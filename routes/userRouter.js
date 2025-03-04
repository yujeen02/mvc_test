const userController = require("../controllers/userController.js");

const router = require("express").Router();

router.post("/addUser", userController.addUser);

router.get("/allUsers", userController.getAllUsers);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

router.post("/login", userController.login);

router.post("/verify", userController.verifyProcess);

router.get("/logout", userController.logout);

router.get("/loginAfter", userController.loginAfter);

module.exports = router;
