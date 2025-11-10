import type { GameSession } from '@/server/domain/entities/GameSession';
import type { IGameSessionRepository } from '@/server/domain/repositories/IGameSessionRepository';

/**
 * In-memory implementation of GameSessionRepository
 * Uses singleton pattern to maintain state across requests
 */
export class InMemoryGameSessionRepository implements IGameSessionRepository {
  private static instance: InMemoryGameSessionRepository;
  private sessions: Map<string, GameSession> = new Map();

  private constructor() {
    // Start cleanup interval for stale sessions (every 2 hours)
    this.startCleanupInterval();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): InMemoryGameSessionRepository {
    if (!InMemoryGameSessionRepository.instance) {
      InMemoryGameSessionRepository.instance = new InMemoryGameSessionRepository();
    }
    return InMemoryGameSessionRepository.instance;
  }

  /**
   * Start periodic cleanup of stale sessions
   * Removes sessions that have been inactive for more than 24 hours
   * Cleanup runs every 2 hours
   */
  private startCleanupInterval(): void {
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    setInterval(() => {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [id, session] of this.sessions.entries()) {
        const timeSinceLastActivity = now - session.lastActivityTimestamp.getTime();
        if (timeSinceLastActivity > TWENTY_FOUR_HOURS) {
          this.sessions.delete(id);
          cleanedCount++;
          console.log(`[SessionCleanup] Removed expired session: ${id} (inactive for ${Math.round(timeSinceLastActivity / 1000 / 60)} minutes)`);
        }
      }

      if (cleanedCount > 0) {
        console.log(`[SessionCleanup] Cleaned up ${cleanedCount} expired session(s). Active sessions: ${this.sessions.size}`);
      }
    }, TWO_HOURS);
  }

  async save(session: GameSession): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async findById(id: string): Promise<GameSession | null> {
    return this.sessions.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  async findAll(): Promise<GameSession[]> {
    return Array.from(this.sessions.values());
  }

  async exists(id: string): Promise<boolean> {
    return this.sessions.has(id);
  }

  /**
   * Clear all sessions (for testing only)
   */
  clearAll(): void {
    this.sessions.clear();
  }
}
