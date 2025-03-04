require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

const userRouter = require("./routes/userRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/static", express.static(path.join(__dirname, "static")));

app.set("view engine", "ejs");

// 회원가입 페이지
app.get("/", async (req, res) => {
  const users = await db.users.findAll();
  res.render("index", { users });
});

// 로그인 페이지
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/loginAfter", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.mySecretKey);

    const user = await db.users.findOne({
      where: { username: decoded.username },
    });

    if (!user) {
      return res.redirect("/login");
    }

    res.render("loginAfter", { user });
  } catch (error) {
    console.error("로그인 후 페이지 오류:", error);
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// API 라우터 등록
app.use("/api", userRouter);

app.listen(port, () => {
  console.log(port, "번 포트에서 대기 중");
});
