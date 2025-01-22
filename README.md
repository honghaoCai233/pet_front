# 宠物管理小程序 (Pet Management Mini Program)

基于Taro + React的微信小程序，用于宠物信息管理、预约服务等功能。

## 技术栈

- Taro 3.6.23
- React 18
- TypeScript
- SCSS

## 项目结构

```bash
pet-mp/
├── config/ # 编译配置
│ ├── index.js # 主配置文件
│ └── dev.js # 开发环境配置
├── src/
│ ├── app.tsx # 小程序入口
│ ├── app.config.ts # 全局配置
│ ├── app.scss # 全局样式
│ ├── assets/ # 静态资源
│ │ └── images/ # 图片资源
│ ├── components/ # 公共组件
│ │ ├── PetCard/ # 宠物卡片组件
│ │ └── NavBar/ # 自定义导航栏
│ ├── pages/ # 页面目录
│ │ ├── index/ # 首页
│ │ ├── pet-list/ # 宠物列表
│ │ ├── pet-detail/ # 宠物详情
│ │ └── user-center/ # 个人中心
│ ├── services/ # 接口服务
│ │ └── api.ts # API请求封装
│ └── styles/ # 全局样式
│ └── variables.scss # SCSS变量
├── .eslintrc.js # ESLint配置
├── .gitignore # Git忽略文件
├── project.config.json # 小程序项目配置
├── tsconfig.json # TypeScript配置
├── package.json # 项目依赖配置
└── README.md # 项目说明文档
```

## 开发环境要求

- Node.js >= 14
- npm >= 6
- 微信开发者工具
- @tarojs/cli (全局安装)

## 快速开始

1. **安装全局依赖**

```bash
npm install -g @tarojs/cli
```

2. **安装项目依赖**
```bash
make install
# 或
npm install
```

3. **启动开发环境**
```bash
make dev
# 或
npm run dev:weapp
```

4. **在微信开发者工具中导入项目**
- 打开微信开发者工具
- 选择"导入项目"
- 选择项目根目录
- 填入自己的小程序AppID

## 可用命令

```bash
# 安装依赖
make install

# 启动开发环境
make dev

# 构建生产环境
make build

# 代码检查
make lint

# 自动修复代码格式
make lint-fix

# 清理构建文件
make clean

# 更新依赖包
make update

# 安装新的依赖
make add pkg=包名

# 安装开发依赖
make add-dev pkg=包名

# 创建新页面
make new-page name=页面名
```

## 开发规范

- 使用TypeScript进行开发
- 使用ESLint进行代码规范检查
- 使用SCSS进行样式开发
- 遵循组件化开发原则
- 使用函数式组件和Hooks

## 目录说明

- `config/`: 项目编译配置
- `src/components/`: 可复用的组件
- `src/pages/`: 页面文件
- `src/services/`: API接口封装
- `src/styles/`: 全局样式和变量

## 注意事项

1. 首次运行前需要：
   - 安装依赖：`make install`
   - 在 `project.config.json` 中配置自己的AppID
   - 在微信开发者工具中开启"不校验合法域名"选项（如需要）

2. 开发时注意：
   - 遵循TypeScript类型定义
   - 使用SCSS变量保持样式一致性
   - 遵循组件化开发原则

## 构建部署

```bash
# 构建生产环境版本
make build
```

构建完成后，生成的文件在 `dist` 目录下，可直接用于小程序发布。

## 版本历史

- 0.1.0 (2024-03-14)
  - 初始化项目
  - 完成基础架构搭建
  - 实现基础组件

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)