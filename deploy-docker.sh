#!/bin/bash

# Docker部署脚本
# 用法: ./deploy-docker.sh [服务器IP]

set -e

SERVER_IP="${1:-101.35.233.33}"

echo "=========================================="
echo "ZJOJ Docker部署"
echo "=========================================="

# 1. 构建Docker镜像
echo ""
echo "[1/4] 构建Docker镜像..."
docker build -t zjoj-frontend:latest .

if [ $? -ne 0 ]; then
    echo "❌ 镜像构建失败!"
    exit 1
fi

echo "✅ 镜像构建成功!"

# 2. 上传到服务器
echo ""
echo "[2/4] 保存并上传镜像..."
docker save zjoj-frontend:latest | gzip > zjoj-frontend.tar.gz

scp zjoj-frontend.tar.gz ubuntu@${SERVER_IP}:~/

ssh ubuntu@${SERVER_IP} "docker load < ~/zjoj-frontend.tar.gz && rm ~/zjoj-frontend.tar.gz"

rm zjoj-frontend.tar.gz

echo "✅ 镜像上传成功!"

# 3. 上传docker-compose配置
echo ""
echo "[3/4] 上传docker-compose配置..."
scp docker-compose.yml ubuntu@${SERVER_IP}:~/zjoj-docker-compose.yml

# 4. 启动容器
echo ""
echo "[4/4] 启动容器..."
ssh ubuntu@${SERVER_IP} "docker-compose -f ~/zjoj-docker-compose.yml up -d"

echo "✅ 容器启动成功!"

echo ""
echo "=========================================="
echo "🎉 Docker部署完成!"
echo "=========================================="
echo "访问地址: http://${SERVER_IP}"
echo ""
echo "查看容器状态:"
echo "  ssh ubuntu@${SERVER_IP} 'docker ps'"
echo ""
echo "查看日志:"
echo "  ssh ubuntu@${SERVER_IP} 'docker logs zjoj-frontend'"
echo "=========================================="
