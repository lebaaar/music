export type ProviderOptions = 'oauth' | 'email' | 'oauth_email';

export interface ProfileData {
    accountType: 'user' | 'gym';
}

export interface UserJwtPayload {
    userId: number;
    name: string;
    email: string;
    joined: Date | string;
    provider: ProviderOptions;
    exp?: number;
    iat?: number;
}

export interface GymJwtPayload {
    gymId: number;
    name: string;
    email: string;
    location: string;
    joined: Date | string;
    isVerified: boolean;
    exp?: number
    iat?: number;
}

export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
}