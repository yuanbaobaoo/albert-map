#!/usr/bin/env bash

# 判断版本号
if [ $# -eq 0 ]; then
    echo "错误: 参数不足, #build \$project"
    exit 1
fi

# 项目名称
project="vmap-wiki-$1"
# 目录名称
projdir="site-$project"
# 版本号
version=$(date -d "$CI_PIPELINE_CREATED_AT" +"%Y%m%d%H%M%S")
# 工作目录
workPath=/data/xe-shell-cache/v-map-wiki/$projdir

mkdir -p $workPath
echo "npm编译参数: 工作目录=$workPath, 版本号=$version"

# 遍历 workPath 下的所有一级目录文件，删除除了 node_modules 外的所有文件
find "$workPath" -maxdepth 1 -print | while read item; do
    if [ "$item" = "$workPath" ]; then
        continue
    fi

    if [ "$item" = "$workPath/node_modules" ]; then
        continue
    fi

    echo "正在删除缓存：$item"
    rm -r $item
done

# 切换到项目目录
cd $projdir

# 复制当前目录文件到缓存目录
find . -maxdepth 1 ! -name "node_modules" ! -name "." ! -name ".git" ! -name ".gitignore" ! -name ".vitepress" ! -name ".idea" ! -name "dist" -exec cp -r {} $workPath/ \;
# 处理了一下.vitepress目录下的文件
find .vitepress -maxdepth 1 ! -name "." ! -name "cache" -exec cp -r {} $workPath/.vitepress/ \;
# 切换工作目录
cd $workPath

# 判断是否有插件，有的话就执行
if [ -e plugin.sh ]; then
  source plugin.sh
fi

# 安装依赖、编译
npm i
npm run build

# 检查退出状态码
if [ $? -ne 0 ]; then
  exit 1
fi

echo "npm编译结束: 工作目录=$workPath, 版本号=$version"
