// Game List Page
// Feature: 002-game-preparation
// Display all games created by the moderator

import { redirect } from "next/navigation";
import { GameList } from "@/components/domain/game/GameList";
import { getGamesAction } from "@/app/actions/game";
import { getCookie } from "@/lib/cookies";
import { COOKIE_NAMES } from "@/lib/constants";

/**
 * Game List Page
 * Shows all games created by the current moderator
 * Requires active session
 */
export default async function GamesPage() {
	// Check session
	const sessionId = await getCookie(COOKIE_NAMES.SESSION_ID);
	if (!sessionId) {
		redirect("/");
	}

	// Fetch games
	const result = await getGamesAction();

	if (!result.success) {
		return (
			<div className="container mx-auto max-w-7xl px-4 py-8">
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-sm text-red-800">
						{result.errors._form?.[0] || "ゲームの読み込みに失敗しました"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">ゲーム管理</h1>
					<p className="mt-2 text-sm text-gray-600">
						作成したゲームの一覧を確認・管理できます
					</p>
				</div>
				<a
					href="/games/create"
					className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					<svg
						className="-ml-1 mr-2 h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					新しいゲームを作成
				</a>
			</div>

			{/* Game List */}
			<GameList games={result.games} managementView={true} />
		</div>
	);
}
