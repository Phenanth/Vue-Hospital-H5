# hosh5

> H5 pages using Vue.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# nginx配置
```
	 server {
        listen      8011;
        server_name  localhost;

        location / {
            #root   html;
            root    F:\Work\Vue\Hos\dist;
            index  index.html index.htm;
        }

        # proxy table settings in vue-cli
        location /api {
            proxy_pass  http://192.168.100.11:8093/;
        }

    }
```
[参考](https://blog.csdn.net/zhongzh86/article/details/70173174)

# 未完成
暂时不知道访问程序的完整URL是什么，所以无法得知能够获取`taxCode`的地址如何获得