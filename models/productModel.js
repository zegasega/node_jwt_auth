// models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,  
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,  
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
  });

  return Product;
};
