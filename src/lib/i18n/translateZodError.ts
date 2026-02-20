// translateZodError.ts
// Translates Zod validation error codes to i18n messages

import { t } from './server';
import type { TranslationKey } from './types';
import type { ZodError } from 'zod';

/**
 * Error code to translation key mapping
 * Maps Zod error codes (e.g., 'NICKNAME_EMPTY') to i18n translation keys (e.g., 'validation.nickname.empty')
 */
const ERROR_CODE_TO_KEY: Record<string, TranslationKey> = {
  // Common
  REQUIRED: 'validation.required',
  INVALID: 'validation.invalid',

  // Game validation
  GAME_NAME_TOO_LONG: 'validation.game.name.tooLong',
  GAME_PLAYER_LIMIT_NOT_INTEGER: 'validation.game.playerLimit.notInteger',
  GAME_PLAYER_LIMIT_TOO_LOW: 'validation.game.playerLimit.tooLow',
  GAME_PLAYER_LIMIT_TOO_HIGH: 'validation.game.playerLimit.tooHigh',

  // Nickname validation
  NICKNAME_EMPTY: 'validation.nickname.empty',
  NICKNAME_TOO_LONG: 'validation.nickname.tooLong',

  // Episode validation
  EPISODE_EMPTY: 'validation.episode.empty',
  EPISODE_TOO_LONG: 'validation.episode.tooLong',
  EPISODE_COUNT: 'validation.episode.count',
  EPISODE_LIE_COUNT: 'validation.episode.lieCount',

  // Answer validation
  ANSWER_NO_SELECTIONS: 'validation.answer.noSelections',
};

/**
 * Translates Zod error codes to localized error messages
 * @param error Zod validation error
 * @returns Record of field names to translated error messages
 */
export async function translateZodError(
  error: ZodError
): Promise<Record<string, string[]>> {
  const fieldErrors = error.flatten().fieldErrors;
  const translatedErrors: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const list = Array.isArray(messages) ? messages : [];
    if (list.length > 0) {
      translatedErrors[field] = await Promise.all(
        list.map(async (message: string) => {
          const translationKey = ERROR_CODE_TO_KEY[message];
          if (translationKey !== undefined) {
            return await t(translationKey);
          }
          return message;
        })
      );
    }
  }

  return translatedErrors;
}
