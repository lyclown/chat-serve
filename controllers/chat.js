import ChatModel from "./../models/chat.js";
import JSONStream from 'jsonstream'
const chatModel = new ChatModel()
class Chat {
    constructor() {

    }
    async getAnswer(ctx, next, chatController) {
        try {
            const answer = await chatModel.getAnswer(ctx);
            // let content = ''
            for await (const chunk of answer) {
                const chunkStr = chunk.toString()
                const dataParts = chunkStr.split('\n');
                // 这个是由于可能会有数据块连在一起返回，导致解析错误，所以需要分割
                for (const dataPart of dataParts) {
                    if (dataPart) {
                        // 对每个数据块分别进行JSON解析
                        try {
                            const jsonData = JSON.parse(dataPart.substring(5));
                            if (jsonData.choices) {
                                const token = jsonData.choices[0].delta.content
                                if (token) {
                                    chatController.send(token)
                                    // content += token
                                }
                            }
                        } catch (error) {

                        }
                        // 对jsonData进行处理
                        // ...
                    }
                }
            }
            chatController.sendEnd()
            ctx.body = 'success';
        } catch (error) {
            ctx.body = error;
            throw new Error(error)
        }
        await next()
    }
    async getAnswerContent(ctx, next){
        const answer = await chatModel.getAnswerContent(ctx);
        ctx.body = answer.choices[0].message.content
        await next()
    }
    async getImage(ctx, next) {
        const images = await chatModel.getImage(ctx);
        console.log(images)
        ctx.body = images
        await next()
    }
    async createTranscription(ctx, next) {
        const transcription = await chatModel.createTranscription(ctx);
        console.log(transcription)
        ctx.body = transcription
        await next()
    }
}
export default Chat