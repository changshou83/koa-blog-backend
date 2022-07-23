import Joi from 'joi';

const articleId = {
  id: Joi.number().required().error(Error('param-id为number类型必需参数')),
};

export const create = Joi.object({
  title: Joi.string()
    .required()
    .error(Error('body-title为string类型的必需参数')),
  intro: Joi.string()
    .empty('')
    .default('')
    .error(Error('body-intro为string类型的参数')),
  articleType: Joi.string()
    .valid('blog', 'book')
    .required()
    .error(
      Error('body-articleType为string类型且范围在[blog,book]之间的必需参数')
    ),
  // 在默认为空的时候要加上empty，让空值变为undefined，从而让default奏效
  content: Joi.string()
    .empty('')
    .default('')
    .error(Error('body-content是string类型的参数')),
  headImg: Joi.string()
    .empty('')
    .default('')
    .error(Error('body-headImg是string类型的参数')),
});

export const index = Joi.object({
  limit: Joi.number()
    .min(0)
    .default(5)
    .error(Error('query-limit为number类型，最小值为0')),
  page: Joi.number()
    .min(1)
    .default(1)
    .error(Error('query-page为number类型，最小值为1')),
  // single是为了让字符串变成数组
  type: Joi.array()
    .empty('')
    .items(Joi.valid('blog', 'book'))
    .single()
    .default(['blog', 'book'])
    .error(Error('query-type为string类型，可选值为[blog,book]')),
  userId: Joi.number()
    .min(-1)
    .default(-1)
    .error(Error('query-user为number类型，最小值为-1(表示全部用户)')),
  
});

export const show = Joi.object(articleId);

export const update = create.append(articleId);

export const destroy = Joi.object(articleId);
