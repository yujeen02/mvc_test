const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const indexRouter = require("./routes/userRoutes");

app.set("view engine", "ejs");
app.set("views", "./views");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(port + "포트로 대기중 입니다.");
});
