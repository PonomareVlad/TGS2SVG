import {webhookCallback} from "grammy";
import {bot, secretToken} from "../src/bot.mjs";

// Default grammY handler for incoming updates via webhooks
export default webhookCallback(bot, "http", {
    timeoutMilliseconds: 9_000,
    secretToken
});
