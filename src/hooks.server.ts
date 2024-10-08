import { authenticateUser } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import type { RequestEvent } from "./routes/$types";


export const handle: Handle = async ({ event, resolve }) => {
    // Protect routes
    // if (event.url.pathname.startsWith("/api")) {
    //     if (event.url.pathname.startsWith("/admin")) {
    //         if (event.locals.user.role !== "ADMIN") {
    //             throw redirect(303, "/protected");
    //         }
    //     }
    // }

    event.locals.user = authenticateUser(event as RequestEvent);

    const response = await resolve(event);
    return response;
};

// export async function handleFetch({ request, event, fetch }) {
//     // Modify the outgoing request here if needed
//     // Intercept server-side fetch requests (making requests to external APIs)
//     return fetch(request);
// }