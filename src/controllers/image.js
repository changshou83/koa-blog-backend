import { generateToken } from '../utils/image.js'

/**
 * @type {Custom.Controller<'image'>}
 */
export default {
  async token(ctx, next) {
    const token = generateToken()
    const key = +new Date() + Math.random().toString(16).slice(2);
    
    if(token) {
      ctx.success({ token, key });
    } else ctx.fail('token生成失败', 500);

    await next();
  }
};
