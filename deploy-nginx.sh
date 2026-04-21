#!/bin/bash

# Nginx配置部署脚本
# 用法: ./deploy-nginx.sh [服务器IP] [用户名]

set -e

SERVER_IP="${1:-101.35.233.33}"
USERNAME="${2:-ubuntu}"

echo "=========================================="
echo "部署Nginx配置"
echo "=========================================="

# 上传配置文件
echo "上传Nginx配置文件..."
scp nginx.conf ${USERNAME}@${SERVER_IP}:~/zjoj-nginx.conf

# 应用配置
echo "应用Nginx配置..."
ssh ${USERNAME}@${SERVER_IP} "sudo cp ~/zjoj-nginx.conf /etc/nginx/sites-available/zjoj && sudo ln -sf /etc/nginx/sites-available/zjoj /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx"

echo "✅ Nginx配置部署完成!"
