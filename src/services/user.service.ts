/**
 * User Service
 * Handles user-related operations using JSON storage
 */

import { StorageService } from './storage.service';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
}

export interface LoginCredentialsDto {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AuthResult {
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * User service for managing user data and authentication
 */
export class UserService {
  private storage: StorageService<User>;

  constructor() {
    this.storage = new StorageService<User>('users');
  }

  /**
   * Get all users (excluding passwords)
   */
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.storage.findAll();
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<User | null> {
    return this.storage.findById(id);
  }

  /**
   * Find user by username
   */
  async findUserByUsername(username: string): Promise<User | null> {
    const users = await this.storage.findAll();
    return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null;
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.storage.findAll();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Register a new user
   */
  async registerUser(userData: CreateUserDto): Promise<User> {
    // Validate input
    if (!userData.username || userData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Check if username already exists
    const existingUser = await this.findUserByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.findUserByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      role: 'user',
      createdAt: new Date()
    };

    return this.storage.create(newUser);
  }

  /**
   * Register admin user (first admin only)
   */
  async createAdminUser(userData: CreateUserDto): Promise<User> {
    // Check if admin already exists
    const allUsers = await this.storage.findAll();
    const existingAdmin = allUsers.find((user) => user.role === 'admin');
    if (existingAdmin) {
      throw new Error('Admin user already exists');
    }

    // Validate input
    if (!userData.username || userData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create admin user
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      role: 'admin',
      createdAt: new Date()
    };

    return this.storage.create(newUser);
  }

  /**
   * Login user and generate tokens
   */
  async loginUser(credentials: LoginCredentialsDto): Promise<AuthResult> {
    // Find user
    const user = await this.findUserByUsername(credentials.username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.username, user.role);
    const refreshToken = generateRefreshToken(user.id, user.username, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  /**
   * Login admin user
   */
  async loginAdmin(credentials: LoginCredentialsDto): Promise<AuthResult> {
    // Find user
    const user = await this.findUserByUsername(credentials.username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify admin role
    if (user.role !== 'admin') {
      throw new Error('Admin access only');
    }

    // Verify password
    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.username, user.role);
    const refreshToken = generateRefreshToken(user.id, user.username, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'role' | 'createdAt' | 'password'>>): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent role changes
    const updateData = {
      ...user,
      ...updates,
      role: user.role,
      id: user.id,
      createdAt: user.createdAt
    };

    return this.storage.update(id, updateData);
  }

  /**
   * Update user password
   */
  async updateUserPassword(id: string, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    return this.storage.update(id, { ...user, password: hashedPassword });
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }
}
