import type { DecodedJwtPayload } from "$lib/types/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {

    // Checks locals for user jwt based object
    if (!locals.user) {
        throw redirect(303, "/");
    }
    const user: DecodedJwtPayload = locals.user;

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
        user,
        recommendedSongs: recommendedSongs
    };
    return data;
}