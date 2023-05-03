import Router from 'koa-router';
import Chat from './../controllers/chat.js';
import sse from 'koa-sse-stream'
import {uploadFile} from './../utils/upload.js'
const chatController = new Chat()

let sseServer = null

const router = new Router();
// 处理 SSE 请求
router.get('/sse', async (ctx, next) => {
    // 创建 SSE 转换器
    const sseTransform = sse();
    // 将 SSE 转换器应用到上下文和下一个中间件函数
    sseTransform(ctx, next);
    // 将 SSE 服务器设置为上下文的 SSE 属性
    sseServer = ctx.sse;
    // 设置响应主体，防止 404 错误
    ctx.body = '';
});
// 处理 getAnswer 请求
router.post('/getAnswer', async (ctx, next) => {
    await chatController.getAnswer(ctx, next, sseServer);
});
// 处理 getAnswerContent 请求,文本输出
router.post('/getAnswerContent', async (ctx, next) => {
    await chatController.getAnswerContent(ctx, next);
});

// 处理 getImage 请求
router.post('/getImage', async (ctx, next) => {
    await chatController.getImage(ctx, next);
});
// 处理 createTranscription 请求
// 将音频转录为输入语言
router.post('/createTranscription', async (ctx, next) => {
    await chatController.createTranscription(ctx, next);
});
router.post('/upload', async (ctx, next) => {
//    const res = await uploadFile(ctx, next)
    const file = ctx.request.files.files;
    await chatController.createTranscription(ctx,next)
});


export default router;

