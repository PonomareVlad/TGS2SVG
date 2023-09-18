import {setWebhookCallback} from "vercel-grammy";
import {bot, secretToken} from "../src/bot.mjs";

// Handler to set webhook url based on request headers
export default setWebhookCallback(bot, {
    secret_token: secretToken,
    path: "api/update",
    onError: "return"
});
