var fs = require('fs')
var template = require('art-template')
var formidable = require('formidable')
var path = require('path')
var queryString = require('querystring')
var myurl = require('url')
var mymodule = require('./dataModule')
// 1.获取首页动态数据  req.url === '/' || req.url === '/
exports.getIndexPage = (req, res) => {
  mymodule.getAllData((err, data) => {
    if (err) {
      res.end('err')
    } else {
      // res.end(data)
      var html = template(__dirname + '/views/index.html', data)
      res.end(html)
    }
  })
}
// 2.获取添加页面静态结构  req.url ==='/add'  method === 'get'
exports.getAddPage = (req, res) => {
  fs.readFile(__dirname + "/views/add.html", (err, data) => {
    if (err) {
      res.end('404')
    } else {
      res.end(data)
    }
  })
}
// 3.实现新增操作 req.url === '/add' method === 'post'
exports.doAdd = (req, res) => {
  //收集数据
  // 在node中允许传递大容量的参数，如果传递的参数较大，那么它支持分批接收参数
  // 在接收参数的时候，会持续的触发data事件
  // data事件中有一个回调函数，这个函数的参数就是每次接收到的字符串
  var str = ''
  req.on('data', (chunk) => {
    str += chunk
  })
  //传参完毕的时候
  req.on('end', () => {
    // console.log(str)
    //需要传对象
    var newObj = queryString.parse(str)
    // console.log(newObj)
    mymodule.addhero(newObj, (err) => {
      if (err) {
        var retValue = {
          code: 100,
          msg: '添加失败'
        }
        res.end(JSON.stringify(retValue))
      } else {
        var retValue = {
          code: 200,
          msg: '添加成功'
        }
        res.end(JSON.stringify(retValue))
      }
    })
  })
}
// 4.展示编辑动态页面 req.url === '/edit' method === 'get'
exports.getEditPage = (req, res) => {
  var url = req.url
  // console.log(url);
  // 接收参数  /edit?id=2
  // parseQueryString <boolean> 如果为 true，则 query 属性总会通过 querystring 模块的 parse() 方法生成一个对象。
  var id = myurl.parse(url, true).query.id
  // console.log(id);
  // 根据id号获取对应的数据对象
  mymodule.getHeroById(id, (err, data) => {
    if (err) {
      res.end('404')
    } else {
      var html = template(__dirname + "/views/edit.html", data)
      res.end(html)
    }
  })
}
// 5.实现编辑操作 req.url === '/edit?id=2' method ='post'
exports.doEdit = (req, res) => {
  // 1.创建对象
  var form = new formidable.IncomingForm()
  // 2.设置编码：如果有普通键值对数据就最好设置
  form.encoding = 'utf-8'
  // 触发事件
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.end('err')
    } else {
      // console.log(fields)
      // fields就是修改后的值
      mymodule.updateHero(fields, (err) => {
        if (err) {
          var retValue = {
            code: 100,
            msg: '修改失败'
          }
          res.end(JSON.stringify(retValue))
        } else {
          var retValue = {
            code: 200,
            msg: '修改成功'
          }
          res.end(JSON.stringify(retValue))
        }
      })
    }
  })
}
// 6.实现删除操作：req.url === '/del?id=2' method === 'get'
// exports.delHeroById = (req, res) => {
//   var id = myurl.parse(req.url, true).query.id
//   mymodule.deleteHeroById(id, (err) => {
//     if (err) {
//       var retValue = {
//         code: 100,
//         msg: '删除失败'
//       }
//       res.end(JSON.stringify(retValue))
//     } else {
//       var retValue = {
//         code: 200,
//         msg: '删除成功'
//       }
//       res.end(JSON.stringify(retValue))
//     }
//   })
// }
exports.delHeroById = (req, res) => {
  var id = myurl.parse(req.url, true).query.id
  mymodule.deleteHeroById(id, (err) => {
    if (err) {
      res.end()
    } else {
      //通过响应头来实现重定向
      res.writeHead(301,{
        'Location':'/'
      })
      res.end()
    }
  })
}
// 7.实现静态资源的加载 req.url === '/css/ | /images/'
exports.getStaticSource = (req, res) => {
  fs.readFile(__dirname + req.url, (err, data) => {
    if (err) {
      res.end('404')
    } else {
      res.end(data)
    }
  })
}
// 8.实现文件的上传操作 req.url === 'fileUpload' method === 'post'
exports.doFileUpload = (req, res) => {
  //1.创建对象
  var form = new formidable.IncomingForm()
  // console.log(form);
  //2.设置编码：如果有普通键值对数据，最好设置
  form.encoding = 'utf-8'
  //3.设置上传文件的扩长名
  form.uploadDir = __dirname + '/images'
  //4.设置是否保留文件扩展名
  form.keepExtensions = true
  //5.上传文件会执行parse函数
  // req:因为req中请求报文，而传递的数据都存储在请求报文中
  // 上传完毕后触调用回调函数，这个里面有三个参数
  // err：上传如果失败的错误信息
  // fields：数据传递成功普通的键值对存储对象
  // files：文件上传成功，存储着文件信息
  form.parse(req, function (err, fields, files) {
    if (err) {
      var retValue = {
        code: 100,
        msg: '上传失败'
      }
      res.end(JSON.stringify(retValue))
    } else {
      var filename = path.basename(files.img.path)
      var retValue = {
        code: 200,
        msg: '上传成功',
        myimg: filename
      }
      res.end(JSON.stringify(retValue))
    }
  })
}