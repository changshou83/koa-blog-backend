# 简介

是`koa-blog`的后端项目，[前往前端项目](https://github.com/changshou83/koa-blog)。

特点：
- 使用`@koa/router`实现路由的控制
- 使用mysql作为数据库，使用`sequelize`作为ORM与数据库进行交互
- 使用`jsonwebtoken`实现token的签发与验证，使用`koa-jwt`实现对token的认证
- 使用`joi`实现参数验证
- 使用`log4js`实现日志记录
- 使用`qiniu`辅助前端实现图片上传
- 使用`Crypto`实现对密码的加密与验证

# 使用

```bash
# 安装依赖
pnpm install
# 运行项目
npm run dev
```

NOTE: 需要在`src`目录下新建一个config.js对必要的信息进行配置
```js
const config = {};

/**
 * orm
 * @type {import("sequelize").Options}
 */
config.MODEL = {
  dialect: '', // 要连接的数据库软件
  database: '', // 要连接数据库名称
  username: '', // 用户名
  password: '', // 密码
  host: '', // 数据库的主机地址
  timezone: '', // 数据库时区
  logging: , // 是否打log
};

config.SECRET_KEY = {
  PASSWORD: '', // 密码加密秘钥
  TOKEN: '', // token生成秘钥
  QINIU: '' // 七牛云认证秘钥
};

export default config;
```

## 当前完成的功能

- 基本crud
- log
- 路由导航
- 参数验证

## 后续想要实现的功能

- [ ] 用户信息的增加
- [ ] 邮箱注册
- [ ] 用nestjs重写一版
