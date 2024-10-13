// See https://kit.svelte.dev/docs/types#app

import type { UserJwtPayload, GymJwtPayload } from "$lib/types/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserJwtPayload | null,
			gym: GymJwtPayload | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
