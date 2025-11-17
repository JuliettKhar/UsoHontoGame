// Session Service Dependency Injection Container
// Provides session service instances with singleton pattern

import type { ISessionService } from '@/server/application/services/ISessionService';
import { CookieSessionService } from '../services/CookieSessionService';

/**
 * Session Service Dependency Injection Container
 * Follows same pattern as Repository factory for consistency
 * Provides singleton instances of session services
 */
// biome-ignore lint/complexity/noStaticOnlyClass: This is a dependency injection container pattern
export class SessionServiceContainer {
  private static sessionService: ISessionService | null = null;

  /**
   * Gets session service instance (singleton)
   * Currently only supports Cookie-based implementation
   * Can be extended for other session storage mechanisms (JWT, Redis, etc.)
   */
  static getSessionService(): ISessionService {
    if (!SessionServiceContainer.sessionService) {
      SessionServiceContainer.sessionService = new CookieSessionService();
    }
    return SessionServiceContainer.sessionService;
  }

  /**
   * Reset singleton instance (for testing)
   * @internal
   */
  static resetForTesting(): void {
    SessionServiceContainer.sessionService = null;
  }

  /**
   * Set custom session service (for testing)
   * @internal
   */
  static setSessionService(service: ISessionService): void {
    SessionServiceContainer.sessionService = service;
  }
}
