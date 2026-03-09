// Mock user data for when database is unavailable
const mockUsers = [
  {
    "_id": "mock-user-1",
    "name": "Demo User",
    "email": "demo@vaccine.com",
    "role": "user",
    "governmentId": "USER001",
    "isEmailVerified": true,
    "password": "$2a$10$mockhashedpassword", // This is a mock hash for demo purposes
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "_id": "mock-admin-1",
    "name": "Demo Admin",
    "email": "admin@vaccine.com",
    "role": "admin",
    "governmentId": "ADMIN001",
    "isEmailVerified": true,
    "password": "$2a$10$mockhashedpassword", // This is a mock hash for demo purposes
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
];

// Function to find a user by email (case insensitive)
const findUserByEmail = (email) => {
  return mockUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
};

// Function to find a user by ID
const findUserById = (id) => {
  return mockUsers.find(user => user._id === id);
};

module.exports = {
  mockUsers,
  findUserByEmail,
  findUserById
};