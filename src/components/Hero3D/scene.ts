/**
 * ACSES hero scene — plain Three.js, dynamically imported so it never blocks first paint.
 *
 * Composition: a brushed-metal "weight plate" ring with a knurled inner dial,
 * a thin red orbit ring, a restrained red light sweep, faint dust motes, and the
 * REAL supplied logo shown on a plane (luminance used as alpha so its black
 * background disappears — the mark itself is never redrawn or recoloured).
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  Group,
  InstancedMesh,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
  CylinderGeometry,
  DoubleSide,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface HeroScene {
  start(): void;
  stop(): void;
  setScroll(progress: number): void;
  dispose(): void;
}

interface Options {
  canvas: HTMLCanvasElement;
  logoUrl: string;
  lite: boolean;
  onFirstFrame: () => void;
}

const SILVER = new Color('#c5c7c9');
const RED = new Color('#e32620');

export function createHeroScene({ canvas, logoUrl, lite, onFirstFrame }: Options): HeroScene {
  const renderer = new WebGLRenderer({ canvas, antialias: !lite, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  // ---------- Lights ----------
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 5, 6);
  scene.add(key);

  const rim = new DirectionalLight(0x9fb3c8, 1.2); // slate/blue-grey, echoing the promo artwork
  rim.position.set(5, -2, -4);
  scene.add(rim);

  const redSweep = new PointLight(RED, 38, 9, 1.6);
  scene.add(redSweep);

  // ---------- Objects ----------
  const rig = new Group(); // receives pointer parallax + scroll
  scene.add(rig);
  const plate = new Group(); // idle motion
  rig.add(plate);

  const brushed = new MeshPhysicalMaterial({
    color: SILVER,
    metalness: 1,
    roughness: 0.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.15,
  });
  const darkMetal = new MeshPhysicalMaterial({
    color: new Color('#2a2d30'),
    metalness: 0.9,
    roughness: 0.42,
    envMapIntensity: 0.9,
  });

  const outer = new Mesh(new TorusGeometry(2.05, 0.2, lite ? 24 : 48, lite ? 96 : 180), brushed);
  plate.add(outer);

  // Recessed plate face — a thin dark disc ring behind the logo
  const face = new Mesh(new CylinderGeometry(1.92, 1.92, 0.1, lite ? 64 : 128), darkMetal);
  face.rotation.x = Math.PI / 2;
  face.position.z = -0.1;
  plate.add(face);

  // Knurled inner dial: instanced ticks
  const tickCount = lite ? 48 : 72;
  const ticks = new InstancedMesh(new BoxGeometry(0.035, 0.16, 0.06), brushed, tickCount);
  const dummy = new Object3D();
  for (let i = 0; i < tickCount; i++) {
    const a = (i / tickCount) * Math.PI * 2;
    const r = i % 6 === 0 ? 1.68 : 1.7;
    dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.05);
    dummy.rotation.set(0, 0, a - Math.PI / 2);
    dummy.scale.set(1, i % 6 === 0 ? 1.9 : 1, 1);
    dummy.updateMatrix();
    ticks.setMatrixAt(i, dummy.matrix);
  }
  plate.add(ticks);

  const innerRing = new Mesh(new TorusGeometry(1.48, 0.028, 12, lite ? 96 : 160), brushed);
  plate.add(innerRing);

  // Red orbit — the single deliberate accent
  const orbitGroup = new Group();
  orbitGroup.rotation.set(1.18, 0.32, 0);
  rig.add(orbitGroup);
  const orbit = new Mesh(
    new TorusGeometry(2.75, 0.012, 8, 220),
    new MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.85, toneMapped: false }),
  );
  orbitGroup.add(orbit);
  const bead = new Mesh(
    new TorusGeometry(0.06, 0.03, 8, 24),
    new MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
  );
  orbitGroup.add(bead);

  const orbit2 = new Mesh(
    new TorusGeometry(3.15, 0.006, 6, 220),
    new MeshBasicMaterial({ color: SILVER, transparent: true, opacity: 0.35, toneMapped: false }),
  );
  orbit2.rotation.set(1.42, -0.5, 0.2);
  rig.add(orbit2);

  // Logo plane — real asset, luminance → alpha
  const logoMat = new MeshBasicMaterial({ transparent: true, toneMapped: false, side: DoubleSide, depthWrite: false });
  const logo = new Mesh(new PlaneGeometry(2.55, 2.55), logoMat);
  logo.position.z = 0.16;
  plate.add(logo);

  new TextureLoader().load(logoUrl, (tex) => {
    tex.colorSpace = SRGBColorSpace;
    tex.minFilter = LinearFilter;
    tex.generateMipmaps = false;
    logoMat.map = tex;
    logoMat.needsUpdate = true;
  });

  // Dust motes in the light
  let dust: Points | null = null;
  if (!lite) {
    const n = 220;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    dust = new Points(
      g,
      new PointsMaterial({
        size: 0.022,
        color: 0xc5c7c9,
        transparent: true,
        opacity: 0.55,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(dust);
  }

  // ---------- Interaction ----------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scroll = 0;
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the plate fully in frame on tall/narrow canvases
    camera.position.z = camera.aspect < 0.9 ? 9.2 / Math.max(camera.aspect, 0.55) * 0.9 : 9.2;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ---------- Loop ----------
  const clock = new Clock(false);
  let raf = 0;
  let first = true;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = clock.getElapsedTime();

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    // Low-amplitude idle motion
    plate.rotation.y = Math.sin(t * 0.32) * 0.28;
    plate.rotation.x = Math.sin(t * 0.21) * 0.08;
    ticks.rotation.z = -t * 0.06;
    innerRing.rotation.z = t * 0.04;
    orbit.rotation.z = t * 0.18;
    bead.position.set(Math.cos(t * 0.55) * 2.75, Math.sin(t * 0.55) * 2.75, 0);
    orbit2.rotation.z = -t * 0.05;

    // Pointer parallax + scroll drift
    rig.rotation.y = pointer.x * 0.32 + scroll * 0.6;
    rig.rotation.x = pointer.y * 0.2 - scroll * 0.25;
    rig.position.y = scroll * 1.4;

    // Restrained red light sweep around the ring
    const a = t * 0.6;
    redSweep.position.set(Math.cos(a) * 3.4, Math.sin(a * 0.8) * 1.6, 2.2 + Math.sin(a) * 1.2);

    if (dust) dust.rotation.y = t * 0.012;

    renderer.render(scene, camera);
    if (first) {
      first = false;
      onFirstFrame();
    }
  };

  return {
    start() {
      if (raf) return;
      clock.start();
      frame();
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      clock.stop();
    },
    setScroll(p) {
      scroll = p;
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose();
        const mat = m.material as MeshBasicMaterial | MeshBasicMaterial[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
          x.map?.dispose();
          x.alphaMap?.dispose();
          x.dispose();
        });
      });
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

