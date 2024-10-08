// See https://kit.svelte.dev/docs/types#app

import type { DecodedJwtPayload } from "$lib/types/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: DecodedJwtPayload | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
