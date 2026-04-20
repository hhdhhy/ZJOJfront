# ZJOJ 前端项目

ZJOJ是一个在线判题系统的前端实现,采用Vue 3 + Element Plus技术栈。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI库**: Element Plus
- **路由**: Vue Router
- **HTTP客户端**: Axios
- **Markdown渲染**: marked

## 项目结构

```
src/
├── api/                    # API请求层
│   ├── modules/           # 模块化API
│   │   ├── auth.js       # 用户认证API
│   │   ├── problem.js    # 题目管理API
│   │   ├── submit.js     # 提交评测API
│   │   └── ai.js         # AI问答API
│   ├── http.js           # 基础HTTP配置
│   ├── authHttp.js       # 认证HTTP拦截器
│   └── index.js          # 统一导出
├── components/            # 组件
│   ├── ProblemList.vue   # 题目列表
│   ├── ProblemDetail.vue # 题目详情
│   ├── ProblemCreate.vue # 创建题目
│   ├── ProblemEdit.vue   # 编辑题目
│   ├── SubmissionList.vue    # 提交列表
│   ├── SubmissionDetail.vue  # 提交详情
│   ├── TestcaseUpload.vue    # 测试用例上传
│   ├── UserProfile.vue   # 用户资料
│   ├── KnowledgeQA.vue   # AI知识问答
│   ├── HeaderNav.vue     # 顶部导航
│   └── Sidebar.vue       # 侧边栏
├── views/                # 页面视图
│   ├── login/           # 登录注册
│   └── main/            # 主框架
├── stores/              # 状态管理
│   ├── auth.js         # 认证状态
│   └── submission.js   # 提交状态
├── router/             # 路由配置
└── assets/             # 静态资源
```

## 功能模块

### 1. 用户认证
- ✅ 用户登录/注册
- ✅ JWT Token管理
- ✅ 用户资料编辑
- ✅ 密码修改

### 2. 题目管理
- ✅ 题目列表(支持搜索和标签过滤)
- ✅ 题目详情查看
- ✅ 创建题目
- ✅ 编辑题目
- ✅ 删除题目
- ✅ 测试用例上传/管理

### 3. 代码评测
- ✅ 代码提交
- ✅ 提交列表(支持筛选)
- ✅ 提交详情(含测试点结果)
- ✅ 评测状态跟踪

### 4. AI知识问答
- ✅ AI智能问答(RAG模式)
- ✅ 对话历史管理
- ✅ 使用统计显示
- ✅ Markdown渲染

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## API配置

在 `.env.development` 或 `.env.production` 中配置API地址:

```
VITE_BASE_URL=http://localhost:8000
```

## 主要特性

1. **模块化API设计**: 按功能模块组织API,便于维护和扩展
2. **统一错误处理**: Axios拦截器统一处理401错误和Token过期
3. **响应式设计**: 使用Element Plus组件库,界面美观
4. **状态管理**: Pinia管理全局状态,数据流清晰
5. **Markdown支持**: 题目描述和AI回答支持Markdown渲染

## Git提交规范

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

## 许可证

MIT License
