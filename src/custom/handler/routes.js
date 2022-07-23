import Router from '@koa/router';
import glob from 'glob';
import compose from 'koa-compose';
import { resolve, join } from 'path';
import jwt from 'koa-jwt';
import config from '../../config.js';

const routesHandler =
  (options = {}) =>
  async (ctx, next) => {
    const rootRouter = new Router();
    rootRouter.use(
      jwt({
        secret: config.SECRET_KEY.TOKEN,
      }).unless({
        method: ['GET'],
        path: [/^\/users\/login/, /^\/users\/register/]
      })
    )

    const routersFilePath = join(resolve(options.dirPath), '/**/*.js').replace(
      /\\/g,
      '/'
    );

    (
      await Promise.all(
        glob
          .sync(routersFilePath)
          .map(routerPath => 'file://' + routerPath)
          .map(async routerPath => (await import(routerPath)).routerHandler)
      )
    )
      .filter(fn => typeof fn === 'function')
      .map(routerHandler => {
        const router = new Router();
        routerHandler(router);
        return router.routes();
      })
      .forEach(router => rootRouter.use(router));

    return compose([rootRouter.routes(), rootRouter.allowedMethods()])(
      ctx,
      next
    );
  };

export default routesHandler;
