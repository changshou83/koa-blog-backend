import { readFileSync } from 'fs';
import { app as server } from '../src/index.js';
// import可以导入json文件，不过我要的是根据开发环境动态读取不同的配置，所以就不用import了

let config;
try {
  const path =
    process.env.NODE_ENV === 'development'
      ? '../config/dev.json'
      : '../config/prod.json';
  const json = readFileSync(new URL(path, import.meta.url), 'utf-8');
  config = JSON.parse(json);
} catch (err) {
  console.log(`Error reading file from disk: ${err}`);
}

const listenerHandler = () =>
  console.log(`当前服务器运行在: http://localhost:${config.server.port}/`);
server.listen(config.server.port, listenerHandler);
