const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;

const router = require("./routes/userRouter.js");

var corOptions = {
  origin: "https://localhost:3000",
};

app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/static", express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.use(cookieParser());

const cookieConfig = {
  maxAge: 30000,
  path: "/",
};

app.get("/", async (req, res) => {
  try {
    const users = await db.users.findAll();

    let showPopUp = req.cookies.popupClosed === "N" ? false : true;

    if (!req.cookies.popupClosed) {
      res.cookie("popupClosed", "Y", cookieConfig);
    }

    res.render("index", { users, showPopUp });
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

app.get("/close-popup", (req, res) => {
  res.cookie("popupClosed", "N", cookieConfig);
  res.send("팝업이 닫혔습니다. 30초 동안 다시 표시되지 않습니다.");
});

// API 라우터 등록
app.use("/api", router);

app.listen(port, () => {
  console.log(port, "번 포트에서 대기 중");
});
