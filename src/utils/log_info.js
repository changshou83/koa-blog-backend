export default (ctx, message, commonInfo) => {
  const { url, host, method, headers } = ctx.request;
  const client = {
    url,
    host,
    method,
    message,
    referer: headers['referer'], // 请求的源地址
    userAgent: headers['user-agent'],
  };
  return JSON.stringify(Object.assign(commonInfo, client));
};
