const { User_menu } = require('../models')

exports.getMenus = async (req, res) => {
  try {

    let menus = await User_menu.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    })

    res.status(200).send({
      menus
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.addMenu = async (req, res) => {
  try {

    const exist = await User_menu.findOne({
      where: { menu: req.body.menu }
    })

    if (exist) {
      return res.status(500).send({
        message: "Menu already exist"
      })
    }

    let menus = await User_menu.create({
      menu: req.body.menu
    })

    res.status(201).send({
      menus
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.updateMenu = async (req, res) => {
  try {

    const { id } = req.params

    await User_menu.update(req.body, {
      where: { id }
    })

    let menus = await User_menu.findOne({
      where: { id }
    })

    res.status(201).send({
      menus
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}