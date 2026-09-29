"use client";

import Link from "next/link";
import { useContext, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TransitionContext } from "./transition/transitionProvider";

export default function CalendarLink() {
  const { hasStarted } = useContext(TransitionContext);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (!hasStarted || !linkRef.current) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        linkRef.current,
        { autoAlpha: 0, y: 20, scale: 0.85 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          delay: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    });
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(linkRef.current, { autoAlpha: 1 });
    });

    return () => media.revert();
  }, { dependencies: [hasStarted], scope: linkRef, revertOnUpdate: true });

  if (!hasStarted) return null;

  return (
    <Link
      ref={linkRef}
      href="/timetable"
      aria-label="Open timetable"
      title="Timetable"
      onClick={(event) => event.stopPropagation()}
      className="group fixed bottom-[5%] right-[5%] z-60 flex size-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-lg backdrop-blur transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-highlight)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-[var(--surface)] px-2.5 py-1.5 text-xs opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        Timetable
      </span>
    </Link>
  );
}