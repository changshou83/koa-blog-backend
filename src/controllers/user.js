import jsonwebtoken from 'jsonwebtoken';

import { loginSchema, logoutSchema, registerSchema } from '../utils/pipe/user.js';
import { sha256Hash } from '../utils/hash.js';
import config from '../config.js';

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

    const token = jsonwebtoken.sign(payload, config.SECRET_KEY.TOKEN, {
      expiresIn: '7d',
    });

    ctx.success({ ...payload, token });
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
  async logout(ctx, next) {
    const { userId } = await logoutSchema.validateAsync(ctx.request.body);
    // 接收user.id使token过期
    await next();
  }
};
