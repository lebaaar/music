import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { WEB_API_URL } from '$lib/const.js';
import { db } from '$lib/db/index.js';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCookieOptions, generateJwt } from '$lib/server/auth.js';

export const GET = async ({ url, cookies }) => {
    const redirect_uri = `${WEB_API_URL}/oauth`;
    const code = await url.searchParams.get('code');
    if (!code) throw new Error('Authorization code not found');

    try {
        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        const { tokens } = await oauthClient.getToken(code);
        oauthClient.setCredentials(tokens);
        if (!tokens?.id_token) throw new Error('ID token not found');

        const ticket = await oauthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: SECRET_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user already exists
        const existingUserQuery = await db.select({
            userId: users.userId,
            name: users.displayName,
            email: users.email,
            joined: users.joinedDate,
            provider: users.provider
        }).from(users).where(eq(users.email, payload?.email as string));

        let userId, name, joined, provider: string | null;

        if (existingUserQuery.length === 0) {
            // User does not exist, create a new user
            const newUser = await db.insert(users).values({
                displayName: payload?.name as string,
                email: payload?.email as string,
                joinedDate: new Date(),
                provider: 'oauth',
                googleId: payload?.sub as string,
            }).returning({ userId: users.userId, name: users.displayName, joined: users.joinedDate, provider: users.provider });

            userId = newUser[0].userId;
            name = newUser[0].name;
            joined = newUser[0].joined;
            provider = newUser[0].provider;
        } else {
            // User already exists, merge the accounts
            if (existingUserQuery[0].provider === 'email') {
                // Same user already exists with email/password - merge accounts
                await db.update(users).set({
                    provider: 'oauth_email',
                    googleId: payload?.sub as string,
                }).where(eq(users.userId, existingUserQuery[0].userId));
            }

            userId = existingUserQuery[0].userId;
            name = existingUserQuery[0].name;
            joined = existingUserQuery[0].joined;
            provider = existingUserQuery[0].provider;
        }

        const token = generateJwt({
            userId,
            name,
            email: payload?.email as string,
            joined,
            provider: provider as 'oauth' | 'email' | 'oauth_email',
        });

        cookies.set('jwt', token, getCookieOptions('lax'));
        throw redirect(303, '/app');
    }
    catch (error) {
        console.error(error);
        throw redirect(303, '/error');
    }
};