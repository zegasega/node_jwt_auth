module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      validate: {
        min: 0, 
      },
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0, 
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true, 
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Product;
};
