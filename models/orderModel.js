module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    virtuals: {
      totalPrice: {
        type: DataTypes.FLOAT,
        get() {
          const quantity = this.getDataValue('quantity');
          const product = this.getDataValue('product'); // Get associated product
          return quantity * (product ? product.price : 0);
        }
      }
    }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
    Order.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return Order;
};
