/**
 * Environment Configuration
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment configuration interface
 */
interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  adminJwtSecret: string;
  bcryptSaltRounds: number;
}

/**
 * Get environment variable with fallback and validation
 */
const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

/**
 * Get environment variable as number with fallback and validation
 */
const getEnvNumber = (key: string, fallback?: number): number => {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Environment variable ${key} is required`);
  }
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return num;
};

/**
 * Environment configuration
 */
export const env: EnvironmentConfig = {
  port: getEnvNumber('PORT', 3000),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  jwtSecret: getEnv('JWT_SECRET'),
  adminJwtSecret: getEnv('ADMIN_JWT_SECRET'),
  bcryptSaltRounds: getEnvNumber('BCRYPT_SALT_ROUNDS', 10)
};

export default env;