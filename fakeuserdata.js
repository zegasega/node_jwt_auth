const axios = require('axios');
const { faker } = require('@faker-js/faker');  

const createRandomUsers = async () => {
  for (let i = 0; i < 1000; i++) {
    const userData = {
      username: faker.internet.userName(),
      email: faker.internet.email(),        
      password: faker.internet.password(),  
      role: Math.random() > 0.5 ? 'user' : 'admin',  
    };

    try {
      const response = await axios.post('http://localhost:3000/user/register', userData);

      console.log(`Kullanıcı ${i + 1} oluşturuldu:`, response.data);
    } catch (error) {
      console.error(`Kullanıcı ${i + 1} oluşturulurken hata oluştu:`, error.response ? error.response.data : error.message);
    }
  }
};

createRandomUsers();
