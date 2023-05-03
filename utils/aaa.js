import { Configuration, OpenAIApi } from "openai";
import {getFilePath} from './../utils/tools.js'
import fs from 'fs'
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const resp = await openai.createTranscription(
  fs.createReadStream('./file/dome.m4a'),
  "whisper-1"
);
console.log(resp)
