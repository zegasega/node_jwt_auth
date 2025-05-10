const axios = require("axios");
const { faker } = require("@faker-js/faker");

// API endpoint
const API_ENDPOINT = "http://localhost:3000/api/customers";

// Token
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnb2tiZXJrLmtvemFrQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2ODg4NDAzLCJleHAiOjE3NDY4ODkzMDN9.s_H6mOm1IVl5xwVSYSdT-w9kJPVFP-lQYydQ6lW1k2Y";

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
