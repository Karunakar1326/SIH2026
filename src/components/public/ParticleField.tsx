import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Full-canvas floating particle network — used as the page background.
 * Renders ~200 nodes connected by proximity edges, all gently drifting,
 * with a subtle radial pulse emanating from the centre.
 */
export function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 5;

    /* ── Nodes ── */
    const NODE_COUNT = 180;
    const spread     = 7;
    const nodePos: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodePos.push(new THREE.Vector3(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 2,
      ));
    }

    // Node velocity
    const nodeVel = nodePos.map(() => new THREE.Vector3(
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.002,
      0,
    ));

    // Point cloud
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePos);
    const nodeMat = new THREE.PointsMaterial({
      color: 0x4fd1ff,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
    });
    const points = new THREE.Points(nodeGeo, nodeMat);
    scene.add(points);

    /* ── Edges (lines between close nodes) ── */
    const CONNECT_DIST = 1.8;
    const edgePositions: number[] = [];

    const buildEdges = () => {
      edgePositions.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (nodePos[i].distanceTo(nodePos[j]) < CONNECT_DIST) {
            edgePositions.push(
              nodePos[i].x, nodePos[i].y, nodePos[i].z,
              nodePos[j].x, nodePos[j].y, nodePos[j].z,
            );
          }
        }
      }
    };

    const edgeGeo = new THREE.BufferGeometry();
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x0d4f6e,
      transparent: true,
      opacity: 0.35,
    });
    const lines = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(lines);

    /* ── Animation ── */
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Move nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        nodePos[i].add(nodeVel[i]);
        // Bounce off bounds
        if (Math.abs(nodePos[i].x) > spread)     nodeVel[i].x *= -1;
        if (Math.abs(nodePos[i].y) > spread / 2) nodeVel[i].y *= -1;
      }

      // Update point cloud positions
      const posArr = nodeGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < NODE_COUNT; i++) {
        posArr.setXYZ(i, nodePos[i].x, nodePos[i].y, nodePos[i].z);
      }
      posArr.needsUpdate = true;

      // Rebuild edges every other frame for perf
      if (Math.round(t * 60) % 2 === 0) {
        buildEdges();
        edgeGeo.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(edgePositions, 3),
        );
      }

      // Subtle node opacity pulse
      nodeMat.opacity = 0.4 + 0.15 * Math.sin(t * 0.8);

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
