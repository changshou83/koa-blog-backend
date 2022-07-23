import user from '../controllers/user.js';
/**
 * @type {Custom.FunctionArgs<Router>}
 */
export const routerHandler = userRouter => {
  userRouter.prefix('/users');
  userRouter.post('/login', user.login);
  userRouter.post('/logout', user.logout);
  userRouter.post('/register', user.register);
  userRouter.put('/authorization', user.authorization);
};
