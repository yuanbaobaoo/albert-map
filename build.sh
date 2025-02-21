#!/usr/bin/env bash

# 判断版本号
if [ $# -eq 0 ]; then
    echo "错误: 参数不足, #build \$project"
    exit 1
fi

# 项目名称
project="vmap-wiki-$1"
# 目录名称
projdir="site-$1"
# 版本号
version=$(date +"%Y%m%d%H%M")
# 根目录
workRoot=/data/xe-shell-cache/v-map-wiki
# 工作目录
workPath=$workRoot/$projdir

# 删除缓存
read -p "正在删除缓存目录 $workRoot 是否立即执行？(y/n) : " delOk
if [ "$delOk" != "y" ]; then
    exit 1
fi

rm -r $workRoot
mkdir -p $workPath && cp -r . $workRoot/
echo "npm编译参数: 工作目录=$workPath, 版本号=$version"

# 复制docker配置
cp -r docker/ $workPath/
# 删除其他文件
rm -r $workRoot/.gitignore $workRoot/.git
# 切换到项目目录
cd $projdir

## 判断是否有插件，有的话就执行
#if [ -e plugin.sh ]; then
#  source plugin.sh
#fi
#
## 安装依赖、编译
#npm i
#npm run build
#
## 检查退出状态码
#if [ $? -ne 0 ]; then
#  exit 1
#fi
#
## 执行 docker镜像编译
## nexus docker 仓库地址
#nexus_url=registry.cn-hongkong.aliyuncs.com/yuanbaobaoo/site
## 是否删除本地镜像
#dellocal=true
## 打包镜像
#echo "docker打包参数: project=$project, version=$version"
#
## build
#echo "start: docker build -t $project ."
#docker build -q -t $project .
#
## 检查退出状态码
#if [ $? -ne 0 ]; then
#  exit 1
#fi
#
## push
#imageName="$nexus_url:$project-$version"
#echo "docker tag $project $imageName"
#docker tag $project $imageName
#
## 检查退出状态码
#if [ $? -ne 0 ]; then
#  exit 1
#fi

# 如果本地镜像不保留，则上传镜像
#if [ "$dellocal" != "false" ]; then
#  # 上传镜像
#  echo "docker push $imageName"
#  docker push $imageName
#
#  # 检查退出状态码
#  if [ $? -ne 0 ]; then
#    exit 1
#  fi
#
#  echo "删除本地镜像缓存: $imageName"
#  docker rmi $imageName
#fi

# push 成功后，删除本地镜像
#docker rmi $project
# 用同名同版本打包，之前的镜像被变成<none>，这里先考虑删掉
#docker rmi $(docker images -f "dangling=true" -q) || true