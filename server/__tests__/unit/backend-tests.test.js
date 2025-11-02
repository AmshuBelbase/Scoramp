// __tests__/unit/backend.test.js - White Box Testing for Backend

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;
let server;

// Mock schemas and models
const userSchema = new mongoose.Schema({
  full_name: String,
  reg_id: String,
  phone: Number,
  field: String,
  address: String,
  email: String,
  password: String,
  cpassword: String,
});

const User = mongoose.model('User', userSchema);

const teamSchema = new mongoose.Schema({
  email: String,
  team_name: String,
  description: String,
  type: String,
  team_code: String,
});

const Team = mongoose.model('Team', teamSchema);

const teamListSchema = new mongoose.Schema({
  email: String,
  team_code: String,
  approval: String,
});

const TeamMembers = mongoose.model('TeamList', teamListSchema);

const taskSchema = new mongoose.Schema({
  email: String,
  task_title: String,
  team_code: String,
  full_marks: Number,
  given_date: String,
  deadline: String,
  description: String,
});

const Task = mongoose.model('Task', taskSchema);

// ==================== TEST SETUP ====================

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Initialize Express app for testing
  app = express();
  app.use(express.json());

  // Test routes (simplified from your index.js)
  app.post('/register', async (req, res) => {
    try {
      const { full_name, reg_id, phone, field, address, email, password, cpassword } = req.body;

      if (!email || !password || password !== cpassword) {
        return res.send({ message: 'Invalid input' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.send({ message: 'User Already Registered ❌' });
      }

      const user = new User({ full_name, reg_id, phone, field, address, email, password });
      await user.save();
      res.send({ message: 'Registration Successful ✅' });
    } catch (err) {
      res.send({ message: err.message });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.send({ message: 'Email and password required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.send({ message: 'User not Found ❌' });
      }

      if (password === user.password) {
        return res.send({ message: 'Login Successful ✅', user });
      } else {
        return res.send({ message: "Email & Password didn't match ❌" });
      }
    } catch (err) {
      res.send({ message: err.message });
    }
  });

  app.post('/createTeam', async (req, res) => {
    try {
      const { email, team_name, description, type, team_code } = req.body;

      if (!email || !team_name || !team_code) {
        return res.send({ message: 'Invalid input', stat: 'false' });
      }

      const existingTeam = await Team.findOne({ team_code });
      if (existingTeam) {
        return res.send({ message: 'Team Already Exists ❌', stat: 'false' });
      }

      const team = new Team({ email, team_name, description, type, team_code });
      await team.save();

      const teamMember = new TeamMembers({ email, team_code, approval: 'yes' });
      await teamMember.save();

      res.send({ message: 'Team Created Successfully ✅', stat: 'true' });
    } catch (err) {
      res.send({ message: err.message, stat: 'false' });
    }
  });

  app.post('/joinNewTeam', async (req, res) => {
    try {
      const { email, team_code } = req.body;

      const team = await Team.findOne({ team_code });
      if (!team) {
        return res.send({ message: "Team Doesn't Exists ❌", stat: 'false' });
      }

      const alreadyMember = await TeamMembers.findOne({ team_code, email });
      if (alreadyMember) {
        return res.send({ message: 'Already in Team 🙄', stat: 'false' });
      }

      const teamMember = new TeamMembers({ email, team_code, approval: 'no' });
      await teamMember.save();

      res.send({ message: 'Team Joined Successfully ✅ Wait for Approval !', stat: 'true' });
    } catch (err) {
      res.send({ message: err.message, stat: 'false' });
    }
  });

  server = app.listen(9001);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

// ==================== WHITE BOX TESTS ====================

describe('Backend White Box Testing - User Registration', () => {
  test('Should register a new user with valid data', async () => {
    const response = await request(app).post('/register').send({
      full_name: 'John Doe',
      reg_id: '12345',
      phone: 9876543210,
      field: 'Engineering',
      address: 'New York',
      email: 'john@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    });

    expect(response.body.message).toBe('Registration Successful ✅');
  });

  test('Should reject registration with mismatched passwords', async () => {
    const response = await request(app).post('/register').send({
      full_name: 'Jane Doe',
      email: 'jane@gmail.com',
      password: 'password123',
      cpassword: 'password456',
    });

    expect(response.body.message).toBe('Invalid input');
  });

  test('Should reject duplicate email registration', async () => {
    await request(app).post('/register').send({
      full_name: 'John Doe',
      email: 'duplicate@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    });

    const response = await request(app).post('/register').send({
      full_name: 'Jane Doe',
      email: 'duplicate@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    });

    expect(response.body.message).toBe('User Already Registered ❌');
  });

  test('Should reject registration with missing email', async () => {
    const response = await request(app).post('/register').send({
      full_name: 'Test User',
      password: 'password123',
      cpassword: 'password123',
    });

    expect(response.body.message).toBe('Invalid input');
  });
});

describe('Backend White Box Testing - Login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await request(app).post('/register').send({
      full_name: 'Test User',
      email: 'test@gmail.com',
      password: 'password123',
      cpassword: 'password123',
    });
  });

  test('Should login with correct credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    expect(response.body.message).toBe('Login Successful ✅');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('test@gmail.com');
  });

  test('Should reject login with incorrect password', async () => {
    const response = await request(app).post('/login').send({
      email: 'test@gmail.com',
      password: 'wrongpassword',
    });

    expect(response.body.message).toBe("Email & Password didn't match ❌");
  });

  test('Should reject login for non-existent user', async () => {
    const response = await request(app).post('/login').send({
      email: 'nonexistent@gmail.com',
      password: 'password123',
    });

    expect(response.body.message).toBe('User not Found ❌');
  });

  test('Should reject login with missing credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'test@gmail.com',
    });

    expect(response.body.message).toBe('Email and password required');
  });
});

describe('Backend White Box Testing - Team Management', () => {
  beforeEach(async () => {
    await Team.deleteMany({});
    await TeamMembers.deleteMany({});
  });

  test('Should create a team with valid data', async () => {
    const response = await request(app).post('/createTeam').send({
      email: 'owner@gmail.com',
      team_name: 'Test Team',
      description: 'A test team',
      type: 'academic',
      team_code: 'TEAM001',
    });

    expect(response.body.message).toBe('Team Created Successfully ✅');
    expect(response.body.stat).toBe('true');

    const team = await Team.findOne({ team_code: 'TEAM001' });
    expect(team).toBeDefined();
    expect(team.team_name).toBe('Test Team');
  });

  test('Should not create duplicate teams', async () => {
    await request(app).post('/createTeam').send({
      email: 'owner@gmail.com',
      team_name: 'Test Team',
      description: 'A test team',
      type: 'academic',
      team_code: 'TEAM002',
    });

    const response = await request(app).post('/createTeam').send({
      email: 'owner2@gmail.com',
      team_name: 'Another Team',
      description: 'Another team',
      type: 'academic',
      team_code: 'TEAM002',
    });

    expect(response.body.message).toBe('Team Already Exists ❌');
    expect(response.body.stat).toBe('false');
  });

  test('Should join an existing team', async () => {
    await request(app).post('/createTeam').send({
      email: 'owner@gmail.com',
      team_name: 'Test Team',
      description: 'A test team',
      type: 'academic',
      team_code: 'TEAM003',
    });

    const response = await request(app).post('/joinNewTeam').send({
      email: 'member@gmail.com',
      team_code: 'TEAM003',
    });

    expect(response.body.message).toBe('Team Joined Successfully ✅ Wait for Approval !');
    expect(response.body.stat).toBe('true');
  });

  test('Should not join non-existent team', async () => {
    const response = await request(app).post('/joinNewTeam').send({
      email: 'member@gmail.com',
      team_code: 'NONEXISTENT',
    });

    expect(response.body.message).toBe("Team Doesn't Exists ❌");
    expect(response.body.stat).toBe('false');
  });

  test('Should prevent duplicate team membership', async () => {
    await request(app).post('/createTeam').send({
      email: 'owner@gmail.com',
      team_name: 'Test Team',
      description: 'A test team',
      type: 'academic',
      team_code: 'TEAM004',
    });

    await request(app).post('/joinNewTeam').send({
      email: 'member@gmail.com',
      team_code: 'TEAM004',
    });

    const response = await request(app).post('/joinNewTeam').send({
      email: 'member@gmail.com',
      team_code: 'TEAM004',
    });

    expect(response.body.message).toBe('Already in Team 🙄');
    expect(response.body.stat).toBe('false');
  });
});

describe('Backend White Box Testing - Input Validation', () => {
  test('Should reject team creation with missing required fields', async () => {
    const response = await request(app).post('/createTeam').send({
      email: 'owner@gmail.com',
      team_name: 'Test Team',
    });

    expect(response.body.stat).toBe('false');
  });

  test('Should reject join team with missing fields', async () => {
    const response = await request(app).post('/joinNewTeam').send({
      email: 'member@gmail.com',
    });

    expect(response.body.stat).toBe('false');
  });
});
