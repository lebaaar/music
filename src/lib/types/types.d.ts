export type ProviderOptions = "oauth" | "email" | "oauth_email";

export interface DecodedJwtPayload {
    userId: number;
    name: string;
    email: string;
    joined: string;
    provider: ProviderOptions;
    exp: number;
    iat: number;
}

export interface CreateJwtPayload {
    userId: number;
    name: string;
    email: string;
    joined: Date;
    provider: ProviderOptions;
}

export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
}