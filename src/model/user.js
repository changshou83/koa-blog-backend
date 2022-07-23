import { Model, DataTypes } from 'sequelize';
import moment from 'moment';
import { sha256Hash } from '../utils/hash.js';
import devConfig from '../config.js';

class User extends Model {}

export default sequelize => {
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户名',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '密码',
        set(val) {
          const newVal = sha256Hash(val, devConfig.SECRET_KEY.PASSWORD);
          this.setDataValue('password', newVal);
        },
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

  return User;
};
