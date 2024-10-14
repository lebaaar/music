import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { WEB_API_URL } from '$lib/const.js';
import { db } from '$lib/db/index.js';
import { gyms, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCookieOptions, generateJwt } from '$lib/server/auth.js';
import type { GymJwtPayload, UserJwtPayload } from '$lib/types/types.js';

export const GET = async ({ url, cookies }) => {
    const redirect_uri = `${WEB_API_URL}/oauth`;
    const code = await url.searchParams.get('code');
    if (!code) throw redirect(303, '/');

    try {
        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        const { tokens } = await oauthClient.getToken(code);
        oauthClient.setCredentials(tokens);
        if (!tokens?.id_token) throw redirect(303, '/');

        const ticket = await oauthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: SECRET_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user already exists
        const existingUserQuery = await db.select()
            .from(users)
            .where(eq(users.email, payload?.email as string));

        let userId, name, joined, provider: string | null;
        let gymId: number | null;

        if (existingUserQuery.length === 0) {
            // User does not exist, create a new user
            const newUser = await db.insert(users).values({
                displayName: payload?.name as string,
                email: payload?.email as string,
                joinedDate: new Date(),
                provider: 'oauth',
                googleId: payload?.sub as string,
            }).returning({ userId: users.userId, name: users.displayName, joined: users.joinedDate, provider: users.provider, gymId: users.gymId });

            userId = newUser[0].userId;
            name = newUser[0].name;
            joined = newUser[0].joined;
            provider = newUser[0].provider;
            gymId = newUser[0].gymId;
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
            name = existingUserQuery[0].displayName;
            joined = existingUserQuery[0].joinedDate;
            provider = existingUserQuery[0].provider;
            gymId = existingUserQuery[0].gymId;
        }

        const userPayload: UserJwtPayload = {
            userId,
            name,
            email: payload?.email as string,
            joined,
            provider: provider as 'oauth' | 'email' | 'oauth_email',
            gym: null
        };

        // Check if user is associated with a gym
        if (gymId) {
            const gym = await db.select().from(gyms).where(eq(gyms.gymId, gymId));
            const gymJwtPayload: GymJwtPayload = {
                gymId: gym[0].gymId,
                name: gym[0].name,
                email: gym[0].email,
                location: gym[0].location ?? 'No location specified',
                joined: gym[0].joinedDate as unknown as string,
                isVerified: gym[0].isVerified,
            };
            userPayload.gym = gymJwtPayload;
        }


        // Generate JWT and set cookie
        const token = generateJwt(userPayload);
        cookies.set('jwt', token, getCookieOptions('lax'));
        throw redirect(303, '/app');
    }
    catch (error) {
        console.log(error);
        // TODO - handle error (redirect to error page, display toast, etc.)
        throw redirect(303, '/error');
    }
};