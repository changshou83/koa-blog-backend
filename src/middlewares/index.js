import errorHandler from './handler/errorHandler.js';
import checkToken from './handler/checkToken.js';
import bodyParser from 'koa-body';

export default [errorHandler(), bodyParser(), checkToken()];
