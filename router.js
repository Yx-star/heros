var handler = require('./handler')

function router(req, res) {
  // 1.获取当前用户请求的url -- 路由
  var url = req.url
  // 获取请求方式  GET/POST
  var method = req.method
  // console.log(url + ":" + method)

  // 1.获取首页动态数据  req.url === '/' || req.url === '/index' mehtod === 'get'
  if (url === '/' || url === '/index' && method === 'GET') {
    handler.getIndexPage(req, res)
  }
  // 2.获取添加页面静态结构  req.url ==='/add'  method === 'get'
  if (url ==='/add' && method === 'GET') {
    handler.getAddPage(req,res)
  }
  // 3.实现新增操作 req.url === '/add' method === 'post'
  if(url === '/add'&& method === 'POST'){
    handler.doAdd(req,res)
  }
  // 4.展示编辑动态页面 req.url === '/edit' method === 'get'
  if (url.indexOf('/edit')===0 && method === 'GET') {
    handler.getEditPage(req,res)
  }
  // 5.实现编辑操作 req.url === '/edit?id=2' method ='post'
  if (url === '/edit' && method ==='POST') {
    handler.doEdit(req,res)
  }
  // 6.实现删除操作：req.url === '/del?id=2' method === 'get'
  if (url.indexOf('/del')== 0 && method === 'GET') {
    handler.delHeroById(req,res)
  }
  // 7.实现静态资源的加载 req.url === '/css/ | /images/'
  if (url.indexOf('/images') === 0 && method === 'GET' || url.indexOf('/node_modules') === 0 && method === 'GET') {
    handler.getStaticSource(req,res)
  }
  // 8.实现文件的上传操作 req.url === 'fileUpload' method === 'post'
  if(url === '/fileUpload' && method === 'POST'){
    handler.doFileUpload(req,res)
  }
}
//暴露给外界成员使用
// exports.router = router
module.exports = router