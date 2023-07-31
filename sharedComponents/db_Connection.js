const mongoose = require("mongoose");

//-----------------MONGODB CONNECTION-----------------------
exports.dbCon = function () {
  mongoose.connect("mongodb+srv://mwajih:gts3850123@cluster0.oo2clvc.mongodb.net/College")
  .then(() => console.log('Connected!'));

  // mongoose.connect(
  //   process.env.mongo_URI,
  //   { useNewUrlParser: true },
  //   function (err, db) {
  //     if (err) throw err;
  //     console.log("*** MONGODB Connected ***");
  //   }
  // );
};

//----------------------------------------------------------
 