import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
    if (locals.gym || locals.user) {
        return ({ account: locals.gym || locals.user });
    }
    return ({ account: null });
}