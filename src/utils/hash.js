import Crypto from 'crypto';

/**
 * 它接受一个值和一个密钥，并返回该值和密钥的哈希值
 * @param val - 要散列的值。
 * @param secretKey - 用于签署请求的密钥。
 * @returns 值和密钥的散列。
 */
export const sha256Hash = (val, secretKey) => {
  const hash = Crypto.createHash('sha256');
  return hash.update(`${val}${secretKey}`).digest('hex');
};
