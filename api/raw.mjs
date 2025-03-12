import renderSvg from "lottie-to-svg";
import {serializeError} from "serialize-error";
import {unzipSync} from "node:zlib";

export default async (req, res) => {

    try {

        const {frame = "0"} = req.query

        if (!req.body) return res.status(415).json({message: "No files provided"});

        const lottie = JSON.parse(unzipSync(req.body).toString());
        const svg = await renderSvg(lottie, null, frame ? parseInt(frame) : null);

        res.setHeader("Content-type", "image/svg+xml");
        res.setHeader("Content-Disposition", `attachment; filename="sticker.svg"`);

        return res.send(svg);

    } catch (e) {
        console.error(e);
        return res.status(500).json(serializeError(e));
    }

}
