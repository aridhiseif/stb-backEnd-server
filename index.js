const express = require("express");
const { MongoClient, Collection } = require("mongodb");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const assert = require("assert");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());
const mongo_url = "mongodb://localhost:27017";

const dataBase = "STBDataBase";

const usersCol = "users";
const chequeCol = "cheques";

MongoClient.connect(
  mongo_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    assert.equal(err, null, "DB connection failed");
    const db = client.db(dataBase);

    app.get("/api/get_users", (req, res) => {
      console.log("get users");
      db.collection(usersCol)
        .find()
        .toArray((err, data) => {
          if (err) res.send("connot fetch users");
          else res.send(data);
        });
    });

    app.get("/get_cheque", (req, res) => {
      console.log("get all cheques");
      db.collection(chequeCol)
        .find()
        .toArray((err, data) => {
          if (err) res.send("connot fetch cheques");
          else res.send(data);
        });
    });

    app.post("/api/add_users", (req, res) => {
      let user = req.body;
      db.collection(usersCol).insertOne(user);
      res.send("user added");
    });

    app.post("/add_cheque", (req, res) => {
      console.log("Add cheque");
      const newCheque = req.body;
      db.collection(chequeCol).insertOne(newCheque);
      res.send("cheque posted");
    });

    app.post("/login", (req, res) => {
      console.log("Login");
      const user = req.body;
      let userToFetch = "seif";
      db.collection(usersCol)
        .findOne({ ident: user.ident, password: user.password })
        .then((resultat) => {
          if (!resultat) {
            res.send("no user");
          } else {
            res.send({
              token: "test123",
            });
          }
        });

      // res.send(userToFetch);
      /*
      if (!userToFetch) {
        res.send("no user");
      } else {
        res.send({
          token: "test123",
        });
      }
      */
    });

    app.delete("/delete_cheque", (req, res) => {
      console.log("deleting cheque");
      const deletedItem = req.body;
      console.log(deletedItem);
      db.collection(chequeCol).deleteOne({
        _id: new mongodb.ObjectId(deletedItem._id),
      });
      console.log("cheque deleted");
      res.send("cheque deleted");
    });
  }
);

app.listen(3200, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running on port 3200");
  }
});
