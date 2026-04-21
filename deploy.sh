#!/bin/bash

# ZJOJ前端部署脚本
# 用法: ./deploy.sh [服务器IP] [用户名]

set -e  # 遇到错误立即退出

# 配置变量
SERVER_IP="${1:-101.35.233.33}"
USERNAME="${2:-ubuntu}"
REMOTE_DIR="/var/www/zjoj-front"
NGINX_CONF_FILE="nginx.conf"

echo "=========================================="
echo "ZJOJ 前端部署脚本"
echo "=========================================="
echo "服务器: ${USERNAME}@${SERVER_IP}"
echo "部署目录: ${REMOTE_DIR}"
echo "=========================================="

# 1. 安装依赖
echo ""
echo "[1/5] 安装依赖..."
npm install

# 2. 构建项目
echo ""
echo "[2/5] 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败!"
    exit 1
fi

echo "✅ 构建成功!"

# 3. 上传文件到服务器
echo ""
echo "[3/5] 上传文件到服务器..."

# 先清空远程目录
ssh ${USERNAME}@${SERVER_IP} "sudo rm -rf ${REMOTE_DIR}/* || true"

# 上传新文件
scp -r dist/* ${USERNAME}@${SERVER_IP}:${REMOTE_DIR}/

if [ $? -ne 0 ]; then
    echo "❌ 上传失败!"
    exit 1
fi

echo "✅ 上传成功!"

# 4. 设置权限
echo ""
echo "[4/5] 设置文件权限..."
ssh ${USERNAME}@${SERVER_IP} "sudo chown -R www-data:www-data ${REMOTE_DIR} && sudo chmod -R 755 ${REMOTE_DIR}"

echo "✅ 权限设置完成!"

# 5. 重启Nginx
echo ""
echo "[5/5] 重启Nginx..."
ssh ${USERNAME}@${SERVER_IP} "sudo nginx -t && sudo systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo "❌ Nginx重启失败!"
    exit 1
fi

echo "✅ Nginx重启成功!"

echo ""
echo "=========================================="
echo "🎉 部署完成!"
echo "=========================================="
echo "访问地址: http://${SERVER_IP}"
echo "=========================================="
