'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_role.hasMany(models.User, {
        foreignKey: {
          name: 'role_id'
        }
      })
      User_role.hasMany(models.User_access, {
        foreignKey: {
          name: 'role_id'
        }
      })
    }
  }
  User_role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_role',
  });
  return User_role;
};