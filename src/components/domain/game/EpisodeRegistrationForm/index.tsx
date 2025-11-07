'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface EpisodeRegistrationFormProps {
  participantId: string;
  onSubmit: (episodes: Array<{ episodeNumber: number; text: string; isLie: boolean }>) => void;
  onUpdate?: (episodes: Array<{ episodeNumber: number; text: string; isLie: boolean }>) => void;
  initialEpisodes?: Array<{ episodeNumber: number; text: string; isLie?: boolean }>;
  isLoading?: boolean;
}

/**
 * EpisodeRegistrationForm
 * Form for participants to register 3 episodes (2 truths and 1 lie)
 */
export function EpisodeRegistrationForm({
  participantId: _participantId,
  onSubmit,
  onUpdate,
  initialEpisodes = [],
  isLoading = false,
}: EpisodeRegistrationFormProps) {
  const [episode1, setEpisode1] = useState(initialEpisodes[0]?.text || '');
  const [episode2, setEpisode2] = useState(initialEpisodes[1]?.text || '');
  const [episode3, setEpisode3] = useState(initialEpisodes[2]?.text || '');
  const [lieNumber, setLieNumber] = useState<number>(
    initialEpisodes.findIndex((ep) => ep.isLie) + 1 || 0
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEpisode = (text: string, episodeNumber: number): string | null => {
    if (!text.trim()) {
      return `エピソード${episodeNumber}を入力してください`;
    }
    if (text.length < 10) {
      return `エピソード${episodeNumber}は10文字以上である必要があります`;
    }
    if (text.length > 500) {
      return `エピソード${episodeNumber}は500文字以下である必要があります`;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all episodes
    const newErrors: { [key: string]: string } = {};
    const error1 = validateEpisode(episode1, 1);
    const error2 = validateEpisode(episode2, 2);
    const error3 = validateEpisode(episode3, 3);

    if (error1) newErrors.episode1 = error1;
    if (error2) newErrors.episode2 = error2;
    if (error3) newErrors.episode3 = error3;

    // Validate lie selection
    if (lieNumber === 0) {
      newErrors.lie = 'どのエピソードが嘘かを選択してください';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const episodes = [
      { episodeNumber: 1, text: episode1, isLie: lieNumber === 1 },
      { episodeNumber: 2, text: episode2, isLie: lieNumber === 2 },
      { episodeNumber: 3, text: episode3, isLie: lieNumber === 3 },
    ];

    if (initialEpisodes.length > 0 && onUpdate) {
      onUpdate(episodes);
    } else {
      onSubmit(episodes);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="episode1" className="block text-sm font-medium mb-2">
            エピソード1
          </label>
          <Input
            id="episode1"
            value={episode1}
            onChange={(e) => setEpisode1(e.target.value)}
            placeholder="あなたの体験を入力してください（10文字以上）"
            disabled={isLoading}
            error={errors.episode1}
          />
          {errors.episode1 && <p className="text-red-500 text-sm mt-1">{errors.episode1}</p>}
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="lie1"
              name="lie"
              checked={lieNumber === 1}
              onChange={() => setLieNumber(1)}
              disabled={isLoading}
              className="mr-2"
            />
            <label htmlFor="lie1" className="text-sm">
              これは嘘です
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="episode2" className="block text-sm font-medium mb-2">
            エピソード2
          </label>
          <Input
            id="episode2"
            value={episode2}
            onChange={(e) => setEpisode2(e.target.value)}
            placeholder="あなたの体験を入力してください（10文字以上）"
            disabled={isLoading}
            error={errors.episode2}
          />
          {errors.episode2 && <p className="text-red-500 text-sm mt-1">{errors.episode2}</p>}
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="lie2"
              name="lie"
              checked={lieNumber === 2}
              onChange={() => setLieNumber(2)}
              disabled={isLoading}
              className="mr-2"
            />
            <label htmlFor="lie2" className="text-sm">
              これは嘘です
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="episode3" className="block text-sm font-medium mb-2">
            エピソード3
          </label>
          <Input
            id="episode3"
            value={episode3}
            onChange={(e) => setEpisode3(e.target.value)}
            placeholder="あなたの体験を入力してください（10文字以上）"
            disabled={isLoading}
            error={errors.episode3}
          />
          {errors.episode3 && <p className="text-red-500 text-sm mt-1">{errors.episode3}</p>}
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="lie3"
              name="lie"
              checked={lieNumber === 3}
              onChange={() => setLieNumber(3)}
              disabled={isLoading}
              className="mr-2"
            />
            <label htmlFor="lie3" className="text-sm">
              これは嘘です
            </label>
          </div>
        </div>

        {errors.lie && <p className="text-red-500 text-sm">{errors.lie}</p>}
      </div>

      <Button type="submit" disabled={isLoading} fullWidth>
        {isLoading ? '送信中...' : initialEpisodes.length > 0 ? '更新' : '登録'}
      </Button>
    </form>
  );
}
