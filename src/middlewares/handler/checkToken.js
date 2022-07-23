import jsonwebtoken from 'jsonwebtoken';

import config from '../../config.js';
const checkToken =
  (options = {}) =>
  async (ctx, next) => {
    let url = ctx.url.split('?')[0]
    
    if (url === '/users/login' || url === '/users/register') {
        await next()
    } else {
      let token = ctx.request.headers["authorization"];

      if (token) {
        token = token.split(' ')[1];
        jsonwebtoken.verify(token, config.SECRET_KEY.TOKEN, (err) => {
          if(err && err.name === "TokenExpiredError") ctx.fail('token 过期', 401)
        });

        await next()
      }
    }
  }

export default checkToken
