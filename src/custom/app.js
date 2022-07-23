import Koa from 'koa';
import { logger, getLog } from './handler/logger.js';
import routerHandler from './handler/routes.js';

class CustomKoa extends Koa {
  /**
   * 批量注册中间件
   * @param {Custom.IMiddleware[]} middlewares - 中间件数组
   */
  useMiddlewares(middlewares = []) {
    middlewares.forEach(this.use, this);
  }
  /**
   * 注册路由
   * @param {string} dirPath - 路由器所在目录的路径
   */
  useRouters(dirPath) {
    const dirPathIsString = typeof dirPath;
    if (!dirPathIsString) {
      throw new Error('路由目录必须为string类型');
    }
    this.use(routerHandler({ dirPath }));
  }
  /**
   * 扩展context对象
   * @param {object} props - 要扩展的属性
   */
  extendContext(props) {
    for (const key in props) {
      if (Object.hasOwnProperty.call(props, key)) {
        const hasProp = Boolean(this.context[key]);
        if (hasProp) {
          throw new Error('不允许覆盖已扩展的属性');
        }
        this.context[key] = props[key];
      }
    }
  }
  /**
   * 日志应用
   * @param {string} dirPath - 日志所在目录的路径
   */
  useLogger(dirPath) {
    const dirPathIsString = typeof dirPath;
    if (!dirPathIsString) {
      throw new Error('目录路径必须为string类型');
    }
    // access log
    this.use(
      logger({
        app: this.env,
        dir: dirPath,
        category: 'access',
        projectName: 'koa-blog-api',
      })
    );
    // app error log
    const appLogger = getLog({ env: this.env, dir: dirPath }, 'app');
    this.on('error', err => appLogger.error(err));
  }
}

export default CustomKoa;
