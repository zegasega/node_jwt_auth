const axios = require('axios');
const { faker } = require('@faker-js/faker');  // Burada faker modülünü doğru şekilde import ediyoruz

// 20 adet rastgele kullanıcı oluşturma fonksiyonu
const createRandomUsers = async () => {
  for (let i = 0; i < 20; i++) {
    // Faker ile rastgele kullanıcı verileri oluşturuyoruz
    const userData = {
      username: faker.internet.userName(),  // Rastgele kullanıcı adı
      email: faker.internet.email(),        // Rastgele e-posta adresi
      password: faker.internet.password(),  // Rastgele şifre
      role: Math.random() > 0.5 ? 'user' : 'admin',  // Rastgele "user" veya "admin" rolü
    };

    try {
      // API'ye POST isteği gönderiyoruz
      const response = await axios.post('http://localhost:3000/user/register', userData);

      // Başarılı bir şekilde kullanıcı oluşturulduysa konsola yazdır
      console.log(`Kullanıcı ${i + 1} oluşturuldu:`, response.data);
    } catch (error) {
      // Hata oluşursa hata mesajını yazdır
      console.error(`Kullanıcı ${i + 1} oluşturulurken hata oluştu:`, error.response ? error.response.data : error.message);
    }
  }
};

// Kullanıcıları oluştur
createRandomUsers();
