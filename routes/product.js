var express = require("express");
var router = express.Router();
var productModel = require("../models/product");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const req = require("express/lib/request");
const { dbCon } = require("../sharedComponents/db_Connection");
require('dotenv').config();
const secretKey = process.env.SECRET_JWT_KEY;


router.post("/insert", verifyToken, function (req, res, next) {
  productModel.create(req.body)
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

router.get('/products', function (req, res) {
  productModel.find().
      then(products => res.json({ products })).
      catch(err => res.status(500).json({ message: err.message }));
});


router.post('/search_products', function (req, res) {
  var name = req.body.name;
  productModel.find({ name: name }).
      then(products => res.json({ products })).
      catch(err => res.status(500).json({ message: err.message }));
});



//cretaing a JWT token and send to server.
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
