var express = require('express');
var fs = require('fs');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/glitch3d', function(req, res, next) {
  res.render('index');
});

router.post('/', function (req, res, next) {
  console.log("I made it!");
  //console.log(req.body.model);
    fs.writeFile('./public/uploads/upload_'+Date.now()+'.obj', req.body.model, function(err) {
      if (err) {
        console.log('fuck');
        console.log(err);
      }
      res.end();
    });
  //});
});

module.exports = router;
