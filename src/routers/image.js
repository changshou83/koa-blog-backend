import image from '../controllers/image.js';

export const routerHandler = imgRouter => {
  imgRouter.get('/imgToken', image.token);
};
