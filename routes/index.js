var express = require("express");
var router = express.Router();
var StudentModel = require("../models/student");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const req = require("express/lib/request");
const { dbCon } = require("../sharedComponents/db_Connection");
require('dotenv').config();
const secretKey = process.env.SECRET_JWT_KEY;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/insert", verifyToken, function (req, res, next) {
  StudentModel.create(req.body)
    .then(
      (data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post('/update_user', verifyToken, function (req, res) {

  var name = req.body.name;
  var password = req.body.password;

  StudentModel.updateOne({
      'password': password
  }, {
          'name': name
      }).then((data) => {
          console.log('User Updated');
          res.json(data);

      })
      .catch(err => res.status(500).json({ message: err.message }));
});

router.post('/delete_user',verifyToken, function (req, res) {

  var name = req.body.name;

  StudentModel.deleteOne({
      'name': name,
  }).then((data) => {
      console.log('User Deleted');
      res.json(data);

  }).catch(err => res.status(500).json({ message: err.message }));
});

router.get("/find", function (req, res, next) {
  StudentModel.find({})
    .then(
      (data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/findfirst", function (req, res, next) {
  StudentModel.findOne({ name: req.body.name })
    .then(
      (data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//cretaing a JWT token and send to server.

router.post('/login_user', function (req, res) {
  var name = req.body.name;
  var password = req.body.password;
  console.log(name)

  StudentModel.findOne({
      'name': name,
      'password': password
  }).then((data) => {
      console.log('User Found.');

      const token = jwt.sign({ name: name, password: password }, secretKey, { expiresIn: '1h' });
      res.json({
          'token': token,
          'name': name,
          'password': password
      });

  }).catch(err => res.status(500).json({ message: err.message }));
});

// router.post("/post", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authData) => {
//     if (err) {
//       console.log("error here");
//       res.sendStatus(403); //forbidden
//     } else {
//       res.json({
//         message: "Post Created ....",
//         authData,
//       });
//     }
//   });
// });

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(40); //forbidden
  }
}
module.exports = router;
