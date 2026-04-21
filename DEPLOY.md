# ZJOJ 前端部署指南

## Docker部署(唯一推荐方式)

### 前置要求

- 服务器已安装Docker和Docker Compose
- SSH密钥配置完成

### 快速部署

```bash
# 添加执行权限
chmod +x deploy-docker.sh

# 一键部署
./deploy-docker.sh

# 或指定服务器IP
./deploy-docker.sh 101.35.233.33
```

部署脚本会自动:
1. 构建Docker镜像
2. 上传到服务器
3. 启动容器

### 手动部署

```bash
# 1. 构建镜像
docker build -t zjoj-frontend:latest .

# 2. 保存并压缩镜像
docker save zjoj-frontend:latest | gzip > zjoj-frontend.tar.gz

# 3. 上传到服务器
scp zjoj-frontend.tar.gz ubuntu@101.35.233.33:~/

# 4. 加载镜像
ssh ubuntu@101.35.233.33 "docker load < ~/zjoj-frontend.tar.gz"

# 5. 运行容器
ssh ubuntu@101.35.233.33 "docker run -d -p 80:80 --name zjoj-frontend --restart unless-stopped zjoj-frontend:latest"

# 6. 清理临时文件
rm zjoj-frontend.tar.gz
```

### 更新部署

每次代码修改后:

```bash
./deploy-docker.sh
```

脚本会自动重建镜像并替换运行中的容器。

### Docker常用命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs zjoj-frontend
docker logs -f zjoj-frontend  # 实时日志

# 重启容器
docker restart zjoj-frontend

# 停止容器
docker stop zjoj-frontend

# 启动容器
docker start zjoj-frontend

# 删除容器
docker rm zjoj-frontend

# 删除镜像
docker rmi zjoj-frontend:latest

# 查看资源使用
docker stats zjoj-frontend

# 进入容器
docker exec -it zjoj-frontend sh
```

### 使用Docker Compose

如果同时部署前后端:

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

## 服务器信息

- 服务器IP: 101.35.233.33
- 用户名: ubuntu
- 前端端口: 80
- 后端API: 通过Nginx反向代理到后端容器

## 常见问题

### 1. 容器启动失败

```bash
# 查看日志
docker logs zjoj-frontend

# 检查端口占用
sudo netstat -tlnp | grep 80
```

### 2. 无法访问

```bash
# 检查容器状态
docker ps

# 检查防火墙
sudo ufw status

# 检查Nginx配置
docker exec zjoj-frontend nginx -t
```

### 3. 更新后还是旧版本

```bash
# 强制删除旧容器和镜像
docker rm -f zjoj-frontend
docker rmi zjoj-frontend:latest

# 重新部署
./deploy-docker.sh
```

### 4. 磁盘空间不足

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 查看磁盘使用
docker system df
```

## 性能优化

### 1. 限制容器资源

编辑docker-compose.yml:

```yaml
services:
  zjoj-frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 100M
```

### 2. 启用Gzip压缩

在Dockerfile的nginx.conf中添加:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. 使用CDN

将静态资源(CSS/JS/图片)托管到CDN加速访问。

## 备份与恢复

### 备份

```bash
# 保存镜像
docker save zjoj-frontend:latest | gzip > backup.tar.gz

# 备份配置文件
scp ubuntu@101.35.233.33:~/zjoj-docker-compose.yml ./backup/
```

### 恢复

```bash
# 加载镜像
docker load < backup.tar.gz

# 启动容器
docker-compose up -d
```

## 监控

```bash
# 实时监控
docker stats

# 查看容器详细信息
docker inspect zjoj-frontend

# 查看日志大小
docker logs zjoj-frontend 2>&1 | wc -l
```

## 安全建议

1. **定期更新基础镜像**
   ```bash
   docker pull nginx:alpine
   docker pull node:18-alpine
   ```

2. **使用非root用户运行**
   在Dockerfile中添加:
   ```dockerfile
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   ```

3. **限制容器权限**
   ```yaml
   services:
     zjoj-frontend:
       security_opt:
         - no-new-privileges:true
       read_only: true
   ```

4. **定期扫描漏洞**
   ```bash
   docker scan zjoj-frontend:latest
   ```
