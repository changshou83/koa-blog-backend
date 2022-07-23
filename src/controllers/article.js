import { Sequelize, Op } from 'sequelize';
import { create, index, show, update, destroy } from '../utils/pipe/article.js';
import { deleteImage } from '../utils/image.js'

/**
 * @type {Custom.Controller<'archives'>}
 */
export default {
  async index(ctx, next) {
    const { limit, page, type, userId } = await index.validateAsync(ctx.query);
    let user = { UserId: userId };
    if(userId === -1) user = {};
    const offset = limit * (page - 1);
    const articles = await ctx.model.Article.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']],
      where: { articleType: type , ...user },
    });
    ctx.success(articles);
    await next();
  },
  async show(ctx, next) {
    const { id } = await show.validateAsync(ctx.params);
    const articles = await ctx.model.Article.findByPk(id, {
      include: {
        model: ctx.model.User,
        attributes: {
          exclude: ['password'],
        },
      },
    });
    if (!articles) return ctx.fail('文章不存在', 404);
    ctx.success(articles);

    await next();
  },
  async create(ctx, next) {
    const { id: user_id } = ctx.state.user;
    const newInfo = await create.validateAsync(ctx.request.body);

    const isCreated = await ctx.model.Article.findOne({
      where: {
        UserId: user_id,
        title: newInfo.title,
        articleType: newInfo.articleType,
      },
    });

    if (isCreated) return ctx.fail('文章已创建', 400);

    const article = await ctx.model.Article.create({
      ...newInfo,
      UserId: user_id,
    });
    ctx.success(article);
    await next();
  },
  async update(ctx, next) {
    const { id: user_id } = ctx.state.user;
    const { id, ...newInfo } = await update.validateAsync({
      ...ctx.params,
      ...ctx.request.body,
    });

    const article = await ctx.model.Article.findByPk(id);
    if (!article) return ctx.fail('文章不存在', 404);
    if(newInfo.headImg === '') newInfo.headImg = article.headImg;
    const url = article.headImg;
    
    const userIdIsEqual = user_id === article.UserId;
    if (!userIdIsEqual) return ctx.fail('该用户无权限更新此文章', 401);
    
    await article.update(newInfo);
    if(article.headImg !== url) await deleteImage(url);
    ctx.success(article, 201);
    
    await next();
  },
  async destroy(ctx, next) {
    const { id: user_id } = ctx.state.user;
    const { id } = await destroy.validateAsync(ctx.params);
    
    const article = await ctx.model.Article.findByPk(id);
    if (!article) return ctx.fail('删除失败，文章未找到，请重新确认文章id');
    const url = article.headImg;

    const userIdIsEqual = user_id === article.UserId;
    if (!userIdIsEqual) return ctx.fail('该用户无权限删除此文章', 401);
    
    await article.destroy();
    await deleteImage(url);
    ctx.success(null, 204);

    await next();
  },
  async archives(ctx, next) {
    const archives = await ctx.model.Article.findAll({
      // 依照id逆序排列
      order: [["id", "DESC"]],
      // 分组
      group: Sequelize.fn(
        "date_format",
        Sequelize.col("createdAt"),
        "%Y-%m"
      ),
      attributes: [
        [
          Sequelize.fn(
            "date_format",
            Sequelize.col("createdAt"),
            "%Y-%m"
          ),
          "month"
        ]
      ],
      // 拿原值
      raw: true
    })
    // 根据month添加date
    for (const item of archives) {
      item.data = await ctx.model.Article.findAll({
        // 依照id逆序排列
        order: [["id", "DESC"]],
        where: {
          createdAt: {
            [Op.like]: `${item.month}%`
          }
        },
        attributes: [
          "id",
          "title",
          [
            Sequelize.fn(
              "date_format",
              Sequelize.col("createdAt"),
              "%Y-%m-%d"
            ),
            "createdAt"
          ]
        ]
      })
    }
    ctx.success(archives)
    await next()
  }
};
