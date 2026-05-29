import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.cratehub.dev',
  ),
  title: {
    default: 'AgentCrate Docs',
    template: '%s · AgentCrate Docs',
  },
  description:
    'Documentation for AgentCrate, the platform for building, signing, and distributing AI agents.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
