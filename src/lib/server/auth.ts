import bcrypt from 'bcrypt';
import type { RequestEvent } from '../../routes/$types';
import type { CookieOptions, DecodedUserJwtPayload, DecodedGymJwtPayload, CreateGymJwtPayload, CreateUserJwtPayload } from '$lib/types/types';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private';

/**
 * Return the user object from cookies if the user is authenticated
 * @param {RequestEvent} event - The request event containing cookies
 * @returns {DecodedUserJwtPayload | DecodedGymJwtPayload | null} - The appropriate decoded JWT payload if authenticated, otherwise null
 */
export function authenticateUser(event: RequestEvent): DecodedUserJwtPayload | DecodedGymJwtPayload | null {
    const { cookies } = event;

    const token = cookies.get('jwt');
    if (!token) return null;


    try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY) as DecodedUserJwtPayload | DecodedGymJwtPayload;
        if ('userId' in decoded) {
            return decoded as DecodedUserJwtPayload;
        } else if ('gymId' in decoded) {
            return decoded as DecodedGymJwtPayload;
        }
    } catch (err) {
        console.error('JWT verification failed:', err);
        return null;
    }
    return null;
}

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - Whether the passwords match
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

/**
 * Generate a JWT token
 * @param {CreateUserJwtPayload | CreateGymJwtPayload} payload payload data for user/gym to be encoded in the JWT
 * @param {string} expiresIn expiration time for the JWT (default 1 hour)
 * @returns {string} JWT token string
 */
export function generateJwt(payload: CreateUserJwtPayload | CreateGymJwtPayload, expiresIn: string = '120d'): string {
    const token = jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: expiresIn });
    return token;
}


/**
 * Generates cookie options for setting HTTP cookies.
 * @param {string} sameSite - The SameSite attribute for the cookie, which can be 'strict', 'none', or 'lax'. Defaults to 'strict'.
 * @returns {CookieOptions} - Cookies options object
 */
export function getCookieOptions(sameSite: 'strict' | 'none' | 'lax' = 'strict'): CookieOptions {
    return {
        httpOnly: true,   // Prevent access via JavaScript
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        maxAge: 120 * 24 * 60 * 60,  // 120 days
        sameSite: sameSite, // CSRF protection
        path: '/' // Path for the cookie
    };
};
