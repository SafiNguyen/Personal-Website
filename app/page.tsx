"use client"; // Add this line for client-side hooks
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const main = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      if (!self.selector) return;
      const panels = self.selector(".panel");
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true,
          pinSpacing: false,
          // You can add animations here later
        });
      });
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={main}>
      <div className="panel bg-black min-h-screen flex items-center justify-center text-white text-6xl">
        Page 1
      </div>

      <div className="panel bg-red-800 min-h-screen flex items-center justify-center text-white text-6xl">
        Page 2
      </div>

      <div className="panel bg-blue-800 min-h-screen flex items-center justify-center text-white text-6xl">
        Page 3
      </div>

      <div className="panel bg-green-800 min-h-screen flex items-center justify-center text-white text-6xl">
        Page 4
      </div>

      {/* foot */}
      <div className="bg-gray-900 min-h-[50vh] flex items-center justify-center text-white">
        Footer
      </div>
    </div>
  );
}
