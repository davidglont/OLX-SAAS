"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ───────────────────────────────────────── */
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ─────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 10;

    /* ── Particle field ─────────────────────────────────── */
    const COUNT = 180;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const cA = new THREE.Color("#8B5CF6");
    const cB = new THREE.Color("#EC4899");

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
      const c = i % 2 === 0 ? cA : cB;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    ptGeo.setAttribute("color",    new THREE.BufferAttribute(colors,    3));
    const ptMat = new THREE.PointsMaterial({
      size: 0.055, vertexColors: true, transparent: true, opacity: 0.75,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    /* ── Floating wireframe shapes ──────────────────────── */
    const geos = [
      new THREE.IcosahedronGeometry(0.65, 0),
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.TorusGeometry(0.55, 0.18, 8, 14),
    ];

    const shapes: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];
    const palette = ["#8B5CF6", "#A78BFA", "#EC4899", "#7C3AED", "#6D28D9", "#C4B5FD"];

    for (let i = 0; i < 7; i++) {
      const geo = geos[i % 3];
      const mat = new THREE.MeshBasicMaterial({
        color: palette[i % palette.length],
        wireframe: true,
        transparent: true,
        opacity: 0.22 + (i % 3) * 0.06,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 3,
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = 0.7 + Math.random() * 0.9;
      mesh.scale.setScalar(scale);
      shapes.push({ mesh, speed: 0.003 + Math.random() * 0.004, offset: Math.random() * Math.PI * 2 });
      scene.add(mesh);
    }

    /* ── Mouse parallax ─────────────────────────────────── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* ── Animation loop ─────────────────────────────────── */
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.018;
      particles.rotation.x = t * 0.009;

      shapes.forEach(({ mesh, speed, offset }) => {
        mesh.rotation.x += speed * 0.7;
        mesh.rotation.y += speed;
        mesh.position.y += Math.sin(t + offset) * 0.0015;
      });

      camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ─────────────────────────────────────────── */
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
