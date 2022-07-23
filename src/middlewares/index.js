import errorHandler from './handler/errorHandler.js';
import bodyParser from 'koa-body';

export default [errorHandler(), bodyParser()];
