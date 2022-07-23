import jwt from 'koa-jwt';
import article from '../controllers/article.js';
import config from '../config.js';

export const routerHandler = articleRouter => {
  articleRouter.prefix('/articles');

  articleRouter.use(
    jwt({
      secret: config.SECRET_KEY.TOKEN,
    }).unless({
      // 验证除GET之外的Token
      method: ['GET'],
    })
  );

  articleRouter.get('/all/archives', article.archives)
  articleRouter.get('/', article.index);
  articleRouter.get('/:id', article.show);
  articleRouter.post('/', article.create);
  articleRouter.put('/:id', article.update);
  articleRouter.del('/:id', article.destroy);
};
