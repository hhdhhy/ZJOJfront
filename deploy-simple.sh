#!/bin/bash

# 简单部署脚本 - 在服务器上构建
set -e

SERVER="ubuntu@101.35.233.33"
REMOTE_DIR="/tmp/zjoj-build"

echo "开始部署..."

# 1. 上传源代码到服务器
echo "[1/4] 上传源代码..."
ssh $SERVER "rm -rf $REMOTE_DIR && mkdir -p $REMOTE_DIR"
scp -r src public package*.json vite.config.js index.html .env.* $SERVER:$REMOTE_DIR/

# 2. 在服务器上构建
echo "[2/4] 在服务器上构建..."
ssh $SERVER "cd $REMOTE_DIR && npm ci && npm run build"

# 3. 部署到nginx目录
echo "[3/4] 部署文件..."
ssh $SERVER "sudo rm -rf /var/www/zjoj-front/* && sudo cp -r $REMOTE_DIR/dist/* /var/www/zjoj-front/ && sudo chown -R www-data:www-data /var/www/zjoj-front"

# 4. 重启nginx
echo "[4/4] 重启Nginx..."
ssh $SERVER "sudo systemctl reload nginx"

# 清理
ssh $SERVER "rm -rf $REMOTE_DIR"

echo "部署完成! 访问 http://101.35.233.33"
