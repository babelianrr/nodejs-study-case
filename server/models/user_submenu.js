'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_submenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_submenu.belongsTo(models.User_menu, {
        as: 'menu',
        foreignKey: {
          name: 'menu_id'
        }
      })
    }
  }
  User_submenu.init({
    menu_id: DataTypes.INTEGER,
    submenu: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_submenu',
  });
  return User_submenu;
};