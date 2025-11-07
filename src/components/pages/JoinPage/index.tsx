'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface JoinPageProps {
  sessionId?: string;
}

/**
 * JoinPage
 * Page for creating a new session or joining an existing one
 */
export function JoinPage({ sessionId }: JoinPageProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [joinSessionId, setJoinSessionId] = useState(sessionId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'join' | 'create'>(sessionId ? 'join' : 'create');

  const handleCreateSession = async () => {
    if (!nickname.trim()) {
      setError('ニックネームを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostNickname: nickname }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'セッションの作成に失敗しました');
      }

      const data = await response.json();
      router.push(`/game/${data.sessionId}?participantId=${data.hostId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!nickname.trim()) {
      setError('ニックネームを入力してください');
      return;
    }

    if (!joinSessionId.trim()) {
      setError('セッションIDを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${joinSessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'セッションへの参加に失敗しました');
      }

      const data = await response.json();
      router.push(`/game/${joinSessionId}?participantId=${data.participantId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">ウソホントゲーム</h1>
        <p className="text-center text-gray-600 mb-8">2つの本当と1つの嘘を見抜こう!</p>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              mode === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            新規作成
          </button>
          <button
            type="button"
            onClick={() => setMode('join')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              mode === 'join'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            参加
          </button>
        </div>

        {/* Forms */}
        <div className="space-y-4">
          {mode === 'join' && (
            <div>
              <label htmlFor="sessionId" className="block text-sm font-medium mb-2">
                セッションID
              </label>
              <Input
                id="sessionId"
                value={joinSessionId}
                onChange={(e) => setJoinSessionId(e.target.value.toUpperCase())}
                placeholder="ABC123"
                disabled={isLoading}
                maxLength={6}
              />
            </div>
          )}

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium mb-2">
              ニックネーム
            </label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="あなたの名前"
              disabled={isLoading}
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <Button
            onClick={mode === 'create' ? handleCreateSession : handleJoinSession}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? '処理中...' : mode === 'create' ? 'ゲームを作成' : 'ゲームに参加'}
          </Button>
        </div>

        {mode === 'create' && (
          <p className="text-xs text-gray-500 text-center mt-4">
            ゲームを作成すると、あなたがホストになります
          </p>
        )}
      </div>
    </div>
  );
}
