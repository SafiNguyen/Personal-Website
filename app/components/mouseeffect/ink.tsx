"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type TrailPoint = {
  x: number;
  y: number;
  life: number;
};

const MAX_POINTS = 40;

function MouseTrail() {
  const pointsRef = useRef<TrailPoint[]>([]);
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_POINTS * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);
    return geometry;
  }, []);
  const dotsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_POINTS * 3);
    const colors = new Float32Array(MAX_POINTS * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0);
    return geometry;
  }, []);
  const { size, viewport } = useThree();

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      const x = (event.clientX / size.width - 0.5) * viewport.width;
      const y = -(event.clientY / size.height - 0.5) * viewport.height;

      pointsRef.current.push({ x, y, life: 1 });
      if (pointsRef.current.length > MAX_POINTS) {
        pointsRef.current.shift();
      }
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [size.width, size.height, viewport.width, viewport.height]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    for (let i = points.length - 1; i >= 0; i -= 1) {
      points[i].life = Math.max(0, points[i].life - delta * 1.6);
      if (points[i].life <= 0) {
        points.splice(i, 1);
      }
    }

    const linePositions = lineGeometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const dotPositions = dotsGeometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const dotColors = dotsGeometry.getAttribute(
      "color"
    ) as THREE.BufferAttribute;

    const count = points.length;
    for (let i = 0; i < MAX_POINTS; i += 1) {
      const index = i * 3;
      if (i < count) {
        const point = points[i];
        linePositions.array[index] = point.x;
        linePositions.array[index + 1] = point.y;
        linePositions.array[index + 2] = 0;

        dotPositions.array[index] = point.x;
        dotPositions.array[index + 1] = point.y;
        dotPositions.array[index + 2] = 0;

        const intensity = point.life;
        dotColors.array[index] = intensity;
        dotColors.array[index + 1] = intensity;
        dotColors.array[index + 2] = intensity;
      } else {
        linePositions.array[index] = 0;
        linePositions.array[index + 1] = 0;
        linePositions.array[index + 2] = 0;
        dotPositions.array[index] = 0;
        dotPositions.array[index + 1] = 0;
        dotPositions.array[index + 2] = 0;
        dotColors.array[index] = 0;
        dotColors.array[index + 1] = 0;
        dotColors.array[index + 2] = 0;
      }
    }

    linePositions.needsUpdate = true;
    dotPositions.needsUpdate = true;
    dotColors.needsUpdate = true;
    lineGeometry.setDrawRange(0, count);
    dotsGeometry.setDrawRange(0, count);
  });

  const pointSize = Math.max(0.04, viewport.width * 0.008);

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#1B2CFF" transparent opacity={0.35} />
      </line>
      <points geometry={dotsGeometry}>
        <pointsMaterial
          vertexColors
          size={pointSize}
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function InkMouse() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      className="fixed inset-0 pointer-events-none z-0"
    >
      <MouseTrail />
    </Canvas>
  );
}