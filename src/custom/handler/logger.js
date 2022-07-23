import log4js from 'log4js';
import { resolve } from 'node:path';
import logInfo from '../../utils/log_info.js';

export const getLog = ({ env, dir }, name) => {
  let appenders = {
    // 常规访问
    access: {
      numBackups: 60,
      type: 'dateFile',
      filename: resolve(dir, 'access/access'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    // App级别的错误
    app: {
      numBackups: 60,
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      filename: resolve(dir, 'application/error'),
    },
  };

  if (env === 'dev' || env === 'local' || env === 'development') {
    appenders.out = {
      type: 'stdout',
    };
  }
  // log4js配置
  let config = {
    pm2: true,
    disableClustering: true,
    appenders,
    categories: {
      default: {
        appenders: ['access'],
        level: 'info',
      },
      app: {
        appenders: ['app'],
        level: 'warn',
      },
    },
  };
  log4js.configure(config);
  return log4js.getLogger(name);
};

export const logger = options => {
  const contextLogger = {};
  const { env, dir, category, projectName } = Object.assign({}, options || {});
  const commonInfo = { projectName };
  const logger = getLog({ env, dir }, category);

  return async (ctx, next) => {
    const start = Date.now();
    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(method => {
      contextLogger[method] = message => {
        logger[method](logInfo(ctx, message, commonInfo));
      };
    });
    ctx.log = contextLogger;
    await next();
    const responseTime = Date.now() - start;
    logger.info(
      logInfo(
        ctx,
        {
          responseTime: `响应时间为${responseTime / 1000}s`,
        },
        commonInfo
      )
    );
  };
};
