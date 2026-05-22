import * as THREE from 'three';
import { prefersReducedMotion } from './utils.js';

// Background Three.js scene: a ringed planet and a 3000-star starfield.
// Pauses rendering when the tab is hidden.
// Under prefers-reduced-motion, renders one static frame and skips the animation loop entirely.
export function initScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0x6b21a8,
      emissive: 0x3b0764,
      shininess: 20,
      specular: 0xff69b4,
    })
  );
  planet.position.set(5, -3, -6);
  scene.add(planet);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.3, 4.8, 80),
    new THREE.MeshBasicMaterial({
      color: 0xff69b4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    })
  );
  ring.rotation.x = Math.PI / 3;
  planet.add(ring);

  const starPositions = new Float32Array(3000 * 3);
  for (let i = 0; i < starPositions.length; i++) starPositions[i] = (Math.random() - 0.5) * 300;
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
  );
  scene.add(stars);

  const pointLight = new THREE.PointLight(0xff69b4, 2.5, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  scene.add(new THREE.AmbientLight(0x442266, 0.8));
  const fillLight = new THREE.PointLight(0xffffff, 1, 50);
  fillLight.position.set(-10, 10, 10);
  scene.add(fillLight);

  camera.position.z = 8;

  const reduced = prefersReducedMotion();

  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);
    planet.rotation.y += 0.002;
    stars.rotation.y += 0.00008;
    stars.rotation.x += 0.00003;
    renderer.render(scene, camera);
  }

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    animate();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else animate();
    });
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (reduced) renderer.render(scene, camera);
  });
}
