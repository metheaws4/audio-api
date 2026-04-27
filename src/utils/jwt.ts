/**
 * JWT Utility Functions
 * Token generation and verification
 */

import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/environment';

/**
 * JWT payload interface extending JwtPayload
 */
export interface JwtPayloadExtended extends JwtPayload {
  userId: string;
  username: string;
  role: 'admin' | 'user';
}

/**
 * Sign a JWT access token
 * @param payload - Token payload
 * @param isAdmin - Whether this is an admin token
 * @param expiresIn - Token expiration time
 * @returns Signed JWT token
 */
export const signToken = (
  payload: Omit<JwtPayloadExtended, 'iat' | 'exp'>,
  isAdmin: boolean = false,
  expiresIn: string = '24h'
): string => {
  const secret = isAdmin ? env.adminJwtSecret : env.jwtSecret;
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @param isAdmin - Whether this is an admin token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (
  token: string,
  isAdmin: boolean = false
): JwtPayloadExtended => {
  const secret = isAdmin ? env.adminJwtSecret : env.jwtSecret;
  try {
    const decoded = jwt.verify(token, secret) as JwtPayloadExtended;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Generate access token for user
 * @param userId - User ID
 * @param username - Username
 * @param role - User role
 * @returns JWT access token
 */
export const generateAccessToken = (
  userId: string,
  username: string,
  role: 'admin' | 'user'
): string => {
  const isAdmin = role === 'admin';
  return signToken({ userId, username, role }, isAdmin, '24h');
};

/**
 * Generate refresh token for user
 * @param userId - User ID
 * @param username - Username
 * @param role - User role
 * @returns JWT refresh token with longer expiration
 */
export const generateRefreshToken = (
  userId: string,
  username: string,
  role: 'admin' | 'user'
): string => {
  const isAdmin = role === 'admin';
  return signToken({ userId, username, role }, isAdmin, '7d');
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export const extractTokenFromHeader = (
  authHeader?: string
): string | null => {
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return null;
};
