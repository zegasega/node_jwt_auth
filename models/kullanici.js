const { DataTypes } = require('sequelize');
const { hashPassword } = require('../utils/utils'); // Şifre hashleme fonksiyonunuzun bulunduğu dosya

module.exports = (sequelize) => {
  const Kullanici = sequelize.define('Kullanici', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ad: {
      type: DataTypes.STRING,
    },
    soyad: {
      type: DataTypes.STRING,

    },
    email: {
      type: DataTypes.STRING,
      
    },
    sifre: { 
      type: DataTypes.STRING,
    },
    rol: {
      type: DataTypes.ENUM('standart', 'admin', 'yonetici'),
      defaultValue: 'standart',
    },
    sifreHash: { 
      type: DataTypes.STRING,
    },
  });

  Kullanici.beforeCreate(async (kullanici) => {
    if (kullanici.sifre) {
      kullanici.sifreHash = await hashPassword(kullanici.sifre);
    }
  });

  return Kullanici;
};