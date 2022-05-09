# ELADMIN-WEB

ELADMIN 前端源码

#### 项目源码

|     |   后端源码  |   前端源码  |
|---  |--- | --- |
|  github   |  https://github.com/elunez/eladmin   |  https://github.com/elunez/eladmin-web   |
|  码云   |  https://gitee.com/elunez/eladmin   |  https://gitee.com/elunez/eladmin-web   |

#### 开发文档
[https://docs.auauz.net/#/](https://docs.auauz.net/#/)

#### 前端模板

初始模板基于： [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

模板文档： [https://panjiachen.github.io/vue-element-admin-site/zh/guide/](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

#### Build Setup
``` bash
# 配置镜像加速
npm config set registry https://registry.npm.taobao.org

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev

# 构建生产环境
npm run build

# 如果遇到 node-sass 安装慢，或者安装不了的问题，请查看
- https://www.ydyno.com/archives/1219.html
-
```

#### 常见问题

1、依赖安装失败

可通过配置淘宝的镜像源解决
```
npm config set registry https://registry.npm.taobao.org
```

2、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```

3、加速node-sass安装

https://www.ydyno.com/archives/1219.html
#### 反馈交流

- QQ交流群：891137268

smartbi 单点登录的集中方式：
1、方法一：使用Smartbi浏览器端SDK登录（配置信息在前端）
  问题： var jsloader = new JSLoader(config); 执行到这句后前台不报错也没反应；
 
2、方法二：使用LoginToken扩展包（配置信息在后端）
  可以实现，但是管理员用户好像无法使用动态token的方式登录，另需要将管理用户信息配置到系统中
 
3、方法三：使用Smartbi服务端SDK登录
   未尝试
4、方法四：在页面中使用Form登录（配置信息在前端）
  可以实现，但是密码以明文的形式传输，不安全
5、方法五：CAS单点登录
  未尝试
  
