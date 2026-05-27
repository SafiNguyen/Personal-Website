"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import FluidText from "./fluidtext";


const LINKS = [
  { label: "About", href: "#" },
  { label: "Work", href: "#" },
  {label: "News", href: "#" },
  {label: "Gallery", href: "#" },
  { label: "Exit", href: "#" },

];

export function ClipMenu() {
  const root = useRef<HTMLDivElement | null>(null);
  const overlay = useRef<HTMLDivElement | null>(null);
  const items = useRef<HTMLAnchorElement[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // initial states
     
      gsap.set(overlay.current, {
        clipPath: "circle(0% at 50% 50%)",
        pointerEvents: "none",
      });

      gsap.set(items.current, {
        y: 24,
        opacity: 0,
      });

      tl.current = gsap
        .timeline({ paused: true, defaults: { duration: 0.9, ease: "power4.inOut" } })
        // overlay reveal
        .to(overlay.current, {
          clipPath: "circle(150% at 50% 50%)",
          pointerEvents: "auto",
        })
        // stagger items
        .to(
          items.current,
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.35"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) t.play();
    else t.reverse();
  }, [open]);

  return (
    <div ref={root} className="relative">
      
      <div className="min-h-dvh grid place-items-center">
        <button
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-overlay"
        >
         <FluidText text="WATER" className="max-w-4xl" />
        </button>
      </div>
      {/* overlay */}
      <div
        id="menu-overlay"
        ref={overlay}
        className="fixed inset-0 z-50 text-white"
        style={{
          backgroundImage: "url('/placeholderMenu.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-end pb-[10vh] px-6">
          <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                ref={(el) => {
                  if (el) items.current[i] = el;
                }}
                className="group block"
                onClick={() => setOpen(false)}
              >
                <span className="inline-block text-4xl text-white drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)]

                 font-handwriting tracking-tight transition-opacity 
                 transition-transform
                 group-hover:opacity-80 sm:text-6xl
                 hover:scale-125
                 duration-500
                 ">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}