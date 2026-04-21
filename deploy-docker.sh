#!/bin/bash

# Docker部署脚本 - 本地构建,上传镜像
set -e

SERVER_IP="${1:-101.35.233.33}"
USERNAME="${2:-ubuntu}"

echo "=========================================="
echo "ZJOJ Docker部署"
echo "=========================================="

# 1. 本地构建Docker镜像
echo ""
echo "[1/4] 本地构建Docker镜像..."
docker build -t zjoj-frontend:latest .

if [ $? -ne 0 ]; then
    echo "❌ 镜像构建失败!"
    exit 1
fi

echo "✅ 镜像构建成功!"

# 2. 保存并上传镜像
echo ""
echo "[2/4] 保存并上传镜像..."
docker save zjoj-frontend:latest | gzip > /tmp/zjoj-frontend.tar.gz

scp /tmp/zjoj-frontend.tar.gz ${USERNAME}@${SERVER_IP}:~/

ssh ${USERNAME}@${SERVER_IP} "docker load < ~/zjoj-frontend.tar.gz && rm ~/zjoj-frontend.tar.gz"

rm /tmp/zjoj-frontend.tar.gz

echo "✅ 镜像上传成功!"

# 3. 停止旧容器
echo ""
echo "[3/4] 停止旧容器..."
ssh ${USERNAME}@${SERVER_IP} "docker stop zjoj-frontend || true && docker rm zjoj-frontend || true"

echo "✅ 旧容器已清理!"

# 4. 启动新容器
echo ""
echo "[4/4] 启动新容器..."
ssh ${USERNAME}@${SERVER_IP} "docker run -d --name zjoj-frontend -p 80:80 --restart unless-stopped zjoj-frontend:latest"

echo "✅ 容器启动成功!"

echo ""
echo "=========================================="
echo "🎉 Docker部署完成!"
echo "=========================================="
echo "访问地址: http://${SERVER_IP}"
echo ""
echo "查看容器状态:"
echo "  ssh ${USERNAME}@${SERVER_IP} 'docker ps'"
echo ""
echo "查看日志:"
echo "  ssh ${USERNAME}@${SERVER_IP} 'docker logs zjoj-frontend'"
echo "=========================================="
