import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerData, PageServerLoad } from "./$types.js";
import { WEB_API_URL } from "$lib/const.js";
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, SECRET_JWT_KEY } from "$env/static/private";

import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { db } from "$lib/db/index.js";
import { eq } from 'drizzle-orm';
import { users } from "$lib/db/schema.js";
import bcrypt from 'bcrypt';
import { hashPassword } from "$lib/server/auth.js";
import type { DecodedJwtPayload } from "$lib/types/types.js";

export const load: PageServerLoad = async ({ locals }) => {
    let isAuth = false;
    let name: string | null = null;

    // Checks locals for user jwt based object
    const userJwt: DecodedJwtPayload | null = locals.user;

    if (userJwt) {
        isAuth = true;
        name = userJwt.name;
    }
    else {
        isAuth = false;
    }

    // Number of all recommended songs...
    const recommendedSongs = 0;
    const data: PageServerData = {
        recommendedSongs,
        isAuth,
        name
    };
    return data;
}

export const actions = {
    login: async ({ cookies, request }) => {
        console.log('loginnn');
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { email, password, missing: true });
        }

        // Check if user exists
        const user = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return fail(400, { email, password, invalid: true });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user[0]?.password ?? '');
        if (!validPassword) {
            return fail(400, { email, password, invalid: true });
        }

        const payload = {
            userId: user[0].userId,
            name: user[0].displayName,
            email: user[0].email,
            joined: user[0].joinedDate,
            authBy: user[0].authBy
        };
        const token = jwt.sign(
            payload,
            SECRET_JWT_KEY,
            { expiresIn: '1h' }
        );

        cookies.set('jwt', token, {
            httpOnly: true,   // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
            maxAge: 60 * 60,  // 1 hour
            sameSite: 'strict', // CSRF protection
            path: '/' // Path for the cookie
        });

        throw redirect(302, '/');
    },
    register: async ({ request, cookies }) => {
        const formData = await request.formData();
        const displayName = formData.get('name') as string;
        const email = formData.get('email') as string;
        const plainPassword = formData.get('password') as string;

        // Validate input
        if (!email || !plainPassword || !displayName) {
            return new Response(JSON.stringify({ error: 'Email, password, and display name are required' }), { status: 400 });
        }

        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return new Response(JSON.stringify({ error: 'User with this email already exists' }), { status: 409 });
        }

        const hashedPassword = await hashPassword(plainPassword);

        const userId = await db.insert(users).values({
            displayName: displayName,
            email: email,
            password: hashedPassword,
            joinedDate: new Date(),
            authBy: 'email',
        }).returning({ userId: users.userId });

        // Generate JWT
        const payload = {
            userId: userId[0].userId,
            name: displayName,
            email: email,
            joined: new Date(),
            authBy: 'email'
        };
        const token = jwt.sign(
            payload,
            SECRET_JWT_KEY,
            { expiresIn: '1h' }
        );

        cookies.set('jwt', token, {
            httpOnly: true,   // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
            maxAge: 60 * 60,  // 1 hour
            sameSite: 'strict', // CSRF protection
            path: '/' // Path for the cookie
        });

        throw redirect(302, '/');
    },
    OAuth2: async () => {
        const redirect_uri = `${WEB_API_URL}/oauth`;

        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        const authUrl = oauthClient.generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.profile openid email",
            prompt: "consent",
        });

        throw redirect(302, authUrl);
    }
} satisfies Actions;
