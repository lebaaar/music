import { authenticateUser } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import type { RequestEvent } from './routes/$types';
import type { GymJwtPayload, UserJwtPayload } from '$lib/types/types';


export const handle: Handle = async ({ event, resolve }) => {
    const authenticatedUser = authenticateUser(event as RequestEvent);
    if (authenticatedUser) {
        if ('userId' in authenticatedUser) {
            event.locals.user = authenticatedUser as UserJwtPayload;
            event.locals.gym = null;
        } else if ('gymId' in authenticatedUser) {
            event.locals.gym = authenticatedUser as GymJwtPayload;
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
        event.locals.gym = null;
    }

    const canAccessApp = event.locals.user !== null || event.locals.gym !== null;
    const isAppPath = event.url.pathname.startsWith('/app');
    const isRootPath = event.url.pathname === '/';

    // Allow logout
    if (event.url.pathname.startsWith('/logout')) {
        return await resolve(event);
    }

    if (isAppPath && !canAccessApp) {
        throw redirect(303, '/');
    }

    if (isRootPath && canAccessApp) {
        throw redirect(303, '/app');
    }

    const response = await resolve(event);
    return response;
};

// export async function handleFetch({ request, event, fetch }) {
//     // Modify the outgoing request here if needed
//     // Intercept server-side fetch requests (making requests to external APIs)
//     return fetch(request);
// }