"use client";

import { useEffect, useRef } from "react";


export default function InkMouse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];

    function createParticle(x: number, y: number) {
      particles.push({
        x,
        y,
        radius: Math.random() * 20 + 10,
        alpha: 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
      });
    }
    }
  );



  return(


  <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}