# BGUR 后台管理系统

基于 Vue 3 + Vite + Element Plus 构建的现代化后台管理系统。

## 🚀 项目特性

- **现代化技术栈**: Vue 3 + Vite + Element Plus
- **响应式设计**: 支持多种屏幕尺寸，移动端友好
- **模块化架构**: 清晰的目录结构，易于维护和扩展
- **配置化管理**: 集中式配置文件，便于定制和部署
- **动态路由**: 支持动态路由加载和权限控制
- **状态管理**: 使用 Pinia 进行状态管理
- **组件化开发**: 高度可复用的组件设计

## 📦 技术栈

- **前端框架**: Vue 3.5.17
- **构建工具**: Vite 5.4.10
- **UI 组件库**: Element Plus 2.10.4
- **状态管理**: Pinia 3.0.3
- **路由管理**: Vue Router 4.5.1
- **HTTP 客户端**: Axios 1.10.0
- **图标库**: Element Plus Icons Vue 2.3.1

## 🏗️ 项目结构

```
bgur-admin/
├── public/                 # 静态资源
│   ├── roter.json         # 路由配置文件
│   └── vite.svg           # 默认图标
├── src/
│   ├── api/               # API 接口
│   │   ├── dashboard.js   # 仪表盘接口
│   │   └── login.js       # 登录接口
│   ├── assets/            # 静态资源
│   │   ├── images/        # 图片资源
│   │   └── styles/        # 样式文件
│   ├── components/        # 公共组件
│   │   ├── AppMenu.vue    # 应用菜单组件
│   │   └── MenuItem.vue   # 菜单项组件
│   ├── config/            # 配置文件
│   │   └── app.js         # 应用配置
│   ├── directives/        # 自定义指令
│   ├── hooks/             # 组合式函数
│   ├── json/              # JSON 数据
│   │   └── tree.json      # 树形数据
│   ├── locales/           # 国际化
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由主文件
│   ├── store/             # 状态管理
│   │   ├── tabs.js        # 标签页状态
│   │   └── user.js        # 用户状态
│   ├── styles/            # 全局样式
│   │   └── style.css      # 主样式文件
│   ├── utils/             # 工具函数
│   │   ├── dynamicRoutes.js # 动态路由工具
│   │   ├── request.js     # HTTP 请求工具
│   │   └── token.js       # Token 管理工具
│   ├── views/             # 页面组件
│   │   ├── auth/          # 权限管理
│   │   ├── company/       # 企业管理
│   │   ├── content/       # 内容管理
│   │   ├── dashboard/     # 仪表盘
│   │   ├── home/          # 首页
│   │   ├── login/         # 登录页
│   │   ├── main/          # 主页面
│   │   ├── order/         # 订单管理
│   │   ├── product/       # 产品管理
│   │   ├── promotion/     # 促销管理
│   │   ├── system/        # 系统管理
│   │   └── user/          # 用户管理
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 🎯 核心功能

### 1. 用户认证系统
- 用户登录/登出
- Token 管理
- 权限验证

### 2. 仪表盘
- 数据概览
- 图表展示
- 实时统计

### 3. 业务模块
- **用户管理**: 用户信息维护、权限分配
- **企业管理**: 企业信息管理
- **产品管理**: 产品信息维护
- **订单管理**: 订单处理和跟踪
- **促销管理**: 促销活动配置
- **内容管理**: 内容发布和管理
- **系统管理**: 系统配置和维护

### 4. 界面特性
- 响应式布局设计
- 多标签页支持
- 动态菜单
- 主题定制

## ⚙️ 配置管理

项目采用集中式配置管理，主要配置文件位于 `src/config/app.js`：

```javascript
export const appConfig = {
  // 应用基本信息
  app: {
    name: 'BGUR',
    fullName: 'BGUR管理系统',
    title: 'BGUR Admin - 管理系统',
    description: 'BGUR后台管理系统'
  },
  
  // 图片资源配置
  images: {
    logo: '/vite.svg',
    loginBackground: loginBackgroundImg
  },
  
  // 页面标题配置
  pages: {
    login: {
      title: 'BGUR管理系统',
      subtitle: '欢迎使用'
    },
    main: {
      logoText: 'BGUR'
    }
  },
  
  // Footer 配置
  footer: {
    appName: 'BGUR',
    contactEmail: 'yhui998@163.com'
  }
}
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5174 查看应用

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 📝 开发指南

### 添加新页面
1. 在 `src/views/` 下创建对应的目录和 Vue 文件
2. 在 `src/router/index.js` 中添加路由配置
3. 如需菜单显示，更新菜单配置

### 添加新 API
1. 在 `src/api/` 下创建对应的 API 文件
2. 使用 `src/utils/request.js` 中的请求工具
3. 在组件中导入并使用

### 状态管理
使用 Pinia 进行状态管理，store 文件位于 `src/store/` 目录下。

### 样式开发
- 全局样式：`src/styles/style.css`
- 组件样式：使用 Vue 单文件组件的 `<style>` 标签
- 支持 scoped 样式

## 🔧 自定义配置

### 修改应用信息
编辑 `src/config/app.js` 文件中的配置项：
- 应用名称和标题
- Logo 和背景图片
- 联系信息

### 修改主题
Element Plus 主题可通过 CSS 变量进行自定义。

### 环境配置
根据不同环境需求，可以创建对应的环境配置文件。

## 📞 技术支持

如有疑问，请联系：yhui998@163.com

## 📄 许可证

本项目仅供学习和开发使用。

---

**BGUR 后台管理系统** - 让管理更简单，让数据更清晰
