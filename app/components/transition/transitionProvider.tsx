"use client";

import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import React, {
  createContext,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";

export const TransitionContext = createContext<{
  navigate: (href: string) => void;
  openHomeMenu: boolean;
  hasStarted: boolean;
  setHasStarted: (started: boolean) => void;
}>({ navigate: () => {}, openHomeMenu: false, hasStarted: false, setHasStarted: () => {} });

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const firstLoad = useRef(true);
  const returningHome = useRef(false);
  const navigationFallback = useRef<number | null>(null);
  const [openHomeMenu, setOpenHomeMenu] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Start off-screen
  useLayoutEffect(() => {
    gsap.set(containerRef.current, { y: "100%" });
  }, []);

  // Exit animation -> navigate
  const navigate = (href: string) => {
    if (isAnimating.current || href === "#") return; // Ignore # links
    isAnimating.current = true;
    if (href === "/") {
      returningHome.current = true;
      setOpenHomeMenu(true);
    }

    const pushRoute = () => {
      if (navigationFallback.current !== null) {
        window.clearTimeout(navigationFallback.current);
        navigationFallback.current = null;
      }
      router.push(href);
    };

    gsap.to(containerRef.current, {
      y: "0%",
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: pushRoute,
    });
    navigationFallback.current = window.setTimeout(pushRoute, 900);
  };

  // Entry animation (slide out)
  const enter = useCallback(() => {
    gsap.to(containerRef.current, {
      y: "100%",
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating.current = false;
        if (pathname === "/" && returningHome.current) {
          returningHome.current = false;
          setOpenHomeMenu(false);
        }
      },
    });
  }, [pathname]);

  // Run entry on every route change except first load
  useEffect(() => {
    isAnimating.current = false;
    if (navigationFallback.current !== null) {
      window.clearTimeout(navigationFallback.current);
      navigationFallback.current = null;
    }
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    enter();
  }, [enter, pathname]);

  return (
    <TransitionContext.Provider value={{ navigate, openHomeMenu, hasStarted, setHasStarted }}>
      {children}

      {/* Overlay - visible during transitions */}
      <div 
        ref={containerRef} 
        className="fixed inset-0 z-9999 min-h-screen w-full bg-background"
      />
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;