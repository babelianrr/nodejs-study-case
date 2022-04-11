const { Product } = require("../models")

exports.addProduct = async (req, res) => {

  try {

    let newProduct = await Product.create({
      name: req.body.name,
      image: req.file.filename
    })

    newProduct = JSON.parse(JSON.stringify(newProduct))

    newProduct = {
      ...newProduct,
      image: process.env.PATH_FILE + newProduct.image
    }

    res.status(201).send({
      newProduct
    })

  } catch (error) {

    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    })

  }
}