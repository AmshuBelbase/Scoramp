// __tests__/integration/auth.integration.test.js - Integration Testing for Authentication

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;
let server;

// Setup similar to backend.test.js
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());

  // User Schema
  const userSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    password: String,
  });
  const User = mongoose.model('User', userSchema);

  // Register endpoint
  app.post('/register', async (req, res) => {
    const { full_name, email, password, cpassword } = req.body;

    if (!email || !password || password !== cpassword) {
      return res.status(400).json({ message: 'Invalid input', success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists', success: false });
    }

    const user = new User({ full_name, email, password });
    await user.save();
    res.status(201).json({ message: 'Registration successful', success: true, user });
  });

  // Login endpoint
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials', success: false });
    }

    const user = await User.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    res.status(200).json({ message: 'Login successful', success: true, user });
  });

  // Update user endpoint
  app.post('/updateUser', async (req, res) => {
    const { id, full_name, email, password } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { full_name, email, password },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    res.status(200).json({ message: 'Update successful', success: true, user });
  });

  server = app.listen(9002);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

// ==================== INTEGRATION TESTS ====================

describe('Authentication Flow - Integration Testing', () => {
  
  test('Complete user lifecycle: Register -> Login -> Update', async () => {
    // Step 1: Register user
    const registerResponse = await request(app).post('/register').send({
      full_name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.user.email).toBe('john@gmail.com');
    const userId = registerResponse.body.user._id;

    // Step 2: Login with registered user
    const loginResponse = await request(app).post('/login').send({
      email: 'john@gmail.com',
      password: 'password123',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.user.email).toBe('john@gmail.com');

    // Step 3: Update user profile
    const updateResponse = await request(app).post('/updateUser').send({
      id: userId,
      full_name: 'Jane Doe',
      email: 'jane@gmail.com',
      password: 'newpassword123',
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.user.full_name).toBe('Jane Doe');

    // Step 4: Verify login with new email
    const newLoginResponse = await request(app).post('/login').send({
      email: 'jane@gmail.com',
      password: 'newpassword123',
    });

    expect(newLoginResponse.status).toBe(200);
    expect(newLoginResponse.body.user.email).toBe('jane@gmail.com');
  });

  test('Should handle concurrent user registrations', async () => {
    const users = Array.from({ length: 5 }, (_, i) => ({
      full_name: `User ${i}`,
      email: `user${i}@gmail.com`,
      password: 'password123',
      cpassword: 'password123',
    }));

    const responses = await Promise.all(
      users.map(user => request(app).post('/register').send(user))
    );

    responses.forEach(response => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  test('Should handle invalid login attempts gracefully', async () => {
    // Register a user
    await request(app).post('/register').send({
      full_name: 'Test User',
      email: 'test@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    });

    // Attempt login with wrong password
    const response = await request(app).post('/login').send({
      email: 'test@gmail.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('Should prevent duplicate email registration', async () => {
    const userData = {
      full_name: 'Test User',
      email: 'duplicate@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    };

    // First registration
    const firstResponse = await request(app).post('/register').send(userData);
    expect(firstResponse.status).toBe(201);

    // Second registration with same email
    const secondResponse = await request(app).post('/register').send(userData);
    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.success).toBe(false);
  });
});

// ==================== BLACK BOX TESTS ====================

describe('Authentication - Black Box Testing', () => {
  
  test('User can register and login without knowing implementation details', async () => {
    // Register
    const register = await request(app).post('/register').send({
      full_name: 'Black Box User',
      email: 'blackbox@gmail.com',
      password: 'secure123',
      cpassword: 'secure123',
    });
    
    expect(register.body.success).toBe(true);

    // Login
    const login = await request(app).post('/login').send({
      email: 'blackbox@gmail.com',
      password: 'secure123',
    });
    
    expect(login.body.success).toBe(true);
    expect(login.body.user).toBeDefined();
  });

  test('System handles edge cases in credentials', async () => {
    // Register with special characters
    const response = await request(app).post('/register').send({
      full_name: 'Special!@#User',
      email: 'special@gmail.com',
      password: 'p@ssw0rd!#$',
      cpassword: 'p@ssw0rd!#$',
    });

    expect(response.body.success).toBe(true);
  });

  test('System rejects empty credentials', async () => {
    const response = await request(app).post('/login').send({
      email: '',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
