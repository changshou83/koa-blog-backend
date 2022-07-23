import { Model, DataTypes } from 'sequelize';
import moment from 'moment';

class Article extends Model {}

export default sequelize => {
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '标题',
      },
      intro: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '简介',
      },
      articleType: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['blog', 'book'],
        comment: '文章类型[blog,book]',
      },
      content: {
        type: DataTypes.TEXT('MEDIUM'),
        allowNull: false,
        comment: '文章内容',
      },
      headImg: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '文章头图',
      },
      createdAt: {
        type: DataTypes.STRING,
        defaultValue: moment().format('YYYY-MM-DD-HH:mm'),
      },
      updatedAt: {
        type: DataTypes.STRING,
        defaultValue: moment().format('YYYY-MM-DD-HH:mm'),
      },
    },
    {
      sequelize,
      timestamp: false,
    }
  );

  return Article;
};
