var fs = require('fs')
//1.获取所有数据
exports.getAllData = (callback) => {
  //1.读取指定的数据文件
  fs.readFile(__dirname + "/data/data.json", (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, JSON.parse(data.toString()))
    }
  })
}
//添加用户
exports.addhero = (newobj, callback) => {
  //1.读取文件
  fs.readFile(__dirname + "/data/data.json", (err, data) => {
    if (err) {
      callback(err)
    } else {
      //1.读取json文件转为对象或数组
      var dataObj = JSON.parse(data.toString())
      console.log(dataObj)
      //2.获取最后一个元素的id号 + 1
      newobj.id = dataObj.heros[dataObj.heros.length - 1].id + 1
      //3.将新数据添加到数组中
      dataObj.heros.push(newobj)
      // 4.再将添加新数据的数组写入文件
      fs.writeFile(__dirname + '/data/data.json', JSON.stringify(dataObj, null, ''), (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  })
}

// 根据id获取对应的数据对象
exports.getHeroById = (id, callback) => {
  // 调用之前封装的方法获取所有数据
  this.getAllData((err, data) => {
    if (err) {
      callback(err)
    } else {
      // 说明我们已经成功的获取数据，并且数据的格式是一个对象
      data.heros.forEach((value, index) => {
        // 在进行id比较的时候不能添加类型的判断
        if (value.id == id) {
          callback(null, value)
        }
      })
    }
  })
}

// 根据id号编辑用户数据
exports.updateHero = (upObj, callback) => {
  this.getAllData((err, data) => {
    if (err) {
      callback(err)
    } else {
      // 在使用forEach的时候，value值只是原始值的副本。所以对副本进行修改，原始值不变
      data.heros.forEach((value, index) => {
        if (value.id == upObj.id) {
          value.name = upObj.name
          value.gender = upObj.gender
          value.img = upObj.img
          //将文件重新写入
          fs.writeFile(__dirname+'/data/data.json',JSON.stringify(data),(err)=>{
            if(err){
              callback(err)
            }else{
              callback(null)
            }
          })
        }
      })
    }
  })
}

//删除信息
exports.deleteHeroById=(id,callback)=>{
  this.getAllData((err,data)=>{
    if(err){
      callback(err)
    }else{
      for (var i = 0; i < data.heros.length; i++) {
        if(data.heros[i].id==id){
          data.heros.splice(i,1)
          break
        }
      }
      //数据重新写入文件中
      fs.writeFile(__dirname+'/data/data.json',JSON.stringify(data,null,""),(err)=>{
        if(err){
          callback(err)
        }else{
          callback(null)
        }
      })
    }
  })
}