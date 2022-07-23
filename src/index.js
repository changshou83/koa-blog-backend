import extendContext from './context.js';
import CustomKoa from './custom/app.js';
import middlewares from './middlewares/index.js';

const app = new CustomKoa();
app.useMiddlewares(middlewares);
app.useLogger('logs');
app.extendContext(extendContext);
app.useRouters('src/routers');

export { app };
