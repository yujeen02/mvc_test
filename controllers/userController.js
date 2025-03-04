const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models");
const secretKey = process.env.mySecretKey;

const User = db.users;

// 사용자 추가
const addUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 중복
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "중복." });
    }

    // 사용자 생성

    const newUser = await User.create({ username, password });

    // JWT 토큰 생성
    const token = jwt.sign({ username: newUser.username }, secretKey, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.json({
      result: true,
      message: "회원가입 성공",
      token,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    return res.status(500).json({ result: false, message: "서버 오류" });
  }
};

// 로그인
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.json({ result: true, message: "로그인 성공", token });
  } catch (error) {
    console.error("로그인 오류:", error);
    return res.status(500).json({ result: false, message: "서버 오류" });
  }
};

// JWT 검증 API
const verifyProcess = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ verified: false, message: "토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return res.json({ verified: true, user: decoded });
  } catch (err) {
    console.error("토큰 검증 실패:", err);
    return res.json({ verified: false, message: "토큰이 유효하지 않습니다." });
  }
};

// 로그인 후
const loginAfter = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ where: { username: decoded.username } });

    if (!user) {
      return res.redirect("/login");
    }
    res.render("loginAfter", { user });
  } catch (error) {
    console.error("로그인 후 페이지 오류:", error);
    res.redirect("/login");
  }
};

// 로그아웃
const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
  res.json({ message: 로그아웃 });
};

// 모든 데이터
const getAllUsers = async (req, res) => {
  let users = await User.findAll({}).catch((err) => console.log(err));
  res.status(200).send(users);
};

// // 한명
// const getUser = async (req, res) => {
//   let id = req.params.id;
//   let user = await User.findOne({ where: { id: id } }).catch((err) =>
//     console.log(err)
//   );
//   res.status(200).send(user);
// };

// 수정
const updateUser = async (req, res) => {
  let id = req.params.id;
  const user = await User.update(req.body, { where: { id: id } }).catch((err) =>
    console.log(err)
  );
  res.status(200).send(user);
};

// 삭제
const deleteUser = async (req, res) => {
  let id = req.params.id;
  await User.destroy({ where: { id: id } }).catch((err) => console.log(err));
  res.status(200).send("User is deleted");
};

module.exports = {
  addUser,
  login,
  verifyProcess,
  logout,
  loginAfter,
  getAllUsers,
  updateUser,
  deleteUser,
};
