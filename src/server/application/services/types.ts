// Application Service 共通型定義
// Server Actions リファクタリング - Phase 1
// Application Service層が使用する共通の型定義

/**
 * 成功時のレスポンス型
 * @template T データの型
 */
export type ServiceSuccess<T> = {
  success: true;
  data: T;
};

/**
 * エラー時のレスポンス型
 * フィールドごとのエラーメッセージを格納
 */
export type ServiceError = {
  success: false;
  errors: Record<string, string[]>;
};

/**
 * Application Service のレスポンス型（データあり）
 * @template T データの型
 */
export type ServiceResponse<T> = ServiceSuccess<T> | ServiceError;

/**
 * 成功時のレスポンス型（データなし）
 */
export type ServiceVoidSuccess = {
  success: true;
};

/**
 * Application Service のレスポンス型（データなし）
 * 削除などデータを返さない操作で使用
 */
export type ServiceVoidResponse = ServiceVoidSuccess | ServiceError;
