import { db } from "$lib/db/index";
import { users } from "$lib/db/schema";

export async function load() {
    // await db.insert(users).values({
    //     displayName: "John Doe",
    //     email: "text",
    //     password: "text",
    //     joinedDate: new Date(),
    //     apiKey: "text",
    //     profileType: 1
    // });
    const allUsers = await db.select().from(users);

    return { allUsers };
}


import { redirect } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from "$env/static/private";
import { WEB_API_URL } from "$lib/const.js";

export const actions = {
    OAuth2: async () => {
        const redirect_uri = `${WEB_API_URL}/oauth`;

        const oauthClient = new OAuth2Client(
            SECRET_CLIENT_ID,
            SECRET_CLIENT_SECRET,
            redirect_uri,
        );

        const authUrl = oauthClient.generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.profile openid",
            prompt: "consent",
        });

        throw redirect(302, authUrl);
    },
};
