import { fail, redirect, type Actions } from '@sveltejs/kit';
import { WEB_API_URL } from '$lib/const.js';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';
import { getCookieOptions, generateJwt, hashPassword } from '$lib/server/auth.js';
import type { GymJwtPayload, UserJwtPayload, ProviderOptions } from '$lib/types/types.js';

import { OAuth2Client } from 'google-auth-library';

import { db } from '$lib/db/index.js';
import { eq } from 'drizzle-orm';
import { gyms, users } from '$lib/db/schema.js';
import bcrypt from 'bcrypt';

interface ReturnObj {
    email: string;
    password: string;
    modalMode: 'login' | 'register';
    profileRegisterType: 'user' | 'gym';
    success: boolean | undefined;
    missing: boolean;
    errorMessage: string | null;
    message: string | null;
    [key: string]: unknown;
}

export const actions = {
    login: async ({ cookies, request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const accountType = formData.get('accountType') as 'user' | 'gym';

        const returnObj: ReturnObj = {
            email: email,
            password: password,
            modalMode: 'login',
            profileRegisterType: accountType,
            success: undefined,
            missing: false,
            errorMessage: null,
            message: null
        }

        // Validate input
        if (!email || !password) {
            return fail(400, { ...returnObj, success: false, missing: true });
        }
        if (accountType !== 'user' && accountType !== 'gym') {
            return fail(400, { ...returnObj, success: false, errorMessage: 'Invalid account type' });
        }

        if (accountType === 'user') {
            // Check if user exists
            const user = await db.select().from(users).where(eq(users.email, email));
            if (user.length === 0) {
                return fail(400, { ...returnObj, success: false });
            }

            // User exists, check if provider is OAuth
            if (user[0].provider === 'oauth') {
                // If same email is used with email, notify user to use Google login
                return fail(400, { ...returnObj, success: false, message: 'Same user exists with Google OAuth. Sign in with Google instead.' });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user[0]?.password ?? '');
            if (!validPassword) {
                return fail(400, { ...returnObj, success: false });
            }

            const payload: UserJwtPayload = {
                userId: user[0].userId,
                name: user[0].displayName,
                email: user[0].email,
                joined: user[0].joinedDate,
                provider: user[0].provider as ProviderOptions,
                gym: null
            };

            // Check if user has a gym tied to their account
            if (user[0].gymId) {
                const gym = await db.select().from(gyms).where(eq(gyms.gymId, user[0].gymId));
                const gymJwtPayload: GymJwtPayload = {
                    gymId: gym[0].gymId,
                    name: gym[0].name,
                    email: gym[0].email,
                    location: gym[0].location ?? 'No location specified',
                    joined: gym[0].joinedDate as unknown as string,
                    isVerified: gym[0].isVerified,
                };
                payload.gym = gymJwtPayload;
            }

            // Generate JWT and set cookie
            const token = generateJwt(payload);
            cookies.set('jwt', token, getCookieOptions());
            throw redirect(303, '/app');
        }
        else if (accountType === 'gym') {
            // Check if gym exists
            const existingGym = await db.select().from(gyms).where(eq(gyms.email, email));

            if (existingGym.length === 0) {
                // Gym account doesn't exist, display Invalid creds error
                return fail(400, { ...returnObj, success: false });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, existingGym[0].password ?? '');
            if (!validPassword) {
                return fail(400, { ...returnObj, success: false });
            }

            // Generate JWT and set cookie
            const payload: GymJwtPayload = {
                gymId: existingGym[0].gymId,
                name: existingGym[0].name,
                email: existingGym[0].email,
                location: existingGym[0].location ?? 'No location specified',
                joined: existingGym[0].joinedDate as unknown as string,
                isVerified: existingGym[0].isVerified,
            };
            const token = generateJwt(payload);
            cookies.set('jwt', token, getCookieOptions());

            returnObj.success = true;
            throw redirect(303, '/app');
        }
    },
    register: async ({ request, cookies }) => {
        const formData = await request.formData();
        const displayName = formData.get('name') as string;
        const email = formData.get('email') as string;
        const plainPassword = formData.get('password') as string;
        const accountType = formData.get('accountType') as 'user' | 'gym';

        const returnObj: ReturnObj = {
            email: email,
            password: plainPassword,
            name: displayName,
            modalMode: 'register',
            profileRegisterType: accountType,
            success: false,
            missing: false,
            errorMessage: null,
            message: null
        }

        // Validate input
        if (!email || !plainPassword || !displayName) {
            return fail(400, { ...returnObj, success: false, missing: true });
        }
        if (accountType !== 'user' && accountType !== 'gym') {
            return fail(400, { ...returnObj, success: false, errorMessage: 'Invalid account type' });
        }

        const hashedPassword = await hashPassword(plainPassword);
        if (accountType === 'user') {
            const existingUser = await db.select({
                email: users.email,
                provider: users.provider,
                userId: users.userId
            }).from(users).where(eq(users.email, email));

            let userId;
            if (existingUser.length === 0) {
                // New user
                const userIdQuery = await db.insert(users).values({
                    displayName: displayName,
                    email: email,
                    password: hashedPassword,
                    joinedDate: new Date(),
                    provider: 'email',
                }).returning({ userId: users.userId });
                userId = userIdQuery[0].userId;
            }
            else {
                // User with the same email already exists
                userId = existingUser[0].userId;
                if (existingUser[0].provider === 'oauth') {
                    // Same user already exists with Google auth - merge accounts
                    await db.update(users).set({
                        provider: 'oauth_email',
                        password: hashedPassword
                    }).where(eq(users.userId, existingUser[0].userId));
                } else {
                    // Different user with the same email already exists
                    return fail(400, { ...returnObj, success: false, errorMessage: 'Email is already in use' });
                }
            }

            // Generate JWT and set cookie
            const payload: UserJwtPayload = {
                userId,
                name: displayName,
                email,
                joined: new Date(),
                provider: 'email',
                gym: null
            };
            const token = generateJwt(payload);
            cookies.set('jwt', token, getCookieOptions());
            throw redirect(303, '/app');
        }
        else if (accountType === 'gym') {
            const existingGym = await db.select({
                gymId: gyms.gymId,
                email: gyms.email,
                name: gyms.name,
                location: gyms.location,
                joinedDate: gyms.joinedDate
            }).from(gyms).where(eq(gyms.email, email));

            if (existingGym.length > 0) {
                // Gym with the same email already exists
                return fail(400, { ...returnObj, success: false, errorMessage: 'Email is already in use' });
            }

            const gymIdQuery = await db.insert(gyms).values({
                name: displayName,
                email: email,
                joinedDate: new Date(),
                location: '',
                password: hashedPassword,
                isVerified: false,
            }).returning({ gymId: gyms.gymId });
            const gymId = gymIdQuery[0].gymId;

            // Generate JWT and set cookie
            const payload: GymJwtPayload = {
                gymId,
                name: displayName,
                location: '',
                email: email,
                joined: new Date(),
                isVerified: false
            };
            const token = generateJwt(payload);
            cookies.set('jwt', token, getCookieOptions());
            throw redirect(303, '/app');
        }
    },
    OAuth2: async () => {
        const redirect_uri = `${WEB_API_URL}/oauth`;

        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        const authUrl = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile openid email',
            prompt: 'consent',
        });

        throw redirect(303, authUrl);
    }
} satisfies Actions;
