import article from '../controllers/article.js';

export const routerHandler = articleRouter => {
  articleRouter.prefix('/articles');
  
  articleRouter.get('/all/archives', article.archives)
  articleRouter.get('/', article.index);
  articleRouter.get('/:id', article.show);
  articleRouter.post('/', article.create);
  articleRouter.put('/:id', article.update);
  articleRouter.del('/:id', article.destroy);
};
