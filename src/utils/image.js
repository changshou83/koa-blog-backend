import qiniu from 'qiniu';
import config from '../config.js';

const ACCESS_KEY = 'VVF0tTox4ZQ9RZhuI2BOD_w7_vTOExHjMoBFOORd';
const SECRET_KEY = config.SECRET_KEY.QINIU;
const bucket = 'koa-blog-changshou';

export function generateToken() {
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  const options = {
    scope: bucket,
    expires: 3600 * 2 //token过期时间2小时
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const token = putPolicy.uploadToken(mac);

  return token;
}

export function deleteImage(key) {
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  const config = new qiniu.conf.Config({ zone: qiniu.zone.Zone_z1 });
  const bucketManager = new qiniu.rs.BucketManager(mac, config);

  key = key.replace('http://cdn.changshou83.site/', '');
  return new Promise((resolve, reject) => {
    bucketManager.delete(bucket, key, (err) => {
      if (err) reject(err);
      else resolve();
    });
  })
}

// 下载图片到本地
function downloadImage() {}
// 构建上传策略函数
function generateUptoken(key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}
/**
 * 上传图片到七牛云
 * @param {string} key 上传到七牛后保存的文件名
 * @param {string} localFile 要上传文件的本地路径
 */
export function uploadImage(key, localFile) {
  const token = generateUptoken(key);
  const extra = new qiniu.io.PutExtra();

  qiniu.io.putFile(token, key, localFile, extra, (err, ret) => {
    if(!err) {
      // 上传成功， 处理返回值
      // key处理后存入headImg，然后删除本地图片
      console.log(ret.hash, ret.key, ret.persistentId);
    } else {
      // 上传失败， 处理返回代码
      console.log(err);
    }
  });
}
