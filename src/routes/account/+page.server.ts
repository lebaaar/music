import type { GymJwtPayload, UserJwtPayload } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {

    let type: 'user' | 'gym' = 'user';
    let account: UserJwtPayload | GymJwtPayload | null = null;
    if (locals.user) {
        type = 'user';
        account = locals.user as UserJwtPayload;
    }
    else if (locals.gym) {
        type = 'gym';
        account = locals.gym as GymJwtPayload;
    }
    else {
        // User not authenticated, throw redirect to root
        throw redirect(303, '/');
    }
    const data = {
        type,
        account
    };
    return data;
}