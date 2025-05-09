const { hash } = require("crypto");
const {hashPassword,comparePassword } = require("../utils/utils")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {  
      type: DataTypes.STRING,
    },
  });

  User.beforeCreate(async (user) => {
    if (user.password){
        user.password = await hashPassword(user.password)
    }
  })

  return User;
};
