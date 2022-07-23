import { Sequelize } from 'sequelize';
import moment from 'moment';
import useUser from './user.js';
import useArticle from './article.js';
import devConfig from '../config.js';

export const sequelize = new Sequelize({
  ...devConfig.MODEL,
  hooks: {
    beforeUpdate(instance) {
      instance.set('updateAt', moment().format('YYYY-MM-DD-HH:mm'));
    },
  },
});

const User = useUser(sequelize);
const Article = useArticle(sequelize);

// 数据表关联
User.hasMany(Article);
Article.belongsTo(User);

// 模型同步
sequelize.sync({ alter: true });

// (async () => {
//   const isExist = await User.findOne({
//     where: {
//       username: '',
//     },
//   });

//   if (isExist) {
//     return;
//   }

//   await User.create({
//     username: '',
//     password: '',
//   });
// })();

export default { User, Article };
