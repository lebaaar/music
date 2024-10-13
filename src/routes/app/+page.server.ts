import type { DecodedGymJwtPayload, DecodedUserJwtPayload } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {

    let type: 'user' | 'gym' = 'user';
    let account: DecodedUserJwtPayload | DecodedGymJwtPayload | null = null;
    if (locals.user) {
        type = 'user';
        account = locals.user as DecodedUserJwtPayload;
    }
    else if (locals.gym) {
        type = 'gym';
        account = locals.gym as DecodedGymJwtPayload;
    }
    else {
        // User not authenticated, throw redirect to root
        throw redirect(303, '/');
    }

    // Number of all recommended songs...
    const recommendedSongs = [
        {
            id: 1,
            title: 'One',
            artist: 'Metallica',
            album: '...And Justice For All',
            cover: 'https://via.placeholder.com/150',
            url: 'https://www.youtube.com/watch?v=apK2jCrfnsk3'
        },
        {
            id: 2,
            title: 'The Devil In I',
            artist: 'Slipknot',
            album: '.5: The Gray Chapter',
            url: 'https://www.youtube.com/watch?v=XEEasR7hVhA'
        }
    ]
    const data = {
        type,
        account,
        recommendedSongs: recommendedSongs
    };
    return data;
}