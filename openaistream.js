import {Node} from "nodered";
import AudioOut from "pins/audioout";
import OpenAIStreamer from "openaistreamer";
let audio, key, volume;

class Openaistream extends Node {
    onStart(config) {
        super.onStart(config);
        //key = String(config.key);
        key = String(config.credentials.key);
        volume = Number(config.volume);
	//console.log("key,volume:"+key+","+volume);

	audio = new AudioOut({});
        audio.enqueue(0, AudioOut.Volume, volume);
        audio.start();
    };
    onMessage(msg, done) {
	//console.log("msg:"+msg.payload);

	new OpenAIStreamer({
		key,
		model: "tts-1",
		voice: "alloy",
		input: msg.payload,
		audio: {
			out: audio,
			stream: 0
		},
		onError(e) {
			trace("OpenAI ERROR: ", e, "\n");
			this.close();
                        done();
		},
		onDone() {
			trace("OpenAI Done\n");
			this.close();
			done();
		}
	})

	//this.send(msg);
        //done();
    };
    static type = "mcu_openaistream";
    static {
         RED.nodes.registerType(this.type, this)
    };
};

