import { Middleware } from 'koa';
import Router from '../../node_modules/@koa/router/lib/router.js';
import extendContext from '../context.js';

interface IMiddleware extends Middleware {}
interface errorHandlerOptions {}
type FunctionArgs<Args extends any = any, Return = void> = (
  ...args: Args[]
) => Return;

declare module 'koa' {
  type extendContextExtends = typeof extendContext;
  interface DefaultContext
    extends extendContextExtends,
      Router.RouterParamContext {}
}

type DefaultControllerTypes =
  | 'index'
  | 'show'
  | 'create'
  | 'update'
  | 'destroy';

type Controller<U = {}> = {
  [P in DefaultControllerTypes | U]?: IMiddleware;
};

export as namespace Custom;
