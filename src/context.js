import model from './model/index.js';

/**
 * 失败返回
 * @param {string} reason
 * @param {number} status
 */
const fail = function (reason, status = 200) {
  if (typeof status !== 'number') {
    throw new Error('statusCode is not a number');
  }
  this.status = status;
  this.body = {
    msg: 'fail',
    status,
    reason,
  };
};

/**
 *
 * @param {any} data
 * @param {number} status
 */
const success = function (data, status = 200) {
  if (typeof status !== 'number') {
    throw new Error('statusCode is not a number');
  }
  this.status = status;
  this.body = {
    msg: 'success',
    status,
    data,
  };
};

export default {
  fail,
  success,
  model,
};
