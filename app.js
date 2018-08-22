var http = require('http')
// var fs = require('fs')
var router = require('./router')
var server = http.createServer()
server.listen(3005,() => {
    console.log('http://127.0.0.1:3005')
})
server.on('request',(req,res) => {
    router(req,res)
})