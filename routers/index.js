// 引入 Koa 和路由中间件
import KoaRouter from 'koa-router';
import chatRouter from './chat.js'
import tim from './tim.js'
// 创建路由器实例
const router = new KoaRouter({ prefix: '/api' });

router.use(chatRouter.routes())
router.use(tim.routes())

// 导出路由器实例
export default router;
