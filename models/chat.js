import request from "./../utils/request.js"
import { handleMessages } from './../utils/tools.js'
import fs from 'fs'
import { getFilePath } from './../utils/tools.js'
import axios from "axios"
import https from 'https'
class Chat {
    // 流体输出
    async getAnswer(ctx) {
        const messages = handleMessages(ctx.request.body)
        console.log(messages)
        try {
            const res = await request({
                method: 'post',
                url: 'https://api.openai.com/v1/chat/completions',
                responseType: 'stream',
                data: {
                    model: "gpt-4",
                    messages: messages,
                    stream: true
                }
            })
            return res
        } catch (error) {
            throw new Error(error)
        }
    }
    // 文本输出
    async getAnswerContent(ctx) {
        const messages = handleMessages(ctx.request.body)
        console.log(messages)
        try {
            const res = await request({
                method: 'post',
                url: 'https://api.openai.com/v1/chat/completions',
                data: {
                    model: "gpt-4",
                    // model: "gpt-3.5-turbo",
                    messages: messages,
                }
            })
            return res
        } catch (error) {
            throw new Error(error)
        }
    }
    async getImage(ctx) {
        const { prompt, ...result } = ctx.request.body
        const option = { n: 2, size: "1024x1024", ...result }
        console.log({
            ...option,
            prompt,
        })
        try {
            const res = await request({
                method: 'post',
                url: 'https://api.openai.com/v1/images/generations',
                data: {
                    ...option,
                    prompt,
                },
            })
            console.log(res)
            return res
        } catch (error) {
            return error
        }
    }
    async createTranscription(ctx) {
        const file = ctx.request.files.files;
        const uploadDir = new URL(`./../file/${file.originalFilename}`, import.meta.url);
        // 检查文件是否已存在
        if (fs.existsSync(uploadDir)) {
            // 如果文件已存在，则删除同名文件
            fs.unlinkSync(uploadDir);
        }
        const fileContent = fs.readFileSync(file.filepath);
        fs.writeFileSync(uploadDir, fileContent);
        try {
            const { text } = await request({
                method: 'post',
                url: 'https://api.openai.com/v1/audio/transcriptions',
                data: {
                    model: 'whisper-1',
                    file: fs.createReadStream(uploadDir),
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log(text)
            const content = await request({
                method: 'post',
                url: 'https://api.openai.com/v1/chat/completions',
                data: {
                    model: "gpt-3.5-turbo",
                    messages: [{role:'user',content:text}],
                }
            })
            console.log(content)
            return content
        } catch (error) {
            return error
        }
    }
    async find() {

    }
    async create() {

    }
}
export default Chat