import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import { WEB_API_URL } from "$lib/const.js";
import { db } from "$lib/db/index.js";
import { users } from "$lib/db/schema";
import { eq } from 'drizzle-orm';
import { cookieOptions, generateJwt } from "$lib/server/auth.js";

export const GET = async ({ url, cookies }) => {
    const redirect_uri = `${WEB_API_URL}/oauth`;
    const code = await url.searchParams.get("code");
    if (!code) throw new Error("Authorization code not found");

    try {
        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        const { tokens } = await oauthClient.getToken(code);
        oauthClient.setCredentials(tokens);
        if (!tokens?.id_token) throw new Error("ID token not found");

        const ticket = await oauthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: SECRET_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user already exists
        const userIdQuery = await db.select({
            userId: users.userId,
            provider: users.provider
        }).from(users).where(eq(users.email, payload?.email as string));

        let userId;
        if (userIdQuery.length === 0) {
            // User does not exist, create a new user
            console.log("Google - New user");
            userId = await db.insert(users).values({
                displayName: payload?.name as string,
                email: payload?.email as string,
                joinedDate: new Date(),
                provider: "oauth",
                googleId: payload?.sub as string,
            }).returning({ userId: users.userId });
        } else {
            // User already exists, merge the accounts
            if (userIdQuery[0].provider !== "oauth") {
                console.log("Google - User with the same email already exists with email/password provider");
                // Same user already exists with email/password - merge accounts
                await db.update(users).set({
                    provider: "oauth_email",
                    googleId: payload?.sub as string,
                }).where(eq(users.userId, userIdQuery[0].userId));
            }
            userId = userIdQuery[0].userId;
        }

        const token = generateJwt({
            userId: userId as number,
            name: payload?.name as string,
            email: payload?.email as string,
            joined: new Date(),
            provider: "oauth",
        });

        cookies.set('jwt', token, cookieOptions);
    }
    catch (error) {
        console.error(error);
    }
    throw redirect(303, "/app");
};