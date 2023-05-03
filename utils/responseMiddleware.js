// responseMiddleware.js

const responseMiddleware = async (ctx, next) => {
    try {
      // 等待其他中间件处理请求
      await next();
  
      // 如果请求没有被其他中间件处理，则返回404
      if (ctx.status === 404) {
        ctx.throw(404, 'Resource not found');
      }
      if(ctx.response.header['content-type'] ==='text/event-stream'){

        ctx.body = ctx.body
        return
      }
      // 统一响应格式
      ctx.body = {
        code: 200,
        message: 'success',
        data: ctx.body,
      };
    } catch (err) {
      // 处理错误
      ctx.status = err.status || 500;
      ctx.body = {
        code: ctx.status,
        message: err.message,
      };
    }
  };
  
  export default responseMiddleware;
  