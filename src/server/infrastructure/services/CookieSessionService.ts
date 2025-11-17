// Cookie Session Service Implementation
// Infrastructure layer implementation of ISessionService using Next.js cookies

import { COOKIE_NAMES } from '@/lib/constants';
import { getCookie } from '@/lib/cookies';
import type {
  ISessionService,
  SessionValidationResult,
} from '@/server/application/services/ISessionService';

/**
 * Cookie-based implementation of Session Service
 * Uses Next.js cookies to access session information
 * Infrastructure layer - handles concrete session storage mechanism
 */
export class CookieSessionService implements ISessionService {
  /**
   * Get current session ID from cookies
   * @returns Session ID if exists, null if no session cookie
   */
  async getCurrentSessionId(): Promise<string | null> {
    return await getCookie(COOKIE_NAMES.SESSION_ID);
  }

  /**
   * Validate current session from cookies
   * @returns Validation result with session information
   */
  async validateCurrentSession(): Promise<SessionValidationResult> {
    const sessionId = await this.getCurrentSessionId();

    return {
      valid: sessionId !== null,
      sessionId: sessionId,
    };
  }

  /**
   * Require valid session - throws if no session
   * @returns Session ID
   * @throws Error if no valid session found
   */
  async requireCurrentSession(): Promise<string> {
    const sessionId = await this.getCurrentSessionId();

    if (!sessionId) {
      throw new Error('セッションが見つかりません。ログインし直してください。');
    }

    return sessionId;
  }
}
