"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  text?: string;
  className?: string;
};

export default function FluidText({ text = "LIQUID TYPE", className = "" }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const feTurbRef = useRef<SVGFETurbulenceElement | null>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement | null>(null);

  const shineRef = useRef<SVGRadialGradientElement | null>(null);
  const shineStop0 = useRef<SVGStopElement | null>(null);
  const shineStop1 = useRef<SVGStopElement | null>(null);

  // “physics” state (we animate these with GSAP)
  const state = useRef({
    // normalized [0..1] coords within component
    mx: 0.5,
    my: 0.5,
    // intensity 0..1
    hover: 0,
    // warp amount
    disp: 0,
    // turbulence frequency (higher = more wiggly)
    freq: 0.008,
    // for animated noise
    seed: 0,
  });

  useLayoutEffect(() => {
    const s = state.current;

    const ctx = gsap.context(() => {
      // Set initial filter params
      if (feTurbRef.current) {
        feTurbRef.current.setAttribute("baseFrequency", `${s.freq} ${s.freq}`);
        feTurbRef.current.setAttribute("numOctaves", "2");
        feTurbRef.current.setAttribute("seed", "1");
      }
      if (feDispRef.current) {
        feDispRef.current.setAttribute("scale", String(0));
      }

      // ticker drives subtle animated flow + updates attributes
      gsap.ticker.add(() => {
        // subtle “flow” in the noise field:
        // animate seed slowly (cheap) rather than animating baseFrequency every frame.
        s.seed += 0.02;

        if (feTurbRef.current) {
          feTurbRef.current.setAttribute("seed", String((s.seed % 100) | 0));
          feTurbRef.current.setAttribute("baseFrequency", `${s.freq} ${s.freq}`);
        }

        if (feDispRef.current) {
          feDispRef.current.setAttribute("scale", String(s.disp));
        }

        // Move shine center
        // radialGradient uses cx/cy in objectBoundingBox (0..1)
        if (shineRef.current) {
          shineRef.current.setAttribute("cx", String(s.mx));
          shineRef.current.setAttribute("cy", String(s.my));
        }

        // Brightness by hover
        if (shineStop0.current) {
          // core highlight
          shineStop0.current.setAttribute("stop-opacity", String(0.95 * s.hover));
        }
        if (shineStop1.current) {
          // softer halo
          shineStop1.current.setAttribute("stop-opacity", String(0.35 * s.hover));
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const s = state.current;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;

      // clamp
      const mx = Math.min(1, Math.max(0, x));
      const my = Math.min(1, Math.max(0, y));

      // Animate toward cursor (inertia)
      gsap.to(s, {
        mx,
        my,
        duration: 0.18,
        ease: "power3.out",
        overwrite: true,
      });

      // Increase warp when moving near the text
      gsap.to(s, {
        disp: 45, // strength of displacement
        freq: 0.012,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onEnter = () => {
      gsap.to(s, {
        hover: 1,
        disp: 35,
        freq: 0.012,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(s, {
        hover: 0,
        disp: 0,
        freq: 0.008,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 1200 260"
        className="h-[180px] w-full"
        role="img"
        aria-label={text}
      >
        <defs>
          {/* Fluid distortion filter */}
          <filter id="fluid">
            <feTurbulence
              ref={feTurbRef}
              type="fractalNoise"
              baseFrequency="0.008 0.008"
              numOctaves={2}
              seed={1}
              result="noise"
            />
            <feDisplacementMap
              ref={feDispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Shine gradient that follows mouse */}
          <radialGradient
            ref={shineRef}
            id="shine"
            gradientUnits="objectBoundingBox"
            cx="0.5"
            cy="0.5"
            r="0.35"
          >
            <stop ref={shineStop0} offset="0%" stopColor="white" stopOpacity="0" />
            <stop ref={shineStop1} offset="45%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Combine base + shine using mask */}
          <mask id="textMask">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="62%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="140"
              fontWeight="800"
              fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
              fill="white"
              letterSpacing="4"
            >
              {text}
            </text>
          </mask>
        </defs>

        {/* Base text (distorted) */}
        <g filter="url(#fluid)">
          {/* solid base */}
          <text
            x="50%"
            y="62%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="140"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
            fill="#E5E7EB"
            letterSpacing="4"
          >
            {text}
          </text>

          {/* shine layer clipped to text */}
          <rect width="100%" height="100%" fill="url(#shine)" mask="url(#textMask)" />
        </g>
      </svg>

    </div>
  );
}