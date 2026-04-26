#!/bin/bash

# Clash安装和配置脚本

echo "=== 安装Clash ==="

# 创建目录
mkdir -p ~/clash

# 下载Clash核心 (使用ghproxy加速)
echo "下载Clash核心..."
cd ~/clash
wget https://ghproxy.net/https://github.com/MetaCubeX/mihomo/releases/download/v1.18.7/mihomo-linux-amd64-v1.18.7.gz -O clash.gz || \
wget https://github.com/MetaCubeX/mihomo/releases/download/v1.18.7/mihomo-linux-amd64-v1.18.7.gz -O clash.gz

if [ ! -f clash.gz ]; then
    echo "下载失败,请手动下载"
    exit 1
fi

# 解压
gunzip -f clash.gz
chmod +x clash

# 创建Country.mmdb数据库
echo "下载GeoIP数据库..."
wget https://ghproxy.net/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb -o Country.mmdb || \
wget https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb -O Country.mmdb

# 创建systemd服务文件
echo "创建systemd服务..."
sudo tee /etc/systemd/system/clash.service > /dev/null <<EOF
[Unit]
Description=Clash Service
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=$HOME/clash/clash -d $HOME/clash
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 重载systemd
sudo systemctl daemon-reload

echo "=== 安装完成 ==="
echo "请将配置文件放到 ~/clash/config.yaml"
echo "然后运行: sudo systemctl start clash"
echo "查看状态: sudo systemctl status clash"
echo "查看日志: journalctl -u clash -f"
