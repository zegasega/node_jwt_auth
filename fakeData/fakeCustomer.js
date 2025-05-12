const axios = require("axios");
const { faker } = require("@faker-js/faker");

// API endpoint
const API_ENDPOINT = "http://localhost:3000/api/customers";

// Token
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnb2tiZXJra296YWtAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ3MDQ2MzI4LCJleHAiOjE3NDcwNDk5Mjh9.vc0xA0-RUM9VzCLSAmRHFKysVx-FNy7jk24ZY6XyeJM";

// Rastgele user ID (1-179 arası)
const getRandomUserId = () => Math.floor(Math.random() * 179) + 1;

// Sahte müşteri verisi oluştur
const createFakeCustomer = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number('+90 5## ### ## ##'),
  createdBy: getRandomUserId(),
});

// Header'lı POST isteği
async function sendFakeCustomerData() {
  const fakeCustomer = createFakeCustomer();

  try {
    const response = await axios.post(API_ENDPOINT, fakeCustomer, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    console.log("✅ Customer created:", response.data);
  } catch (error) {
    console.error("❌ Error creating customer:", error.response?.data || error.message);
  }
}

// Belirtilen sayıda veri gönder
async function seedCustomers(count = 10) {
  for (let i = 0; i < count; i++) {
    await sendFakeCustomerData();
  }
}

seedCustomers(100);
