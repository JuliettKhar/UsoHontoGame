// Application Service 共通エラーハンドラー
// Server Actions リファクタリング - Phase 1
// Domain Error → ServiceError 変換を一元化

import { NotFoundError } from '@/server/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/server/domain/errors/UnauthorizedError';
import { ValidationError } from '@/server/domain/errors/ValidationError';
import { StatusTransitionError } from '@/server/domain/errors/StatusTransitionError';
import { InvalidStatusTransitionError } from '@/server/domain/errors/InvalidStatusTransitionError';
import type { ServiceError } from './types';

/**
 * Domain Error を ServiceError 形式に変換
 * エラーハンドリングを一元化し、Server Actions間の重複コードを削減
 *
 * @param error キャッチされたエラー
 * @param defaultMessageKey デフォルトのi18nメッセージキー
 * @returns ServiceError形式のエラーレスポンス
 */
export async function mapDomainErrorToServiceError(
  error: unknown,
  defaultMessageKey: string
): Promise<ServiceError> {
  // ValidationError: ドメインバリデーション違反
  if (error instanceof ValidationError) {
    return {
      success: false,
      errors: { _form: [error.message] },
    };
  }

  // NotFoundError: リソース未発見
  if (error instanceof NotFoundError) {
    return {
      success: false,
      errors: { _form: [error.message] },
    };
  }

  // UnauthorizedError: 認可失敗
  if (error instanceof UnauthorizedError) {
    return {
      success: false,
      errors: { _form: [error.message] },
    };
  }

  // StatusTransitionError: ステータス遷移エラー（詳細情報付き）
  if (error instanceof StatusTransitionError) {
    return {
      success: false,
      errors: { _form: [error.message] },
    };
  }

  // InvalidStatusTransitionError: ステータス遷移エラー（シンプル）
  if (error instanceof InvalidStatusTransitionError) {
    return {
      success: false,
      errors: { _form: [error.message] },
    };
  }

  // Generic Error: その他のエラー
  console.error('Unexpected error in Application Service:', error);

  // i18n対応のエラーメッセージ取得
  const { t } = await import('@/lib/i18n/server');
  return {
    success: false,
    errors: { _form: [await t(defaultMessageKey)] },
  };
}
