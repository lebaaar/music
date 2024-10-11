import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import { WEB_API_URL } from "$lib/const.js";
import { db } from "$lib/db/index.js";
import { users } from "$lib/db/schema";
import { eq } from 'drizzle-orm';

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

        const jwt = tokens.id_token;

        const ticket = await oauthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: SECRET_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        console.log("Google OAuth tokens:", tokens);
        // console.log("Google OAuth ticket:", ticket);
        // console.log("Google OAuth payload:", payload);

        // Check if user already exists
        const query = await db.select({
            email: users.email,
        }).from(users).where(eq(users.email, payload?.email as string));

        if (query.length === 0) {
            await db.insert(users).values({
                displayName: payload?.name as string,
                email: payload?.email as string,
                joinedDate: new Date(),
                authBy: "google",
            });
        } else {
            console.log("User already exists:", payload?.email);
        }

        cookies.set('jwt', jwt, {
            httpOnly: true,   // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
            maxAge: 60 * 60,  // 1 hour
            sameSite: 'strict', // CSRF protection
            path: '/' // Path for the cookie
        });
    }
    catch (error) {
        console.error(error);
    }



    throw redirect(303, "/");
};