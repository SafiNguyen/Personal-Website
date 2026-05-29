"use client";

import { useEffect, useRef } from "react";
import initInk, {  } from "../components/mouseeffect/ink";

export default function InkCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = initInk(containerRef.current);
    return () => cleanup?.();
  }, []);

  return <div ref={containerRef} className="h-[400px] w-full" />;
}