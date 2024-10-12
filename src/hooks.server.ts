import { authenticateUser } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import type { RequestEvent } from './routes/$types';


export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = authenticateUser(event as RequestEvent);

    // Allow logout
    if (event.url.pathname.startsWith('/logout')) {
        return await resolve(event);
    }

    if (event.url.pathname.startsWith('/app')) {
        if (!event.locals.user) {
            throw redirect(303, '/');
        }
    } else if (event.url.pathname.startsWith('/')) {
        if (event.locals.user) {
            throw redirect(303, '/app');
        }
    }

    const response = await resolve(event);
    return response;
};

// export async function handleFetch({ request, event, fetch }) {
//     // Modify the outgoing request here if needed
//     // Intercept server-side fetch requests (making requests to external APIs)
//     return fetch(request);
// }