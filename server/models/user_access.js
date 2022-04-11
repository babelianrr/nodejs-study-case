'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_access extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_access.belongsTo(models.User_role, {
        as: 'role',
        foreignKey: {
          name: 'role_id'
        }
      })

      User_access.belongsTo(models.User_access, {
        as: 'menu',
        foreignKey: {
          name: 'menu_id'
        }
      })
    }
  }
  User_access.init({
    role_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_access',
  });
  return User_access;
};