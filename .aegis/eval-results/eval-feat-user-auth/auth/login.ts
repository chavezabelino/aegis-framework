/**
 * @aegisBlueprint feat-user-auth
 * @aegisFrameworkVersion 2.4.0
 * @mode strict
 * @intent Generated for evaluation: eval-feat-user-auth
 */


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, AuthToken, LoginRequest } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function loginUser(req: LoginRequest): Promise<AuthToken> {
  try {
    const user = await getUserByEmail(req.email);
    const isValid = await bcrypt.compare(req.password, user.password);
    
    if (isValid) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      
      // Emit observability event
      emit('auth.login.success', { userId: user.id, timestamp: Date.now() });
      
      return { token, expiresIn: 3600 };
    }
    
    emit('auth.login.failed', { email: req.email, timestamp: Date.now() });
    throw new Error('Invalid credentials');
  } catch (error) {
    emit('auth.login.error', { error: error.message, timestamp: Date.now() });
    throw error;
  }
}

async function getUserByEmail(email: string): Promise<User> {
  // Mock implementation
  return { id: '1', email, password: 'hashed', createdAt: new Date() };
}

function emit(event: string, data: any): void {
  console.log(`Event: ${event}`, data);
}
