import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// The sign-in animation, as a small three.js scene: loose words from a whole
// subject tumble into the hopper of the SriDha machine, its gears turn, and
// finished topic cards roll out along a conveyor belt.
//
// Every moving part is a pure function of the clock, so a paused or still
// (reduced-motion) scene is always a complete, consistent frame.

export type TopicMachinePalette = {
  ink: string;
  machine: string;
  accent: string;
  gold: string;
  teal: string;
  sage: string;
  rust: string;
  paper: string;
  border: string;
  muted: string;
  positive: string;
  // The yellow of the SriDha logo
  brand: string;
};

export type TopicMachineContent = {
  words: readonly string[];
  topics: readonly { title: string; label: string }[];
  status: string;
  fonts: { serif: string; sans: string };
};

export type TopicMachineScene = {
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

// Timing, in seconds
const WORD_SLOTS = 15;
const WORD_FLIGHT = 3.8;
const CARD_INTERVAL = 3.4;
const CARD_TRAVEL = 3.8;
const CARD_FADE = 0.6;
const CARD_EMERGE = 0.9;
const MACHINE_THUMP = 0.35;
// The logo tick is redrawn for every card (seconds after the card appears)
const LOGO_TICK = {
  drawStart: 0.3,
  drawLength: 0.5,
  tuckLength: 0.3,
  bounceStart: 0.7,
  bounceLength: 0.4,
};

// Layout, in scene units
const HOPPER_MOUTH = new THREE.Vector3(-0.85, 3.05, 0);
const WORD_START_X = -7;
const BELT = { start: 1.3, end: 4.15, top: -1.75 };
const CARD_SIZE = { width: 2.9, height: 1.7 };
const MAX_PIXEL_RATIO = 2;
const POINTER_TILT = { x: 0.08, y: 0.14 };
const WORLD_TURN = -0.22;

// Fixed pseudo-random numbers, so every cycle of every slot looks different
// but the scene is the same each time it is drawn.
const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

const hash = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas unavailable');
  return { canvas, context };
};

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
};

// Wraps text onto as many lines as it needs within maxWidth.
const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) =>
  text.split(' ').reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1];
    if (last && context.measureText(`${last} ${word}`).width <= maxWidth) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
    return lines;
  }, []);

export const createTopicMachineScene = (
  canvas: HTMLCanvasElement,
  palette: TopicMachinePalette,
  content: TopicMachineContent,
  { animate }: { animate: boolean },
): TopicMachineScene => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.setClearColor(0x000000, 0);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.push(item);
    return item;
  };

  const toTexture = (source: HTMLCanvasElement) => {
    const texture = track(new THREE.CanvasTexture(source));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0.5, 1.4, 20);
  camera.lookAt(0.5, 1.4, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, palette.sage, 1.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
  keyLight.position.set(5, 8, 10);
  scene.add(keyLight);

  const world = new THREE.Group();
  world.rotation.y = WORLD_TURN;
  scene.add(world);

  const standard = (color: string, roughness = 0.5) =>
    track(new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.1 }));

  // ---- The machine --------------------------------------------------------

  const machine = new THREE.Group();
  world.add(machine);

  const body = new THREE.Mesh(
    track(new RoundedBoxGeometry(4.4, 3.4, 2.4, 6, 0.28)),
    standard(palette.machine, 0.6),
  );
  machine.add(body);

  const plinth = new THREE.Mesh(
    track(new RoundedBoxGeometry(5, 0.4, 2.8, 4, 0.12)),
    standard(palette.accent, 0.7),
  );
  plinth.position.y = -1.9;
  world.add(plinth);

  // Hopper: an open funnel on top, where the words go in
  const hopper = new THREE.Mesh(
    track(new THREE.CylinderGeometry(1.15, 0.55, 1.3, 48, 1, true)),
    track(
      new THREE.MeshStandardMaterial({
        color: palette.gold,
        roughness: 0.35,
        metalness: 0.25,
        side: THREE.DoubleSide,
      }),
    ),
  );
  hopper.position.set(HOPPER_MOUTH.x, 2.35, 0);
  machine.add(hopper);

  const rim = new THREE.Mesh(
    track(new THREE.TorusGeometry(1.15, 0.07, 12, 64)),
    standard(palette.gold, 0.3),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.set(HOPPER_MOUTH.x, 3, 0);
  machine.add(rim);

  // The SriDha logo mark on the front face, built from its own shapes so
  // each part can move: the half circle, the bar, the two yellow dots and
  // the tick stroke. Proportions are taken from the logo artwork.
  // Unlit, so the mark keeps its exact brand colours like printed artwork
  const flat = (color: string) => track(new THREE.MeshBasicMaterial({ color }));

  const extruded = (shape: THREE.Shape, color: string) =>
    new THREE.Mesh(
      track(
        new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false }),
      ),
      flat(color),
    );

  const logo = new THREE.Group();
  logo.position.set(-0.4, -0.08, 1.2);
  logo.scale.setScalar(0.86);
  machine.add(logo);

  const halfCircle = new THREE.Shape();
  halfCircle.moveTo(0, 0.968);
  halfCircle.absarc(0, 0, 0.968, Math.PI / 2, (Math.PI * 3) / 2, false);
  halfCircle.lineTo(0, 0.968);
  const halfCircleMesh = extruded(halfCircle, palette.paper);
  halfCircleMesh.position.set(-0.149, -0.008, 0);
  logo.add(halfCircleMesh);

  const bar = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.086, 1.9, 0.06)),
    flat(palette.paper),
  );
  bar.position.z = 0.03;
  logo.add(bar);

  const yellowHalf = new THREE.Shape();
  yellowHalf.moveTo(0, -0.489);
  yellowHalf.absarc(0, 0, 0.489, -Math.PI / 2, Math.PI / 2, false);
  yellowHalf.lineTo(0, -0.489);
  const yellowHalfMesh = extruded(yellowHalf, palette.brand);
  yellowHalfMesh.position.set(0.043, -0.522, 0);
  logo.add(yellowHalfMesh);

  const dot = new THREE.Shape();
  dot.absarc(0, 0, 0.217, 0, Math.PI * 2, false);
  const dotMesh = extruded(dot, palette.brand);
  dotMesh.position.set(0.683, 0.179, 0);
  logo.add(dotMesh);

  // The tick stroke grows from its base, so it can be drawn again
  const strokeStart = new THREE.Vector2(0.839, -0.043);
  const strokeEnd = new THREE.Vector2(1.449, 0.935);
  const strokeLength = strokeStart.distanceTo(strokeEnd);
  const strokeRadius = 0.04;
  const stroke = new THREE.Group();
  stroke.position.set(strokeStart.x, strokeStart.y, 0.03);
  stroke.rotation.z =
    Math.atan2(strokeEnd.y - strokeStart.y, strokeEnd.x - strokeStart.x) -
    Math.PI / 2;
  const strokeMesh = new THREE.Mesh(
    track(
      new THREE.CapsuleGeometry(
        strokeRadius,
        strokeLength - strokeRadius * 2,
        6,
        16,
      ),
    ),
    flat(palette.paper),
  );
  strokeMesh.position.y = strokeLength / 2;
  stroke.add(strokeMesh);
  logo.add(stroke);

  // Status lights that blink in turn
  const lights = [palette.rust, palette.gold, palette.positive].map(
    (color, index) => {
      const light = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.11, 20, 20)),
        track(new THREE.MeshBasicMaterial({ color })),
      );
      light.position.set(0.95 + index * 0.36, 1.15, 1.25);
      machine.add(light);
      return light;
    },
  );

  // Output slot on the right side, where the cards come out
  const slot = new THREE.Mesh(
    track(new RoundedBoxGeometry(0.16, 2, 2, 3, 0.06)),
    standard(palette.ink, 0.8),
  );
  slot.position.set(2.2, -0.75, 0);
  machine.add(slot);

  // ---- Conveyor belt ------------------------------------------------------

  const { canvas: stripes, context: stripeContext } = createCanvas(64, 16);
  stripeContext.fillStyle = palette.border;
  stripeContext.fillRect(0, 0, 64, 16);
  stripeContext.fillStyle = palette.muted;
  stripeContext.fillRect(0, 0, 10, 16);
  const beltTexture = toTexture(stripes);
  beltTexture.wrapS = THREE.RepeatWrapping;
  beltTexture.repeat.set(14, 1);

  const beltLength = BELT.end - BELT.start + 1.6;
  const belt = new THREE.Mesh(
    track(new THREE.BoxGeometry(beltLength, 0.2, 1.7)),
    track(new THREE.MeshStandardMaterial({ map: beltTexture, roughness: 0.8 })),
  );
  belt.position.set(BELT.start + beltLength / 2 - 0.2, BELT.top - 0.1, 0);
  world.add(belt);

  const rollerGeometry = track(new THREE.CylinderGeometry(0.16, 0.16, 1.8, 24));
  const rollerMaterial = standard(palette.machine, 0.5);
  const rollers = [
    belt.position.x - beltLength / 2,
    belt.position.x + beltLength / 2,
  ].map(x => {
    const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(x, BELT.top - 0.1, 0);
    world.add(roller);
    return roller;
  });

  const legGeometry = track(new THREE.BoxGeometry(0.14, 1.2, 0.14));
  [belt.position.x - 1.8, belt.position.x + 1.8].forEach(x => {
    [-0.65, 0.65].forEach(z => {
      const leg = new THREE.Mesh(legGeometry, rollerMaterial);
      leg.position.set(x, BELT.top - 0.8, z);
      world.add(leg);
    });
  });

  // Soft shadow on the floor
  {
    const { canvas: shadow, context } = createCanvas(256, 128);
    const gradient = context.createRadialGradient(128, 64, 0, 128, 64, 128);
    gradient.addColorStop(0, 'rgba(23, 48, 46, 0.22)');
    gradient.addColorStop(1, 'rgba(23, 48, 46, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 128);
    const floor = new THREE.Mesh(
      track(new THREE.PlaneGeometry(14, 4)),
      track(
        new THREE.MeshBasicMaterial({
          map: toTexture(shadow),
          transparent: true,
          depthWrite: false,
        }),
      ),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(1.6, -2.42, 0);
    world.add(floor);
  }

  // ---- Words going in -----------------------------------------------------

  const wordStyles = [
    { font: `italic 600 96px "${content.fonts.serif}"`, color: palette.ink },
    { font: `700 76px "${content.fonts.sans}"`, color: palette.accent },
    { font: `500 96px "${content.fonts.serif}"`, color: palette.teal },
    { font: `600 70px "${content.fonts.sans}"`, color: palette.rust },
  ];

  const wordTextures = content.words.map((word, index) => {
    const style = wordStyles[index % wordStyles.length];
    const height = 132;
    const { context: measure } = createCanvas(1, 1);
    measure.font = style.font;
    const width = Math.ceil(measure.measureText(word).width) + 40;
    const { canvas: label, context } = createCanvas(width, height);
    context.font = style.font;
    context.fillStyle = style.color;
    context.textBaseline = 'middle';
    context.fillText(word, 20, height / 2);
    return { texture: toTexture(label), aspect: width / height };
  });

  const wordGeometry = track(new THREE.PlaneGeometry(1, 1));
  const words = Array.from({ length: WORD_SLOTS }, (_, slotIndex) => {
    const material = track(
      new THREE.MeshBasicMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    const mesh = new THREE.Mesh(wordGeometry, material);
    world.add(mesh);
    return {
      mesh,
      material,
      offset: (slotIndex / WORD_SLOTS) * WORD_FLIGHT,
      slotIndex,
    };
  });

  const start = new THREE.Vector3();
  const control = new THREE.Vector3();
  const end = new THREE.Vector3();

  const placeWords = (time: number) => {
    words.forEach(word => {
      const cycleTime = time + word.offset;
      const cycle = Math.floor(cycleTime / WORD_FLIGHT);
      const progress = (cycleTime - cycle * WORD_FLIGHT) / WORD_FLIGHT;
      const seed = cycle * WORD_SLOTS + word.slotIndex;
      const random = hash(seed);
      const wordIndex = Math.floor(hash(seed + 0.5) * wordTextures.length);
      const { texture, aspect } = wordTextures[wordIndex];

      if (word.material.map !== texture) {
        word.material.map = texture;
        word.material.needsUpdate = true;
      }

      const depth = (hash(seed + 1.5) - 0.5) * 2.4;
      start.set(WORD_START_X, -1.2 + random * 5.8, depth);
      control.set(-3.8, Math.max(start.y, 2) + 2.4, depth * 0.5);
      end.set(HOPPER_MOUTH.x + (random - 0.5) * 0.6, HOPPER_MOUTH.y, 0);

      // Quadratic Bézier from the left edge into the hopper
      const inverse = 1 - progress;
      word.mesh.position
        .copy(start)
        .multiplyScalar(inverse * inverse)
        .addScaledVector(control, 2 * inverse * progress)
        .addScaledVector(end, progress * progress);

      const size = 0.58 + hash(seed + 2.5) * 0.34;
      const shrink =
        progress < 0.78 ? 1 : 1 - ((progress - 0.78) / 0.22) * 0.85;
      word.mesh.scale.set(size * aspect * shrink, size * shrink, 1);
      word.mesh.rotation.set(
        0,
        -WORLD_TURN + Math.sin(time * 1.6 + word.slotIndex) * 0.3,
        (random - 0.5) * 0.9 + progress * (hash(seed + 3.5) - 0.5) * 3,
      );

      word.material.opacity =
        progress < 0.08
          ? progress / 0.08
          : progress > 0.9
            ? (1 - progress) / 0.1
            : 1;
    });
  };

  // ---- Topic cards coming out ---------------------------------------------

  const cardTextures = content.topics.map(topic => {
    const width = 1024;
    const height = 600;
    const { canvas: card, context } = createCanvas(width, height);

    roundedRect(context, 6, 6, width - 12, height - 12, 36);
    context.fillStyle = palette.paper;
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = palette.border;
    context.stroke();

    context.fillStyle = palette.gold;
    roundedRect(context, 6, 6, 22, height - 12, 11);
    context.fill();

    context.fillStyle = palette.accent;
    context.font = `600 40px "${content.fonts.sans}"`;
    context.letterSpacing = '6px';
    context.fillText(topic.label, 76, 112);

    context.letterSpacing = '0px';
    context.fillStyle = palette.ink;
    context.font = `600 116px "${content.fonts.serif}"`;
    wrapText(context, topic.title, width - 140).forEach((line, index) => {
      context.fillText(line, 72, 250 + index * 112);
    });

    context.fillStyle = palette.positive;
    context.beginPath();
    context.arc(88, height - 82, 12, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = palette.ink;
    context.font = `600 44px "${content.fonts.sans}"`;
    context.fillText(content.status, 116, height - 70);

    return toTexture(card);
  });

  const cardGeometry = track(
    new THREE.PlaneGeometry(CARD_SIZE.width, CARD_SIZE.height),
  );
  const visibleCards = Math.ceil(CARD_TRAVEL / CARD_INTERVAL) + 1;
  const cards = Array.from({ length: visibleCards }, () => {
    const material = track(
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }),
    );
    const mesh = new THREE.Mesh(cardGeometry, material);
    mesh.rotation.y = -WORLD_TURN;
    world.add(mesh);
    return { mesh, material };
  });

  const placeCards = (time: number) => {
    const latest = Math.floor(time / CARD_INTERVAL);
    cards.forEach(card => {
      card.mesh.visible = false;
    });

    for (let back = 0; back < visibleCards; back += 1) {
      const number = latest - back;
      const age = time - number * CARD_INTERVAL;
      if (age < 0 || age > CARD_TRAVEL) continue;

      const slotIndex = ((number % visibleCards) + visibleCards) % visibleCards;
      const topicIndex =
        ((number % cardTextures.length) + cardTextures.length) %
        cardTextures.length;
      const card = cards[slotIndex];
      const leaveAt = CARD_TRAVEL - CARD_FADE;
      const emerge = Math.min(age / CARD_EMERGE, 1);

      card.mesh.visible = true;
      if (card.material.map !== cardTextures[topicIndex]) {
        card.material.map = cardTextures[topicIndex];
        card.material.needsUpdate = true;
      }
      // Slide out quickly, rest in view so the topic can be read, then move
      // on and fade as the next card comes out.
      card.mesh.position.set(
        BELT.start +
          (BELT.end - BELT.start) * (1 - (1 - emerge) ** 3) +
          Math.max(0, age - leaveAt) * 1.8,
        BELT.top + CARD_SIZE.height / 2 + 0.02,
        0.05,
      );
      // A small hop as each card leaves the machine
      card.mesh.position.y +=
        Math.max(0, Math.sin(Math.min(age / 0.5, 1) * Math.PI)) * 0.18;
      card.material.opacity =
        age > leaveAt ? Math.max(0, 1 - (age - leaveAt) / CARD_FADE) : 1;
    }

    // The machine thumps as each card is pressed out
    const sinceLatest = time - latest * CARD_INTERVAL;
    const thump =
      sinceLatest < MACHINE_THUMP
        ? Math.sin((sinceLatest / MACHINE_THUMP) * Math.PI) * 0.035
        : 0;
    machine.scale.set(1 - thump * 0.4, 1 + thump, 1);

    animateLogo(time, sinceLatest);
  };

  // Each pressed-out card is a small victory: the logo's tick stroke draws
  // itself and the small dot bounces, then the stroke tucks away just before
  // the next card. The large yellow half slowly breathes throughout.
  const animateLogo = (time: number, sinceLatest: number) => {
    const draw = Math.min(
      Math.max((sinceLatest - LOGO_TICK.drawStart) / LOGO_TICK.drawLength, 0),
      1,
    );
    const tuck = Math.min(
      Math.max((CARD_INTERVAL - sinceLatest) / LOGO_TICK.tuckLength, 0),
      1,
    );
    stroke.scale.y = Math.max(easeOutCubic(draw) * tuck, 0.001);

    const bounce =
      (sinceLatest - LOGO_TICK.bounceStart) / LOGO_TICK.bounceLength;
    dotMesh.scale.setScalar(
      bounce > 0 && bounce < 1 ? 1 + Math.sin(bounce * Math.PI) * 0.35 : 1,
    );

    yellowHalfMesh.scale.setScalar(1 + Math.sin(time * 1.6) * 0.04);
  };

  // ---- Frame --------------------------------------------------------------

  const pointer = { x: 0, y: 0 };
  const handlePointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  if (animate) window.addEventListener('pointermove', handlePointerMove);

  const renderAt = (time: number) => {
    placeWords(time);
    placeCards(time);

    rollers.forEach(roller => {
      roller.rotation.y = -time * 2.4;
    });
    beltTexture.offset.x = -time * 0.35;

    const activeLight = Math.floor(time * 2.5) % lights.length;
    lights.forEach((light, index) => {
      light.scale.setScalar(index === activeLight ? 1.35 : 0.85);
    });

    world.rotation.y +=
      (WORLD_TURN + pointer.x * POINTER_TILT.y - world.rotation.y) * 0.05;
    world.rotation.x += (pointer.y * POINTER_TILT.x - world.rotation.x) * 0.05;

    renderer.render(scene, camera);
  };

  // Time only advances while running, so pausing never makes parts jump.
  // A still scene starts part-way through, so it already shows words
  // flying in and cards on the belt.
  let elapsed = animate ? 0 : CARD_INTERVAL * 1.3;
  let lastTime = 0;
  let frame = 0;
  let running = false;

  const tick = () => {
    const now = performance.now();
    elapsed += (now - lastTime) / 1000;
    lastTime = now;
    renderAt(elapsed);
    frame = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (!animate) {
      renderAt(elapsed);
      return;
    }
    if (running) return;
    running = true;
    lastTime = performance.now();
    tick();
  };

  const stopLoop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    if (!running) renderAt(elapsed);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  const dispose = () => {
    stopLoop();
    window.removeEventListener('pointermove', handlePointerMove);
    resizeObserver.disconnect();
    disposables.forEach(item => item.dispose());
    renderer.dispose();
  };

  return { start: startLoop, stop: stopLoop, dispose };
};
