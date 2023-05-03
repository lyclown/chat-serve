// 引入 Koa 和静态资源中间件
import Koa from 'koa';
import serve from 'koa-static';
// 引入 cors 中间件
import cors from '@koa/cors';
import {koaBody} from 'koa-body';
import router from './routers/index.js'
import responseMiddleware from './utils/responseMiddleware.js'

import http from 'http'
import dotenv from 'dotenv'
dotenv.config();
// 创建 Koa 应用
const app = new Koa();

// 使用静态资源中间件
// app.use(serve('dist'));
// 中间件
app.use(cors());
app.use(koaBody({
    multipart: true,
}))
// 创建 HTTP 服务器
const server = http.createServer(app.callback());

// 添加路由前缀
app.use(router.routes()).use(router.allowedMethods());
app.use(responseMiddleware)






// 导出 Koa 应用
app.listen(3001, () => {
    console.log('Server started on port 3001...')
});
