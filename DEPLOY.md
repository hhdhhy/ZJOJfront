# ZJOJ 前端部署指南

## 部署方式选择

### 方式一: Docker部署(推荐)

**优点:**
- 环境一致,避免依赖问题
- 一键部署,简单可靠
- 易于扩展和维护
- 隔离性好,不影响宿主机

**要求:**
- 服务器已安装Docker和Docker Compose

### 方式二: 传统部署

**优点:**
- 不需要Docker环境
- 更直接的控制

**缺点:**
- 需要手动配置环境
- 可能出现依赖冲突

---

## Docker部署

### 首次部署

1. 确保服务器已安装Docker和Docker Compose
2. 运行Docker部署脚本:

```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

### 更新部署

```bash
./deploy-docker.sh
```

### 手动Docker部署

```bash
# 1. 构建镜像
docker build -t zjoj-frontend:latest .

# 2. 保存镜像
docker save zjoj-frontend:latest | gzip > zjoj-frontend.tar.gz

# 3. 上传到服务器
scp zjoj-frontend.tar.gz ubuntu@101.35.233.33:~/

# 4. 在服务器上加载镜像
ssh ubuntu@101.35.233.33 "docker load < ~/zjoj-frontend.tar.gz"

# 5. 启动容器
ssh ubuntu@101.35.233.33 "docker run -d -p 80:80 --name zjoj-frontend zjoj-frontend:latest"
```

### Docker常用命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs zjoj-frontend

# 重启容器
docker restart zjoj-frontend

# 停止容器
docker stop zjoj-frontend

# 删除容器
docker rm zjoj-frontend

# 查看容器资源使用
docker stats zjoj-frontend
```

---

## 传统部署

### 首次部署

1. 确保已配置SSH密钥访问服务器
2. 运行部署脚本:

```bash
chmod +x deploy.sh
./deploy.sh
```

### 更新部署

每次代码修改后,只需运行:

```bash
./deploy.sh
```

脚本会自动:
- 安装依赖
- 构建项目
- 上传到服务器
- 设置权限
- 重启Nginx

## 手动部署步骤

如果需要手动部署:

```bash
# 1. 构建
npm run build

# 2. 上传文件
scp -r dist/* ubuntu@101.35.233.33:/var/www/zjoj-front/

# 3. 设置权限
ssh ubuntu@101.35.233.33 "sudo chown -R www-data:www-data /var/www/zjoj-front"

# 4. 重启Nginx
ssh ubuntu@101.35.233.33 "sudo systemctl reload nginx"
```

## Nginx配置

如果修改了nginx.conf,需要重新部署:

```bash
chmod +x deploy-nginx.sh
./deploy-nginx.sh
```

## 服务器信息

- 服务器IP: 101.35.233.33
- 用户名: ubuntu
- 前端目录: /var/www/zjoj-front
- Nginx配置: /etc/nginx/sites-available/zjoj
- 后端API: http://127.0.0.1:8000 (通过Nginx反向代理)

## 常见问题

### 1. 权限错误

如果遇到Permission denied错误:

```bash
ssh ubuntu@101.35.233.33 "sudo chown -R www-data:www-data /var/www/zjoj-front"
```

### 2. Nginx配置错误

检查Nginx配置:

```bash
ssh ubuntu@101.35.233.33 "sudo nginx -t"
```

查看错误日志:

```bash
ssh ubuntu@101.35.233.33 "sudo tail -50 /var/log/nginx/error.log"
```

### 3. 后端服务未启动

检查后端状态:

```bash
ssh ubuntu@101.35.233.33 "sudo supervisorctl status"
```

重启后端:

```bash
ssh ubuntu@101.35.233.33 "sudo supervisorctl restart zjoj"
```

## 环境变量

开发环境: `.env.development`
生产环境: `.env.production`

确保生产环境的VITE_BASE_URL指向正确的后端地址。
