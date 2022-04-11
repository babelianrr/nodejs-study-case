const { User_role, User_access } = require('../models')

exports.getRoles = async (req, res) => {
  try {

    let roles = await User_role.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    })

    res.status(200).send({
      roles
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.addRole = async (req, res) => {
  try {

    const exist = await User_role.findOne({
      where: { role: req.body.role }
    })

    if (exist) {
      return res.status(500).send({
        message: "Role already exist"
      })
    }

    let newRole = await User_role.create({
      role: req.body.role
    })

    res.status(201).send({
      newRole
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.updateRole = async (req, res) => {
  try {

    const { id } = req.params

    await User_role.update(req.body, {
      where: { id }
    })

    let role = await User_role.findOne({
      where: { id }
    })

    res.status(201).send({
      role
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}
