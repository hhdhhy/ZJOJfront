#!/bin/bash

# ZJOJ前端 Docker部署脚本
# 在服务器上构建和部署

set -e

SERVER="ubuntu@101.35.233.33"
PROJECT_DIR="/tmp/zjoj-docker-build"

echo "=========================================="
echo "  ZJOJ前端 Docker部署"
echo "=========================================="

# 1. 上传源代码到服务器
echo ""
echo "[1/5] 上传源代码到服务器..."
ssh $SERVER "rm -rf $PROJECT_DIR && mkdir -p $PROJECT_DIR"
scp Dockerfile docker-compose.yml package*.json vite.config.js index.html .env.* $SERVER:$PROJECT_DIR/
scp -r src public $SERVER:$PROJECT_DIR/

# 2. 在服务器上构建镜像
echo ""
echo "[2/5] 在服务器上构建Docker镜像..."
ssh $SERVER "cd $PROJECT_DIR && docker build -t zjoj-frontend:latest ."

# 3. 停止旧容器
echo ""
echo "[3/5] 停止旧容器..."
ssh $SERVER "docker stop zjoj-frontend || true && docker rm zjoj-frontend || true"

# 4. 启动新容器
echo ""
echo "[4/5] 启动新容器..."
ssh $SERVER "docker run -d --name zjoj-frontend -p 80:80 --restart unless-stopped zjoj-frontend:latest"

# 5. 清理
echo ""
echo "[5/5] 清理临时文件..."
ssh $SERVER "rm -rf $PROJECT_DIR"

echo ""
echo "=========================================="
echo "  部署完成!"
echo "=========================================="
echo ""
echo "访问地址: http://101.35.233.33"
echo ""
echo "查看状态: ssh ubuntu@101.35.233.33 'docker ps'"
echo "查看日志: ssh ubuntu@101.35.233.33 'docker logs zjoj-frontend'"
echo "=========================================="
