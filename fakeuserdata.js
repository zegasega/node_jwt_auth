const axios = require('axios');
const { faker } = require('@faker-js/faker');  

const createRandomUsers = async () => {
  for (let i = 0; i < 1000; i++) {
    const userData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Math.random() < 0.33 ? 'user' : (Math.random() < 0.5 ? 'admin' : 'manager')

    };

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);

      console.log(`Kullanıcı ${i + 1} oluşturuldu:`, response.data);
    } catch (error) {
      console.error(`Kullanıcı ${i + 1} oluşturulurken hata oluştu:`, error.response ? error.response.data : error.message);
    }
  }
};

createRandomUsers();
