export type ProviderOptions = 'oauth' | 'email' | 'oauth_email';

export interface ProfileData {
    accountType: 'user' | 'gym';
}

export interface DecodedUserJwtPayload {
    userId: number;
    name: string;
    email: string;
    joined: string;
    provider: ProviderOptions;
    exp: number;
    iat: number;
}

export interface DecodedGymJwtPayload {
    gymId: number;
    name: string | undefined;
    email: string;
    location: string;
    joined: string;
    isVerified: boolean;
    exp: number;
    iat: number;
}

export interface CreateUserJwtPayload {
    userId: number;
    name: string;
    email: string;
    joined: Date;
    provider: ProviderOptions;
}

export interface CreateGymJwtPayload {
    gymId: number;
    name: string;
    location: string;
    email: string;
}

export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
}