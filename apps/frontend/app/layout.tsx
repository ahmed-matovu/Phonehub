import './globals.css';
import type { Metadata } from 'next';
import { StoreProvider } from '../components/StoreProvider';

export const metadata: Metadata = {
  title: 'Electronic Hub',
  description: 'Discover phones, computers, audio, and everyday electronics.',
  icons: { icon: '/electronic-hub-logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
