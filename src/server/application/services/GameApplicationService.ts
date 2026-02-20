// GameApplicationService
// Server Actions リファクタリング - Phase 2
// ゲーム管理のApplication Service

import { SessionServiceContainer } from '@/server/infrastructure/di/SessionServiceContainer';
import { createGameRepository } from '@/server/infrastructure/repositories';
import { CreateGame } from '@/server/application/use-cases/games/CreateGame';
import { UpdateGameSettings } from '@/server/application/use-cases/games/UpdateGameSettings';
import { DeleteGame } from '@/server/application/use-cases/games/DeleteGame';
import { GetGamesByCreator } from '@/server/application/use-cases/games/GetGamesByCreator';
import { StartAcceptingResponses } from '@/server/application/use-cases/games/StartAcceptingResponses';
import { CloseGame } from '@/server/application/use-cases/games/CloseGame';
import { ValidateStatusTransition } from '@/server/application/use-cases/games/ValidateStatusTransition';
import { GameId } from '@/server/domain/value-objects/GameId';
import type { CreateGameOutput, GameManagementDto } from '@/server/application/dto/GameDto';
import type { GameDetailDto } from '@/server/application/dto/GameDetailDto';
import type { ServiceResponse, ServiceVoidResponse } from './types';
import { mapDomainErrorToServiceError } from './errorHandlers';

/**
 * GameApplicationService
 * ゲーム管理のビジネスロジックを調整
 * セッション取得、リポジトリ注入、UseCase実行、エラー変換を担当
 */
export class GameApplicationService {
  /**
   * ゲーム作成
   * @param input ゲーム作成パラメータ
   * @returns 作成されたゲーム情報
   */
  async createGame(input: {
    name: string | null;
    playerLimit: number;
  }): Promise<ServiceResponse<CreateGameOutput>> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();
      const useCase = new CreateGame(repository);

      // 3. UseCase実行
      const game = await useCase.execute({
        creatorId: sessionId,
        name: input.name,
        playerLimit: input.playerLimit,
      });

      return {
        success: true,
        data: game,
      };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.create.error');
    }
  }

  /**
   * ゲーム設定更新
   * @param input 更新パラメータ
   * @returns 更新されたゲーム情報
   */
  async updateGame(input: {
    gameId: string;
    name?: string | null;
    playerLimit?: number;
  }): Promise<ServiceResponse<GameDetailDto>> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();
      const useCase = new UpdateGameSettings(repository);

      // 3. UseCase実行
      const result = await useCase.execute({
        gameId: input.gameId,
        name: input.name,
        playerLimit: input.playerLimit,
        requesterId: sessionId,
      });

      if (!result.game) {
        return {
          success: false,
          errors: { _form: ['ゲームの更新に失敗しました'] },
        };
      }

      return {
        success: true,
        data: result.game,
      };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.update.error');
    }
  }

  /**
   * ゲーム削除
   * @param gameId ゲームID
   * @returns 削除成功/失敗
   */
  async deleteGame(gameId: string): Promise<ServiceVoidResponse> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();
      const useCase = new DeleteGame(repository);

      // 3. UseCase実行
      await useCase.execute({
        gameId,
        requesterId: sessionId,
      });

      return { success: true };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.delete.error');
    }
  }

  /**
   * 作成者のゲーム一覧取得
   * @returns ゲーム一覧
   */
  async getGamesByCreator(): Promise<ServiceResponse<GameManagementDto[]>> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();
      const useCase = new GetGamesByCreator(repository);

      // 3. UseCase実行
      const result = await useCase.execute({
        creatorId: sessionId,
      });

      return {
        success: true,
        data: result.games,
      };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.fetch.error');
    }
  }

  /**
   * ゲーム詳細取得
   * @param gameId ゲームID
   * @returns ゲーム詳細情報
   */
  async getGameDetail(gameId: string): Promise<ServiceResponse<GameDetailDto>> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリから直接取得（認可チェック込み）
      const repository = createGameRepository();
      const game = await repository.findById(new GameId(gameId));

      if (!game) {
        return {
          success: false,
          errors: { _form: ['ゲームが見つかりません'] },
        };
      }

      // 3. 認可チェック - 作成者のみ閲覧可能
      if (game.creatorId !== sessionId) {
        return {
          success: false,
          errors: { _form: ['このゲームを閲覧する権限がありません'] },
        };
      }

      // 4. DTOにマッピング
      const gameDetailDto: GameDetailDto = {
        id: game.id.toString(),
        name: game.name,
        status: game.status.toString(),
        maxPlayers: game.maxPlayers,
        currentPlayers: game.currentPlayers,
        availableSlots: game.availableSlots,
        creatorId: game.creatorId,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
      };

      return {
        success: true,
        data: gameDetailDto,
      };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.fetch.error');
    }
  }

  /**
   * ゲーム開始（準備中→出題中）
   * @param gameId ゲームID
   * @returns 開始成功/失敗
   */
  async startGame(gameId: string): Promise<ServiceVoidResponse> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();

      // 3. ステータス遷移検証
      const validateUseCase = new ValidateStatusTransition(repository);
      const validationResponse = await validateUseCase.execute(gameId, '出題中', sessionId);

      if (!validationResponse.canTransition) {
        return {
          success: false,
          errors: {
            _form: validationResponse.errors.map((err) => err.message),
          },
        };
      }

      // 4. ゲーム開始実行
      const startUseCase = new StartAcceptingResponses(repository);
      await startUseCase.execute({ gameId });

      return { success: true };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.start.error');
    }
  }

  /**
   * ゲーム終了（出題中→締切）
   * @param gameId ゲームID
   * @returns 終了成功/失敗
   */
  async closeGame(gameId: string): Promise<ServiceVoidResponse> {
    try {
      // 1. セッション取得
      const sessionService = SessionServiceContainer.getSessionService();
      const sessionId = await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();

      // 3. ステータス遷移検証
      const validateUseCase = new ValidateStatusTransition(repository);
      const validationResponse = await validateUseCase.execute(gameId, '締切', sessionId);

      if (!validationResponse.canTransition) {
        return {
          success: false,
          errors: {
            _form: validationResponse.errors.map((err) => err.message),
          },
        };
      }

      // 4. ゲーム終了実行
      const closeUseCase = new CloseGame(repository);
      await closeUseCase.execute({ gameId, sessionId });

      return { success: true };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.close.error');
    }
  }

  /**
   * 回答受付開始（旧startAcceptingAction用）
   * @param gameId ゲームID
   * @returns 開始成功/失敗
   */
  async startAcceptingResponses(gameId: string): Promise<ServiceVoidResponse> {
    try {
      // 1. セッション取得（認可用、現在は使用していないが将来のため）
      const sessionService = SessionServiceContainer.getSessionService();
      await sessionService.requireCurrentSession();

      // 2. リポジトリ・UseCase準備
      const repository = createGameRepository();
      const useCase = new StartAcceptingResponses(repository);

      // 3. UseCase実行
      await useCase.execute({ gameId });

      return { success: true };
    } catch (error) {
      return mapDomainErrorToServiceError(error, 'action.game.start.error');
    }
  }
}
