# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

# Pet 小程序

## 项目介绍

Pet 是一个基于 uni-app 开发的宠物服务平台小程序，主要功能包括:

- 宠物领养
- 闲置商城
- 宠物社区
- 宠物服务(托运、寄养、殡葬等)

## 技术栈

- 框架：uni-app
- UI 组件：uView UI
- 状态管理：Vuex
- 地图服务：腾讯地图

## 开始使用

### 环境要求

- Node.js 12.0+
- HBuilderX 3.0+
- 微信开发者工具

### 安装运行

1. 安装依赖

bash
npm install

2. 运行项目

方式一：HBuilderX
- 使用 HBuilderX 打开项目
- 点击工具栏的运行按钮，选择运行到对应平台

方式二：命令行

bash
运行到微信小程序
npm run dev:mp-weixin
运行到 H5
npm run dev:h5

### 项目配置

1. 小程序配置
- 修改 `manifest.json` 中的 appid
- 配置微信开发者工具

2. 后端接口配置

javascript
// config/index.config.js
const CONFIG = {
development: {
baseUrl: '你的开发环境接口地址'
},
production: {
baseUrl: '你的生产环境接口地址'
}
}

## 目录结构

├── api # 接口请求
├── components # 公共组件
├── config # 配置文件
├── pages # 页面文件
├── static # 静态资源
├── store # Vuex 状态管理
├── utils # 工具函数
└── uview-ui # UI 组件库


## 主要功能

- 首页：轮播图、分类导航、推荐列表
- 领养中心：宠物列表、详情、申请领养
- 闲置商城：商品浏览、购物车、下单支付
- 宠物服务：托运、寄养、殡葬等服务预约
- 个人中心：个人信息、订单管理、收藏等

## 开发注意事项

1. 遵循 uni-app 开发规范
2. 使用 uView UI 组件库进行开发
3. 保持代码风格统一
4. 做好版本管理和代码备份

## 参与贡献

1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码
4. 创建 Pull Request

## 版权信息

Copyright © 2023 Pet