/** @format */

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Points } from "three";

function Particles({ count }: { count: number }) {
  const ref = useRef<Points>(null);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#00f0ff"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ThreeBackground() {
  // null = not started yet (nothing is rendered, no WebGL context is created)
  const [particleCount, setParticleCount] = useState<number | null>(null);

  useEffect(() => {
    // People who ask their OS for less motion get no animated background at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Phones and low-core devices get fewer particles (same look, far less GPU work).
    const isSmallScreen = window.innerWidth < 768;
    const isLowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const count = isSmallScreen || isLowPower ? 600 : 1200;

    // Wait until the browser is idle so the effect never competes with first paint.
    const start = () => setParticleCount(count);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(start, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (particleCount === null) return null;

  return (
    <div
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 3] }}
        // Cap the pixel ratio (retina screens would otherwise render 4-9x the pixels)
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <Particles count={particleCount} />
      </Canvas>
    </div>
  );
}
