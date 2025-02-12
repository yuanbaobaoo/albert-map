#!/usr/bin/env bash

# 判断版本号
if [ $# -eq0 ]; then
    echo "错误: 参数不足, #build \$version"
    exit 1
fi

# 项目名称
project=xw-albert-map
# 版本号
version=$(echo $1 | sed 's/[\/&]/\\&/g')
# 工作目录
workPath=/data/xe-shell-cache/$project

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

# nexus docker 仓库地址
nexus_url=registry.cn-hongkong.aliyuncs.com/yuanbaobaoo/site
# 是否删除本地镜像
dellocal=true
# 打包镜像
echo "docker打包参数: project=$project, version=$version"

# build
echo "start: docker build -t $project ."
docker build -q -t $project .

# 检查退出状态码
if [ $? -ne 0 ]; then
  exit 1
fi

# push
imageName="$nexus_url:$project-$version"
echo "docker tag $project $imageName"
docker tag $project $imageName

# 检查退出状态码
if [ $? -ne 0 ]; then
  exit 1
fi

# 如果本地镜像不保留，则上传镜像
if [ "$dellocal" != "false" ]; then
  # 上传镜像
  echo "docker push $imageName"
  docker push $imageName

  # 检查退出状态码
  if [ $? -ne 0 ]; then
    exit 1
  fi

  echo "删除本地镜像缓存: $imageName"
  docker rmi $imageName
fi

# push 成功后，删除本地镜像
docker rmi $project
# 用同名同版本打包，之前的镜像被变成<none>，这里先考虑删掉
docker rmi $(docker images -f "dangling=true" -q) || true