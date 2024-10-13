// See https://kit.svelte.dev/docs/types#app

import type { DecodedUserJwtPayload, DecodedGymJwtPayload } from "$lib/types/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: DecodedUserJwtPayload | null,
			gym: DecodedGymJwtPayload | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
