import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        AgentCrate Docs
      </h1>
      <p className="mt-4 max-w-xl text-fd-muted-foreground">
        Build, sign, and distribute AI agents with the{' '}
        <code className="font-mono">crate</code> CLI and the CrateHub registry.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/docs"
          className="rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/docs/cli"
          className="rounded-md border border-fd-border px-4 py-2 text-sm font-medium hover:bg-fd-muted"
        >
          CLI reference
        </Link>
        <Link
          href="/docs/api"
          className="rounded-md border border-fd-border px-4 py-2 text-sm font-medium hover:bg-fd-muted"
        >
          API reference
        </Link>
      </div>
    </main>
  );
}
