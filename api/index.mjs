import {unzipSync} from "node:zlib";
import renderSvg from "lottie-to-svg";
import {serializeError} from "serialize-error";

export default async ({body}, res) => {

    try {

        if (!body) return res.status(415).json({message: "No files provided"});

        const lottie = JSON.parse(unzipSync(body).toString());
        const svg = new TextEncoder().encode(await renderSvg(lottie));

        res.setHeader("Content-type", "image/svg+xml");
        res.setHeader("Content-Disposition", `attachment; filename="sticker.svg"`);

        return res.send(svg);

    } catch (e) {
        console.error(e);
        return res.status(500).json(serializeError(e));
    }

}
