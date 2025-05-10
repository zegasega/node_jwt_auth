module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id"
      }
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        defaultValue: "pending",
        allowNull: false
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

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, { foreignKey: "customerId", as: "customer" });
  };

  return Order;
};
