"use client";

import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import React, {
  createContext,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";

export const TransitionContext = createContext<{ navigate: (href: string) => void }>({ navigate: () => {} });

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const firstLoad = useRef(true);

  // Start off-screen
  useLayoutEffect(() => {
    gsap.set(containerRef.current, { y: "100%" });
  }, []);

  // Exit animation → navigate
  const navigate = (href: string) => {
    if (isAnimating.current || href === "#") return; // Ignore # links
    isAnimating.current = true;

    gsap.to(containerRef.current, {
      y: "0%",
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        router.push(href);
      },
    });
  };

  // Entry animation (slide out)
  const enter = () => {
    gsap.to(containerRef.current, {
      y: "100%",
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  };

  // Run entry on every route change except first load
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    enter();
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Overlay - visible during transitions */}
      <div 
        ref={containerRef} 
        className="fixed inset-0 z-[9999] bg-zinc-900 min-h-screen w-full" 
      />
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;