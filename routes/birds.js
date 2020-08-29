var express = require("express");
var router = express.Router();
var path = require("path"); //系统路径模块
var fs = require("fs"); //文件模块
var bodyParser = require("body-parser"); /*post方法*/

var app = express();

//login请求
app.use(bodyParser.json()); // 添加json解析
app.use(bodyParser.urlencoded({ extended: false }));

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/", function (req, res) {
  
});

router.post("/login", function (req, res, next) {
  const errorResponse = {
    code:400,
    errorMsg:''
  }
  const succResponse = {
    code:200,
    result:null
  }

  var emailAddress = req.body.emailAddress; //post专用
  var password = req.body.password;
  var file = path.join(__dirname, "data/users.json"); //文件路径，__dirname为当前运行js文件的目录
  //读取json文件
  fs.readFile(file, "utf-8", function (err, data) {
    if (err) {
      res.send("文件读取失败");
    } else {
      //校验用户名密码
      const user = JSON.parse(data).find((item) => {
        return item.emailAddress === emailAddress;
      });
      if(user){
        if(user.password===password){
          res.send({
            ...succResponse,
            result:{
              userAccountId:user.userAccountId,
              isAdmin:user.isAdmin,
              emailAddress:user.emailAddress
            }
          })
        }else{
          res.send({
            ...errorResponse,
            errorMsg:'密码错误'
          })
        }
      }else{
        res.send({
          ...errorResponse,
          errorMsg:'该用户不存在'
        })
      }
    }
  });
});

module.exports = router;
