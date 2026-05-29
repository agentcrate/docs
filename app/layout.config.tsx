import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <span className="font-semibold">AgentCrate</span>
        <span className="text-fd-muted-foreground"> Docs</span>
      </>
    ),
  },
  links: [
    {
      text: 'CrateHub',
      url: 'https://cratehub.ai',
      external: true,
    },
    {
      text: 'GitHub',
      url: 'https://github.com/agentcrate',
      external: true,
    },
  ],
};
