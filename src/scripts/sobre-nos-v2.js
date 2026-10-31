import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';

/* A mesa de trabalho da SENVIA, vista de cima. Cada paragem do scroll leva a câmara a um objeto, que se levanta da mesa;
   os ecrãs, o caderno e as fotos são desenhados em canvas. Todos os dados de clientes nos ecrãs são fictícios. */

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= utilitários ================= */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const rad = THREE.MathUtils.degToRad;
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const FOV = 30, TAN = Math.tan(rad(FOV / 2));
const C = { ink: '#0B1F2A', ink2: '#4A6170', petrol: '#0E86A8', petrolD: '#00708F', navy: '#0B1F2A', line: '#E3E8EA', green: '#1FAF5B', amber: '#F2B53A', pen: '#24405A', pencil: '#4B5560', bg: '#F4F7F8' };
const UI = (w, s) => `${w} ${s}px Inter, "Segoe UI", system-ui, sans-serif`;
const HAND = (s, w = 700) => `${w} ${s}px Caveat, "Segoe Print", "Comic Sans MS", cursive`;
const MONO = (s, w = 500) => `${w} ${s}px "DM Mono", ui-monospace, Consolas, monospace`;
// aleatório com semente: os traços desenhados à mão não tremem quando o canvas é redesenhado
function rng(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* ================= motor ================= */
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: innerWidth >= 760, powerPreference: 'high-performance' });
const MOBILE0 = innerWidth < 760;
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE0 ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const ANISO = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xC9A97E);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.5;
const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.6, 160);

// luz: o sol entra pela janela (atrás, à esquerda) e projeta a sombra do caixilho na mesa
const hemi = new THREE.HemisphereLight(0xFFF8EE, 0xB0936C, 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xFFF1DE, 3.0);
sun.castShadow = true;
sun.shadow.mapSize.set(MOBILE0 ? 1024 : 2048, MOBILE0 ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 90 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.025;
scene.add(sun, sun.target);
const windowFrame = new THREE.Group(); scene.add(windowFrame);
{
  const m = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  const bar = (w, h, x, y) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), m); b.position.set(x, y, 0); b.castShadow = true; windowFrame.add(b); };
  const OW = 17, OH = 11.5, BIG = 80;
  bar(BIG, BIG, -OW / 2 - BIG / 2, 0); bar(BIG, BIG, OW / 2 + BIG / 2, 0); bar(OW, BIG, 0, OH / 2 + BIG / 2); bar(OW, BIG, 0, -OH / 2 - BIG / 2);
  bar(0.75, OH, 1.6, 0); bar(OW, 0.75, 0, 1.4);
}
function placeSun(p){
  const az = rad(-128 + p * 7), el = rad(52 - p * 5);
  const dir = V3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
  sun.position.copy(dir).multiplyScalar(45);
  sun.target.position.set(0, 0, 0);
  windowFrame.position.copy(dir).multiplyScalar(30);
  windowFrame.lookAt(0, 0, 0);
  sun.color.setRGB(1, lerp(0.945, 0.9, p), lerp(0.87, 0.78, p));
}

/* ================= canvas e geometria ================= */
function mkCv(w, h){
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = ANISO;
  return { cv, c: cv.getContext('2d'), tex, w, h };
}
function rr(c, x, y, w, h, r){ c.beginPath(); c.roundRect(x, y, w, h, r); }
function fillRR(c, x, y, w, h, r, col){ rr(c, x, y, w, h, r); c.fillStyle = col; c.fill(); }
function strokeRR(c, x, y, w, h, r, col, lw = 2){ rr(c, x, y, w, h, r); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); }
function txt(c, s, x, y, font, col, align = 'left', maxW){
  c.font = font; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'middle';
  let t = s;
  if (maxW && c.measureText(t).width > maxW){ while (t.length > 1 && c.measureText(t + '…').width > maxW) t = t.slice(0, -1); t += '…'; }
  c.fillText(t, x, y);
}
function wrap(c, s, x, y, maxW, lh, font, col, maxLines = 99){
  c.font = font; c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'middle';
  const words = s.split(' '); let line = '', n = 0;
  for (const w of words){
    const t = line ? line + ' ' + w : w;
    if (c.measureText(t).width > maxW && line){
      if (n === maxLines - 1){ c.fillText(line + '…', x, y + n * lh); return n + 1; }
      c.fillText(line, x, y + n * lh); n++; line = w;
    } else line = t;
  }
  if (line){ c.fillText(line, x, y + n * lh); n++; }
  return n;
}
// o símbolo da SENVIA: um losango grande e dois pequenos
function logoMark(c, x, y, s, col){
  c.fillStyle = col;
  [[0, 0, 1], [1.5, -1.33, 0.67], [1.5, 1.33, 0.67]].forEach(([dx, dy, k]) => {
    c.save(); c.translate(x + dx * s, y + dy * s); c.rotate(Math.PI / 4); rr(c, -s * k, -s * k, s * k * 2, s * k * 2, s * k * 0.3); c.fill(); c.restore();
  });
}
function stars(c, x, y, s, col = C.amber){
  for (let k = 0; k < 5; k++){
    c.save(); c.translate(x + s + k * s * 2.3, y); c.beginPath();
    for (let j = 0; j < 10; j++){ const a = -Math.PI / 2 + j * Math.PI / 5, d = j % 2 ? s * 0.45 : s; c.lineTo(Math.cos(a) * d, Math.sin(a) * d); }
    c.closePath(); c.fillStyle = col; c.fill(); c.restore();
  }
}
function rrShape(w, h, r){
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
// placa deitada na mesa: largura em x, profundidade em z, espessura em y (a base fica em y = 0)
function slab(w, d, t, r, bevel = 0){
  const g = new THREE.ExtrudeGeometry(rrShape(w - bevel * 2, d - bevel * 2, Math.max(0.001, r - bevel)), {
    depth: Math.max(0.0005, t - bevel * 2), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
  g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0);
  return g;
}
// face plana com cantos redondos e UV de 0 a 1, virada para cima, para levar uma textura de canvas
function rrPlane(w, d, r){
  const g = new THREE.ShapeGeometry(rrShape(w, d, r), 10);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / d + 0.5);
  g.rotateX(-Math.PI / 2);
  return g;
}
const mesh = (geo, mat, y = 0) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; return m; };

/* ================= a mesa ================= */
function woodTexture(){
  const K = mkCv(2048, 1024), c = K.c, R = rng(7);
  c.fillStyle = '#D4B68E'; c.fillRect(0, 0, 2048, 1024);
  // veios longos e ondulados
  for (let i = 0; i < 260; i++){
    const y0 = R() * 1100 - 40, a = 3 + R() * 14, f = 0.0015 + R() * 0.003, ph = R() * 6.3;
    c.beginPath();
    for (let x = -20; x <= 2068; x += 16) c.lineTo(x, y0 + Math.sin(x * f + ph) * a + Math.sin(x * 0.011 + ph * 2) * 1.6);
    const dark = R() < 0.5;
    c.strokeStyle = dark ? `rgba(120,80,40,${0.04 + R() * 0.09})` : `rgba(255,240,215,${0.05 + R() * 0.08})`;
    c.lineWidth = 0.8 + R() * 3.2; c.stroke();
  }
  // poros
  for (let i = 0; i < 9000; i++){ c.fillStyle = `rgba(100,65,30,${R() * 0.07})`; c.fillRect(R() * 2048, R() * 1024, 1 + R() * 5, 1); }
  K.tex.wrapS = K.tex.wrapT = THREE.RepeatWrapping; K.tex.repeat.set(2, 1.4); K.tex.needsUpdate = true;
  return K.tex;
}
const desk = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.58, metalness: 0 }));
desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);
// tapete de secretária em feltro escuro, como o da fotografia
const MAT_H = 0.03;
const deskMat = mesh(slab(7.6, 4.5, MAT_H, 0.22), new THREE.MeshStandardMaterial({ color: 0x1D2B31, roughness: 0.96 }));
deskMat.position.set(0.5, 0, -0.85); deskMat.receiveShadow = true; scene.add(deskMat);

/* ================= objetos ================= */
const OBJS = [];
function addObj(o){
  o.root.position.copy(o.pos); o.root.rotation.y = o.yaw; o.q0 = o.root.quaternion.clone();
  o.lift = 0; o.hov = 0; o.wob = 0; o.liftH ??= 0; o.faceK ??= 0; o.stop ??= -1;
  o.root.traverse((m) => { if (m.isMesh){ m.castShadow = m.userData.noShadow ? false : true; m.receiveShadow = true; m.userData.obj = o; } });
  scene.add(o.root); OBJS.push(o); return o;
}
const PHOTO = new Image();

// --- polaroid com a foto do Thiago: pequena, no meio das outras coisas da mesa; revela-se a primeira vez que lá chegas
const polaroid = (() => {
  const root = new THREE.Group(), W = 0.9, D = 1.08;
  root.add(mesh(slab(W, D, 0.012, 0.015), new THREE.MeshStandardMaterial({ color: 0xFBFAF6, roughness: 0.85 })));
  const K = mkCv(600, 720);
  root.add(mesh(rrPlane(W, D, 0.015), new THREE.MeshStandardMaterial({ map: K.tex, roughness: 0.45 }), 0.0145));
  let dev = 0;
  const draw = () => {
    const c = K.c, px = 38, py = 38, ps = 524;
    c.fillStyle = '#FBFAF6'; c.fillRect(0, 0, 600, 720);
    c.fillStyle = '#2C3338'; c.fillRect(px, py, ps, ps);
    if (PHOTO.complete && PHOTO.naturalWidth){
      const iw = PHOTO.naturalWidth, ih = PHOTO.naturalHeight, s = Math.min(iw, ih) * 0.79;
      c.save(); c.globalAlpha = smooth(clamp(dev * 1.15));
      c.filter = `saturate(${lerp(0.2, 1, smooth(dev))}) contrast(${lerp(0.8, 1.04, dev)})`;
      c.drawImage(PHOTO, iw * 0.515 - s / 2, ih * 0.38 - s * 0.42, s, s, px, py, ps, ps);
      c.restore(); c.filter = 'none';
    }
    c.fillStyle = `rgba(214,206,190,${(1 - smooth(dev)) * 0.35})`; c.fillRect(px, py, ps, ps);
    const g = c.createLinearGradient(px, py, px + ps, py + ps); g.addColorStop(0, 'rgba(255,255,255,.14)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(px, py, ps, ps);
    c.save(); c.translate(300, 640); c.rotate(-0.025); txt(c, 'Thiago · Leiria, 2025', 0, 0, HAND(52), C.pen, 'center'); c.restore();
    K.tex.needsUpdate = true;
  };
  draw();
  return addObj({ key: 'polaroid', label: 'Polaroid', stop: 1, root, pos: V3(-4.7, 0, -2.75), yaw: 0.22, liftH: 0.35, faceK: 0.28, R: [1.95, 1.6], draw,
    update(dt, t, e){ if (e > 0.55 && dev < 1){ dev = Math.min(1, dev + dt / 2.6); draw(); } } });
})();
PHOTO.onload = () => polaroid.draw();
PHOTO.src = '/images/thiago-sousa.webp';

// --- portátil: o ecrã passa por um sistema à medida, o Senvia OS e um site
const SCREEN_W = 1280, SCREEN_H = 800;
function carSide(c, x, y, w, col){
  const h = w * 0.36;
  c.save(); c.translate(x, y);
  c.fillStyle = col; c.beginPath();
  c.moveTo(w * 0.04, h * 0.78); c.lineTo(w * 0.02, h * 0.5); c.quadraticCurveTo(w * 0.05, h * 0.36, w * 0.2, h * 0.32);
  c.lineTo(w * 0.33, h * 0.08); c.quadraticCurveTo(w * 0.36, 0, w * 0.45, 0); c.lineTo(w * 0.66, 0); c.quadraticCurveTo(w * 0.72, 0, w * 0.77, h * 0.1);
  c.lineTo(w * 0.86, h * 0.32); c.quadraticCurveTo(w * 0.98, h * 0.36, w * 0.98, h * 0.55); c.lineTo(w * 0.97, h * 0.78); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.moveTo(w * 0.36, h * 0.3); c.lineTo(w * 0.43, h * 0.1); c.lineTo(w * 0.54, h * 0.1); c.lineTo(w * 0.54, h * 0.3); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(w * 0.58, h * 0.3); c.lineTo(w * 0.58, h * 0.1); c.lineTo(w * 0.68, h * 0.1); c.lineTo(w * 0.76, h * 0.3); c.closePath(); c.fill();
  [0.24, 0.78].forEach((k) => { c.beginPath(); c.arc(w * k, h * 0.8, h * 0.2, 0, Math.PI * 2); c.fillStyle = '#1D2428'; c.fill(); c.beginPath(); c.arc(w * k, h * 0.8, h * 0.09, 0, Math.PI * 2); c.fillStyle = '#AEB8BE'; c.fill(); });
  c.restore();
}
function appShell(c, brand, items, active){
  c.fillStyle = C.bg; c.fillRect(0, 0, SCREEN_W, SCREEN_H);
  c.fillStyle = C.navy; c.fillRect(0, 0, 236, SCREEN_H);
  logoMark(c, 40, 52, 9, '#2BDBFF'); txt(c, brand, 66, 52, UI(700, 21), '#FFFFFF');
  items.forEach((it, k) => {
    const y = 122 + k * 54;
    if (k === active) fillRR(c, 16, y - 22, 204, 44, 10, 'rgba(43,219,255,.14)');
    fillRR(c, 34, y - 8, 16, 16, 4, k === active ? '#2BDBFF' : 'rgba(255,255,255,.28)');
    txt(c, it, 64, y, UI(k === active ? 600 : 500, 17), k === active ? '#FFFFFF' : 'rgba(255,255,255,.62)');
  });
  fillRR(c, 16, SCREEN_H - 78, 204, 58, 12, 'rgba(255,255,255,.06)');
  c.beginPath(); c.arc(46, SCREEN_H - 49, 15, 0, Math.PI * 2); c.fillStyle = '#2BDBFF'; c.fill();
  txt(c, 'Equipa', 72, SCREEN_H - 56, UI(600, 15), '#FFFFFF'); txt(c, 'sem limite de utilizadores', 72, SCREEN_H - 37, UI(500, 12), 'rgba(255,255,255,.55)');
}
function kpi(c, x, y, w, label, value, col){
  fillRR(c, x, y, w, 104, 16, '#FFFFFF'); strokeRR(c, x, y, w, 104, 16, C.line, 1.5);
  txt(c, label, x + 22, y + 32, UI(500, 16), C.ink2); txt(c, value, x + 22, y + 70, UI(700, 34), C.ink);
  fillRR(c, x + w - 54, y + 22, 32, 32, 9, col);
}
function pill(c, x, y, label, bg, fg){ c.font = UI(600, 13); const w = c.measureText(label).width + 22; fillRR(c, x, y - 13, w, 26, 13, bg); txt(c, label, x + 11, y, UI(600, 13), fg); return w; }
const SCENES = [
  { name: 'Sistema à medida', draw(c){
    appShell(c, 'Stand', ['Painel', 'Stock', 'Clientes', 'Vendas', 'Oficina', 'Relatórios'], 1);
    txt(c, 'Stock', 276, 62, UI(700, 32), C.ink); txt(c, '3 stands · atualizado agora', 276, 96, UI(500, 16), C.ink2);
    fillRR(c, 1062, 44, 182, 46, 12, C.petrol); txt(c, '+ Nova viatura', 1153, 67, UI(600, 16), '#FFFFFF', 'center');
    kpi(c, 276, 128, 300, 'Em stock', '48', '#CFEFF7'); kpi(c, 600, 128, 300, 'Vendidas este mês', '12', '#D3F5E1'); kpi(c, 924, 128, 320, 'Em transferência', '3', '#FCEBC5');
    const cars = [['Citadina 1.0', '2021 · 42 000 km', '13 900 €', 0, '#3A7CA5'], ['Carrinha 1.5 diesel', '2020 · 88 000 km', '16 450 €', 1, '#6B7B86'], ['SUV híbrido', '2022 · 31 000 km', '27 900 €', 0, '#9E3B3B'],
      ['Compacto 1.2', '2019 · 64 000 km', '11 200 €', 2, '#2F6E55'], ['Elétrico 58 kWh', '2023 · 12 000 km', '31 500 €', 0, '#E5E9EC'], ['Monovolume 7 lug.', '2018 · 97 000 km', '14 800 €', 1, '#B78B3A']];
    const ST = [['Disponível', '#D3F5E1', '#0F7A3D'], ['Reservada', '#FCEBC5', '#8A5A00'], ['Em transferência', '#CFEFF7', '#00607A']];
    cars.forEach(([n, d, p, s, col], k) => {
      const x = 276 + (k % 3) * 324, y = 256 + Math.floor(k / 3) * 262, w = 300;
      fillRR(c, x, y, w, 244, 16, '#FFFFFF'); strokeRR(c, x, y, w, 244, 16, C.line, 1.5);
      c.save(); rr(c, x + 10, y + 10, w - 20, 116, 11); c.clip(); const g = c.createLinearGradient(0, y, 0, y + 126); g.addColorStop(0, '#EEF3F5'); g.addColorStop(1, '#DCE5E9'); c.fillStyle = g; c.fillRect(x, y, w, 130); c.restore();
      carSide(c, x + 50, y + 34, 200, col);
      txt(c, n, x + 20, y + 152, UI(600, 18), C.ink, 'left', w - 40); txt(c, d, x + 20, y + 180, UI(500, 14), C.ink2);
      txt(c, p, x + 20, y + 214, UI(700, 20), C.ink); const [l, bg, fg] = ST[s]; c.font = UI(600, 13); pill(c, x + w - 20 - (c.measureText(l).width + 22), y + 214, l, bg, fg);
    });
  } },
  { name: 'Senvia OS', draw(c){
    appShell(c, 'Senvia OS', ['Painel', 'Leads', 'Clientes', 'Agenda', 'Propostas', 'Faturas'], 1);
    txt(c, 'Leads', 276, 62, UI(700, 32), C.ink); txt(c, 'Esta semana · 9 leads', 276, 96, UI(500, 16), C.ink2);
    fillRR(c, 930, 44, 314, 46, 12, '#FFFFFF'); strokeRR(c, 930, 44, 314, 46, 12, C.line, 1.5);
    logoMark(c, 954, 67, 6, C.petrol); txt(c, 'Otto: 3 tarefas para hoje', 976, 67, UI(600, 15), C.ink);
    const COLS = [['Novo', '#0E86A8', [['Marta Lopes', 'Clínica dentária', '1 200 €'], ['Rui Fonseca', 'Ginásio', '850 €'], ['Sara Matos', 'Escola de línguas', '2 400 €']]],
      ['Contactado', '#7C3AED', [['Inês Duarte', 'Imobiliária', '3 100 €'], ['Paulo Neves', 'Restaurante', '690 €']]],
      ['Proposta', '#D97706', [['Hugo Reis', 'Oficina', '4 500 €'], ['Ana Cruz', 'Loja de móveis', '1 980 €']]],
      ['Ganho', '#1FAF5B', [['Luís Pinto', 'Contabilidade', '2 750 €'], ['Rita Melo', 'Estética', '1 150 €']]]];
    COLS.forEach(([name, col, cards], k) => {
      const x = 276 + k * 246, w = 230;
      fillRR(c, x, 128, w, 652, 16, '#EAEFF1');
      fillRR(c, x + 16, 150, 10, 10, 3, col); txt(c, name, x + 36, 156, UI(700, 16), C.ink); txt(c, String(cards.length), x + w - 18, 156, UI(600, 15), C.ink2, 'right');
      cards.forEach(([n, t, v], j) => {
        const y = 184 + j * 150;
        fillRR(c, x + 10, y, w - 20, 136, 12, '#FFFFFF'); fillRR(c, x + 10, y, 5, 136, 3, col);
        c.beginPath(); c.arc(x + 42, y + 34, 16, 0, Math.PI * 2); c.fillStyle = col + '33'; c.fill();
        txt(c, n.split(' ').map((s) => s[0]).join(''), x + 42, y + 35, UI(700, 13), col, 'center');
        txt(c, n, x + 66, y + 34, UI(600, 16), C.ink, 'left', w - 90); txt(c, t, x + 26, y + 72, UI(500, 14), C.ink2, 'left', w - 50);
        txt(c, v, x + 26, y + 108, UI(700, 18), C.ink);
      });
    });
  } },
  { name: 'Site', draw(c){
    c.fillStyle = '#E9EDEF'; c.fillRect(0, 0, SCREEN_W, SCREEN_H);
    fillRR(c, 0, 0, SCREEN_W, 56, 0, '#DDE3E6');
    ['#FF6159', '#FFBD2E', '#28C941'].forEach((col, k) => { c.beginPath(); c.arc(28 + k * 22, 28, 7, 0, Math.PI * 2); c.fillStyle = col; c.fill(); });
    fillRR(c, 380, 13, 520, 30, 15, '#FFFFFF'); txt(c, 'o-teu-site.pt', 640, 28, UI(500, 14), C.ink2, 'center');
    c.fillStyle = '#FFF8EF'; c.fillRect(0, 56, SCREEN_W, SCREEN_H - 56);
    txt(c, 'Aurora', 64, 104, `italic 600 30px "Instrument Serif", Georgia, serif`, '#5A3418');
    ['Pães', 'Bolos', 'Encomendas', 'Contactos'].forEach((s, k) => txt(c, s, 640 + k * 118, 104, UI(500, 16), '#5A3418'));
    fillRR(c, 1094, 82, 132, 44, 22, '#B4541E'); txt(c, 'Encomendar', 1160, 104, UI(600, 15), '#FFFFFF', 'center');
    txt(c, 'PADARIA ARTESANAL', 64, 196, MONO(15), '#B4541E');
    c.font = UI(800, 58); c.fillStyle = '#2E1A0C'; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    c.fillText('Pão quente,', 62, 270); c.fillText('todas as manhãs.', 62, 336);
    wrap(c, 'Encomenda até às 20h e levanta de manhã, ainda quente. Ou recebe em casa.', 64, 384, 470, 28, UI(500, 19), '#6B4A32');
    fillRR(c, 64, 446, 196, 56, 28, '#B4541E'); txt(c, 'Encomendar agora', 162, 474, UI(600, 17), '#FFFFFF', 'center');
    strokeRR(c, 276, 446, 160, 56, 28, '#B4541E', 2); txt(c, 'Ver horário', 356, 474, UI(600, 17), '#B4541E', 'center');
    const g = c.createRadialGradient(930, 330, 20, 930, 330, 260); g.addColorStop(0, '#F7D9A8'); g.addColorStop(1, '#F1C88A'); c.beginPath(); c.arc(930, 330, 230, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    const loaf = (x, y, w, h, r, col) => { c.save(); c.translate(x, y); c.rotate(r); c.beginPath(); c.ellipse(0, 0, w, h, 0, 0, Math.PI * 2); c.fillStyle = col; c.fill();
      c.strokeStyle = 'rgba(255,235,200,.75)'; c.lineWidth = 5; for (let i = -1; i <= 1; i++){ c.beginPath(); c.moveTo(i * w * 0.4 - w * 0.12, -h * 0.5); c.quadraticCurveTo(i * w * 0.4, 0, i * w * 0.4 + w * 0.12, h * 0.5); c.stroke(); } c.restore(); };
    loaf(880, 300, 150, 74, -0.35, '#B8692C'); loaf(1000, 400, 110, 60, 0.4, '#9C5523');
    [['Broa de milho', '2,40 €'], ['Pão de centeio', '3,10 €'], ['Croissant', '1,20 €']].forEach(([n, p], k) => {
      const x = 64 + k * 392; fillRR(c, x, 590, 368, 150, 18, '#FFFFFF');
      c.beginPath(); c.arc(x + 70, 665, 44, 0, Math.PI * 2); c.fillStyle = ['#E9B872', '#A8743F', '#F0C27B'][k]; c.fill();
      txt(c, n, x + 136, 646, UI(600, 20), '#2E1A0C'); txt(c, p, x + 136, 684, UI(700, 20), '#B4541E');
    });
  } },
].map((s) => { const K = mkCv(SCREEN_W, SCREEN_H); return { ...s, K }; });
const laptop = (() => {
  const root = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0xC5CBCF, metalness: 0.7, roughness: 0.32 });
  root.add(mesh(slab(3.3, 2.25, 0.085, 0.12, 0.02), alu));
  // teclado e trackpad
  const KB = mkCv(1024, 700);
  {
    const c = KB.c; c.fillStyle = '#BFC5C9'; c.fillRect(0, 0, 1024, 700);
    fillRR(c, 52, 34, 920, 360, 14, '#A9B0B4');
    const rows = [14, 14, 13, 12, 11];
    rows.forEach((n, r) => { const kw = (900 - (n - 1) * 8) / n; for (let k = 0; k < n; k++) fillRR(c, 62 + k * (kw + 8), 44 + r * 66, kw, 56, 8, '#22282C'); });
    fillRR(c, 332, 430, 360, 230, 16, '#B3BABE'); strokeRR(c, 332, 430, 360, 230, 16, 'rgba(0,0,0,.08)', 2);
    KB.tex.needsUpdate = true;
  }
  root.add(mesh(new THREE.PlaneGeometry(3.12, 2.13).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: KB.tex, roughness: 0.5, metalness: 0.35 }), 0.088));
  const hinge = new THREE.Group(); hinge.position.set(0, 0.085, -1.12); root.add(hinge);
  const lid = mesh(slab(3.3, 2.2, 0.05, 0.12, 0.015), alu); lid.position.z = 1.1; hinge.add(lid);
  const bezel = mesh(rrPlane(3.22, 2.12, 0.1).rotateX(Math.PI), new THREE.MeshStandardMaterial({ color: 0x0A0E11, roughness: 0.18, metalness: 0.2 }), -0.0025);
  bezel.position.z = 1.1; hinge.add(bezel);
  const SC = mkCv(SCREEN_W, SCREEN_H);
  const scrMat = new THREE.MeshBasicMaterial({ map: SC.tex, toneMapped: false });
  const scr = mesh(new THREE.PlaneGeometry(3.04, 1.9).rotateX(Math.PI / 2), scrMat, -0.005); scr.position.z = 1.1 + 0.04; scr.userData.noShadow = true; hinge.add(scr);
  // manual: tempo que o ecrã fica parado depois de o visitante escolher um cartão
  let cur = 0, prev = 0, tr = 1, hold = 0, manual = 0;
  const show = (k) => { if (k === cur) return; prev = cur; cur = k; tr = 0; hold = 0; sceneChanged(k); };
  const compose = () => {
    const c = SC.c, e = smooth(tr);
    if (tr >= 1) c.drawImage(SCENES[cur].K.cv, 0, 0);
    else { c.drawImage(SCENES[prev].K.cv, -e * SCREEN_W, 0); c.drawImage(SCENES[cur].K.cv, (1 - e) * SCREEN_W, 0); }
    // etiqueta do que está no ecrã e os pontos
    c.font = UI(600, 15); const lw = c.measureText(SCENES[cur].name).width + 56;
    fillRR(c, SCREEN_W - lw - 22, SCREEN_H - 58, lw, 38, 19, 'rgba(11,31,42,.86)');
    SCENES.forEach((s, k) => { c.beginPath(); c.arc(SCREEN_W - lw - 2 + k * 12, SCREEN_H - 39, 3.5, 0, Math.PI * 2); c.fillStyle = k === cur ? '#2BDBFF' : 'rgba(255,255,255,.35)'; c.fill(); });
    txt(c, SCENES[cur].name, SCREEN_W - lw + 34, SCREEN_H - 39, UI(600, 15), '#FFFFFF');
    SC.tex.needsUpdate = true;
  };
  const draw = () => { SCENES.forEach((s) => { s.draw(s.K.c); }); compose(); };
  draw();
  return addObj({ key: 'laptop', label: 'Portátil', stop: 2, root, pos: V3(0.45, MAT_H, -1.15), yaw: 0, R: [1.9, 1.75], tOff: V3(0, 0.78, -0.95), draw,
    update(dt, t, e){
      hinge.rotation.x = -rad(lerp(106, 114, e));
      scrMat.color.setScalar(lerp(0.62, 1, e));
      if (tr < 1){ tr = Math.min(1, tr + dt / 0.55); compose(); }
      if (manual > 0) manual -= dt;
      else { hold += dt * (e > 0.6 ? 1 : 0.55); if (hold > 2.8) show((cur + 1) % SCENES.length); }
    },
    poke(){ show((cur + 1) % SCENES.length); manual = 8; },
    choose(k){ show(k); manual = 14; } });
})();

// --- caderno aberto, com os esboços de um ecrã e de um fluxo; os traços desenham-se quando lá chegas
const notebook = (() => {
  const root = new THREE.Group(), PW = 1.5, PD = 2.04;
  root.add(mesh(slab(3.22, 2.16, 0.04, 0.06), new THREE.MeshStandardMaterial({ color: 0x1E3A46, roughness: 0.75 })));
  const paper = new THREE.MeshStandardMaterial({ color: 0xF6F2E8, roughness: 0.9 });
  const L = mkCv(760, 1032), R = mkCv(760, 1032);
  [[-1, L], [1, R]].forEach(([s, K]) => {
    const stack = mesh(slab(PW, PD, 0.035, 0.02), paper, 0.04); stack.position.x = s * (PW / 2 + 0.04); root.add(stack);
    const pg = mesh(new THREE.PlaneGeometry(PW, PD).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: K.tex, roughness: 0.9 }), 0.078);
    pg.position.x = s * (PW / 2 + 0.04); root.add(pg);
  });
  const ringM = new THREE.MeshStandardMaterial({ color: 0xA9B2B8, metalness: 0.85, roughness: 0.3 });
  for (let k = 0; k < 13; k++){ const r = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 6, 18), ringM); r.position.set(0, 0.08, -0.9 + k * 0.15); r.userData.noShadow = true; root.add(r); }
  let prog = 0.18;
  // pequeno "motor" de caneta: cada traço aparece pela ordem e os anteriores ficam completos
  const page = (K, seed, items) => {
    const c = K.c, Rn = rng(seed);
    c.fillStyle = '#F7F3EA'; c.fillRect(0, 0, 760, 1032);
    c.fillStyle = '#D8D1C2'; for (let y = 60; y < 1010; y += 34) for (let x = 40; x < 740; x += 34) { c.beginPath(); c.arc(x, y, 2, 0, Math.PI * 2); c.fill(); }
    const n = items.length;
    items.forEach((it, i) => { const t = clamp(prog * n - i); if (t > 0) it(c, t, Rn); });
    K.tex.needsUpdate = true;
  };
  const line = (pts, col = C.pencil, lw = 3.4) => (c, t, Rn) => {
    let total = 0; const seg = []; for (let i = 1; i < pts.length; i++){ const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    let left = total * t; c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++){
      const j = pass ? 1.4 : 0; c.globalAlpha = pass ? 0.35 : 0.9; c.beginPath(); c.moveTo(pts[0][0] + j, pts[0][1] - j); let rem = left;
      for (let i = 1; i < pts.length && rem > 0; i++){ const k = Math.min(1, rem / seg[i - 1]); c.lineTo(lerp(pts[i - 1][0], pts[i][0], k) + j, lerp(pts[i - 1][1], pts[i][1], k) - j); rem -= seg[i - 1]; }
      c.stroke();
    }
    c.globalAlpha = 1;
  };
  const box = (x, y, w, h, col) => line([[x, y], [x + w, y + 1], [x + w - 1, y + h], [x + 1, y + h - 1], [x, y]], col);
  const arrow = (x1, y1, x2, y2, col = C.pencil) => (c, t, Rn) => {
    line([[x1, y1], [lerp(x1, x2, 0.5), lerp(y1, y2, 0.5) - 6], [x2, y2]], col)(c, Math.min(1, t * 1.3), Rn);
    if (t > 0.75){ const a = Math.atan2(y2 - y1, x2 - x1); line([[x2 - Math.cos(a - 0.5) * 18, y2 - Math.sin(a - 0.5) * 18], [x2, y2], [x2 - Math.cos(a + 0.5) * 18, y2 - Math.sin(a + 0.5) * 18]], col)(c, (t - 0.75) * 4, Rn); }
  };
  const word = (s, x, y, size, col = C.pen, rot = 0, align = 'left') => (c, t) => {
    c.save(); c.translate(x, y); c.rotate(rot); c.font = HAND(size); const w = c.measureText(s).width, x0 = align === 'center' ? -w / 2 : 0;
    c.beginPath(); c.rect(x0 - 4, -size, (w + 8) * t, size * 2); c.clip(); txt(c, s, x0, 0, HAND(size), col); c.restore();
  };
  const marker = (x, y, w, h, col) => (c, t) => { c.fillStyle = col; c.globalAlpha = 0.45; rr(c, x, y, w * t, h, 6); c.fill(); c.globalAlpha = 1; };
  const tick = (x, y, col = '#1F9D55') => line([[x, y], [x + 12, y + 14], [x + 34, y - 16]], col, 5);
  const LEFT = [
    marker(64, 66, 330, 34, '#FFE07A'), word('ecrã de clientes', 70, 80, 60), word('v2', 640, 86, 44, '#C2410C', -0.1),
    box(150, 150, 300, 560), line([[150, 220], [450, 220]]), word('Clientes', 176, 186, 36, C.pencil),
    box(176, 244, 248, 40), word('procurar…', 190, 264, 30, '#8A929A'),
    ...[0, 1, 2, 3].flatMap((k) => [line([[194, 322 + k * 82], [194 + 1, 322 + k * 82]], C.pencil, 30), line([[230, 312 + k * 82], [400, 312 + k * 82]]), line([[230, 336 + k * 82], [350, 336 + k * 82]], '#9AA2A8')]),
    box(196, 640, 208, 48, C.petrol), word('+ novo cliente', 300, 664, 32, C.petrol, 0, 'center'),
    arrow(560, 600, 420, 660, '#C2410C'), word('botão grande!', 470, 570, 40, '#C2410C', -0.08),
    word('o dono vê tudo', 470, 300, 36, C.pen, -0.05), word('num ecrã só', 476, 340, 36, C.pen, -0.05), arrow(520, 370, 440, 420),
    word('a equipa só', 60, 800, 38), word('o que precisa', 60, 842, 38), tick(320, 830),
  ];
  const RIGHT = [
    marker(60, 66, 300, 34, '#A7F0CF'), word('fluxo do pedido', 66, 80, 60),
    box(60, 200, 170, 90), word('pedido', 145, 246, 40, C.pen, 0, 'center'), arrow(240, 246, 300, 246),
    box(306, 200, 170, 90), word('stock', 391, 246, 40, C.pen, 0, 'center'), arrow(486, 246, 546, 246),
    box(552, 200, 160, 90), word('fatura', 632, 246, 40, C.pen, 0, 'center'),
    arrow(632, 300, 632, 400), word('email ao cliente', 470, 440, 38, C.pen, -0.03),
    tick(70, 560), word('à medida', 120, 560, 44), tick(70, 640), word('preço fechado', 120, 640, 44), tick(70, 720), word('sem licenças', 120, 720, 44),
    line([[440, 830], [700, 830]], C.pencil, 2.5), word('ok do cliente', 450, 800, 40, C.petrol, -0.06),
    (c, t) => { c.strokeStyle = C.petrol; c.lineWidth = 3.5; c.beginPath(); c.ellipse(560, 800, 140, 46, -0.06, 0, Math.PI * 2 * t); c.stroke(); },
  ];
  const draw = () => { page(L, 11, LEFT); page(R, 23, RIGHT); };
  draw();
  return addObj({ key: 'notebook', label: 'Caderno', stop: 3, root, pos: V3(-5.5, 0, 0.85), yaw: 0.16, liftH: 0.85, faceK: 0.5, R: [1.72, 1.62], draw,
    update(dt, t, e){ if (e > 0.5 && prog < 1){ prog = Math.min(1, prog + dt / 3.2); draw(); } } });
})();

// --- três post-its com as regras da casa
const POSTS = [
  { col: '#FFE07A', lines: ['À medida'], sub: 'nada de tamanho único', pos: V3(3.45, 0, 2.55), yaw: -0.12, doodle: 'ruler' },
  { col: '#A7F0CF', lines: ['Preço', 'fechado'], sub: 'sem licenças', pos: V3(4.38, 0, 2.75), yaw: 0.1, doodle: 'tag' },
  { col: '#F9C9E0', lines: ['Falas com', 'quem faz'], sub: '', pos: V3(5.32, 0, 2.5), yaw: -0.05, doodle: 'chat' },
].map((P, j) => {
  const K = mkCv(420, 420), c = K.c;
  const draw = () => {
    c.fillStyle = P.col; c.fillRect(0, 0, 420, 420);
    const g = c.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, 'rgba(0,0,0,.06)'); g.addColorStop(0.18, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,255,255,.12)'); c.fillStyle = g; c.fillRect(0, 0, 420, 420);
    P.lines.forEach((l, k) => txt(c, l, 210, 150 + k * 74 - (P.lines.length - 1) * 30, HAND(78), '#1E2B33', 'center'));
    if (P.sub) txt(c, P.sub, 210, 320, HAND(40, 500), 'rgba(30,43,51,.7)', 'center');
    c.strokeStyle = 'rgba(30,43,51,.75)'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round';
    if (P.doodle === 'chat'){ c.beginPath(); c.roundRect(150, 290, 120, 70, 20); c.stroke(); c.beginPath(); c.moveTo(180, 360); c.lineTo(168, 384); c.lineTo(204, 360); c.stroke(); }
    K.tex.needsUpdate = true;
  };
  draw();
  const geo = new THREE.PlaneGeometry(0.76, 0.76, 1, 12), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++){ const t = clamp((-p.getY(i) - 0.02) / 0.36); p.setZ(i, 0.075 * t * t); }
  geo.computeVertexNormals(); geo.rotateX(-Math.PI / 2);
  const root = new THREE.Group(); root.add(mesh(geo, new THREE.MeshStandardMaterial({ map: K.tex, roughness: 0.92, side: THREE.DoubleSide }), 0.003));
  return addObj({ key: 'post' + j, label: 'Post-its', stop: 4, root, pos: P.pos, yaw: P.yaw, liftH: 1.05 + j * 0.04, faceK: 0.78, delay: j * 0.22, draw });
});

// --- telemóvel com as avaliações do Google (as cinco são reais e todas de 5 estrelas)
const REVIEWS = [
  ['Tiago Pereira', 'Recomendo vivamente! Super profissional, disponível e honesto. Preço/qualidade fantástico. Super satisfeito! Muito obrigado pelo trabalho desenvolvido!', '#0E86A8'],
  ['max henrique', 'O Thiago me atendeu super bem e foi muito atencioso. Realizou tudo o que eu precisava para o meu site com eficiência e cuidado. Recomendo!', '#7C3AED'],
  ['Andreia Silva da Costa', 'Excelência. Competência e comprometimento. Descrevem minha experiência com a equipe da Senvia.', '#D97706'],
  ['Cristina Sousa', 'Excelente serviço. Disponibilidade, empenho, dedicação. Super recomendo!', '#1FAF5B'],
  ['João Basilio', 'Excelentes profissionais!', '#E11D48'],
];
const phone = (() => {
  const root = new THREE.Group(), W = 0.78, D = 1.6;
  root.add(mesh(slab(W, D, 0.075, 0.12, 0.014), new THREE.MeshPhysicalMaterial({ color: 0x23292D, metalness: 0.5, roughness: 0.35, clearcoat: 0.6 })));
  root.add(mesh(rrPlane(W - 0.03, D - 0.03, 0.105), new THREE.MeshStandardMaterial({ color: 0x07090B, roughness: 0.12, metalness: 0.3 }), 0.0775));
  const SW = 432, SH = 900, K = mkCv(SW, SH), LIST = mkCv(SW, 1500);
  const scrMat = new THREE.MeshBasicMaterial({ map: K.tex, toneMapped: false });
  const scr = mesh(rrPlane(0.71, 1.48, 0.085), scrMat, 0.08); scr.userData.noShadow = true; root.add(scr);
  let off = 0, offT = 0, hold = 0, listH = 0;
  const drawList = () => {
    const c = LIST.c; c.clearRect(0, 0, SW, 1500); let y = 0;
    REVIEWS.forEach(([n, t, col]) => {
      c.font = UI(500, 17); const lines = Math.min(5, Math.ceil(c.measureText(t).width / 340) + 1), h = 96 + lines * 24;
      fillRR(c, 16, y, SW - 32, h, 18, '#FFFFFF');
      c.beginPath(); c.arc(50, y + 38, 18, 0, Math.PI * 2); c.fillStyle = col; c.fill(); txt(c, n[0].toUpperCase(), 50, y + 39, UI(700, 17), '#FFFFFF', 'center');
      txt(c, n, 80, y + 30, UI(600, 17), C.ink, 'left', 300); stars(c, 80, y + 52, 7);
      wrap(c, t, 34, y + 90, SW - 72, 24, UI(500, 17), '#33454F', 5);
      y += h + 12;
    });
    listH = y;
  };
  const compose = () => {
    const c = K.c;
    c.fillStyle = '#EEF2F3'; c.fillRect(0, 0, SW, SH);
    c.save(); c.beginPath(); c.rect(0, 352, SW, SH - 352); c.clip(); c.drawImage(LIST.cv, 0, 364 - off); c.restore();
    c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, SW, 350);
    txt(c, '9:41', 40, 30, UI(600, 17), C.ink); fillRR(c, SW - 70, 22, 34, 16, 4, C.ink); fillRR(c, SW - 112, 22, 30, 16, 4, 'rgba(11,31,42,.25)');
    txt(c, 'Avaliações', SW / 2, 82, UI(700, 19), C.ink, 'center');
    fillRR(c, 26, 120, 64, 64, 16, C.navy); logoMark(c, 47, 152, 7.5, '#2BDBFF');
    txt(c, 'SENVIA Agency', 106, 140, UI(700, 21), C.ink); txt(c, 'Software house · Leiria', 106, 168, UI(500, 15), C.ink2);
    txt(c, '5,0', 26, 246, UI(800, 64), C.ink); stars(c, 136, 230, 11); txt(c, '5 avaliações no Google', 138, 262, UI(500, 15), C.ink2);
    txt(c, '5 ★', 26, 304, UI(600, 14), C.ink2); fillRR(c, 64, 299, SW - 130, 10, 5, C.amber); txt(c, '100%', SW - 26, 304, UI(600, 14), C.ink2, 'right');
    c.fillStyle = '#E3E8EA'; c.fillRect(0, 349, SW, 1.5);
    fillRR(c, SW / 2 - 64, SH - 16, 128, 5, 3, 'rgba(11,31,42,.35)');
    K.tex.needsUpdate = true;
  };
  const draw = () => { drawList(); compose(); };
  draw();
  return addObj({ key: 'phone', label: 'Telemóvel', stop: 5, root, pos: V3(5.55, 0, 0.35), yaw: -0.3, liftH: 1.35, faceK: 0.8, R: [0.92, 0.86], draw,
    update(dt, t, e){
      scrMat.color.setScalar(lerp(0.32, 1, e));
      if (e > 0.6){ hold += dt; if (hold > 2.3){ hold = 0; offT = offT + 190 > listH - (SH - 380) ? 0 : offT + 190; } } else { hold = 1.2; offT = 0; }
      const n = damp(off, offT, 4, dt); if (Math.abs(n - off) > 0.3){ off = n; compose(); }
    },
    poke(){ hold = 99; } });
})();

// --- cartão de visita: está virado para baixo e vira-se quando o levantas
const card = (() => {
  const root = new THREE.Group(), flip = new THREE.Group(), W = 0.9, D = 0.55; root.add(flip); flip.position.y = 0.006;
  flip.add(mesh(slab(W, D, 0.012, 0.03), new THREE.MeshStandardMaterial({ color: 0xF8F5EE, roughness: 0.8 }), -0.006));
  const F = mkCv(900, 550), B = mkCv(900, 550);
  const draw = () => {
    let c = F.c; c.fillStyle = '#FBF8F2'; c.fillRect(0, 0, 900, 550);
    logoMark(c, 84, 96, 17, C.petrol); txt(c, 'SENVIA', 134, 96, UI(800, 40), C.ink);
    txt(c, 'Thiago Sousa', 68, 232, UI(800, 64), C.ink); txt(c, 'FUNDADOR', 72, 290, MONO(24), C.ink2);
    c.fillStyle = C.petrol; c.fillRect(70, 344, 64, 4);
    txt(c, 'R. de Atenas 149', 70, 402, UI(600, 32), C.ink); txt(c, '2415-585 Leiria', 70, 446, UI(600, 32), C.ink);
    txt(c, 'senvia.pt', 832, 446, UI(800, 32), C.petrol, 'right');
    F.tex.needsUpdate = true;
    c = B.c; const g = c.createLinearGradient(0, 0, 900, 550); g.addColorStop(0, '#0E86A8'); g.addColorStop(1, '#00627E'); c.fillStyle = g; c.fillRect(0, 0, 900, 550);
    logoMark(c, 360, 262, 30, '#FFFFFF'); txt(c, 'SENVIA', 450, 262, UI(800, 52), '#FFFFFF');
    txt(c, 'SOFTWARE À MEDIDA · LEIRIA', 450, 470, MONO(18), 'rgba(255,255,255,.75)', 'center');
    B.tex.needsUpdate = true;
  };
  draw();
  flip.add(mesh(rrPlane(W, D, 0.03), new THREE.MeshStandardMaterial({ map: F.tex, roughness: 0.95 }), 0.0085));
  const back = mesh(rrPlane(W, D, 0.03).rotateX(Math.PI), new THREE.MeshStandardMaterial({ map: B.tex, roughness: 0.6 }), -0.0085);
  flip.add(back);
  return addObj({ key: 'card', label: 'Cartão', stop: 6, root, pos: V3(1.6, 0, 2.45), yaw: 0.12, liftH: 1.25, faceK: 0.82, R: [0.56, 0.54], draw,
    update(dt, t, e){ flip.rotation.x = Math.PI * (1 - smooth(clamp((e - 0.15) / 0.75))); } });
})();

// --- caneca de café com vapor (não é paragem, mas abana se lhe tocares)
const mug = (() => {
  const root = new THREE.Group();
  const prof = [[0, 0], [0.36, 0], [0.4, 0.015], [0.415, 0.06], [0.43, 0.86], [0.42, 0.9], [0.39, 0.9], [0.375, 0.86], [0.36, 0.1], [0, 0.09]].map(([x, y]) => new THREE.Vector2(x, y));
  const cer = new THREE.MeshPhysicalMaterial({ color: 0xF6F4EF, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.15 });
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 56), cer));
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.055, 14, 28, Math.PI), cer); h.rotation.z = -Math.PI / 2; h.position.set(0.41, 0.48, 0); root.add(h);
  const K = mkCv(512, 512);
  { const c = K.c, g = c.createRadialGradient(256, 256, 10, 256, 256, 256); g.addColorStop(0, '#5A3317'); g.addColorStop(0.75, '#4A2810'); g.addColorStop(0.9, '#A0703F'); g.addColorStop(1, '#6B4523'); c.fillStyle = g; c.fillRect(0, 0, 512, 512);
    // um coração de leite
    c.fillStyle = 'rgba(244,226,196,.92)'; c.beginPath(); c.moveTo(256, 360); c.bezierCurveTo(140, 290, 150, 170, 220, 170); c.bezierCurveTo(250, 170, 256, 196, 256, 210); c.bezierCurveTo(256, 196, 262, 170, 292, 170); c.bezierCurveTo(362, 170, 372, 290, 256, 360); c.fill();
    K.tex.needsUpdate = true; }
  const coffee = mesh(new THREE.CircleGeometry(0.37, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: K.tex, roughness: 0.25 }), 0.78); coffee.rotation.y = 0.5; root.add(coffee);
  const D = mkCv(512, 160);
  { const c = D.c; logoMark(c, 150, 80, 22, C.petrol); txt(c, 'SENVIA', 210, 82, UI(800, 52), C.ink); D.tex.needsUpdate = true; }
  const decal = new THREE.Mesh(new THREE.CylinderGeometry(0.4242, 0.4242, 0.17, 32, 1, true, -0.85, 1.7), new THREE.MeshStandardMaterial({ map: D.tex, transparent: true, roughness: 0.3 }));
  decal.position.y = 0.48; decal.userData.noShadow = true; root.add(decal);
  // vapor
  const SV = mkCv(128, 128); { const c = SV.c, g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); SV.tex.needsUpdate = true; }
  const puffs = [0, 1, 2, 3].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: SV.tex, transparent: true, depthWrite: false, opacity: 0 })); root.add(s); return s; });
  let burst = 0;
  return addObj({ key: 'mug', label: 'Café', root, pos: V3(5.05, 0, -2.55), yaw: -0.55, R: [0.6, 0.6],
    update(dt, t){
      burst = Math.max(0, burst - dt * 0.6);
      puffs.forEach((s, k) => { const ph = (t * (0.28 + burst * 0.3) + k / puffs.length) % 1; s.position.set(Math.sin(t * 1.1 + k * 2) * 0.12 * ph, 0.9 + ph * 1.5, Math.cos(t * 0.9 + k) * 0.08 * ph);
        s.scale.setScalar(0.35 + ph * 0.8); s.material.opacity = Math.sin(Math.PI * ph) * (0.28 + burst * 0.4); });
    },
    poke(){ burst = 1; } });
})();

// --- planta, lápis: decoração que também reage ao toque
const plant = (() => {
  const root = new THREE.Group();
  root.add(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.72, 40), new THREE.MeshStandardMaterial({ color: 0xEDEAE4, roughness: 0.55 })).translateY(0.36));
  root.add(mesh(new THREE.CircleGeometry(0.46, 32).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3B2A1E, roughness: 1 }), 0.68));
  const leafG = new THREE.SphereGeometry(1, 14, 10);
  [[6, 0.12, 0.95, 0.24, '#6FAF86'], [8, 0.26, 0.6, 0.34, '#5E9F78'], [10, 0.38, 0.3, 0.4, '#4F8E69']].forEach(([n, r, tilt, len, col], ring) => {
    const m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.55 });
    for (let k = 0; k < n; k++){
      const a = (k / n) * Math.PI * 2 + ring * 0.4, g = new THREE.Group();
      const leaf = new THREE.Mesh(leafG, m); leaf.scale.set(0.11, 0.045, len); leaf.position.z = len * 0.85; g.add(leaf);
      g.position.set(Math.sin(a) * r * 0.4, 0.74, Math.cos(a) * r * 0.4); g.rotation.set(0, a, 0); g.rotateX(-tilt); root.add(g);
    }
  });
  return addObj({ key: 'plant', label: 'Planta', root, pos: V3(-7.7, 0, -3.25), yaw: 0, R: [0.8, 0.8] });
})();
const pencil = (() => {
  const root = new THREE.Group(), g = new THREE.Group(); root.add(g); g.rotation.z = Math.PI / 2; g.position.y = 0.06;
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 6), new THREE.MeshStandardMaterial({ color: 0x0E86A8, roughness: 0.5 })));
  g.add(new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0xE6C9A0, roughness: 0.8 })).translateY(0.85));
  g.add(new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.07, 6), new THREE.MeshStandardMaterial({ color: 0x2A2F33, roughness: 0.6 })).translateY(0.925));
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0xB9C0C4, metalness: 0.8, roughness: 0.3 })).translateY(-0.8));
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0xF0A3B5, roughness: 0.7 })).translateY(-0.9));
  return addObj({ key: 'pencil', label: 'Lápis', root, pos: V3(-3.05, 0, 2.3), yaw: 0.55, R: [0.8, 0.8] });
})();

/* ================= paragens ================= */
const N = 7;
const STOPS = [
  { label: 'Olá', T: V3(0.3, 0, -0.3), R: [4.9, 3.6], ph: 54, yaw: 0, fit: 1.0 },
  { label: 'Polaroid', obj: polaroid, ph: 60, yaw: 0.12 },
  { label: 'Portátil', obj: laptop, ph: 26, yaw: -0.05 },
  { label: 'Caderno', obj: notebook, ph: 66, yaw: 0.08 },
  { label: 'Post-its', obj: POSTS[1], R: [1.45, 1.35], ph: 60, yaw: -0.1 },
  { label: 'Telemóvel', obj: phone, ph: 62, yaw: -0.1 },
  { label: 'Cartão', obj: card, ph: 66, yaw: 0.06 },
];
const UP = V3(0, 1, 0);
// onde fica o objeto quando está levantado (um pouco mais perto da câmara)
function liftPos(o, s, out = V3()){
  out.copy(o.pos); out.y += o.liftH;
  if (o.liftH) out.add(V3(Math.sin(s.yaw), 0, Math.cos(s.yaw)).multiplyScalar(0.25));
  return out;
}
const L = { W: innerWidth, H: innerHeight, mobile: MOBILE0 };
const notes = [...document.querySelectorAll('.note')];
const track = document.querySelector('.track');
function camPosFor(s, d = s.d){ const ph = rad(s.ph); return s.T.clone().add(V3(Math.sin(s.yaw) * Math.cos(ph), Math.sin(ph), Math.cos(s.yaw) * Math.cos(ph)).multiplyScalar(d)); }
function layout(){
  const W = innerWidth, H = innerHeight;
  L.W = W; L.H = H; L.mobile = W < 760;
  renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
  const top = L.mobile ? 104 : 80, bottom = L.mobile ? 0 : 74;
  STOPS.forEach((s, k) => {
    const note = notes[k], R = (s.R || s.obj.R)[L.mobile ? 1 : 0];
    let rw, rh, cx, cy;
    if (L.mobile){
      const nb = note.offsetTop + note.offsetHeight + 14, bot = H - 44;
      rw = W - 24; rh = Math.max(150, bot - nb); cx = W / 2; cy = (nb + bot) / 2;
    } else {
      const left = note.classList.contains('left'), a = left ? note.offsetLeft + note.offsetWidth + 24 : 24, b = left ? W - 24 : note.offsetLeft - 24;
      rw = Math.max(200, b - a); rh = H - top - bottom; cx = (a + b) / 2; cy = (top + H - bottom) / 2;
    }
    s.d = R * H / (TAN * (s.fit || 0.88) * Math.min(rw, rh));
    s.ox = -(cx - W / 2); s.oy = H / 2 - cy;
    if (s.obj){
      liftPos(s.obj, s, s.T || (s.T = V3()));
      if (s.obj.tOff) s.T.add(s.obj.tOff);
      if (s.obj === POSTS[1]) s.T.y = POSTS[1].pos.y + POSTS[1].liftH + 0.02;
    }
  });
  // orientação de cada objeto levantado: virado para a câmara da sua paragem
  OBJS.forEach((o) => {
    if (!o.faceK) return;
    const s = STOPS[o.stop], cp = camPosFor(s), lp = liftPos(o, s);
    const m = new THREE.Matrix4().lookAt(cp, s.T, UP), camUp = V3().setFromMatrixColumn(m, 1);
    const n = cp.clone().sub(lp).normalize();
    const z = camUp.clone().sub(n.clone().multiplyScalar(camUp.dot(n))).normalize().negate();
    const x = V3().crossVectors(n, z);
    o.qFace = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, n, z));
    o.lp = lp;
  });
}
layout();
let relayout = 0;
addEventListener('resize', () => { cancelAnimationFrame(relayout); relayout = requestAnimationFrame(layout); });

/* ================= cartões do portátil: escolhem o ecrã em vez de sair da página ================= */
const doorBtns = [...document.querySelectorAll('.door[data-scene]')], doorLink = document.getElementById('door-link');
const DOOR_LINKS = [['https://www.senvia.pt/softwares', 'Ver sistemas à medida'], ['https://www.senvia.pt/senvia-os', 'Ver o Senvia OS'], ['https://www.senvia.pt/sites', 'Ver sites e pacotes']];
function sceneChanged(k){
  doorBtns.forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.scene === k)));
  if (doorLink){ doorLink.href = DOOR_LINKS[k][0]; doorLink.textContent = DOOR_LINKS[k][1]; }
}
doorBtns.forEach((b) => b.addEventListener('click', () => laptop.choose(+b.dataset.scene)));

/* ================= paragens: botões ================= */
const stopsNav = document.getElementById('stops');
STOPS.forEach((s, k) => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = s.label; b.setAttribute('aria-label', `Ir para: ${s.label}`);
  b.addEventListener('click', () => go(k)); stopsNav.appendChild(b);
});
const stopBtns = [...stopsNav.children];
const lenis = REDUCE ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.85, touchMultiplier: 1.1 });
const trackLen = () => Math.max(1, track.offsetHeight - innerHeight);
function go(k){
  const y = track.offsetTop + (k / (N - 1)) * trackLen();
  if (lenis) lenis.scrollTo(y, { duration: 1.1 + 0.22 * Math.abs(k - state.p), easing: (t) => 1 - Math.pow(1 - t, 3) });
  else scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' });
}
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go(+a.dataset.go); }));

/* ================= rato e toque ================= */
const tip = document.getElementById('tip'), hint = document.getElementById('hint');
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pickList = OBJS.map((o) => o.root);
let hovered = null, mouse = { x: 0, y: 0, sx: 0, sy: 0 }, down = null;
function pick(cx, cy){
  ndc.set((cx / L.W) * 2 - 1, -(cy / L.H) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(pickList, true).find((h) => h.object.userData.obj);
  return hit ? hit.object.userData.obj : null;
}
addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / L.W) * 2 - 1; mouse.y = (e.clientY / L.H) * 2 - 1;
  if (e.pointerType !== 'mouse') return;
  const o = e.target === canvas ? pick(e.clientX, e.clientY) : null;
  hovered = o; canvas.style.cursor = o ? 'pointer' : '';
  if (o){ tip.textContent = o.label; tip.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; tip.classList.add('on'); }
  else tip.classList.remove('on');
}, { passive: true });
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return; down = null;
  const o = pick(e.clientX, e.clientY); if (!o) return;
  if (o.stop >= 0 && Math.round(state.p) !== o.stop) go(o.stop);
  else if (o.poke && o.stop >= 0) o.poke();
  else { o.wob = 1; o.poke?.(); }
});

/* ================= ciclo ================= */
const state = { p: 0, intro: REDUCE ? 1 : 0 };
const tmpT = V3(), tmpP = V3(), tmpQ = new THREE.Quaternion(), wobQ = new THREE.Quaternion();
let last = performance.now(), t = 0, worldHidden = false, navDark = false;
const vignette = document.querySelector('.sv2 .vignette');
notes.forEach((n) => { n._v = -1; [...n.children].forEach((c, i) => c.style.setProperty('--i', i)); });
function readP(){ return clamp((scrollY - track.offsetTop) / trackLen()) * (N - 1); }
function frame(now){
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
  const p = state.p = readP();
  state.intro = Math.min(1, state.intro + dt / 1.9);
  // câmara: entre duas paragens recua um pouco e volta a aproximar-se, como quem passa a mão por cima da mesa
  const i = Math.min(N - 2, Math.floor(p)), f = p - i, e = smoother(clamp((f - 0.14) / 0.72));
  const A = STOPS[i], B = STOPS[i + 1];
  tmpT.lerpVectors(A.T, B.T, e);
  const hump = A.T.distanceTo(B.T) * 0.32 * Math.sin(Math.PI * e);
  const ie = 1 - smooth(state.intro);
  const s = { T: tmpT, ph: lerp(A.ph, B.ph, e) + ie * 14, yaw: lerp(A.yaw, B.yaw, e) - ie * 0.12 };
  const d = (lerp(A.d, B.d, e) + hump) * (1 + ie * 0.35);
  camera.position.copy(camPosFor(s, d));
  mouse.sx = damp(mouse.sx, L.mobile ? 0 : mouse.x, 3, dt); mouse.sy = damp(mouse.sy, L.mobile ? 0 : mouse.y, 3, dt);
  camera.position.x += mouse.sx * d * 0.02; camera.position.z += mouse.sy * d * 0.015;
  camera.lookAt(tmpT);
  camera.setViewOffset(L.W, L.H, lerp(A.ox, B.ox, e), lerp(A.oy, B.oy, e), L.W, L.H);
  placeSun(p / (N - 1));
  // objetos: levantam-se ao chegar à sua paragem
  OBJS.forEach((o) => {
    let l = o.stop >= 0 ? smooth(clamp((0.62 - Math.abs(p - o.stop)) / 0.46)) : 0;
    if (o.delay) l = clamp(l * 1.45 - o.delay);
    o.lift = damp(o.lift, l, 6, dt);
    o.hov = damp(o.hov, hovered === o && o.lift < 0.4 ? 1 : 0, 9, dt);
    o.wob = Math.max(0, o.wob - dt * 1.4);
    const k = smooth(o.lift);
    tmpP.copy(o.pos);
    if (o.lp) tmpP.lerp(o.lp, k);
    tmpP.y += o.hov * 0.14 + Math.sin(t * 1.6 + o.pos.x) * 0.025 * k;
    o.root.position.copy(tmpP);
    if (o.qFace) o.root.quaternion.slerpQuaternions(o.q0, o.qFace, o.faceK * k); else o.root.quaternion.copy(o.q0);
    if (o.wob > 0){ wobQ.setFromAxisAngle(V3(0, 0, 1), Math.sin(o.wob * 22) * 0.06 * o.wob); o.root.quaternion.multiply(wobQ); }
    if (o.hov > 0.01 && !o.qFace){ tmpQ.setFromAxisAngle(V3(1, 0, 0), -0.04 * o.hov); o.root.quaternion.multiply(tmpQ); }
    o.update?.(dt, t, k);
  });
  // notas e botões
  const a = Math.round(p);
  notes.forEach((n, k) => {
    // cheia até 0,1 da paragem, desaparece até 0,42: entre duas paragens a câmara voa sem nota por cima
    const v = REDUCE ? (Math.abs(p - k) < 0.42 ? 1 : 0) : smooth(clamp((0.42 - Math.abs(p - k)) / 0.32)), dir = p < k ? 1 : -1;
    if (Math.abs(v - n._v) < 0.002 && dir === n._dir) return;
    n._v = v; n._dir = dir;
    n.style.setProperty('--v', v.toFixed(3)); n.style.setProperty('--dir', dir);
    n.classList.toggle('vis', v > 0.01); n.classList.toggle('full', v > 0.995); n.classList.toggle('on', v > 0.6);
  });
  stopBtns.forEach((b, k) => b.classList.toggle('on', k === a));
  hint.classList.toggle('off', p > 0.15);
  const tb = track.getBoundingClientRect().bottom, past = tb <= 0, overFooter = tb < 72;
  if (overFooter !== navDark){ navDark = overFooter; document.body.classList.toggle('night', overFooter); }
  if (past !== worldHidden){ worldHidden = past; canvas.style.visibility = vignette.style.visibility = past ? 'hidden' : ''; }
  if (past) return;
  renderer.render(scene, camera);
}
function loop(now){ lenis?.raf(now); frame(now); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
// o mundo 3D entra com fade depois do primeiro frame (o texto já está à vista)
requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('sv2').classList.add('ready3d')));
// letras dos canvas: redesenhar quando a Inter e a Caveat carregarem
Promise.all([UI(400, 16), UI(600, 16), UI(700, 16), UI(800, 16), HAND(40), HAND(40, 500), MONO(16)].map((f) => document.fonts.load(f))).then(() => {
  OBJS.forEach((o) => o.draw?.()); layout();
});
document.fonts.ready.then(layout);
