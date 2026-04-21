# ZJOJ 前端部署指南

## Docker部署(推荐)

### 前置要求

- 服务器已安装Docker和Docker Compose
- SSH密钥配置完成
- 代码已推送到GitHub

### 首次部署

1. 在服务器上克隆代码:
```bash
cd ~
git clone https://github.com/hhdhhy/ZJOJfront.git
cd ZJOJfront
```

2. 构建并启动容器:
```bash
docker compose up -d --build
```

### 更新部署

每次代码修改后,在服务器上执行:

```bash
cd ~/ZJOJfront
git pull
docker compose up -d --build
```

会自动:
1. 拉取最新代码
2. 重新构建Docker镜像
3. 重启容器

### 常用命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs zjoj-frontend
docker logs -f zjoj-frontend  # 实时日志

# 重启容器
docker compose restart

# 停止服务
docker compose down

# 进入容器
docker exec -it zjoj-frontend sh

# 查看资源使用
docker stats zjoj-frontend
```

### 故障排查

**80端口被占用:**
```bash
# 查找占用80端口的容器
docker ps | grep 80

# 停止冲突的容器
docker stop <container_name>
docker rm <container_name>

# 重新启动
docker compose up -d
```

**容器启动失败:**
```bash
# 查看详细日志
docker logs zjoj-frontend

# 重新构建
docker compose down
docker compose up -d --build
```

## 架构说明

- **前端容器**: Nginx提供静态文件,代理/api/请求到后端
- **后端地址**: http://101.35.233.33:8000
- **前端访问**: http://101.35.233.33

## 技术栈

- Node.js 20 (构建时)
- Vite 7
- Vue 3
- Nginx Alpine (运行时)
