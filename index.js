var http = require('http')
var fs = require('fs')
var server = http.createServer()
server.listen(3003,() => {
    console.log('http://127.0.0.1:3003')
})
server.on('request',(req,res) => {
    // 1.获取当前用户请求的url -- 路由
    var url = req.url
    // 获取请求方式  GET/POST
    var method = req.method
    console.log(url +":"+method)

    // 1.获取首页动态数据  req.url === '/' || req.url === '/index' mehtod === 'get'
    if(url === '/' || url === '/index' && method === 'GET'){
        fs.readFile(__dirname + '/views/index.html',(err,data) => {
            if(err){
                res.end('404')
            }else{
                res.end(data)
            }
        })
    }

    // 2.获取添加页面静态结构  req.url ==='/add'  method === 'get'
    // 3.实现新增操作 req.url === '/add' method === 'post'
    // 4.展示编辑动态页面 req.url === '/edit' method === 'get'
    // 5.实现编辑操作 req.url === '/edit?id=2' method ='post'
    // 6.实现删除操作：req.url === '/del?id=2' method === 'get'
    // 7.实现静态资源的加载 req.url === '/css/ | /images/'
    if(url.indexOf('/images') === 0 && method === 'GET' || url.indexOf('/node_modules') === 0 && method === 'GET'){
        fs.readFile(__dirname + url,(err,data) => {
            if(err){
                res.end('404')
            }else{
                res.end(data)
            }
        })
    }
    // 8.实现文件的上传操作 req.url === 'fileUpload' method === 'post'
})