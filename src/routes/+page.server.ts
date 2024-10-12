import { fail, redirect, type Actions } from '@sveltejs/kit';
import { WEB_API_URL } from '$lib/const.js';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

import { OAuth2Client } from 'google-auth-library';

import { db } from '$lib/db/index.js';
import { eq } from 'drizzle-orm';
import { users } from '$lib/db/schema.js';
import bcrypt from 'bcrypt';
import { getCookieOptions, generateJwt, hashPassword } from '$lib/server/auth.js';
import type { ProviderOptions } from '$lib/types/types.js';

export const actions = {
    login: async ({ cookies, request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { email, password, missing: true, modalMode: 'login' });
        }

        // Check if user exists
        const user = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return fail(400, { email, password, invalid: true, modalMode: 'login' });
        }

        // User exists, check if provider is OAuth
        if (user[0].provider === 'oauth') {
            // If same email is used with email, notify user to use Google login
            return fail(400, { email, password, message: 'Same user exists with Google OAuth. Sign in with Google instead.', invalid: true, modalMode: 'login' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user[0]?.password ?? '');
        if (!validPassword) {
            return fail(400, { email, password, invalid: true, modalMode: 'login' });
        }

        const token = generateJwt({
            userId: user[0].userId,
            name: user[0].displayName,
            email: user[0].email,
            joined: user[0].joinedDate,
            provider: user[0].provider as ProviderOptions
        });

        cookies.set('jwt', token, getCookieOptions());

        throw redirect(303, '/app');
    },
    register: async ({ request, cookies }) => {
        const formData = await request.formData();
        const displayName = formData.get('name') as string;
        const email = formData.get('email') as string;
        const plainPassword = formData.get('password') as string;

        // Validate input
        if (!email || !plainPassword || !displayName) {
            return fail(400, { email, plainPassword, invalid: true, modalMode: 'register' });
        }

        const existingUser = await db.select({
            email: users.email,
            provider: users.provider,
            userId: users.userId
        }).from(users).where(eq(users.email, email));
        let userId;

        const hashedPassword = await hashPassword(plainPassword);

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
                console.log('Register - Same user with oauth already exists - merge accounts');
            } else {
                // Different user with the same email already exists
                console.log('Register - Different user with the same email already exists');
                return fail(400, { email, plainPassword, invalid: true, modalMode: 'register', errorMessage: 'Email is already in use' });
            }
        }

        const token = generateJwt({
            userId: userId,
            name: displayName,
            email: email,
            joined: new Date(),
            provider: 'email'
        });

        cookies.set('jwt', token, getCookieOptions());
        throw redirect(303, '/app');
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
