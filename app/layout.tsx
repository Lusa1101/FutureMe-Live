import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import ClientToaster with SSR disabled to prevent hydration mismatch
const ClientToaster = dynamic(
  () => import('@/components/ui/client-toaster').then(mod => ({ default: mod.ClientToaster })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'FutureMe Live - Talk to Your Future Self',
  description: 'AI-powered conversation with your future self using real-time emotion detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}