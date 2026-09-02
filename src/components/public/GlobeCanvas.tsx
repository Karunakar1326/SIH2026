import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────
   Hotspot locations on India (lat, lng, intensity 0-1)
   ───────────────────────────────────────────────────── */
const HOTSPOTS = [
  { lat: 20.5,  lng: 86.9,  intensity: 1.00, label: 'Odisha'   },
  { lat: 22.3,  lng: 88.3,  intensity: 0.85, label: 'Bengal'   },
  { lat:  8.5,  lng: 77.0,  intensity: 0.72, label: 'Kerala'   },
  { lat: 15.5,  lng: 80.2,  intensity: 0.90, label: 'AP Coast' },
  { lat: 23.0,  lng: 70.5,  intensity: 0.65, label: 'Gujarat'  },
  { lat: 25.5,  lng: 91.5,  intensity: 0.60, label: 'Northeast'},
];

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

export function ThreeGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Scene ── */
    const W = el.clientWidth  || 600;
    const H = el.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 0, 2.8);

    /* ── Globe sphere ── */
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);

    // Dark atmosphere material
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x050d1a,
      emissive: 0x000814,
      shininess: 20,
      transparent: true,
      opacity: 0.96,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    /* ── Wireframe lat/lng lines ── */
    const wireGroup = new THREE.Group();
    const lineMat  = new THREE.LineBasicMaterial({ color: 0x1a5f7a, transparent: true, opacity: 0.35 });
    const equatorMat = new THREE.LineBasicMaterial({ color: 0x4fd1ff, transparent: true, opacity: 0.55 });

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const pts: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 360; lon += 3) {
        pts.push(latLngToVec3(lat, lon - 180, 1.001));
      }
      const geo  = new THREE.BufferGeometry().setFromPoints(pts);
      const mat  = lat === 0 ? equatorMat : lineMat;
      wireGroup.add(new THREE.Line(geo, mat));
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        pts.push(latLngToVec3(lat, lon - 180, 1.001));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      wireGroup.add(new THREE.Line(geo, lineMat));
    }
    scene.add(wireGroup);

    /* ── Atmosphere glow (outer sphere) ── */
    const atmGeo = new THREE.SphereGeometry(1.08, 32, 32);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x0a2a4a,
      emissive: 0x051828,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    /* ── Hotspot pulses ── */
    const hotspotGroup = new THREE.Group();
    const hotRings: { mesh: THREE.Mesh; speed: number; phase: number }[] = [];

    HOTSPOTS.forEach(({ lat, lng, intensity }) => {
      const pos = latLngToVec3(lat, lng, 1.002);

      // Core dot
      const dotGeo = new THREE.SphereGeometry(0.008 * intensity, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xff6614 });
      const dot    = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      hotspotGroup.add(dot);

      // 2 pulse rings per hotspot
      for (let r = 0; r < 2; r++) {
        const ringGeo = new THREE.RingGeometry(0.015, 0.018, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xff4400,
          transparent: true,
          opacity: 0.7 * intensity,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        hotspotGroup.add(ring);
        hotRings.push({ mesh: ring, speed: 0.8 + r * 0.4, phase: r * Math.PI });
      }
    });
    scene.add(hotspotGroup);

    /* ── Point cloud (star-like surface particles) ── */
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi   = Math.random() * Math.PI * 2;
      const r     = 1.05 + Math.random() * 0.25;
      positions[i * 3    ] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.cos(theta);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x4fd1ff,
      size: 0.004,
      transparent: true,
      opacity: 0.25,
    });
    scene.add(new THREE.Points(partGeo, partMat));

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0x112233, 1.2));
    const sun = new THREE.DirectionalLight(0x6699cc, 1.8);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x001133, 0.5);
    fill.position.set(-5, -3, -5);
    scene.add(fill);

    /* ── Mouse interaction (drag-to-rotate) ── */
    let isDragging = false;
    let prevMouse  = { x: 0, y: 0 };
    let rotVel     = { x: 0.0008, y: 0.0003 };

    const onDown = (e: MouseEvent) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; };
    const onUp   = () => { isDragging = false; };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      rotVel.x = dy * 0.0003;
      rotVel.y = dx * 0.0003;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('mousemove', onMove);

    /* ── Initial rotation offset (center India at ~78°E) ── */
    globe.rotation.y       = -1.36;
    wireGroup.rotation.y   = -1.36;
    hotspotGroup.rotation.y = -1.36;

    /* ── Animation loop ── */
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow auto-rotation + damped velocity
      globe.rotation.y       += rotVel.y + 0.0006;
      wireGroup.rotation.y   += rotVel.y + 0.0006;
      hotspotGroup.rotation.y += rotVel.y + 0.0006;
      globe.rotation.x       += rotVel.x;
      wireGroup.rotation.x   += rotVel.x;
      hotspotGroup.rotation.x += rotVel.x;
      rotVel.x *= 0.95;
      rotVel.y *= 0.95;

      // Pulse rings
      hotRings.forEach(({ mesh, speed, phase }) => {
        const scale = 1 + (((Math.sin(t * speed + phase) + 1) / 2) * 3);
        mesh.scale.setScalar(scale);
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          0.7 * (1 - (scale - 1) / 3);
      });

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('mousemove', onMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      onMouseDown={e => (e.currentTarget.style.cursor = 'grabbing')}
      onMouseUp={e => (e.currentTarget.style.cursor = 'grab')}
    />
  );
}
