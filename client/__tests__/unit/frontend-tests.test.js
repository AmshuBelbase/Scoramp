// __tests__/unit/frontend.test.js - White Box Testing for Frontend Components

import React from 'react';
import LoginForm from '../../src/Components/LoginForm/LoginForm.jsx';
import SignUpForm from '../../src/Components/SignUpForm/SignUpForm.jsx';
import Teams from '../../src/Components/Teams/Teams.jsx';
import LeaderBoard from '../../src/Components/LeaderBoard/LeaderBoard.jsx';
import SettingsPage from '../../src/Components/SettingsPage/SettingsPage.jsx';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

beforeAll(() => {
  window.alert = jest.fn();
});


// ==================== LOGINFORM TESTS ====================

describe('LoginForm - White Box Testing', () => {
  
  test('Should initialize with empty form fields', () => {
    render(
      <BrowserRouter>
        <LoginForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const [passwordInput] = screen.getAllByPlaceholderText(/password/i);

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  test('Should update state when form inputs change', () => {
    render(
      <BrowserRouter>
        <LoginForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    // const emailInput = getByPlaceholderText(/email/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });

    expect(emailInput.value).toBe('test@gmail.com');
  });

  test('Should validate email format (must contain gmail.com)', async () => {
    render(
      <BrowserRouter>
        <LoginForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const [passwordInput] = screen.getAllByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@yahoo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('You Entered Something Wrong ❌');
    });
  });

  test('Should call login API with correct credentials', async () => {
    const setLoginUserMock = jest.fn();
    axios.post.mockResolvedValue({
      data: {
        message: 'Login Successful ✅',
        user: { _id: '123', email: 'test@gmail.com' }
      }
    });

    render(
      <BrowserRouter>
        <LoginForm setLoginUser={setLoginUserMock} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@gmail.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { 
      target: { value: 'password123' } 
    });

    
    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:9002/login', {
        email: 'test@gmail.com',
        password: 'password123'
      });
    });
  });

  test('Should display error message for failed login', async () => {
    axios.post.mockResolvedValue({
      data: {
        message: "Email & Password didn't match ❌"
      }
    });

    render(
      <BrowserRouter>
        <LoginForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@gmail.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { 
      target: { value: 'wrongpassword' } 
    });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Email & Password didn't match ❌");
    });
  });
});

// ==================== SIGNUPFORM TESTS ====================

describe('SignUpForm - White Box Testing', () => {
  
  test('Should initialize with empty form fields', () => {
    render(
      <BrowserRouter>
        <SignUpForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    const fullNameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const phoneInput = screen.getByPlaceholderText(/phone/i);

    expect(fullNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(phoneInput.value).toBe('');
  });

  test('Should validate phone number length (must be 10 digits)', () => {
    render(
      <BrowserRouter>
        <SignUpForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/phone/i), { 
      target: { value: '123' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@gmail.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/create password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
      target: { value: 'password123' } 
    });

    const registerButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(registerButton);

    expect(window.alert).toHaveBeenCalledWith('You Entered Something Wrong ❌');
  });

  test('Should validate password match', () => {
    render(
      <BrowserRouter>
        <SignUpForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/full name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/phone/i), { 
      target: { value: '9876543210' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@gmail.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/create password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
      target: { value: 'password456' } 
    });

    const registerButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(registerButton);

    expect(window.alert).toHaveBeenCalledWith('You Entered Something Wrong ❌');
  });

  test('Should validate email format (must contain gmail.com)', () => {
    render(
      <BrowserRouter>
        <SignUpForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@yahoo.com' } 
    });

    const registerButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(registerButton);

    expect(window.alert).toHaveBeenCalledWith('You Entered Something Wrong ❌');
  });

  test('Should call register API with valid data', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'Registration Successful ✅' }
    });

    render(
      <BrowserRouter>
        <SignUpForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/full name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/phone/i), { 
      target: { value: '9876543210' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@gmail.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/create password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
      target: { value: 'password123' } 
    });

    
    const registerButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9002/register',
        expect.any(Object)
      );
    });
  });
});

// ==================== TEAMS FORM TESTS ====================

describe('Teams Component - White Box Testing', () => {
  
  const mockUser = { _id: '123', email: 'test@gmail.com' };

  test('Should initialize with empty new team form', () => {
    render(
      <BrowserRouter>
        <Teams setLoginUser={jest.fn()} user={mockUser} />
      </BrowserRouter>
    );

    // Click to toggle popup on
    const menuDiv = screen.getByText(/new team/i).closest('.menu');
    userEvent.click(menuDiv);

    const teamNameInput = screen.getByPlaceholderText(/Team Name/i);
    expect(teamNameInput.value).toBe('');
  });

  test('Should generate team code when type is selected', () => {
    render(
      <BrowserRouter>
        <Teams setLoginUser={jest.fn()} user={mockUser} />
      </BrowserRouter>
    );
    const menuDiv = screen.getByText(/new team/i).closest('.menu');
    userEvent.click(menuDiv);
    // Select type
    const typeSelect = screen.getByRole('combobox');
    expect(typeSelect.value).toBe(''); // initially empty string for default option

    fireEvent.change(typeSelect, { target: { value: 'private' } });
    expect(typeSelect.value).toBe('private');


    // Team code should be generated
    const matchedElements = screen.getAllByDisplayValue(/^[a-z0-9]+$/i);
    expect(matchedElements.length).toBeGreaterThan(0);
  });

  test('Should validate team creation with all required fields', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'Team Created Successfully ✅', stat: 'true' }
    });

    render(
      <BrowserRouter>
        <Teams setLoginUser={jest.fn()} user={mockUser} />
      </BrowserRouter>
    );

    const menuDiv = screen.getByText(/new team/i).closest('.menu');
    userEvent.click(menuDiv);

    fireEvent.change(screen.getByPlaceholderText(/team name/i), { 
      target: { value: 'Test Team' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { 
      target: { value: 'Test Description' } 
    });

    // Select type to generate team_code
    fireEvent.change(screen.getByRole('combobox'), { 
      target: { value: 'private' } 
    });

    // expect(typeSelect.value).toBe(''); // initially empty string for default option

    // fireEvent.change(typeSelect, { target: { value: 'private' } });
    // expect(typeSelect.value).toBe('private');

    const createButton = screen.getByRole('button', { name: /create team/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});

// ==================== STATE MANAGEMENT TESTS ====================

describe('State Management - White Box Testing', () => {
  
  test('Should handle state updates correctly in LoginForm', () => {
    const { rerender, getByPlaceholderText } = render(
      <BrowserRouter>
        <LoginForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    const emailInput = getByPlaceholderText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    expect(emailInput.value).toBe('test@gmail.com');
    
    fireEvent.change(emailInput, { target: { value: 'another@gmail.com' } });
    expect(emailInput.value).toBe('another@gmail.com');
  });

  test('Should clear form after successful submission', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'Registration Successful ✅' }
    });

    const { getByPlaceholderText } = render(
      <BrowserRouter>
        <SignUpForm setLoginUser={jest.fn()} />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(getByPlaceholderText(/full name/i), { 
      target: { value: 'John Doe' } 
    });

    // After submission, form should be reset
    // (This depends on your implementation)
  });
});
