#!/bin/bash

echo "开始部署前端..."

# 进入项目目录
cd ~/ZJOJfront

# 拉取最新代码
echo "1. 拉取最新代码..."
git pull

# 强制重新构建Docker镜像(不使用缓存)
echo "2. 构建Docker镜像..."
docker build --no-cache -t zjoj-front .

# 停止并删除旧容器(如果存在)
echo "3. 停止旧容器..."
docker stop zjoj-front 2>/dev/null || true
docker rm zjoj-front 2>/dev/null || true

# 启动新容器
echo "4. 启动新容器..."
docker run -d --name zjoj-front -p 80:80 zjoj-front

# 检查容器状态
echo "5. 检查容器状态..."
docker ps | grep zjoj

echo "部署完成!"
