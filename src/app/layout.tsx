import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'ウソホントゲーム - Two Truths and a Lie',
  description: '2つの本当と1つの嘘を見抜くパーティーゲーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
