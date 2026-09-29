import TransitionLink from "./transition/transitionLink";

export default function BackHomePlaceholder() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-6 text-[var(--foreground)]">
      <TransitionLink
        href="/"
        className="rounded-full border border-[var(--border)] px-6 py-3 text-sm transition hover:border-[var(--site-highlight)] hover:text-[var(--site-highlight)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-highlight)]"
      >
        Back home
      </TransitionLink>
    </main>
  );
}