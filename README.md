###本地运行
1. `npm install -d`
1. `npm start`
1.  打开浏览器访问 `http://localhost:8000`


###发版

1. 编译后的文件`index.html`中的css和js文件路径修改为绝对路径
1. 编译后的文件`index.js`中async.js文件路径修改为绝对路径
1. `scp /Users/marginyu/work/eospark/dist/* root@47.75.132.47:/usr/share/nginx/eos`
   密码：你懂的