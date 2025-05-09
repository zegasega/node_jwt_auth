const axios = require('axios');
const { faker } = require('@faker-js/faker');  

const createRandomUsers = async () => {
  for (let i = 0; i < 1000; i++) {
    // Generate random user data
    const userData = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),  
      role: Math.random() > 0.5 ? 'user' : 'admin',
      age: faker.number.int({ min: 18, max: 100 }),  // Random age between 18 and 100
      country: faker.location.country()  // Random country
    };

    try {
      // Send POST request to create user
      const response = await axios.post('http://localhost:3000/user/register', userData);

      // Log successful user creation
      console.log(`Kullanıcı ${i + 1} oluşturuldu:`, response.data);
    } catch (error) {
      // Log error if user creation fails
      console.error(`Kullanıcı ${i + 1} oluşturulurken hata oluştu:`, error.response ? error.response.data : error.message);
    }
  }
};

// Call the function to create random users
createRandomUsers();
