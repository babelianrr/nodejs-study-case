const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const { uploadFile } = require("../middlewares/uploadFile")

const { login, home } = require("../controllers/page")
const { register, getUsers, checkAuth, getUser, _login, verify } = require("../controllers/user")
const { getMenus, addMenu, updateMenu } = require("../controllers/menu")
const { getSubmenus, addSubmenu, updateSubmenu } = require("../controllers/submenu")
const { getRoles, addRole, updateRole } = require("../controllers/role")
const { addProduct } = require("../controllers/upload")

router.get("/login", login)
router.get("/home", home)

router.get("/checkauth", auth, checkAuth)
router.get("/users", auth, getUsers)
router.get("/user/:id", auth, getUser)
router.post("/register", register)
router.post("/login", _login)
router.get("/user/verify/:id/:token", verify)

router.get("/menus", auth, getMenus)
router.post("/addmenu", auth, addMenu)
router.put("/updatemenu/:id", auth, updateMenu)

router.get("/submenus", auth, getSubmenus)
router.post("/addsubmenu", auth, addSubmenu)
router.put("/updatesubmenu/:id", auth, updateSubmenu)

router.get("/roles", auth, getRoles)
router.post("/addrole", auth, addRole)
router.put("/updaterole/:id", auth, updateRole)

router.post("/product", uploadFile("image"), addProduct)

module.exports = router