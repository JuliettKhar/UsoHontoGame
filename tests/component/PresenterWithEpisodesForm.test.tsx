// Component Tests: PresenterWithEpisodesForm
// Feature: 003-presenter-episode-inline

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PresenterWithEpisodesForm } from '@/components/domain/game/PresenterWithEpisodesForm';

// Mock the server action
vi.mock('@/app/actions/presenter', () => ({
  addPresenterWithEpisodesAction: vi.fn(),
}));

describe('PresenterWithEpisodesForm', () => {
  const defaultProps = {
    gameId: 'game-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render form with all fields', () => {
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      expect(screen.getByLabelText(/ニックネーム/)).toBeInTheDocument();
      expect(screen.getByText(/エピソード（3つ選択）/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /登録/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /クリア/ })).toBeInTheDocument();
    });

    it('should render 3 episode input sections', () => {
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      expect(screen.getByText('エピソード 1')).toBeInTheDocument();
      expect(screen.getByText('エピソード 2')).toBeInTheDocument();
      expect(screen.getByText('エピソード 3')).toBeInTheDocument();
    });

    it('should render character counters', () => {
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      expect(screen.getByText(/0\/50文字/)).toBeInTheDocument();
      expect(screen.getAllByText(/0\/1000文字/)).toHaveLength(3);
    });

    it('should render lie marker checkboxes', () => {
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(3);
    });
  });

  describe('Input Interactions', () => {
    it('should update nickname field when typing', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      await user.type(nicknameInput, 'テスト太郎');

      expect(nicknameInput).toHaveValue('テスト太郎');
    });

    it('should update episode text when typing', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      await user.type(episodeInputs[0], 'エピソード1');

      expect(episodeInputs[0]).toHaveValue('エピソード1');
    });

    it('should toggle lie marker checkbox', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const radioButtons = screen.getAllByRole('radio');
      const firstRadio = radioButtons[0];

      expect(firstRadio).not.toBeChecked();
      await user.click(firstRadio);
      expect(firstRadio).toBeChecked();
    });

    it('should update character counter for nickname', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      await user.type(nicknameInput, 'テスト');

      expect(screen.getByText(/3\/50文字/)).toBeInTheDocument();
    });

    it('should update character counter for episodes', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      await user.type(episodeInputs[0], 'テスト');

      expect(screen.getAllByText(/3\/1000文字/)).toHaveLength(1);
    });
  });

  describe('Character Counter Color Changes', () => {
    it('should change color when nickname approaches max length', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      // Type 41 characters (80% of 50)
      await user.type(nicknameInput, 'a'.repeat(41));

      // Check that color class is applied
      const counter = screen.getByText(/41\/50文字/);
      expect(counter).toHaveClass('text-orange-600');
    });

    it('should change color when episode text approaches max length', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      // Type 801 characters (80% of 1000)
      await user.type(episodeInputs[0], 'a'.repeat(801));

      // Check that color class is applied
      const counters = screen.getAllByText(/801\/1000文字/);
      expect(counters[0]).toHaveClass('text-orange-600');
    });
  });

  describe('Clear/Reset Button', () => {
    it('should clear all fields when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);

      await user.type(nicknameInput, 'テスト太郎');
      await user.type(episodeInputs[0], 'エピソード1');

      const clearButton = screen.getByRole('button', { name: /クリア/ });
      await user.click(clearButton);

      expect(nicknameInput).toHaveValue('');
      expect(episodeInputs[0]).toHaveValue('');
    });

    it('should clear lie marker when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);
      expect(radioButtons[0]).toBeChecked();

      const clearButton = screen.getByRole('button', { name: /クリア/ });
      await user.click(clearButton);

      expect(radioButtons[0]).not.toBeChecked();
    });
  });

  describe('Form Submission', () => {
    it('should be enabled when form is valid', async () => {
      const _user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /登録/ });
      expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button while submitting', async () => {
      const { addPresenterWithEpisodesAction } = await import('@/app/actions/presenter');
      vi.mocked(addPresenterWithEpisodesAction).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      const radioButtons = screen.getAllByRole('radio');

      await user.type(nicknameInput, 'テスト太郎');
      await user.type(episodeInputs[0], 'エピソード1');
      await user.type(episodeInputs[1], 'エピソード2');
      await user.type(episodeInputs[2], 'エピソード3');
      await user.click(radioButtons[2]);

      const submitButton = screen.getByRole('button', { name: /登録/ });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByLabelText(/ニックネーム/);
      expect(nicknameInput).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      nicknameInput.focus();
      expect(nicknameInput).toHaveFocus();

      await user.keyboard('{Tab}');
      // Should move to next element (episode 1 input)
      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      expect(episodeInputs[0]).toHaveFocus();
    });
  });

  describe('Success Message', () => {
    it('should display success message on successful submission', async () => {
      const { addPresenterWithEpisodesAction } = await import('@/app/actions/presenter');
      vi.mocked(addPresenterWithEpisodesAction).mockResolvedValue({
        success: true,
        presenter: {
          id: 'presenter-1',
          gameId: 'game-123',
          nickname: 'テスト太郎',
          episodes: [
            {
              id: 'ep1',
              presenterId: 'presenter-1',
              text: 'エピソード1',
              isLie: false,
              createdAt: new Date(),
            },
            {
              id: 'ep2',
              presenterId: 'presenter-1',
              text: 'エピソード2',
              isLie: false,
              createdAt: new Date(),
            },
            {
              id: 'ep3',
              presenterId: 'presenter-1',
              text: 'エピソード3',
              isLie: true,
              createdAt: new Date(),
            },
          ],
          createdAt: new Date(),
        },
      });

      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      const radioButtons = screen.getAllByRole('radio');

      await user.type(nicknameInput, 'テスト太郎');
      await user.type(episodeInputs[0], 'エピソード1');
      await user.type(episodeInputs[1], 'エピソード2');
      await user.type(episodeInputs[2], 'エピソード3');
      await user.click(radioButtons[2]);

      const submitButton = screen.getByRole('button', { name: /登録/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/プレゼンターとエピソードが正常に登録されました/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('onSuccess Callback', () => {
    it('should call onSuccess callback after successful submission', async () => {
      const { addPresenterWithEpisodesAction } = await import('@/app/actions/presenter');
      vi.mocked(addPresenterWithEpisodesAction).mockResolvedValue({
        success: true,
        presenter: {
          id: 'presenter-1',
          gameId: 'game-123',
          nickname: 'テスト太郎',
          episodes: [
            {
              id: 'ep1',
              presenterId: 'presenter-1',
              text: 'エピソード1',
              isLie: false,
              createdAt: new Date(),
            },
            {
              id: 'ep2',
              presenterId: 'presenter-1',
              text: 'エピソード2',
              isLie: false,
              createdAt: new Date(),
            },
            {
              id: 'ep3',
              presenterId: 'presenter-1',
              text: 'エピソード3',
              isLie: true,
              createdAt: new Date(),
            },
          ],
          createdAt: new Date(),
        },
      });

      const onSuccess = vi.fn();
      const user = userEvent.setup();
      render(<PresenterWithEpisodesForm {...defaultProps} onSuccess={onSuccess} />);

      const nicknameInput = screen.getByPlaceholderText(/例：田中太郎/);
      const episodeInputs = screen.getAllByPlaceholderText(/エピソード.*の内容を入力してください/);
      const radioButtons = screen.getAllByRole('radio');

      await user.type(nicknameInput, 'テスト太郎');
      await user.type(episodeInputs[0], 'エピソード1');
      await user.type(episodeInputs[1], 'エピソード2');
      await user.type(episodeInputs[2], 'エピソード3');
      await user.click(radioButtons[2]);

      const submitButton = screen.getByRole('button', { name: /登録/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });
});
