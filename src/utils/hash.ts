/**
 * Password Hashing Utilities
 * Uses bcrypt for secure password hashing and comparison
 */

import bcrypt from 'bcrypt';
import { env } from '../config/environment';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 * @throws Error if hashing fails
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - Plain text password to compare
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 * @throws Error if comparison fails
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Failed to compare passwords');
  }
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid boolean and errors array
 */
export const validatePasswordStrength = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
