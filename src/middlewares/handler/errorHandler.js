/**
 * @type {Custom.FunctionArgs<Custom.errorHandlerOptions, Custom.IMiddleware>}
 */
const errorHandler =
  (options = {}) =>
  async (ctx, next) => {
    try {
      await next();
      const { body, status } = ctx;
      // 处理404
      const isNotFound = status === 404 && !body;
      if (isNotFound) {
        ctx.success('资源未找到', status);
      }
    } catch (err) {
      let { status = 500, message } = err;

      // 根据自定义message前缀判断错误类型
      const paramErrorKeywords = ['body', 'query', 'param'];
      const isParamError = paramErrorKeywords.some(keyword =>
        message.includes(keyword)
      );
      if (isParamError) status = 400;

      const isProd = ctx.app.env === 'production';
      const isServerError = status === 500;
      const isProdServerError = isProd && isServerError;

      const isAuth = message === 'Authentication Error'

      const showError = [isAuth, isParamError].includes(true)

      if(isAuth) {
        message = '用户未登录，请先登录'
      }
      if (!showError && isProdServerError) {
        message = 'server error';
        ctx.app.emit('error', { message, status }); // 日志处理
      }

      ctx.fail(message, status);
    }
  };

export default errorHandler;
