"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "../page.module.css";

export default function ParallaxScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sceneRef.current || !backgroundRef.current || !characterRef.current) {
      return;
    }

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const moveBackground = gsap.quickTo(backgroundRef.current, "x", {
        duration: 1.1,
        ease: "power3.out",
      });
      const moveBackgroundY = gsap.quickTo(backgroundRef.current, "y", {
        duration: 1.1,
        ease: "power3.out",
      });
      const moveCharacter = gsap.quickTo(characterRef.current, "x", {
        duration: 0.7,
        ease: "power3.out",
      });
      const moveCharacterY = gsap.quickTo(characterRef.current, "y", {
        duration: 0.7,
        ease: "power3.out",
      });

      const handlePointerMove = (event: PointerEvent) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        moveBackground(x * -18);
        moveBackgroundY(y * -12);
        moveCharacter(x * 42);
        moveCharacterY(y * 28);
      };

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => window.removeEventListener("pointermove", handlePointerMove);
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([backgroundRef.current, characterRef.current], { clearProps: "all" });
    });

    return () => media.revert();
  }, { scope: sceneRef });

  return (
    <section ref={sceneRef} className={styles.parallaxScene} aria-label="Home scene">
      <div ref={backgroundRef} className={styles.parallaxBackground} aria-hidden="true">
        <span className={styles.placeholderLabel}>Background placeholder</span>
      </div>
      <div ref={characterRef} className={styles.parallaxCharacter} aria-hidden="true">
        <span className={styles.placeholderLabel}>Character placeholder</span>
      </div>
    </section>
  );
}