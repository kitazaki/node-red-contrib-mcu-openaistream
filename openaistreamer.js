import MP3Streamer from "mp3streamer";
import WavStreamer from "wavstreamer";

// https://platform.openai.com/docs/api-reference/audio/createSpeech

export default class {
        constructor(options) {
		const {key, model, voice, input, speed, response_format, ...o} = options;
                const request = {
                        input,
                        model,
                        voice,
                        speed: speed ?? 1,
                        response_format: response_format ?? "mp3",
                };
                const body = ArrayBuffer.fromString(JSON.stringify(request));
                let streamer;
                if (request.response_format == "mp3") {
                        streamer = MP3Streamer;
                } else if (request.response_format == "wav") {
                        streamer = WavStreamer;
                } else {
                        throw new Error(`invalid response_format:${request.response_format}`);
                }
        
                return new streamer({
                        ...o,
                        http: device.network.https,
                        request: {
                                method: 'POST',
                                headers: new Map([
                                        ["content-type", "application/json"],
                                        ["Authorization", `Bearer ${key}`],
                                        ['content-length', body.byteLength.toString()],
                                ]),
                                onWritable(count) {
                                        this.position ??= 0;
                                        this.write(body.slice(this.position, this.position + count))
                                        this.position += count
                                },
                        },
                        port: 443,
                        host: "api.openai.com",
                        path: "/v1/audio/speech",
                        waveHeaderBytes: request.response_format == "wav" ? 44 : undefined,
                })
        }
}

