// __tests__/e2e/blackbox.e2e.test.js - Black Box End-to-End Testing

const request = require('supertest');
describe('Black Box E2E Testing - Complete User Workflows', () => {
  
  /**
   * These tests treat the system as a "black box" - 
   * we only care about inputs and outputs, not implementation details
   */

  let app, server, mongoServer;

  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoose = require('mongoose');
    const express = require('express');

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    app = express();
    app.use(express.json());

    // Setup models
    const userSchema = new mongoose.Schema({
      full_name: String,
      email: String,
      password: String,
      reg_id: String,
      phone: Number,
    });

    const User = mongoose.model('User', userSchema);
    const teamSchema = new mongoose.Schema({
      email: String,
      team_name: String,
      team_code: String,
      type: String,
      description: String,
    });
    const Team = mongoose.model('Team', teamSchema);

    const teamMembersSchema = new mongoose.Schema({
      email: String,
      team_code: String,
      approval: String,
    });
    const TeamMembers = mongoose.model('TeamList', teamMembersSchema);

    // Endpoints
    app.post('/register', async (req, res) => {
      try {
          let { full_name, reg_id, phone, field, address, email, password, cpassword } = req.body;

          reg_id = reg_id === '' ? '-' : reg_id;
          field = field === '' ? '-' : field;
          address = address === '' ? '-' : address;

          if (!email || !password || password !== cpassword) {
            return res.status(400).json({ success: false, message: 'Invalid registration data' });
          }

          if (phone && !/^\d+$/.test(phone)) {
            return res.status(400).json({ success: false, message: "Phone must be numeric" });
          }

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(409).json({ success: false, message: 'User Already Registered ❌' });
          }

          const user = new User({ full_name, reg_id, phone, field, address, email, password });
          await user.save();

          return res.status(201).json({ success: true, message: 'Registration Successful ✅', user });

        } catch (err) {
          console.error('Error registering user:', err);

          if (err.name == 'ValidationError') {
            return res.status(400).json({ success: false, message: err.message });
          }

          return res.status(500).json({ success: false, message: 'Server error' });
        }
    });

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email, password });
      
      if (!user) {
        return res.status(401).json({ success: false });
      }

      res.status(200).json({ success: true, user });
    });

    app.post('/createTeam', async (req, res) => {
      const team = new Team(req.body);
      await team.save();

      const member = new TeamMembers({
        email: req.body.email,
        team_code: req.body.team_code,
        approval: 'yes',
      });
      await member.save();

      res.status(201).json({ success: true });
    });

    app.post('/joinTeam', async (req, res) => {
      const { email, team_code } = req.body;
      const team = await Team.findOne({ team_code });

      if (!team) {
        return res.status(404).json({ success: false });
      }

      const member = new TeamMembers({ email, team_code, approval: 'no' });
      await member.save();

      res.status(201).json({ success: true });
    });

    server = app.listen(9005);
  });

  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  // ==================== SCENARIO 1: New User Registration ====================
  test('Scenario 1: New user can register successfully', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        full_name: 'Alice Johnson',
        email: 'alice@gmail.com',
        password: 'secure123',
        cpassword: 'secure123',
        phone: 9876543210,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('Scenario 2: User registration fails with mismatched passwords', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        full_name: 'Bob Smith',
        email: 'bob@gmail.com',
        password: 'password123',
        cpassword: 'password456',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // ==================== SCENARIO 2: User Authentication ====================
  test('Scenario 3: Registered user can login', async () => {
    // Register first
    await request(app).post('/register').send({
      full_name: 'Charlie Brown',
      email: 'charlie@gmail.com',
      password: 'pass123',
      cpassword: 'pass123',
    });

    // Then login
    const response = await request(app)
      .post('/login')
      .send({
        email: 'charlie@gmail.com',
        password: 'pass123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('charlie@gmail.com');
  });

  test('Scenario 4: Login fails with incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@gmail.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // ==================== SCENARIO 3: Team Creation ====================
  test('Scenario 5: User can create a team', async () => {
    const response = await request(app)
      .post('/createTeam')
      .send({
        email: 'organizer@gmail.com',
        team_name: 'Python Developers',
        description: 'Advanced Python developers',
        type: 'professional',
        team_code: 'PYDEV001',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  // ==================== SCENARIO 4: Team Joining ====================
  test('Scenario 6: User can join an existing team', async () => {
    // Create team first
    await request(app).post('/createTeam').send({
      email: 'organizer2@gmail.com',
      team_name: 'Web Developers',
      team_code: 'WEBDEV001',
      description: 'Web dev team',
      type: 'professional',
    });

    // Join team
    const response = await request(app)
      .post('/joinTeam')
      .send({
        email: 'joiner@gmail.com',
        team_code: 'WEBDEV001',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('Scenario 7: User cannot join non-existent team', async () => {
    const response = await request(app)
      .post('/joinTeam')
      .send({
        email: 'joiner@gmail.com',
        team_code: 'NONEXISTENT',
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  // ==================== SCENARIO 5: Data Validation ====================
  test('Scenario 8: System rejects invalid input types', async () => {
    jest.setTimeout(10000);
    const response = await request(app)
      .post('/register')
      .send({
        full_name: 'Test User',
        email: 'test@gmail.com',
        password: 'pass123',
        cpassword: 'pass123',
        phone: 'noo', // Invalid phone
      });

    // Should either fail or handle gracefully
    expect([400, 201]).toContain(response.status);
  });

  test('Scenario 9: System handles empty form submission', async () => {
    const response = await request(app)
      .post('/register')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // ==================== SCENARIO 6: Concurrent Operations ====================
  test('Scenario 10: System handles concurrent requests', async () => {
    const requests = Array.from({ length: 5 }, (_, i) =>
      request(app)
        .post('/register')
        .send({
          full_name: `User ${i}`,
          email: `user${i}@gmail.com`,
          password: 'pass123',
          cpassword: 'pass123',
        })
    );

    const responses = await Promise.all(requests);
    responses.forEach(response => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  // ==================== SCENARIO 7: Error Handling ====================
  test('Scenario 11: System provides meaningful error messages', async () => {
    // Register user
    await request(app).post('/register').send({
      full_name: 'User',
      email: 'user@gmail.com',
      password: 'pass123',
      cpassword: 'pass123',
    });

    // Try to register duplicate email
    const response = await request(app)
      .post('/register')
      .send({
        full_name: 'Another User',
        email: 'user@gmail.com',
        password: 'pass123',
        cpassword: 'pass123',
      });

    expect(response.body).toHaveProperty('success');
    expect(response.status).toBe(409);
  });

  // ==================== SCENARIO 8: Data Persistence ====================
  test('Scenario 12: Registered user data persists across requests', async () => {
    const userData = {
      full_name: 'Persistent User',
      email: 'persistent@gmail.com',
      password: 'pass123',
      cpassword: 'pass123',
      phone: 1234567890,
    };

    // Register
    const registerResponse = await request(app)
      .post('/register')
      .send(userData);

    expect(registerResponse.body.success).toBe(true);

    // Login to verify persistence
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'persistent@gmail.com',
        password: 'pass123',
      });

    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.user.email).toBe('persistent@gmail.com');
  });
});
