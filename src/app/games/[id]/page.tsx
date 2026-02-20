// App Router Page: Game Detail/Edit
// Feature: 002-game-preparation
// Server Component that fetches data and delegates to GameDetailPage component

import { getGameDetailAction } from '@/app/actions/game';
import { requireSessionAction } from '@/app/actions/session';
import { GameDetailPage, GameDetailPageError } from '@/components/pages/GameDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Next.js App Router page for /games/[id]
 * Handles session check, data fetching, and error states
 */
export default async function Page({ params }: PageProps) {
  const { sessionId } = await requireSessionAction();

  const { id: gameId } = await params;
  const result = await getGameDetailAction(gameId);

  if (!result.success) {
    const errorMessage = result.errors._form?.[0] || 'ゲームの読み込みに失敗しました';
    return <GameDetailPageError errorMessage={errorMessage} />;
  }

  return <GameDetailPage game={result.game} currentSessionId={sessionId} />;
}
