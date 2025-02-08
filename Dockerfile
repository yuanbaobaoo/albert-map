FROM nginx:latest

# 创建目录
RUN mkdir -vp /data/www
# 复制文件
COPY dist/ /data/www/
# 复制nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf