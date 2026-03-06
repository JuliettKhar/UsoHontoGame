/**
 * Header Component
 * Feature: 008-i18n-support / US1
 *
 * Application header with language switcher
 */

'use client';

import { LanguageSwitcher } from './LanguageSwitcher';
import Link from 'next/link';

/**
 * Header Component
 *
 * Renders application header with language switcher
 */
export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link className="text-lg font-semibold text-gray-900" href="/games">
            ゲーム一覧
          </Link>
          <Link className="text-lg font-semibold text-gray-900" href="/">
            ホーム
          </Link>
        </div>
        <div className="text-lg font-semibold text-gray-900">ウソホントゲーム</div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
