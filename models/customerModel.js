module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define("Customer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: "Users", 
        key: "id"
      }
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

  Customer.associate = (models) => {
    // Customer modelinin bir User'a ait olduğunu belirtiyoruz
    Customer.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  };

  return Customer;
};

