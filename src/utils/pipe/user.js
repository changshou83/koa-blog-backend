import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string()
    .max(20)
    .required()
    .error(Error('body-username是字符串类型的长度最大为20的必需参数')),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/)
    .required()
    .error(
      Error(
        'body-password为string类型必需参数，至少包含：大小写字母，长度为8-16'
      )
    ),
});

export const loginSchema = registerSchema.append();
