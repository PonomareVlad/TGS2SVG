import https from "node:https";
import {InputFile} from "grammy";
import {unzipSync} from "node:zlib";
import renderSvg from "lottie-to-svg";

export async function convert(file, filename = "sticker.svg") {
    const buffer = await getBufferFromUrl(file.getUrl());
    const lottie = JSON.parse(unzipSync(buffer).toString());
    const svg = new TextEncoder().encode(await renderSvg(lottie));
    return new InputFile(svg, filename);
}

export async function getBufferFromUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (response) => {
            const body = []
            response
                .on('data', (chunk) => {
                    body.push(chunk)
                })
                .on('end', () => {
                    resolve(Buffer.concat(body))
                })
        })
    })
}
