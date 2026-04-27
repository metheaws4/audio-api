/**
 * Global type declarations for modules without @types packages
 */

declare module 'morgan' {
  import express = require('express');

  interface TokenHandler {
    (req: express.Request, res: express.Response): string;
  }

  interface LoggerOptions {
    stream?: {
      write: (message: string) => void;
    };
    format?: string | TokenHandler;
    level?: string;
  }

  interface Morgan extends express.RequestHandler {
    (format: string | TokenHandler, options?: LoggerOptions): express.RequestHandler;
    token(name: string, fn: TokenHandler): void;
    format(name: string, fmt: string | TokenHandler): void;
  }

  const morgan: Morgan;
  export = morgan;
}

declare module 'bcrypt' {
  export function hash(password: string, salt: number | string): Promise<string>;
  export function hashSync(password: string, salt: number | string): string;
  export function compare(password: string, hash: string): Promise<boolean>;
  export function compareSync(password: string, hash: string): boolean;
  export function genSalt(rounds: number): Promise<string>;
  export function genSaltSync(rounds: number): string;

  export namespace constants {
    export const SALT_ROUNDS: number;
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    [key: string]: any;
  }

  export interface SignOptions {
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'ES256' | 'none';
    expiresIn?: number | string;
    notBefore?: number | string;
    audience?: string | string[];
    issuer?: string;
    jwtid?: string;
    mutatePayload?: boolean;
    noTimestamp?: boolean;
    header?: { [key: string]: any };
  }

  export interface VerifyOptions {
    algorithms?: Array<'HS256' | 'HS384' | 'HS512' | 'RS256' | 'ES256' | 'none'>;
    audience?: string | RegExp | string[];
    issuer?: string | string[];
    clockTolerance?: number;
    maxAge?: number | string;
    clockTimestamp?: number;
    nonce?: string;
    json?: boolean;
    complete?: boolean;
  }

  export interface SignCallback {
    (err: Error | null, token: string | undefined): void;
  }

  export interface VerifyCallback {
    (err: Error, decoded: string | JwtPayload | undefined): void;
  }

  export class JsonWebTokenError extends Error {
    constructor(message?: string);
    public name: 'JsonWebTokenError';
  }

  export class TokenExpiredError extends JsonWebTokenError {
    constructor(message: string, expiredAt: Date);
    public name: 'TokenExpiredError';
    public expiredAt: Date;
  }

  export function sign(payload: string | JwtPayload | Buffer, secret: string, options?: SignOptions): string;
  export function sign(payload: string | JwtPayload | Buffer, secret: string, options: SignOptions, callback: SignCallback): void;
  export function verify(token: string, secretOrPublicKey: string, options?: VerifyOptions): JwtPayload;
  export function verify(token: string, secretOrPublicKey: string, options: VerifyOptions, callback: VerifyCallback): void;
  export function verify(token: string, secretOrPublicKey: string, callback: VerifyCallback): void;
  export function decode(token: string): JwtPayload | string | null;
}