# ZJOJ 前端部署指南

## 快速部署

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
