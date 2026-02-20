'use server';

// Server Actions for session management
// Server Actions リファクタリング - Phase 5
// Provides server-side functions for session operations
// Refactored to use SessionApplicationService

import { SessionApplicationService } from '@/server/application/services/SessionApplicationService';

// SessionApplicationService インスタンス（モジュールレベルSingleton）
const sessionService = new SessionApplicationService();

/**
 * Result type for createSessionAction
 */
export type CreateSessionResult =
  | { success: true; sessionId: string }
  | { success: false; error: { code: string; message: string } };

/**
 * Result type for setNicknameAction
 */
export type SetNicknameResult =
  | { success: true; nickname: string }
  | { success: false; error: { code: string; message: string } };

/**
 * Result type for validateSessionAction
 */
export type ValidateSessionResult = {
  valid: boolean;
  sessionId: string | null;
  nickname: string | null;
  hasNickname: boolean;
};

/**
 * Creates a new session with a unique session ID
 * Stores session ID in HTTP-only cookie
 * @returns Session ID and success status
 */
export async function createSessionAction(): Promise<CreateSessionResult> {
  // Application Service呼び出し
  return await sessionService.createSession();
}

/**
 * Sets or updates the nickname for the current session
 * @param nickname The nickname to set (1-50 characters)
 * @returns Success status and nickname
 */
export async function setNicknameAction(nickname: string): Promise<SetNicknameResult> {
  // Application Service呼び出し
  return await sessionService.setNickname(nickname);
}

/**
 * Validates the current session from cookies
 * @returns Session validity status and data
 */
export async function validateSessionAction(): Promise<ValidateSessionResult> {
  // Application Service呼び出し
  return await sessionService.validateSession();
}
