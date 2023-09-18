import {Bot} from "grammy";
import {convert} from "./utils.mjs";
import {hydrateFiles} from "@grammyjs/files";
import {autoQuote} from "@roziscoding/grammy-autoquote";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

export const bot = new Bot(token);

bot.use(autoQuote);

bot.api.config.use(hydrateFiles(token));

const safe = bot.errorBoundary(console.error);

safe.on(":sticker:is_animated", async ctx => {
    await ctx.replyWithChatAction("upload_document");
    const file = await convert(await ctx.getFile());
    return ctx.replyWithDocument(file);
});

safe.on("::custom_emoji", async ctx => {
    await ctx.replyWithChatAction("upload_document");
    const stickers = await ctx.getCustomEmojiStickers();
    const animated = stickers.filter(({is_animated} = {}) => is_animated);
    if (!animated.length) return ctx.reply("Send animated (vector) emoji");
    return Promise.all(animated.map(async ({file_id}, index) => {
        const file = await ctx.api.getFile(file_id);
        const filename = [++index, "svg"].join(".");
        const svg = await convert(file, filename);
        return ctx.replyWithDocument(svg);
    }));
});

safe.on("msg", ctx => ctx.reply(`Send animated sticker or custom emoji`));
