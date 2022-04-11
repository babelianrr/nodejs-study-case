const { User, User_token } = require("../models")
const joi = require("joi")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const sendEmail = require("../utils/email")

exports.getUsers = async (req, res) => {
  try {

    let users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"]
      }
    })

    res.status(200).send({
      users
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params

    let user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    })

    res.status(200).send({
      user
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.addUser = async (req, res) => {
  const schema = joi.object({
    name: joi.string().trim().min(3).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().min(6).required()
  })

  const { error } = schema.validate(req.body)

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message
      }
    })

  try {

    const salt = await bcrypt.genSalt(10)
    const hashedPw = await bcrypt.hash(req.body.password, salt)
    const exist = await User.findOne({
      where: { email: req.body.email }
    })

    if (exist) {
      return res.status(500).send({
        message: "User already exist"
      })
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPw,
      role_id: 1,
      is_active: 1
    })

    const token = jwt.sign({ id: User.id }, process.env.TOKEN_KEY)

    res.status(201).send({
      data: {
        name: newUser.name,
        token
      }
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.register = async (req, res) => {
  const schema = joi.object({
    name: joi.string().trim().min(3).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().min(6).required()
  })

  const { error } = schema.validate(req.body)

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message
      }
    })

  try {

    const salt = await bcrypt.genSalt(10)
    const hashedPw = await bcrypt.hash(req.body.password, salt)
    const exist = await User.findOne({
      where: { email: req.body.email }
    })

    if (exist) {
      return res.status(500).send({
        message: "User already exist"
      })
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPw,
      role_id: 2,
      is_active: 0
    })

    let token = await User_token.create({
      userId: newUser.id,
      token: crypto.randomBytes(32).toString("hex"),
    })

    const message = `http://localhost:5000/user/verify/${newUser.id}/${token.token}`

    await sendEmail(newUser.email, "Verify Email", message)

    res.status(201).send({
      message: "An Email sent to your account please verify"
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.verify = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id }
    })
    if (!user) return res.status(400).send("Invalid user")

    const token = await User_token.findOne({
      where: {
        userId: user.id,
        token: req.params.token
      }
    })
    if (!token) return res.status(400).send("Invalid token")

    await User.update({ is_active: 1 }, {
      where: { id: user.id }
    })
    await User_token.destroy({
      where: { userId: user.id }
    })

    res.status(200).send("Email verified sucessfully")
  } catch (error) {
    res.status(400).send("An error occured")
  }
}

exports._login = async (req, res) => {

  const schema = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(6).required(),
  })

  const { error } = schema.validate(req.body)

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message
      }
    })

  try {
    const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.TOKEN_KEY}&response=${req.body["g-recaptcha-response"]}`

    fetch(VERIFY_URL, { method: "POST" })
    // .then(res => res.json())
    // .then(json => res.send(json))

    const exist = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    })

    const valid = await bcrypt.compare(req.body.password, exist.password)

    if (!valid) {
      return res.status(400).send({
        message: "Invalid credentials",
      })
    }

    const active = await User.findOne({
      where: {
        email: req.body.email,
        is_active: 1
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    })

    if (!active) {
      return res.status(400).send({
        message: "Your account is inactive"
      })
    }

    const token = jwt.sign({ id: exist.id }, process.env.TOKEN_KEY)

    res.status(200).send({
      data: {
        id: exist.id,
        name: exist.name,
        email: exist.email,
        role_id: exist.role_id,
        token
      }
    })
    res.redirect("/home")


  } catch (error) {

    console.log(error)
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    })

  }

}

exports.checkAuth = async (req, res) => {

  try {

    const id = req.user.id

    const userData = await User.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    })

    if (!userData) {
      return res.status(404).send({
        message: "An error occurred"
      })
    }

    res.send({
      status: "Success",
      data: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    })

  } catch (error) {

    console.log(error)
    res.status({
      status: "Failed",
      message: "Server Error"
    })

  }

}
