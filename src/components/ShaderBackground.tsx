"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = uv * aspect;

    // Mouse influence — strong, obvious displacement
    vec2 mouseNorm = uMouse * aspect;
    float mouseDist = length(st - mouseNorm);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.45;

    // Faster animation speed
    float t = uTime * 0.25;

    // Layered noise for organic aurora flow
    float n1 = snoise(vec3(st * 1.2 + mouseInfluence, t));
    float n2 = snoise(vec3(st * 2.4 - mouseInfluence * 0.7, t * 1.4 + 10.0));
    float n3 = snoise(vec3(st * 0.6, t * 0.8 + 5.0));
    float n4 = snoise(vec3(st * 3.5 + vec2(mouseInfluence * 0.3), t * 0.6 + 20.0));

    float flow = n1 * 0.45 + n2 * 0.30 + n3 * 0.15 + n4 * 0.10;

    // Vivid aurora color palette
    vec3 emerald  = vec3(0.063, 0.725, 0.506);  // #10b981
    vec3 blue     = vec3(0.231, 0.510, 0.965);  // #3b82f6
    vec3 purple   = vec3(0.545, 0.361, 0.965);  // #8b5cf6
    vec3 teal     = vec3(0.078, 0.894, 0.776);  // bright teal accent
    vec3 dark     = vec3(0.02, 0.02, 0.06);

    // Dynamic color blending based on noise + position
    float blend1 = smoothstep(-0.4, 0.5, flow + uv.y * 0.4 - 0.15);
    float blend2 = smoothstep(-0.3, 0.6, flow - uv.x * 0.3 + 0.15);
    float blend3 = smoothstep(-0.2, 0.4, n4 + sin(t * 0.5) * 0.3);

    vec3 color = mix(emerald, blue, blend1);
    color = mix(color, purple, blend2 * 0.65);
    color = mix(color, teal, blend3 * 0.25);

    // Aurora glow — bright streaks
    float aurora = pow(abs(sin(flow * 3.14159 + t * 0.3)), 2.0) * 0.4;
    color += emerald * aurora * (1.0 - blend1);
    color += blue * aurora * blend1 * 0.5;

    // Mouse glow — bright spot near cursor
    float mouseGlow = smoothstep(0.8, 0.0, mouseDist) * 0.35;
    color += teal * mouseGlow;

    // Gentle vignette — less aggressive than before
    float vignette = 1.0 - smoothstep(0.5, 1.6, length(uv - 0.5) * 1.4);

    // Final color: keep it bright! Mix with dark for depth, not muddiness
    color *= 0.6 + 0.4 * sin(flow * 2.0 + t * 0.2);  // pulsing brightness
    color = mix(dark, color, vignette * 0.85 + 0.15);

    // Boost saturation
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.4);

    // Ensure minimum brightness so colors pop
    color = max(color, dark * 1.5);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobile =
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });

    // Mobile: half resolution for performance. Desktop: full DPR (capped at 2).
    const pixelRatio = isMobile ? 0.5 : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    scene.add(new THREE.Mesh(geometry, material));

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    // Only add mouse tracking on desktop
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();

      if (!isMobile) {
        // Smooth mouse follow on desktop
        uniforms.uMouse.value.x +=
          (mouseRef.current.x - uniforms.uMouse.value.x) * 0.05;
        uniforms.uMouse.value.y +=
          (mouseRef.current.y - uniforms.uMouse.value.y) * 0.05;
      }
      // On mobile, mouse stays at (0.5, 0.5) — centered, no interaction

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
