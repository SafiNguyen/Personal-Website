import BackHomeLink from "./backHomeLink";

export default function BackHomePlaceholder() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
      <BackHomeLink
        className="rounded-full border border-(--border) px-6 py-3 text-sm transition hover:border-(--site-highlight) hover:text-(--site-highlight) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--site-highlight)"
      >
        Back home
      </BackHomeLink>
    </main>
  );
}