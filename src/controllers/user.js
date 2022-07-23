import jsonwebtoken from 'jsonwebtoken';

import { loginSchema, registerSchema } from '../utils/pipe/user.js';
import { sha256Hash } from '../utils/hash.js';
import config from '../config.js';

const sign = (payload) => {
  const token = jsonwebtoken.sign(payload, config.SECRET_KEY.TOKEN, {
    expiresIn: '2h',
  });
  const refresh_token = jsonwebtoken.sign(payload, config.SECRET_KEY.TOKEN, {
    expiresIn: '1d',
  });

  return { token, refresh_token }
}

/**
 * @type {Custom.Controller<"login">}
 */
export default {
  async login(ctx, next) {
    const { username, password } = await loginSchema.validateAsync(
      ctx.request.body
    );

    const user = await ctx.model.User.findOne({
      where: { username },
    });

    if (!user) return ctx.fail('用户不存在，请重新确认用户名', 400);

    const passwordIsEqual =
      user.password === sha256Hash(password, config.SECRET_KEY.PASSWORD);

    if (!passwordIsEqual)
      return ctx.fail('密码错误，请重新确认用户名和密码', 400);

    const payload = {
      id: user.id,
      username: user.username,
    };

    ctx.success({ ...payload, ...sign(payload) });
    await next();
  },
  async register(ctx, next) {
    const { username, password } = await registerSchema.validateAsync(ctx.request.body);

    const isCreated = await ctx.model.User.findOne({
      where: { username },
    });

    if (isCreated) return ctx.fail('用户已创建', 400);

    const user = await ctx.model.User.create({
      username,
      password
    });
    ctx.success({
      id: user.id,
      username: user.username
    });
    await next();
  },
  async authorization(ctx, next) {
    // 验证refresh——token是否过期
    let oldToken = ctx.request.headers["authorization"];

    if (oldToken) {
      oldToken = oldToken.split(' ')[1]
      jsonwebtoken.verify(oldToken, config.SECRET_KEY.TOKEN, (err) => {
        if(err && err.name === "TokenExpiredError") ctx.fail('长时间未登录，请重新登陆', 403)
      });
    }
    
    // 签发新token
    const { id } = ctx.state.user;
    const user = await ctx.model.User.findOne({
      where: { id },
    });

    const payload = {
      id: user.id,
      username: user.username,
    };

    ctx.success(sign(payload));
    await next();
  }
};
