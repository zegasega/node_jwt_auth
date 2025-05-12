const { faker } = require('@faker-js/faker');
const axios = require('axios');

// API URL'sini burada belirtin
const apiUrl = 'http://localhost:3000/api/orders'; // API endpoint örneği
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnb2tiZXJra296YWtAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ3MDU2MzA2LCJleHAiOjE3NDcwNTk5MDZ9.EwfyiFuf2orpLNGTZhmNl38qr17r5e5SEdKUxhgu3hg"; // Access token

async function generateFakeOrder() {
  // Sipariş verilerini oluşturma
  const order = {
    customerId: faker.number.int({ min: 1, max: 1 }), // Rastgele müşteri ID'si
    totalAmount: faker.commerce.price({ min: 1, max: 1, dec: 2 }), // 10 ile 500 arasında rastgele fiyat
    status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'cancelled']), // Sipariş durumu
    orderDetails: [
      {
        productId: faker.number.int({ min: 1, max: 100 }), // Rastgele ürün ID'si
        quantity: faker.number.int({ min: 1, max: 5 }), // Ürün miktarı
        price: faker.commerce.price({ min: 5, max: 100, dec: 2 }) // Ürün fiyatı
      }
    ], // Sipariş detayları, burada array kullanıyoruz
    paymentMethod: faker.helpers.arrayElement(['card', 'cash']), // Ödeme yöntemi
    notes: faker.lorem.sentence(), // Sipariş notları
  };

  try {
    const response = await axios.post(apiUrl, order, {
      headers: {
        'Authorization': `Bearer ${accessToken}` // Access token'ı Authorization başlığında gönderme
      }
    });
    console.log(`Sipariş başarıyla oluşturuldu: ${response.data.id}`);
  } catch (error) {
    console.error('Sipariş gönderilirken hata oluştu:', error.response?.data || error);
  }
}

async function generateMultipleOrders(count) {
  for (let i = 0; i < count; i++) {
    await generateFakeOrder(); // 100 adet sipariş üret
  }
}

generateMultipleOrders(100); // 100 adet sipariş üret
