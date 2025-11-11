// Game Detail/Edit Page
// Feature: 002-game-preparation
// View and edit game settings

import { redirect } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { COOKIE_NAMES } from "@/lib/constants";
import { getGameDetailAction } from "@/app/actions/game";
import { GameForm } from "@/components/domain/game/GameForm";

interface GameDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
	// Check session
	const sessionId = await getCookie(COOKIE_NAMES.SESSION_ID);
	if (!sessionId) {
		redirect("/");
	}

	// Get game ID from params
	const { id: gameId } = await params;

	// Fetch game details
	const result = await getGameDetailAction(gameId);

	// Handle errors
	if (!result.success) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-8">
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<h2 className="text-lg font-semibold text-red-900">
						エラーが発生しました
					</h2>
					<p className="mt-2 text-sm text-red-800">
						{result.errors._form?.[0] || "ゲームの読み込みに失敗しました"}
					</p>
					<a
						href="/games"
						className="mt-4 inline-block text-sm font-medium text-red-900 underline"
					>
						ゲーム一覧に戻る
					</a>
				</div>
			</div>
		);
	}

	const game = result.game;

	// Check if game can be edited (only 準備中 status)
	const canEdit = game.status === "準備中";

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8">
			{/* Header */}
			<div className="mb-6">
				<a
					href="/games"
					className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
				>
					← ゲーム一覧に戻る
				</a>
				<h1 className="text-3xl font-bold text-gray-900">ゲーム詳細</h1>
				<p className="mt-2 text-sm text-gray-600">
					ゲームの設定を確認・編集できます
				</p>
			</div>

			{/* Status info */}
			{!canEdit && (
				<div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
					<p className="text-sm text-yellow-800">
						現在のステータス: <span className="font-semibold">{game.status}</span>
					</p>
					<p className="mt-1 text-sm text-yellow-800">
						ゲームの設定を変更できるのは準備中のみです。
					</p>
				</div>
			)}

			{/* Game info card */}
			<div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<dl className="space-y-4">
					<div>
						<dt className="text-sm font-medium text-gray-500">ゲーム名</dt>
						<dd className="mt-1 text-base text-gray-900">{game.name}</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">ステータス</dt>
						<dd className="mt-1 text-base text-gray-900">{game.status}</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">参加者</dt>
						<dd className="mt-1 text-base text-gray-900">
							{game.currentPlayers} / {game.maxPlayers} 人
						</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">空き枠</dt>
						<dd className="mt-1 text-base text-gray-900">
							{game.availableSlots} 枠
						</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">作成日時</dt>
						<dd className="mt-1 text-base text-gray-900">
							{new Date(game.createdAt).toLocaleString("ja-JP")}
						</dd>
					</div>
					<div>
						<dt className="text-sm font-medium text-gray-500">更新日時</dt>
						<dd className="mt-1 text-base text-gray-900">
							{new Date(game.updatedAt).toLocaleString("ja-JP")}
						</dd>
					</div>
				</dl>
			</div>

			{/* Edit form */}
			{canEdit && (
				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold text-gray-900">
						設定を変更
					</h2>
					<GameForm
						mode="edit"
						gameId={game.id}
						initialPlayerLimit={game.maxPlayers}
						currentPlayers={game.currentPlayers}
					/>
				</div>
			)}
		</div>
	);
}
