const { User_menu, User_submenu } = require('../models')

exports.getSubmenus = async (req, res) => {
  try {
    let submenus = await User_submenu.findAll({
      include: {
        model: User_menu,
        as: "menu",
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    })

    res.status(200).send({
      submenus
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })
  }
}

exports.addSubmenu = async (req, res) => {
  try {

    const exist = await User_submenu.findOne({
      where: {
        menu_id: req.body.menu_id,
        submenu: req.body.submenu
      }
    })

    if (exist) {
      return res.status(500).send({
        message: "Submenu on this menu is already exist"
      })
    }

    let submenus = await User_submenu.create({
      menu_id: req.body.menu_id,
      submenu: req.body.submenu
    })

    res.status(201).send({
      submenus
    })

  } catch (err) {

    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })

  }
}

exports.updateSubmenu = async (req, res) => {
  try {
    const { id } = req.params

    await User_submenu.update(req.body, {
      where: { id }
    })

    let submenus = await User_submenu.findOne({
      where: { id }
    })

    res.status(201).send({
      submenus
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: "An error occurred"
    })
  }
}