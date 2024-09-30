import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import { WEB_API_URL } from "$lib/const.js";

export const GET = async ({ url }) => {
    const redirect_uri = `${WEB_API_URL}/oauth`;
    const code = await url.searchParams.get("code");

    try {
        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        if (!code) {
            throw new Error("Authorization code not found");
        }
        const r = await oauthClient.getToken(code);
        oauthClient.setCredentials(r.tokens);

        const user = await oauthClient.credentials;

        console.log(user);
    }
    catch (error) {
        console.error(error);
    }

    throw redirect(303, "/");
};