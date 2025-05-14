const {hashPassword } = require("../utils/utils")
const {sendTestEmail} = require("../services/emailService/sendTestMail");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM("standard", "admin", "manager"),
      defaultValue: "standard"
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
  });
    User.beforeCreate(async (user) => {
      await sendTestEmail(user.email)
  });

  User.hasMany(sequelize.models.Customer, { foreignKey: "createdBy", as: "customers" });

  return User;
};
