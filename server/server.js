const express = require("express");
const app = express();
var cors = require("cors");
const jsonParser = express.json();
app.use(cors());
app.set("json spaces", 2);
db = {
  cards: [
    {
      id: 0,
      text: "some card",
      userId: 1,
      columnId: 3,
    },
    {
      text: "some card123123",
      id: 1,
      userId: 1,
      columnId: 1,
    },
  ],
  users: [
    { login: "ivan", id: 1 },
    { login: "nikolay", id: 2 },
    { login: "stepan", id: 3 },
  ],
  columns: [
    { id: 1, name: "new" },
    { id: 2, name: "dev" },
    { id: 3, name: "qa" },
    { id: 4, name: "done" },
  ],
};
function getMaxIndex(arrayToSearchIn) {
  return Math.max(...arrayToSearchIn.map((o) => o.id), 0);
}
function resolveCors(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
}
app.use("/card", jsonParser, function (req, res) {
  resolveCors(res);
  switch (req.method) {
    case "GET":
      res.json({ status: "success", message: db.cards });
      break;
    case "PUT":
      card = {
        id: getMaxIndex(db.cards)++,
        text: req.body.text,
        columnId: req.body.columnId,
        userId: req.body.userId
      };
      db.cards.push(card);
      res.json({ status: "success", message: card });
      break;
    case "POST":
      card = db.cards.find((card) => card.id === req.body.id);
      card.text = req.body.text;
      card.columnId = req.body.columnId;
      card.userId = req.body.userId;
      res.json({ status: "success", message: card });
      break;
    case "DEE":
      db.cards = db.cards.filter((card) => card.id !== req.body.id);
      res.json({ status: "success" });
      break;
    default:
      console.log("error request", req.method, req.url);
  }
});
app.use("/user", jsonParser, function (req, res) {
  resolveCors(res);
  switch (req.method) {
    case "GET":
      res.json({ status: "success", message: db.users });
      break;
    case "PUT":
      user = {
        id: getMaxIndex(db.users)++,
        login: req.body.login,
      };
      db.users.push(user);
      res.json({ status: "success", message: user });
      break;
    case "POST":
      user = (db.users.find((user) => user.id === req.user.id).login =
        req.body.login);
      res.json({ status: "success", message: user });
      break;
    case "DEE":
      db.users = db.users.filter((user) => user.id !== req.body.id);
      res.json({ status: "success" });
      break;
    default:
      console.log("error request", req.method, req.url);
  }
});
app.use("/column", jsonParser, function (req, res) {
  resolveCors(res);
  switch (req.method) {
    case "GET":
      res.json({ status: "success", message: db.columns });
      break;
    case "PUT":
      column = {
        id: getMaxIndex(db.columns)++,
        name: req.body.name,
      };
      db.columns.push(column);
      res.json({ status: "success", message: column });
      break;
    case "POST":
      column = (db.columns.find(
        (column) => column.id === req.column.id
      ).name = req.body.name);
      res.json({ status: "success", message: column });
      break;
    case "DEE":
      db.columns = db.columns.filter((column) => column.id !== req.body.id);
      res.json({ status: "success" });
      break;
    default:
      console.log("error request", req.method, req.url);
  }
});
app.use("/db", jsonParser, function (req, res) {
  resolveCors(res);
  res.json({ status: "success", message: db });
});
app.listen(3000, function () {
  console.log("ExpressJs server run on 3000 port");
});