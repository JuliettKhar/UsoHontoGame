// Response Status Page Component
// Feature: 006-results-dashboard, User Story 1
// Real-time response submission tracking for moderators

'use client';

import { AccessibilityProvider } from '@/components/ui/AccessibilityProvider';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import ResponseStatusList from '@/components/domain/results/ResponseStatusList';
import type { ResponseStatusPageProps } from './ResponseStatusPage.types';
import { useResponseStatus } from './hooks/useResponseStatus';

/**
 * ResponseStatusPage - Main component for response status tracking
 * Displays real-time updates of participant submission status
 *
 * @param props - Component props including gameId and optional initial data
 */
export function ResponseStatusPage({ gameId, initialData }: ResponseStatusPageProps) {
  const { toasts, showError, removeToast } = useToast();

  // Response status polling hook
  const { data, error, isLoading, isPolling, refetch } = useResponseStatus({
    gameId,
    initialData,
    pollingInterval: 5000, // Poll every 5 seconds
    enabled: true,
    onError: (err) => {
      showError(err.message, '回答状況の取得エラー');
    },
  });

  return (
    <AccessibilityProvider>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/"
            className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← TOPに戻る
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">回答状況ダッシュボード</h1>
              <p className="mt-2 text-sm text-gray-600">
                参加者の回答送信状況をリアルタイムで確認できます
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Polling Indicator */}
              {isPolling && (
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                  <span className="text-sm font-medium text-blue-700">自動更新中</span>
                </div>
              )}

              {/* Manual Refresh Button */}
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? '更新中...' : '手動更新'}
              </button>
            </div>
          </div>
        </div>

        {/* Game Info */}
        {data && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{data.gameName}</h2>
                <p className="text-sm text-gray-600">
                  最終更新: {new Date(data.lastUpdated).toLocaleString('ja-JP')}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 px-3 py-1">
                <span className="text-sm font-semibold text-blue-800">{data.gameStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">エラーが発生しました</h3>
                <p className="mt-1 text-sm text-red-700">{error.message}</p>
                {error.statusCode === 403 && (
                  <p className="mt-2 text-sm text-red-600">
                    この機能はゲーム作成者のみが利用できます。
                  </p>
                )}
                {error.statusCode === 400 && (
                  <p className="mt-2 text-sm text-red-600">
                    ダッシュボードは出題中のゲームでのみ利用できます。
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State (Initial Load Only) */}
        {isLoading && !data && !error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm text-gray-600">回答状況を読み込み中...</p>
            </div>
          </div>
        )}

        {/* Response Status List */}
        {data && !error && (
          <ResponseStatusList
            participants={data.participants}
            totalParticipants={data.totalParticipants}
            submittedCount={data.submittedCount}
            allSubmitted={data.allSubmitted}
          />
        )}

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </AccessibilityProvider>
  );
}
