export interface DecodedJwtPayload {
    userId: number;
    name: string;
    email: string;
    joined: string;
    authBy: 'google' | 'email';
    exp: number;
    iat: number;
}
