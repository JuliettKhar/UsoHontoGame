/**
 * Prisma Seed Script - My Games
 * Generates test games for the current user's session
 *
 * Usage:
 *   npm run seed:my <your-session-id>
 *
 * Example:
 *   npm run seed:my wDTbv1VX6IqHNmPgqbCX-
 *
 * How to get your session ID:
 *   1. Open DevTools (F12)
 *   2. Go to Application → Cookies → http://localhost:3000
 *   3. Copy the value of 'sessionId' cookie
 */

import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

// Test data configuration
const CONFIG = {
  numberOfGames: 100, // Number of games to create
  presentersPerGame: 3, // Number of presenters per game (1-10)
  episodesPerPresenter: 3, // Fixed at 3 per requirements
};

// Sample data
const GAME_NAMES = [
  'クイズ大会',
  '謎解きゲーム',
  'トリビアチャレンジ',
  '知識王決定戦',
  'ファクトチェック',
  'リアルorフェイク',
  '本当はどっち？',
  'ウソつきは誰だ',
  '真実を見抜け',
  '騙し合いゲーム',
];

const PRESENTER_NAMES = [
  '太郎',
  '花子',
  '次郎',
  '春子',
  '三郎',
  'さくら',
  'たけし',
  'ゆうこ',
  'けんた',
  'みさき',
  '健二',
  '美咲',
  '翔太',
  '結衣',
  '大輔',
];

const EPISODE_TEMPLATES = [
  '私は昔、{動作}したことがある',
  '実は私、{特技}ができる',
  '子供の頃、{経験}したことがある',
  '一度だけ{場所}に行ったことがある',
  '私の家には{物}がある',
  '{数}回も{経験}したことがある',
  '実は{職業}の免許を持っている',
  '{言語}を話すことができる',
  '過去に{賞}を受賞したことがある',
  '{有名人}に会ったことがある',
];

const EPISODE_VARIABLES = {
  動作: ['空を飛んで', '海を泳いで渡って', '山に登って'],
  特技: ['逆立ち', 'ジャグリング', '早口言葉'],
  経験: ['UFOを見た', '宝物を見つけた', '迷子になった'],
  場所: ['南極', 'エベレスト', '無人島'],
  物: ['恐竜の化石', '隕石', '忍者の秘伝書'],
  数: ['10', '20', '100'],
  職業: ['パイロット', '医者', '弁護士'],
  言語: ['中国語', 'フランス語', 'スワヒリ語'],
  賞: ['ノーベル賞', 'アカデミー賞', 'オリンピック金メダル'],
  有名人: ['総理大臣', 'ハリウッドスター', '宇宙飛行士'],
};

function generateEpisodeText(): string {
  const template = EPISODE_TEMPLATES[Math.floor(Math.random() * EPISODE_TEMPLATES.length)];
  let text = template;

  // Replace variables in template
  for (const [key, values] of Object.entries(EPISODE_VARIABLES)) {
    const placeholder = `{${key}}`;
    if (text.includes(placeholder)) {
      const value = values[Math.floor(Math.random() * values.length)];
      text = text.replace(placeholder, value);
    }
  }

  return text;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  // Get session ID from command line argument
  const sessionId = process.argv[2];

  if (!sessionId) {
    console.error('❌ Error: Session ID is required');
    console.log('');
    console.log('Usage:');
    console.log('  npm run seed:my <your-session-id>');
    console.log('');
    console.log('Example:');
    console.log('  npm run seed:my wDTbv1VX6IqHNmPgqbCX-');
    console.log('');
    console.log('How to get your session ID:');
    console.log('  1. Open DevTools (F12)');
    console.log('  2. Go to Application → Cookies → http://localhost:3000');
    console.log("  3. Copy the value of 'sessionId' cookie");
    console.log('');
    process.exit(1);
  }

  console.log('🌱 Starting seed for your games...');
  console.log(`👤 Session ID: ${sessionId}`);
  console.log('');

  // Delete only games created by this session
  console.log('🗑️  Deleting existing games for this session...');
  const deletedGames = await prisma.game.deleteMany({
    where: { creatorId: sessionId },
  });
  console.log(`   Deleted ${deletedGames.count} games`);
  console.log('');

  const statuses = ['準備中', '出題中', '締切'];
  const gamesPerStatus = Math.ceil(CONFIG.numberOfGames / statuses.length);
  let totalGames = 0;

  for (const status of statuses) {
    console.log(`📊 Creating ${gamesPerStatus} games with status: ${status}`);

    for (let i = 0; i < gamesPerStatus; i++) {
      const gameName = `${getRandomItem(GAME_NAMES)} #${totalGames + 1}`;
      const maxPlayers = Math.floor(Math.random() * 50) + 10; // 10-60 players
      const currentPlayers = status === '準備中' ? 0 : Math.floor(Math.random() * maxPlayers);

      // Create game with specified session ID
      const game = await prisma.game.create({
        data: {
          name: gameName,
          creatorId: sessionId, // Use provided session ID
          maxPlayers,
          currentPlayers,
          status,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      });

      // Create presenters
      for (let j = 0; j < CONFIG.presentersPerGame; j++) {
        const presenterName = `${getRandomItem(PRESENTER_NAMES)}${j + 1}`;

        const presenter = await prisma.presenter.create({
          data: {
            gameId: game.id,
            nickname: presenterName,
          },
        });

        // Create episodes
        const lieIndex = Math.floor(Math.random() * CONFIG.episodesPerPresenter);
        for (let k = 0; k < CONFIG.episodesPerPresenter; k++) {
          await prisma.episode.create({
            data: {
              presenterId: presenter.id,
              text: generateEpisodeText(),
              isLie: k === lieIndex,
            },
          });
        }
      }

      totalGames++;
    }
  }

  console.log('');
  console.log('✅ Seed completed!');
  console.log(`📈 Created ${totalGames} games for session: ${sessionId}`);
  console.log(`📈 Created ${totalGames * CONFIG.presentersPerGame} presenters`);
  console.log(
    `📈 Created ${totalGames * CONFIG.presentersPerGame * CONFIG.episodesPerPresenter} episodes`
  );
  console.log('');
  console.log('🎮 You can now see these games at: http://localhost:3000/games');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
