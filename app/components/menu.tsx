"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TransitionLink from "./transition/transitionLink";

const LINKS = [
  { label: "About", href: "About" },
  { label: "Work", href: "Projects" },
  {label: "News", href: "News" },
  {label: "Gallery", href: "Gallery" },

];

export function ClipMenu() {
  const root = useRef<HTMLDivElement | null>(null);
  const overlay = useRef<HTMLDivElement | null>(null);
  const items = useRef<HTMLButtonElement[]>([]);
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


useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
    if (e.key === "Escape") setOpen(false);
    else setOpen(true);
  };

  const handleClick = () => setOpen(true);

  window.addEventListener("keydown", handleKey);
  window.addEventListener("click", handleClick);

  return () => {
    window.removeEventListener("keydown", handleKey);
    window.removeEventListener("click", handleClick);
  };
}, []);

  return (
    <div ref={root} className="relative">

       <div className="fixed inset-0 z-50 flex items-center justify-center">
                 
         idk
         
      </div>
     
      <div className="fixed inset-0 z-50 text-white">

        <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-end pb-[10vh] px-6">
        
        <button
          className="rounded-full px-4 py-2 text-sm"
          onClick={(e) => {
            e.stopPropagation(); 
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-controls="menu-overlay"
        >
          <p>Press any key or click to start</p>
        </button>
          
        </div>
        
       
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
            <TransitionLink key={l.label} href={l.href}>
                <button
                  ref={(el) => {
                    if (el) items.current[i] = el; 
                  }}
                  className="group inline-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="inline-block text-1xl text-white drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)]
                 font-handwriting tracking-tight transition-opacity 
                 transition-transform
                  sm:text-3xl
                 hover:scale-150
                 duration-500
                 ">
                    {l.label}
                  </span>
                </button>
            </TransitionLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}