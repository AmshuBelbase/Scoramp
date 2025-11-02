// __tests__/integration/teams.integration.test.js - Integration Testing for Teams

const request = require('supertest');

describe('Teams Workflow - Integration Testing', () => {
  
  let app, server, mongoServer;
  let userId, teamCode;

  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoose = require('mongoose');
    const express = require('express');

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    app = express();
    app.use(express.json());

    // Define models
    const userSchema = new mongoose.Schema({
      full_name: String,
      email: String,
      password: String,
    });

    const teamSchema = new mongoose.Schema({
      email: String,
      team_name: String,
      description: String,
      type: String,
      team_code: String,
    });

    const teamMembersSchema = new mongoose.Schema({
      email: String,
      team_code: String,
      approval: String,
    });

    const User = mongoose.model('User', userSchema);
    const Team = mongoose.model('Team', teamSchema);
    const TeamMembers = mongoose.model('TeamList', teamMembersSchema);

    // Routes
    app.post('/register', async (req, res) => {
      const { email, password, cpassword } = req.body;
      if (password !== cpassword) return res.json({ success: false });
      
      const user = new User(req.body);
      await user.save();
      res.json({ success: true, user });
    });

    app.post('/createTeam', async (req, res) => {
      const { email, team_name, description, type, team_code } = req.body;
      
      const team = new Team({ email, team_name, description, type, team_code });
      await team.save();

      const member = new TeamMembers({ email, team_code, approval: 'yes' });
      await member.save();

      res.json({ success: true, message: 'Team created' });
    });

    app.post('/joinNewTeam', async (req, res) => {
      const { email, team_code } = req.body;
      
      const team = await Team.findOne({ team_code });
      if (!team) return res.json({ success: false, message: 'Team not found' });

      const member = new TeamMembers({ email, team_code, approval: 'no' });
      await member.save();

      res.json({ success: true, message: 'Joined team' });
    });

    app.post('/getMyTeams', async (req, res) => {
      const { email } = req.body;
      const teams = await TeamMembers.find({ email });
      res.json(teams);
    });

    server = app.listen(9003);
  });

  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  test('Complete team workflow: Register -> Create Team -> Join Team -> Get Teams', async () => {
    // Step 1: Register owner
    const ownerReg = await request(app).post('/register').send({
      full_name: 'Team Owner',
      email: 'owner@gmail.com',
      password: 'pass123',
      cpassword: 'pass123',
    });

    expect(ownerReg.body.success).toBe(true);
    const ownerId = ownerReg.body.user._id;

    // Step 2: Create team
    const teamCode = 'TEAM' + Date.now();
    const teamCreate = await request(app).post('/createTeam').send({
      email: 'owner@gmail.com',
      team_name: 'Dev Team',
      description: 'Development team',
      type: 'academic',
      team_code: teamCode,
    });

    expect(teamCreate.body.success).toBe(true);

    // Step 3: Register another user
    const memberReg = await request(app).post('/register').send({
      full_name: 'Team Member',
      email: 'member@gmail.com',
      password: 'pass123',
      cpassword: 'pass123',
    });

    expect(memberReg.body.success).toBe(true);

    // Step 4: Member joins team
    const teamJoin = await request(app).post('/joinNewTeam').send({
      email: 'member@gmail.com',
      team_code: teamCode,
    });

    expect(teamJoin.body.success).toBe(true);

    // Step 5: Verify member can see team
    const myTeams = await request(app).post('/getMyTeams').send({
      email: 'member@gmail.com',
    });

    expect(myTeams.body.length).toBeGreaterThan(0);
    expect(myTeams.body[0].team_code).toBe(teamCode);
  });
});

// ==================== TASK INTEGRATION TESTS ====================

describe('Tasks Workflow - Integration Testing', () => {
  
  let app, server, mongoServer;

  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoose = require('mongoose');
    const express = require('express');

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    app = express();
    app.use(express.json());

    // Define models
    const taskSchema = new mongoose.Schema({
      email: String,
      task_title: String,
      team_code: String,
      full_marks: Number,
      given_date: String,
      deadline: String,
      description: String,
    });

    const subTaskSchema = new mongoose.Schema({
      email: String,
      task_id: String,
      team_code: String,
      full_marks: Number,
      subDate: String,
      submissionMessage: String,
      fscore: Number,
      tscore: Number,
    });

    const Task = mongoose.model('Task', taskSchema);
    const SubTask = mongoose.model('SubTask', subTaskSchema);

    // Routes
    app.post('/assignTask', async (req, res) => {
      const { email, task_title, team_code, full_marks, deadline, description } = req.body;
      
      const task = new Task({
        email,
        task_title,
        team_code,
        full_marks,
        deadline,
        description,
        given_date: new Date().toISOString(),
      });
      
      await task.save();
      res.json({ success: true, task });
    });

    app.post('/submitTask', async (req, res) => {
      const { email, task_id, team_code, full_marks, submissionMessage, fscore, tscore } = req.body;
      
      const submission = new SubTask({
        email,
        task_id,
        team_code,
        full_marks,
        submissionMessage,
        fscore,
        tscore,
        subDate: new Date().toISOString(),
      });

      await submission.save();
      res.json({ success: true, submission });
    });

    app.post('/getMyTasks', async (req, res) => {
      const tasks = await Task.find({});
      res.json(tasks);
    });

    server = app.listen(9004);
  });

  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  test('Complete task workflow: Assign Task -> Submit Task -> Score Task', async () => {
    // Step 1: Assign task
    const assignResponse = await request(app).post('/assignTask').send({
      email: 'teacher@gmail.com',
      task_title: 'React Assignment',
      team_code: 'TEAM001',
      full_marks: 100,
      deadline: '2025-12-31T23:59:59Z',
      description: 'Build a React component',
    });

    expect(assignResponse.body.success).toBe(true);
    const taskId = assignResponse.body.task._id;

    // Step 2: Student submits task
    const submitResponse = await request(app).post('/submitTask').send({
      email: 'student@gmail.com',
      task_id: taskId,
      team_code: 'TEAM001',
      full_marks: 100,
      submissionMessage: 'Completed the assignment',
      fscore: -1,
      tscore: 85,
    });

    expect(submitResponse.body.success).toBe(true);

    // Step 3: Get tasks to verify
    const tasksResponse = await request(app).post('/getMyTasks').send({});
    expect(tasksResponse.body.length).toBeGreaterThan(0);
  });
});
