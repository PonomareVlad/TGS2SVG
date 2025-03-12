import busboy from "busboy";
import {unzipSync} from "node:zlib";
import renderSvg from "lottie-to-svg";

export default async (req, res) => {

    const {headers, query: {frame = "0"}} = req;
    const bb = busboy({headers, limits: {files: 1}});

    let conversion = Promise.resolve();

    bb.on("file", (name, file) => conversion = convert(res, file, frame));
    bb.on("close", () => conversion.then(async () => {
        try {
            await res.status(415).json({message: "No files provided"});
        } catch (e) {
            console.error(e);
        }
    }));

    req.pipe(bb);

}

async function convert(res, file, frame) {

    const lottie = JSON.parse(unzipSync(file).toString());
    const svg = await renderSvg(lottie, null, frame ? parseInt(frame) : null);

    res.setHeader("Content-type", "image/svg+xml");
    res.setHeader("Content-Disposition", `attachment; filename="sticker.svg"`);

    return res.send(svg);

}
