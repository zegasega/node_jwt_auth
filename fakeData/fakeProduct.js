const axios = require('axios');
const { faker } = require('@faker-js/faker');

// Kaç adet veri oluşturulacağı
const PRODUCT_COUNT = 1000;

// API endpoint
const API_URL = 'http://localhost:3000/api/products';

// Access token
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnb2tiZXJra296YWtAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ3MTE3NTY1LCJleHAiOjE3NDcxMjExNjV9.uyMaSosRIF2IqCs4Z9WsO7y5TE4QQxyw-BGYaWVDDEo';

// Fake ürün oluşturan fonksiyon
const generateFakeProduct = () => ({
  name: faker.commerce.productName() + ' ' + faker.string.uuid(),
  price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
  description: faker.commerce.productDescription(),
  stock: faker.number.int({ min: 0, max: 100 }),
});

// Ürünleri gönderen fonksiyon
const seedProducts = async () => {
  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const product = generateFakeProduct();

    try {
      await axios.post(API_URL, product, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ (${i + 1}/${PRODUCT_COUNT}) ${product.name} eklendi`);
    } catch (error) {
      console.error(`❌ (${i + 1}) Hata:`, error.response?.data || error.message);
    }
  }

  console.log('🎉 1000 sahte ürün başarıyla gönderildi.');
};

seedProducts();
