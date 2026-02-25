import { redirect } from 'next/navigation';
import { isAuthenticated } from './auth';

export function requireAuth() {
  if (!isAuthenticated()) {
    redirect('/login');
  }
}
