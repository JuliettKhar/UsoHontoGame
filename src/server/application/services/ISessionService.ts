// Session Service Interface
// Application layer service for session management operations

export interface SessionValidationResult {
  valid: boolean;
  sessionId: string | null;
}

/**
 * Session Service Interface
 * Provides session management operations following Clean Architecture principles
 * - Application layer interface
 * - Infrastructure layer implements concrete session access
 */
export interface ISessionService {
  /**
   * Get current session ID from the request context
   * @returns Session ID if exists, null if no session
   */
  getCurrentSessionId(): Promise<string | null>;

  /**
   * Validate if current session is valid and return session info
   * @returns Validation result with session ID
   */
  validateCurrentSession(): Promise<SessionValidationResult>;

  /**
   * Require current session - throws error if no valid session
   * @returns Session ID
   * @throws Error if no valid session found
   */
  requireCurrentSession(): Promise<string>;
}
