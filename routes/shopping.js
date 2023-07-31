var express = require("express");
var router = express.Router();
var cartSchema = require("../models/cart");
var productModel = require("../models/product");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const req = require("express/lib/request");
const { dbCon } = require("../sharedComponents/db_Connection");
require('dotenv').config();
const secretKey = process.env.SECRET_JWT_KEY;


router.post('/view-cart', function (req, res) {
  var username = req.body.username;
  cartSchema.find({ username: username }).
      then(carts => res.json(carts[0])).
      catch(err => res.status(500).json({ message: err.message }));
});

router.post('/add-product-to-cart', function (req, res) {
  var username = req.body.username;
  cartSchema.find({ username: username }).
      then(carts => {
          let cart = carts[0];
          var name = req.body.product;
          console.log('In products');
          productModel.model('Product').find({ name: name }).
              then(products => {
                  let cart_products = cart.products;
                  let product_id = product.id;
                  cart_products.push(product_id);
                  let updated_price = cart.total_price + product.price;

                  cartSchema.updateOne({
                      'username': req.body.username
                  }, {
                          'total_price': updated_price,
                          'products': cart_products
                      }).then((data) => {
                          console.log('Cart Updated');
                          res.json(data);
                      })
                      .catch(err => res.status(500).json({ message: err.message }));
              }).catch(err => res.status(500).json({ message: err.message }));
      }).
      catch(err => res.status(500).json({ message: err.message }));
});

router.post('/cart-checkout', function (req, res) {
  //place order
  var username = req.body.username;

  cartSchema.find({ username: username }).
      then(carts => {

          let cart = carts[0];
          var name = req.body.product;

          cartSchema.updateOne({
              'username': req.body.username
          }, {
                  'status': "complete",
              }).then((data) => {
                  console.log('ORder Placed');
                  res.json({
                      message: "Order Placed"
                  });
              })
              .catch(err => res.status(500).json({ message: err.message }));
      }).
      catch(err => res.status(500).json({ message: err.message }));
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
