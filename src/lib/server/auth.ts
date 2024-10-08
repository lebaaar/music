import bcrypt from 'bcrypt';
import type { RequestEvent } from '../../routes/$types';
import type { DecodedJwtPayload } from '$lib/types/types';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private';

/**
 * Return the user object from cookies if the user is authenticated
 * @param {RequestEvent} event - The request event containing cookies
 * @returns {DecodedJwtPayload | null} - The decoded JWT payload if authenticated, otherwise null
 */
export const authenticateUser = (event: RequestEvent): DecodedJwtPayload | null => {
    const { cookies } = event;
    const token = cookies.get("jwt");

    if (!token) {
        return null;
    }

    let decodedJwtPayload: DecodedJwtPayload | null = null;
    jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
        // Check for JWT errros (expired...)
        if (err) {
            return null;
        }
        decodedJwtPayload = decoded as DecodedJwtPayload;
    });

    return decodedJwtPayload;
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

export function getCookie(name: string, cookies: string): string | null {
    const cookie = cookies.split(';').find(c => c.trim().startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
}