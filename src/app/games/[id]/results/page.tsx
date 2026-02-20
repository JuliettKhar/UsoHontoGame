// App Router Page: /games/[id]/results
// Feature: 006-results-dashboard, User Story 3
// Displays final rankings with winner celebration

import { getResultsAction } from '@/app/actions/game';
import { requireSessionAction } from '@/app/actions/session';
import { ResultsPage } from '@/components/pages/ResultsPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  await requireSessionAction();

  const { id: gameId } = await params;
  const result = await getResultsAction(gameId);

  return (
    <ResultsPage gameId={gameId} initialData={result.success ? result.data : undefined} />
  );
}
