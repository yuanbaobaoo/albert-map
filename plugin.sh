# 编译前声明base路径
base="/"

# 覆盖自定义编译配置文件
echo "
/**
 * compile.ts文件为自动生成，请不要在该文件做任何修改
 * 任何修改，在提交正式环境编译时都会被覆盖，如果有需要，请在build.sh中修改
 */
export default {
    BASE: '$base'
}
" > .vitepress/compile.ts

# 覆盖nginx.conf
sed -i 's#__BASE__#'$base'#g' nginx.conf
