import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';

/* ================= conteúdo ================= */
const ROOT = document.getElementById('sv2');

// divide títulos em palavras para a animação (mantém <em>)
ROOT.querySelectorAll('.split').forEach((el) => {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3){
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = part; frag.appendChild(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
  };
  walk(el);
});

/* ================= utilidades ================= */
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
const damp = (dt, rate) => 1 - Math.exp(-dt * rate);
const backOut = (x) => x <= 0 ? 0 : 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
function rng(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = rng(1500);
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function stepTo(st, tg, k){ for (const key in tg) st[key] += (tg[key] - st[key]) * k; }

/* ================= renderer e cena ================= */
const canvas = document.getElementById('world');
// no telemóvel: sem antialias e no máximo 1.5x (ecrãs 3x pintavam 4x mais píxeis por frame)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: innerWidth >= 760, powerPreference: 'high-performance' });
let DPR = Math.min(devicePixelRatio, innerWidth < 760 ? 1.5 : 2);
renderer.setPixelRatio(DPR);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const BG = new THREE.Color('#EEF2F3');
scene.background = BG;
scene.fog = new THREE.Fog(BG, 14, 46);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.95;

const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 140);
scene.add(camera);
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.castShadow = true;
sun.shadow.mapSize.set(innerWidth < 760 ? 1024 : 2048, innerWidth < 760 ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
const hemi = new THREE.HemisphereLight(0xffffff, 0xbfd2da, 0.6); scene.add(hemi);

const FLOOR_Y = innerWidth < 760 ? -3.2 : -2.4;
const floorMat = new THREE.ShaderMaterial({
  uniforms: { uBg: { value: BG.clone() }, uDot: { value: new THREE.Color('#9FB4BE') }, uCam: { value: new THREE.Vector3() } },
  vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform vec3 uBg; uniform vec3 uDot; uniform vec3 uCam; varying vec3 vW;
    void main(){
      vec2 g = fract(vW.xz * 2.0) - 0.5; float d = length(g); float fw = fwidth(d) * 1.2;
      float dotA = 1.0 - smoothstep(0.045 - fw, 0.045 + fw, d);
      float dist = length(vW.xz - uCam.xz); float fade = 1.0 - smoothstep(5.0, 26.0, dist);
      gl_FragColor = vec4(mix(uBg, uDot, dotA * fade), 1.0);
      #include <colorspace_fragment>
    }`,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), floorMat);
floor.rotation.x = -Math.PI / 2; floor.position.set(0, FLOOR_Y, -40); scene.add(floor);
const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.ShadowMaterial({ color: 0x0B1F2A, opacity: 0.1 }));
shadowCatcher.rotation.x = -Math.PI / 2; shadowCatcher.position.set(0, FLOOR_Y + 0.002, -40); shadowCatcher.receiveShadow = true; scene.add(shadowCatcher);

const glowMat = new THREE.ShaderMaterial({
  uniforms: { uColor: { value: new THREE.Color('#7CC6DA') }, uA: { value: 0.5 } }, transparent: true, depthWrite: false, fog: false,
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform vec3 uColor; uniform float uA; varying vec2 vUv;
    void main(){ float d = length(vUv - 0.5) * 2.0; float a = uA * pow(1.0 - smoothstep(0.0, 1.0, d), 2.2); gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
    }`,
});
const glow = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), glowMat);
glow.position.set(14, 7, -60); glow.renderOrder = -1; camera.add(glow);

/* ================= desenho em canvas ================= */
const Q = innerWidth < 760 ? 0.6 : 1;
const PXU = 300;   // px de desenho por unidade 3D
const UI = (w, s) => `${w} ${s}px Inter, "Segoe UI", system-ui, sans-serif`;
const MONO = (w, s) => `${w} ${s}px "DM Mono", ui-monospace, Consolas, monospace`;
const C = { ink: '#0F172A', ink2: '#64748B', ink3: '#94A3B8', line: '#E2E8F0', soft: '#F1F5F9', bg: '#F8FAFC', petrol: '#0E86A8', deep: '#00708F', navy: '#0B1F2A', green: '#059669', red: '#DC2626', amber: '#D97706', wa: '#25D366' };
const ST = { g: [C.green, '#DCFCE7'], b: ['#1D4ED8', '#DBEAFE'], r: [C.red, '#FEE2E2'], a: [C.amber, '#FEF3C7'], n: ['#475569', '#E2E8F0'] };
const ICONS = {
  wa: { icon: 'wa', c: ['#4ADE80', '#16A34A'] }, mail: { icon: 'mail', c: ['#FDBA74', '#F97316'] }, bell: { icon: 'bell', c: ['#FCD34D', '#D97706'] },
  check: { icon: 'check', c: ['#6EE7B7', '#059669'] }, warn: { icon: 'box', c: ['#FCA5A5', '#DC2626'] }, swap: { icon: 'swap', c: ['#7DD3FC', '#0284C7'] },
  sheet: { icon: 'sheet', c: ['#4ADE80', '#15803D'] }, users: { icon: 'users', c: ['#67E8F9', '#0891B2'] }, bolt: { icon: 'bolt', c: ['#A5B4FC', '#4F46E5'] },
  chat: { icon: 'chat', c: ['#C4B5FD', '#7C3AED'] }, euro: { icon: 'euro', c: ['#6EE7B7', '#059669'] }, calendar: { icon: 'calendar', c: ['#FDA4AF', '#F43F5E'] },
};
function mkCv(w, h){ const cv = document.createElement('canvas'); cv.width = Math.round(w * Q); cv.height = Math.round(h * Q);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { cv, g: cv.getContext('2d'), tex, w, h }; }
function begin(K){ const g = K.g; g.setTransform(K.cv.width / K.w, 0, 0, K.cv.height / K.h, 0, 0); g.clearRect(0, 0, K.w, K.h); return g; }
function fillRR(g, x, y, w, h, r, col){ rr(g, x, y, w, h, r); g.fillStyle = col; g.fill(); }
function strokeRR(g, x, y, w, h, r, col, lw = 1.5){ rr(g, x, y, w, h, r); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); }
function fit(g, s, max){ if (g.measureText(s).width <= max) return s; while (s.length > 1 && g.measureText(s + '…').width > max) s = s.slice(0, -1); return s.trimEnd() + '…'; }
function txt(g, s, x, y, font, col, align = 'left', max = 0){ g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(max ? fit(g, s, max) : s, x, y); }
function pill(g, x, y, s, font, fg, bg, padX = 12, h = 30, align = 'left'){
  g.font = font; const w = g.measureText(s).width + padX * 2, X = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  fillRR(g, X, y - h / 2, w, h, h / 2, bg); txt(g, s, X + w / 2, y + 1, font, fg, 'center'); return w;
}
function tile(g, x, y, s, key){
  const M = ICONS[key], gr = g.createLinearGradient(x, y, x, y + s); gr.addColorStop(0, M.c[0]); gr.addColorStop(1, M.c[1]);
  rr(g, x, y, s, s, s * 0.3); g.fillStyle = gr; g.fill(); glyph(g, M.icon, x + s / 2, y + s / 2, s * 0.6, '#FFFFFF', 20);
}
function avatar(g, cx, cy, r, ini, col){ g.fillStyle = col; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); txt(g, ini, cx, cy + 1, UI(600, r * 0.74), '#FFFFFF', 'center'); }
function panel(g, x, y, w, h, title, sub){ fillRR(g, x, y, w, h, 18, '#FFFFFF'); strokeRR(g, x, y, w, h, 18, C.line); txt(g, title, x + 22, y + 34, UI(600, 18), C.ink); if (sub) txt(g, sub, x + w - 22, y + 34, UI(500, 14), C.ink2, 'right'); }
function glyph(g, name, cx, cy, size, col = '#FFFFFF', lw = 18){
  g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(size / 256, size / 256);
  g.strokeStyle = g.fillStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  const P = (pts, close = false) => { g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); g.stroke(); };
  const R = (x, y, w, h, r) => { rr(g, x, y, w, h, r); g.stroke(); };
  const O = (x, y, r, fill = false) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); fill ? g.fill() : g.stroke(); };
  const A = (x, y, r, a, b) => { g.beginPath(); g.arc(x, y, r, a, b); g.stroke(); };
  switch (name){
    case 'grid': R(48, 48, 70, 70, 18); R(138, 48, 70, 70, 18); R(48, 138, 70, 70, 18); R(138, 138, 70, 70, 18); break;
    case 'users': O(102, 98, 32); A(102, 214, 62, Math.PI * 1.12, Math.PI * 1.88); O(172, 110, 24); A(180, 204, 44, Math.PI * 1.2, Math.PI * 1.8); break;
    case 'doc': P([[68, 40], [156, 40], [192, 76], [192, 216], [68, 216]], true); P([[156, 40], [156, 76], [192, 76]]); P([[98, 122], [162, 122]]); P([[98, 158], [162, 158]]); break;
    case 'calendar': R(50, 66, 156, 144, 24); P([[50, 112], [206, 112]]); P([[94, 46], [94, 84]]); P([[162, 46], [162, 84]]); break;
    case 'euro': A(144, 128, 72, Math.PI * 0.28, Math.PI * 1.72); P([[50, 108], [146, 108]]); P([[50, 148], [140, 148]]); break;
    case 'chat': R(44, 56, 168, 118, 34); P([[86, 172], [70, 212], [124, 174]]); break;
    case 'mail': R(44, 66, 168, 124, 20); P([[52, 78], [128, 136], [204, 78]]); break;
    case 'wa': A(128, 122, 80, Math.PI * 0.72, Math.PI * 2.62); P([[80, 180], [62, 214], [102, 202]]); break;
    case 'check': P([[58, 132], [106, 180], [198, 84]]); break;
    case 'bolt': P([[142, 36], [74, 142], [126, 142], [112, 220], [186, 108], [132, 108]], true); break;
    case 'sheet': R(48, 54, 160, 148, 20); P([[48, 102], [208, 102]]); P([[48, 150], [208, 150]]); P([[102, 54], [102, 202]]); P([[156, 54], [156, 202]]); break;
    case 'car': R(32, 120, 192, 60, 20); P([[62, 120], [88, 80], [168, 80], [194, 120]]); O(78, 186, 18); O(178, 186, 18); break;
    case 'swap': P([[52, 96], [196, 96]]); P([[160, 62], [196, 96], [160, 130]]); P([[204, 166], [60, 166]]); P([[96, 132], [60, 166], [96, 200]]); break;
    case 'tool': A(176, 80, 42, Math.PI * 0.25, Math.PI * 1.75); P([[146, 110], [62, 194]]); break;
    case 'box': P([[128, 46], [204, 84], [204, 172], [128, 210], [52, 172], [52, 84]], true); P([[52, 84], [128, 122], [204, 84]]); P([[128, 122], [128, 210]]); break;
    case 'table': R(40, 90, 176, 42, 12); P([[70, 132], [70, 206]]); P([[186, 132], [186, 206]]); break;
    case 'list': [84, 128, 172].forEach((y) => { O(66, y, 11, true); P([[100, y], [200, y]]); }); break;
    case 'search': O(110, 110, 60); P([[154, 154], [208, 208]]); break;
    case 'bell': g.beginPath(); g.moveTo(60, 180); g.quadraticCurveTo(84, 158, 84, 118); g.quadraticCurveTo(84, 62, 128, 62); g.quadraticCurveTo(172, 62, 172, 118); g.quadraticCurveTo(172, 158, 196, 180); g.closePath(); g.stroke(); P([[110, 210], [146, 210]]); break;
  }
  g.restore();
}
function iconTex(name){ const c = document.createElement('canvas'); c.width = c.height = 256; glyph(c.getContext('2d'), name, 128, 128, 200, '#FFFFFF', 16);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function slabGeo(w, h, d, r){
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 10 });
  geo.translate(0, 0, -d / 2); return geo;
}
// cartão 3D: placa arredondada com a face desenhada num canvas
function makeCard(parent, w, h, color, draw, r = 0.1){
  const cv = mkCv(Math.round(w * PXU), Math.round(h * PXU));
  const g = new THREE.Group(); parent.add(g);
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2, transparent: true });
  const slab = new THREE.Mesh(slabGeo(w, h, 0.05, Math.min(r, h / 2 - 0.01)), m); slab.castShadow = true; g.add(slab);
  const fm = new THREE.MeshBasicMaterial({ map: cv.tex, transparent: true, toneMapped: false });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, h), fm); f.position.z = 0.037; g.add(f);
  const K = { g, slab, mats: [m, fm], cv, w, h, rpx: Math.min(r, h / 2 - 0.01) * PXU };
  K.redraw = (...a) => { const c = begin(cv); draw(c, cv.w, cv.h, K.rpx, ...a); cv.tex.needsUpdate = true; };
  K.redraw(); g.visible = false;
  return K;
}
const setOp = (K, op) => { K.mats.forEach((m) => { m.opacity = op; }); K.g.visible = op > 0.01; K.slab.castShadow = op > 0.6; };

/* ================= os sistemas (dados fictícios) ================= */
const BW = 1500, BH = 960;
const SIDE = [0, 0, 250, BH], TOPB = [250, 0, BW - 250, 84];
function carShape(g, cx, cy, w, col){
  const s = w / 200; g.save(); g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = col; g.beginPath(); g.moveTo(-96, 18); g.quadraticCurveTo(-100, -6, -78, -12); g.lineTo(-46, -16); g.quadraticCurveTo(-24, -44, 10, -44); g.quadraticCurveTo(44, -44, 62, -16); g.lineTo(84, -10); g.quadraticCurveTo(100, -6, 98, 18); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.78)'; g.beginPath(); g.moveTo(-36, -16); g.quadraticCurveTo(-18, -36, 6, -36); g.lineTo(6, -16); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(14, -36); g.quadraticCurveTo(40, -36, 52, -16); g.lineTo(14, -16); g.closePath(); g.fill();
  [-56, 56].forEach((x) => { g.fillStyle = '#1F2937'; g.beginPath(); g.arc(x, 18, 17, 0, 7); g.fill(); g.fillStyle = '#CBD5E1'; g.beginPath(); g.arc(x, 18, 7, 0, 7); g.fill(); });
  g.restore();
}
function sideDraw(name, ini, menu){ return (g, x, y, w, h) => {
  g.fillStyle = C.navy; g.fillRect(x, y, w, h);
  fillRR(g, 24, 28, 46, 46, 13, C.petrol); txt(g, ini, 47, 52, UI(800, 22), '#FFFFFF', 'center');
  txt(g, name, 84, 44, UI(700, 18), '#FFFFFF', 'left', w - 96); txt(g, 'Sistema à medida', 84, 66, UI(500, 12), '#7FA3B3');
  menu.forEach(([l, ic], k) => { const yy = 132 + k * 58;
    if (!k){ fillRR(g, 14, yy - 22, w - 28, 44, 12, 'rgba(255,255,255,.08)'); fillRR(g, 14, yy - 14, 4, 28, 2, '#2BDBFF'); }
    glyph(g, ic, 44, yy, 24, k ? '#9FB8C4' : '#FFFFFF', 20); txt(g, l, 70, yy + 1, UI(k ? 500 : 700, 16), k ? '#C9DBE3' : '#FFFFFF'); });
}; }
function topDraw(g, x, y, w, h){
  g.fillStyle = '#FFFFFF'; g.fillRect(x, y, w, h); g.fillStyle = C.line; g.fillRect(x, y + h - 1.5, w, 1.5);
  fillRR(g, x + 28, 20, 420, 44, 22, C.soft); glyph(g, 'search', x + 54, 42, 20, C.ink2, 22); txt(g, 'Procurar…', x + 76, 43, UI(400, 15), C.ink3);
  txt(g, 'Quinta, 11 de março', x + w - 90, 43, UI(500, 14), C.ink2, 'right'); avatar(g, x + w - 48, 42, 20, 'MS', '#8B5CF6');
}
function kpiCard(g, x, y, w, h, l, v, d){ fillRR(g, x, y, w, h, 16, '#FFFFFF'); strokeRR(g, x, y, w, h, 16, C.line); txt(g, l, x + 18, y + 30, UI(500, 14), C.ink2, 'left', w - 36); txt(g, v, x + 18, y + 72, UI(700, 28), C.ink); txt(g, d, x + 18, y + 104, UI(500, 12), C.green, 'left', w - 36); }
const SCR = {
  geral: { name: 'Lumen Interiores', dims: ['8 pessoas na equipa', '120 clientes'], parts: [
    { r: SIDE, label: 'Menu', draw: sideDraw('Lumen Interiores', 'L', [['Painel', 'grid'], ['Clientes', 'users'], ['Orçamentos', 'doc'], ['Obras', 'tool'], ['Agenda', 'calendar'], ['Faturas', 'euro'], ['Equipa', 'users']]) },
    { r: TOPB, label: 'Pesquisa e conta', draw: topDraw },
    { r: [280, 110, 1190, 130], label: 'Indicadores', draw(g, x, y, w, h){ const kw = (w - 36) / 4;
      [['Orçamentos abertos', '12', '4 a aguardar resposta'], ['Obras em curso', '5', '2 terminam esta semana'], ['Faturado este mês', '18.400 €', '+12% que fevereiro'], ['Por receber', '3.250 €', '3 faturas']].forEach(([l, v, d], k) => kpiCard(g, x + k * (kw + 12), y, kw, h, l, v, d)); } },
    { r: [280, 268, 580, 662], label: 'Agenda da equipa', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Agenda da equipa', 'Hoje');
      [['09:00', 'Visita: cozinha Rua do Sol', 'RC', '#2563EB'], ['10:30', 'Medições: casa de banho', 'ID', '#DB2777'], ['12:00', 'Entrega de material', 'PL', '#0D9488'], ['14:30', 'Reunião com a Clínica Aurora', 'MS', '#8B5CF6'], ['16:00', 'Orçamento: escritório Leiria', 'RC', '#2563EB'], ['17:30', 'Fecho da obra Av. Marquês', 'PL', '#0D9488']].forEach(([hh, s, a, col], k) => {
        const yy = y + 84 + k * 92; fillRR(g, x + 20, yy, w - 40, 78, 14, C.bg); pill(g, x + 36, yy + 39, hh, UI(700, 14), C.deep, '#E0F2F7', 12, 30);
        txt(g, s, x + 120, yy + 39, UI(500, 16), C.ink, 'left', w - 210); avatar(g, x + w - 52, yy + 39, 17, a, col); }); } },
    { r: [888, 268, 582, 392], label: 'Obras em curso', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Obras em curso', '5');
      [['Cozinha · Rua do Sol', 0.72], ['Casa de banho · Marinha Grande', 0.45], ['Escritório · Leiria', 0.2], ['Loja · Pombal', 0.9]].forEach(([s, v], k) => {
        const yy = y + 86 + k * 74; txt(g, s, x + 22, yy, UI(500, 15), C.ink, 'left', w - 120); txt(g, Math.round(v * 100) + '%', x + w - 22, yy, UI(700, 15), C.ink, 'right');
        fillRR(g, x + 22, yy + 18, w - 44, 10, 5, C.soft); fillRR(g, x + 22, yy + 18, (w - 44) * v, 10, 5, v > 0.85 ? C.green : C.petrol); }); } },
    { r: [888, 688, 582, 242], label: 'Avisos automáticos', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Avisos automáticos');
      [['wa', 'Lembrete enviado a Rita Fonseca'], ['mail', 'Fatura FT 2027/42 enviada'], ['bell', 'Tarefa criada: encomendar azulejos']].forEach(([ic, s], k) => {
        const yy = y + 64 + k * 56; tile(g, x + 22, yy, 38, ic); txt(g, s, x + 74, yy + 20, UI(500, 15), C.ink, 'left', w - 96); }); } },
  ] },
  stand: { name: 'Auto Lis', dims: ['3 stands', '214 viaturas'], parts: [
    { r: SIDE, label: 'Menu', draw: sideDraw('Auto Lis', 'A', [['Painel', 'grid'], ['Viaturas', 'car'], ['Vendas', 'euro'], ['Transferências', 'swap'], ['Clientes', 'users'], ['Oficina', 'tool']]) },
    { r: TOPB, label: 'Pesquisa e conta', draw: topDraw },
    { r: [280, 110, 1190, 64], label: 'Filtros por stand', draw(g, x, y, w, h){ let px = x;
      [['Todos', '214'], ['Leiria', '96'], ['Marinha Grande', '61'], ['Pombal', '57']].forEach(([s, n], k) => { const ww = pill(g, px, y + h / 2, `${s}  ${n}`, UI(600, 15), k ? C.ink : '#FFFFFF', k ? '#FFFFFF' : C.navy, 18, 44); if (k) strokeRR(g, px, y + h / 2 - 22, ww, 44, 22, C.line); px += ww + 10; }); } },
    { r: [280, 200, 800, 730], label: 'Stock de viaturas', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Viaturas', '214 em stock');
      const CARS = [['Peugeot 208 1.2', '2021 · 38.000 km', '15.900 €', 'Leiria', '#E11D48'], ['BMW 320d', '2019 · 92.000 km', '24.500 €', 'Leiria', '#1E3A8A'], ['Renault Clio', '2022 · 21.000 km', '16.400 €', 'Pombal', '#F59E0B'],
        ['VW Golf 1.6 TDI', '2018 · 110.000 km', '15.200 €', 'Marinha', '#64748B'], ['Mercedes A180', '2020 · 54.000 km', '26.900 €', 'Pombal', '#111827'], ['Toyota Yaris', '2021 · 33.000 km', '18.700 €', 'Leiria', '#0E86A8']];
      const cw = (w - 64) / 3, ch = (h - 96) / 2;
      CARS.forEach(([m, k2, p, s, col], k) => { const cx = x + 20 + (k % 3) * (cw + 12), cy = y + 70 + Math.floor(k / 3) * (ch + 12);
        fillRR(g, cx, cy, cw, ch, 14, C.bg); strokeRR(g, cx, cy, cw, ch, 14, C.line); fillRR(g, cx + 10, cy + 10, cw - 20, ch * 0.42, 10, '#E8F1F5');
        carShape(g, cx + cw / 2, cy + 10 + ch * 0.24, cw * 0.66, col);
        txt(g, m, cx + 16, cy + ch * 0.42 + 40, UI(600, 16), C.ink, 'left', cw - 32); txt(g, k2, cx + 16, cy + ch * 0.42 + 66, UI(400, 13), C.ink2, 'left', cw - 32);
        txt(g, p, cx + 16, cy + ch - 34, UI(700, 18), C.ink); pill(g, cx + cw - 14, cy + ch - 34, s, UI(600, 11), C.deep, '#E0F2F7', 9, 24, 'right');
        const est = ['Disponível', 'Disponível', 'Reservada', 'Em trânsito', 'Disponível', 'Disponível'][k], ek = est === 'Reservada' ? 'a' : est === 'Em trânsito' ? 'b' : 'g';
        pill(g, cx + cw - 18, cy + 30, est, UI(600, 11), ST[ek][0], ST[ek][1], 9, 24, 'right'); }); } },
    { r: [1108, 200, 362, 350], label: 'Transferências', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Transferências');
      [['BMW 320d', 'Leiria → Pombal', 'Hoje', 'a'], ['Renault Clio', 'Pombal → Leiria', 'Amanhã', 'b'], ['VW Golf', 'Marinha → Leiria', 'Feita', 'g']].forEach(([m, r, d, s], k) => {
        const yy = y + 70 + k * 90; fillRR(g, x + 16, yy, w - 32, 78, 12, C.bg); glyph(g, 'swap', x + 42, yy + 39, 26, C.petrol, 20);
        txt(g, m, x + 66, yy + 28, UI(600, 15), C.ink, 'left', w - 170); txt(g, r, x + 66, yy + 52, UI(400, 13), C.ink2, 'left', w - 170); pill(g, x + w - 26, yy + 39, d, UI(600, 12), ST[s][0], ST[s][1], 10, 26, 'right'); }); } },
    { r: [1108, 578, 362, 352], label: 'Vendas do mês', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Vendas do mês');
      txt(g, '23', x + 22, y + 104, UI(700, 52), C.ink); txt(g, 'viaturas vendidas', x + 96, y + 108, UI(500, 14), C.ink2);
      [['Leiria', 11], ['Marinha Grande', 5], ['Pombal', 7]].forEach(([s, v], k) => { const yy = y + 168 + k * 58; txt(g, s, x + 22, yy, UI(500, 14), C.ink); txt(g, String(v), x + w - 22, yy, UI(700, 14), C.ink, 'right');
        fillRR(g, x + 22, yy + 16, w - 44, 10, 5, C.soft); fillRR(g, x + 22, yy + 16, (w - 44) * v / 11, 10, 5, C.petrol); }); } },
  ] },
  oficina: { name: 'Oficina Matos', dims: ['4 mecânicos', '38 viaturas por semana'], parts: [
    { r: SIDE, label: 'Menu', draw: sideDraw('Oficina Matos', 'M', [['Painel', 'grid'], ['Viaturas', 'car'], ['Orçamentos', 'doc'], ['Reparações', 'tool'], ['Clientes', 'users'], ['Peças', 'box']]) },
    { r: TOPB, label: 'Pesquisa e conta', draw: topDraw },
    { r: [280, 110, 1190, 540], label: 'Viaturas na oficina', draw(g, x, y, w, h){
      const COLS = [['Diagnóstico', '#F59E0B', [['45-RT-12', 'Peugeot 308', 'Ruído na travagem', 'HM'], ['AC-91-PL', 'Renault Megane', 'Luz do motor acesa', 'JS']]],
        ['Em reparação', '#3B82F6', [['12-AB-34', 'VW Golf', 'Embraiagem', 'HM'], ['27-FZ-08', 'Fiat 500', 'Revisão completa', 'PB'], ['BD-44-TR', 'Opel Corsa', 'Pneus e alinhamento', 'JS']]],
        ['Pronta', '#10B981', [['83-QL-56', 'Seat Ibiza', 'Revisão feita', 'PB'], ['AF-07-MG', 'Ford Focus', 'Travões novos', 'HM']]]];
      const cw = (w - 24) / 3;
      COLS.forEach(([n, col, cards], j) => { const cx = x + j * (cw + 12); fillRR(g, cx, y, cw, h, 16, C.soft);
        g.fillStyle = col; g.beginPath(); g.arc(cx + 22, y + 30, 6, 0, 7); g.fill(); txt(g, n, cx + 38, y + 31, UI(600, 16), C.ink); pill(g, cx + cw - 14, y + 31, String(cards.length), UI(600, 12), C.ink2, '#E2E8F0', 9, 24, 'right');
        cards.forEach(([pl, m, task, mec], k) => { const yy = y + 60 + k * 156; fillRR(g, cx + 12, yy, cw - 24, 142, 14, '#FFFFFF'); strokeRR(g, cx + 12, yy, cw - 24, 142, 14, C.line);
          fillRR(g, cx + 28, yy + 16, 128, 34, 6, '#FFFFFF'); strokeRR(g, cx + 28, yy + 16, 128, 34, 6, '#0F172A', 2); fillRR(g, cx + 28, yy + 16, 18, 34, 4, '#1D4ED8'); txt(g, pl, cx + 100, yy + 34, MONO(500, 15), C.ink, 'center');
          txt(g, m, cx + 28, yy + 74, UI(600, 16), C.ink, 'left', cw - 60); txt(g, task, cx + 28, yy + 100, UI(400, 14), C.ink2, 'left', cw - 90);
          avatar(g, cx + cw - 44, yy + 112, 16, mec, mec === 'HM' ? '#2563EB' : mec === 'JS' ? '#DB2777' : '#0D9488'); }); }); } },
    { r: [280, 678, 580, 252], label: 'Orçamento', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Orçamento 0318 · Peugeot 308');
      [['Pastilhas de travão', '64,00 €'], ['Discos (par)', '98,00 €'], ['Mão de obra (1,5 h)', '72,00 €']].forEach(([s, v], k) => { const yy = y + 76 + k * 36; txt(g, s, x + 22, yy, UI(400, 15), C.ink); txt(g, v, x + w - 22, yy, UI(500, 15), C.ink, 'right'); });
      g.fillStyle = C.line; g.fillRect(x + 22, y + 178, w - 44, 1.5); txt(g, 'Total com IVA', x + 22, y + 210, UI(600, 16), C.ink); txt(g, '287,82 €', x + w - 22, y + 210, UI(700, 20), C.ink, 'right'); } },
    { r: [888, 678, 582, 252], label: 'Avisos ao cliente', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Avisos ao cliente');
      fillRR(g, x + 22, y + 62, w - 44, 96, 16, '#D9FDD3'); tile(g, x + 38, y + 82, 40, 'wa');
      txt(g, 'O seu Golf está pronto. Pode levantar', x + 94, y + 96, UI(500, 15), C.ink, 'left', w - 132); txt(g, 'a partir das 17h. Oficina Matos', x + 94, y + 122, UI(500, 15), C.ink, 'left', w - 132);
      txt(g, 'Enviado automaticamente · 16:42', x + 22, y + 198, UI(500, 13), C.ink2); pill(g, x + w - 22, y + 198, 'Lido', UI(600, 12), C.green, '#DCFCE7', 10, 26, 'right'); } },
  ] },
  rest: { name: 'Tasca do Largo', dims: ['12 mesas', '6 pessoas por turno'], parts: [
    { r: SIDE, label: 'Menu', draw: sideDraw('Tasca do Largo', 'T', [['Painel', 'grid'], ['Mesas', 'table'], ['Pedidos', 'list'], ['Stock', 'box'], ['Equipa', 'users'], ['Fornecedores', 'doc']]) },
    { r: TOPB, label: 'Pesquisa e conta', draw: topDraw },
    { r: [280, 110, 700, 530], label: 'Mesas', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Mesas', 'Leiria · Lisboa · Porto');
      const S = ['o', 'l', 'p', 'o', 'l', 'o', 'o', 'l', 'p', 'o', 'l', 'o'], T = ['38,50 €', '', 'A pagar', '64,00 €', '', '22,80 €', '51,20 €', '', 'A pagar', '17,40 €', '', '29,90 €'];
      const tw = (w - 44 - 36) / 4, th = (h - 90 - 24) / 3;
      S.forEach((s, k) => { const tx = x + 22 + (k % 4) * (tw + 12), ty = y + 70 + Math.floor(k / 4) * (th + 12), col = s === 'l' ? ['#047857', '#ECFDF5'] : s === 'p' ? ['#B91C1C', '#FEF2F2'] : ['#B45309', '#FFFBEB'];
        fillRR(g, tx, ty, tw, th, 14, col[1]); strokeRR(g, tx, ty, tw, th, 14, col[0] + '33', 1.5);
        txt(g, `Mesa ${k + 1}`, tx + 16, ty + 28, UI(700, 16), C.ink); txt(g, s === 'l' ? 'Livre' : T[k], tx + 16, ty + th - 24, UI(600, 14), col[0]); }); } },
    { r: [1008, 110, 462, 530], label: 'Pedidos para a cozinha', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Pedidos para a cozinha');
      [['Mesa 4', '2 Bacalhau à Brás', 'há 3 min', 'Pronto', 'g'], ['Mesa 7', '1 Polvo à lagareiro', 'há 6 min', 'A fazer', 'a'], ['Mesa 2', '3 Bitoque', 'há 9 min', 'A fazer', 'a'], ['Esplanada', '2 Sopa do dia', 'há 12 min', 'Entregue', 'n']].forEach(([m, p, t, s, k2], k) => {
        const yy = y + 66 + k * 112; fillRR(g, x + 16, yy, w - 32, 98, 14, C.bg);
        txt(g, m, x + 34, yy + 28, UI(700, 15), C.ink); txt(g, t, x + w - 34, yy + 28, UI(400, 13), C.ink3, 'right');
        txt(g, p, x + 34, yy + 64, UI(500, 16), C.ink, 'left', w - 170); pill(g, x + w - 34, yy + 64, s, UI(600, 12), ST[k2][0], ST[k2][1], 10, 26, 'right'); }); } },
    { r: [280, 668, 700, 262], label: 'Stock crítico', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Stock crítico', 'abaixo do mínimo');
      [['Vinho da casa', 0.08, C.red], ['Bacalhau', 0.55, C.petrol], ['Natas', 0.28, C.amber], ['Batata', 0.72, C.petrol]].forEach(([s, v, col], k) => {
        const yy = y + 72 + k * 46; txt(g, s, x + 22, yy, UI(500, 15), C.ink); fillRR(g, x + 190, yy - 6, w - 300, 12, 6, C.soft); fillRR(g, x + 190, yy - 6, (w - 300) * v, 12, 6, col);
        txt(g, Math.round(v * 50) + ' un.', x + w - 22, yy, UI(600, 14), col === C.petrol ? C.ink : col, 'right'); }); } },
    { r: [1008, 668, 462, 262], label: 'Equipa hoje', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Equipa hoje');
      [['Ana', 'Sala', '10h às 16h', '#DB2777'], ['Luís', 'Cozinha', '10h às 16h', '#2563EB'], ['Rita', 'Sala', '16h às 23h', '#0D9488'], ['Paulo', 'Cozinha', '16h às 23h', '#8B5CF6']].forEach(([n, f, hh, col], k) => {
        const yy = y + 72 + k * 46; avatar(g, x + 38, yy, 16, n[0], col); txt(g, n, x + 64, yy, UI(600, 15), C.ink); txt(g, f, x + 160, yy, UI(400, 14), C.ink2); txt(g, hh, x + w - 22, yy, UI(500, 14), C.ink, 'right'); }); } },
  ] },
};

// os sistemas já feitos: o Orbis (restauração) e a Perfect2Gether (comercial), sempre com dados fictícios
SCR.orbis = { name: 'Orbis', dims: ['Leiria · Lisboa · Porto', '12 mesas por unidade'], parts: [
  { r: SIDE, label: 'Menu', draw: sideDraw('Orbis', 'O', [['Dashboard', 'grid'], ['Atendimento', 'table'], ['Reservas', 'calendar'], ['Caixa', 'euro'], ['Menu', 'list'], ['Stock e insumos', 'box']]) },
  ...SCR.rest.parts.slice(1),
] };
SCR.p2g = { name: 'Perfect2Gether', dims: ['Energia e serviços', '48 propostas'], parts: [
  { r: SIDE, label: 'Menu', draw: sideDraw('Perfect2Gether', 'P', [['Painel', 'grid'], ['Mensagens', 'chat'], ['Leads', 'users'], ['Propostas', 'doc'], ['Vendas', 'euro'], ['Financeiro', 'euro'], ['Recursos Humanos', 'users']]) },
  { r: TOPB, label: 'Pesquisa e conta', draw: topDraw },
  { r: [280, 110, 1190, 130], label: 'Indicadores', draw(g, x, y, w, h){ const kw = (w - 36) / 4;
    [['Total de propostas', '48', '31 energia · 17 serviços'], ['Comissão total', '18.940 €', '+8% que fevereiro'], ['Em negociação', '12.300 €', '9 propostas'], ['Aceites', '15', '6 convertidas em venda']].forEach(([l, v, d], k) => kpiCard(g, x + k * (kw + 12), y, kw, h, l, v, d)); } },
  { r: [280, 268, 780, 662], label: 'Propostas', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Propostas', 'Este mês');
    [['Em negociação', 'a', 'Energia', '0048', 'Transportes Atlântico, Lda', '1.240 €'], ['Aceite', 'g', 'Energia', '0047', 'Padaria Sol', '186 €'], ['Convertida em venda', 'b', 'Serviços', '0046', 'Ferragens Leiria', '420 €'], ['Em negociação', 'a', 'Serviços', '0045', 'Clínica Aurora', '310 €'], ['Aceite', 'g', 'Energia', '0044', 'Hotel Atlântico', '2.050 €']].forEach(([st, sk, tp, code, cl, v], k) => {
      const yy = y + 70 + k * 116; fillRR(g, x + 18, yy, w - 36, 102, 14, C.bg);
      let px = x + 36 + pill(g, x + 36, yy + 28, st, UI(600, 12), ST[sk][0], ST[sk][1], 10, 26) + 8;
      px += pill(g, px, yy + 28, tp, UI(600, 12), '#6D28D9', '#EDE9FE', 10, 26) + 10; txt(g, code + ' · 11 mar', px, yy + 29, MONO(500, 13), C.ink2);
      txt(g, cl, x + 36, yy + 70, UI(600, 17), C.ink, 'left', w - 220); txt(g, v, x + w - 36, yy + 52, UI(700, 19), '#4338CA', 'right'); }); } },
  { r: [1088, 268, 382, 662], label: 'Recursos humanos', draw(g, x, y, w, h){ panel(g, x, y, w, h, 'Recursos Humanos');
    [['calendar', 'Ponto', '#3B82F6'], ['calendar', 'Ausências', '#8B5CF6'], ['users', 'Colaboradores', '#10B981'], ['chat', 'Avisos', '#F97316']].forEach(([ic, l, col], k) => {
      const cw = (w - 52) / 2, cx = x + 20 + (k % 2) * (cw + 12), cy = y + 66 + Math.floor(k / 2) * 112;
      fillRR(g, cx, cy, cw, 100, 14, C.bg); fillRR(g, cx + cw / 2 - 22, cy + 14, 44, 44, 13, col); glyph(g, ic, cx + cw / 2, cy + 36, 26, '#FFFFFF', 20); txt(g, l, cx + cw / 2, cy + 80, UI(600, 14), C.ink, 'center'); });
    [['Férias · Inês Duarte', 'Aprovado', 'g'], ['Formação · Rui Costa', 'Pendente', 'a'], ['Consulta · Pedro Lopes', 'Aprovado', 'g']].forEach(([s2, st, sk], k) => {
      const yy = y + 318 + k * 100; fillRR(g, x + 20, yy, w - 40, 86, 14, '#FFFFFF'); strokeRR(g, x + 20, yy, w - 40, 86, 14, C.line);
      txt(g, s2, x + 38, yy + 30, UI(600, 15), C.ink, 'left', w - 80); pill(g, x + 38, yy + 60, st, UI(600, 12), ST[sk][0], ST[sk][1], 10, 26); }); } },
] };

/* ================= o quadro: a planta e o sistema ================= */
const board = new THREE.Group(); scene.add(board);
const BOARD_W = BW / PXU, BOARD_H = BH / PXU;
const BOARD_CV = mkCv(BW, BH);
{ const m = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, roughness: 0.4, clearcoat: 0.5 });
  const slab = new THREE.Mesh(slabGeo(BOARD_W, BOARD_H, 0.08, 0.14), m); slab.castShadow = true; slab.receiveShadow = true; board.add(slab);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(BOARD_W, BOARD_H), new THREE.MeshBasicMaterial({ map: BOARD_CV.tex, toneMapped: false, transparent: true }));
  face.position.z = 0.052; board.add(face); }
// planta de uma parte: contorno tracejado, o nome e linhas de conteúdo
function blueprintPart(g, pt, ink){
  const [x, y, w, h] = pt.r;
  g.setLineDash([10, 7]); strokeRR(g, x + 4, y + 4, w - 8, h - 8, 12, ink, 2); g.setLineDash([]);
  g.globalAlpha *= 0.9; txt(g, pt.label.toUpperCase(), x + 22, y + 28, MONO(500, 15), ink, 'left', w - 40);
  const a = g.globalAlpha; g.globalAlpha = a * 0.35;
  const n = Math.max(1, Math.min(6, Math.floor((h - 60) / 56)));
  for (let k = 0; k < n; k++){ const yy = y + 66 + k * Math.max(40, (h - 90) / n); if (yy > y + h - 24) break; fillRR(g, x + 22, yy, (w - 44) * (0.45 + ((k * 37) % 50) / 100), 9, 4.5, ink); }
  if (h > 200 && w > 300){ g.beginPath(); g.moveTo(x + w - 120, y + 20); g.lineTo(x + w - 24, y + 90); g.moveTo(x + w - 24, y + 20); g.lineTo(x + w - 120, y + 90); g.strokeStyle = ink; g.lineWidth = 1.5; g.stroke(); strokeRR(g, x + w - 120, y + 20, 96, 70, 6, ink, 1.5); }
  g.globalAlpha = a;
}
// cotas: as medidas da empresa, à volta da planta
function dims(g, P, ink){
  g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = 1.5;
  const y = 98, x0 = 290, x1 = BW - 30;
  g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.moveTo(x0, y - 8); g.lineTo(x0, y + 8); g.moveTo(x1, y - 8); g.lineTo(x1, y + 8); g.stroke();
  [[x0, 1], [x1, -1]].forEach(([x, d]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 12 * d, y - 5); g.lineTo(x + 12 * d, y + 5); g.closePath(); g.fill(); });
  g.font = MONO(500, 15); const tw = g.measureText(P.dims[0]).width + 24, cx = (x0 + x1) / 2;
  fillRR(g, cx - tw / 2, y - 13, tw, 26, 6, g.__paper); txt(g, P.dims[0], cx, y + 1, MONO(500, 15), ink, 'center');
  const x = 266, y0 = 120, y1 = BH - 30;
  g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.moveTo(x - 8, y0); g.lineTo(x + 8, y0); g.moveTo(x - 8, y1); g.lineTo(x + 8, y1); g.stroke();
  g.save(); g.translate(x, (y0 + y1) / 2); g.rotate(-Math.PI / 2); g.font = MONO(500, 15); const th = g.measureText(P.dims[1]).width + 24;
  fillRR(g, -th / 2, -13, th, 26, 6, g.__paper); txt(g, P.dims[1], 0, 1, MONO(500, 15), ink, 'center'); g.restore();
}
let boardKey = '';
function drawBoard(scr, d, b, night){
  const key = `${scr}|${d.toFixed(3)}|${b.toFixed(3)}|${night}`; if (key === boardKey) return; boardKey = key;
  const g = begin(BOARD_CV), P = SCR[scr], n = P.parts.length;
  const paper = night ? '#0B2A3A' : '#F2F8FA', ink = night ? '#7FE0FF' : '#0E86A8'; g.__paper = paper;
  g.save(); rr(g, 0, 0, BW, BH, 40); g.clip();
  g.fillStyle = paper; g.fillRect(0, 0, BW, BH);
  const gl = night ? 'rgba(127,224,255,.08)' : '#DDEBF0', gl2 = night ? 'rgba(127,224,255,.18)' : '#C4DDE6';
  for (let x = 0; x <= BW; x += 30){ g.fillStyle = x % 150 ? gl : gl2; g.fillRect(x, 0, 1, BH); }
  for (let y = 0; y <= BH; y += 30){ g.fillStyle = y % 150 ? gl : gl2; g.fillRect(0, y, BW, 1); }
  // quanto cada parte já é "a sério" (aparecem uma a uma)
  const R = P.parts.map((_, k) => smooth(k / n * 0.55, k / n * 0.55 + 0.45, b)), avg = R.reduce((a, v) => a + v, 0) / n;
  if (avg > 0){ g.globalAlpha = Math.min(1, avg * 1.6); g.fillStyle = '#EEF3F6'; g.fillRect(0, 0, BW, BH); g.globalAlpha = 1; }
  // a planta, desenhada da esquerda para a direita
  if (d > 0 && avg < 1){
    g.save(); g.beginPath(); g.rect(0, 0, d * BW, BH); g.clip();
    P.parts.forEach((pt, k) => { if (R[k] >= 1) return; g.globalAlpha = 1 - R[k]; blueprintPart(g, pt, ink); });
    g.globalAlpha = 1 - avg; dims(g, P, ink); g.restore(); g.globalAlpha = 1;
    if (d < 1){ g.fillStyle = ink; g.fillRect(d * BW - 1.5, 0, 3, BH); }
  }
  // as partes reais, a subir de cima para baixo, com uma linha de luz no sítio onde estão a nascer
  P.parts.forEach((pt, k) => { const r = R[k]; if (r <= 0) return; const [x, y, w, h] = pt.r, hh = h * ease(r);
    g.save(); g.beginPath(); g.rect(x, y, w, hh); g.clip(); pt.draw(g, x, y, w, h); g.restore();
    if (r < 1){ g.save(); g.shadowColor = '#2BDBFF'; g.shadowBlur = 18; g.fillStyle = '#2BDBFF'; g.fillRect(x, y + hh - 2, w, 4); g.restore(); } });
  g.restore();
  BOARD_CV.tex.needsUpdate = true;
}

// réguas na margem da planta (só enquanto é planta)
function rulerTex(len, vertical){
  const K = mkCv(vertical ? 60 : len, vertical ? len : 60), g = begin(K);
  fillRR(g, 0, 0, K.w, K.h, 10, '#E9EEF1'); g.fillStyle = '#334155';
  for (let i = 0, v = 0; i <= len - 20; i += 15, v++){ const L2 = v % 10 === 0 ? 26 : v % 5 === 0 ? 18 : 10;
    if (vertical){ g.fillRect(0, i + 10, L2, 2); if (v % 10 === 0) txt(g, String(v / 10), 34, i + 11, MONO(500, 13), '#334155'); }
    else { g.fillRect(i + 10, 0, 2, L2); if (v % 10 === 0) txt(g, String(v / 10), i + 11, 40, MONO(500, 13), '#334155', 'center'); } }
  K.tex.needsUpdate = true; return K.tex;
}
const rulers = [[BOARD_W, 0.2, false], [0.2, BOARD_H, true]].map(([w, h, v]) => {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xE9EEF1, roughness: 0.3, metalness: 0.5, clearcoat: 0.6, transparent: true });
  const g = new THREE.Group(); board.add(g);
  const slab = new THREE.Mesh(slabGeo(w, h, 0.03, 0.05), m); slab.castShadow = true; g.add(slab);
  const fm = new THREE.MeshBasicMaterial({ map: rulerTex(Math.round((v ? h : w) * PXU), v), transparent: true, toneMapped: false });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, h), fm); f.position.z = 0.025; g.add(f);
  return { g, mats: [m, fm], v, op: 0 };
});
// o lápis que desenha a planta (a ponta fica na origem do grupo)
const pencil = (() => {
  const g = new THREE.Group(); board.add(g);
  const inner = new THREE.Group(); g.add(inner);
  const mk = (geo, color, y, extra = {}) => { const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, clearcoat: 0.4, ...extra })); m.position.y = y; m.castShadow = true; inner.add(m); return m; };
  mk(new THREE.ConeGeometry(0.018, 0.06, 6), 0x1F2937, 0.03);
  mk(new THREE.CylinderGeometry(0.05, 0.018, 0.12, 6), 0xE8C9A0, 0.12);
  mk(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 6), 0xF2B53A, 0.705);
  mk(new THREE.CylinderGeometry(0.052, 0.052, 0.08, 16), 0xC0C7CF, 1.27, { metalness: 0.8 });
  mk(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), 0xF2A3B5, 1.36);
  g.visible = false;
  return { g, op: 0 };
})();

/* ---------- cartões que saltam do quadro ---------- */
function drawPop(g, w, h, r, W){
  const d = W.d;
  switch (W.kind){
    case 'kpi': fillRR(g, 0, 0, w, h, 22, '#FFFFFF'); txt(g, d[0], 24, h * 0.3, UI(500, 16), C.ink2, 'left', w - 110); txt(g, d[1], 24, h * 0.68, UI(700, 34), C.ink); pill(g, w - 20, h * 0.3, d[2], UI(600, 13), C.green, '#DCFCE7', 10, 26, 'right'); break;
    case 'note': fillRR(g, 0, 0, w, h, 22, '#FFFFFF'); tile(g, 20, (h - 58) / 2, 58, d[0]); txt(g, d[1], 94, h * 0.38, UI(600, 17), C.ink, 'left', w - 112); txt(g, d[2], 94, h * 0.66, UI(400, 14), C.ink2, 'left', w - 112); break;
    case 'bubble': fillRR(g, 0, 0, w, h, 22, '#DCFCE7'); tile(g, 20, (h - 58) / 2, 58, d[0]); txt(g, d[1], 94, h * 0.36, UI(600, 14), C.ink2, 'left', w - 112); txt(g, d[2], 94, h * 0.66, UI(500, 17), C.ink, 'left', w - 112); break;
    case 'stamp': fillRR(g, 3, 3, w - 6, h - 6, 22, '#DCFCE7'); strokeRR(g, 7, 7, w - 14, h - 14, 18, '#16A34A', 5); glyph(g, 'check', 64, h / 2, 50, '#15803D', 30);
      g.letterSpacing = '5px'; txt(g, d[0], w / 2 + 30, h / 2 + 2, UI(800, 40), '#15803D', 'center'); g.letterSpacing = '0px'; break;
    case 'chip': fillRR(g, 0, 0, w, h, h / 2, d[1]); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(34, h / 2, 9, 0, 7); g.fill(); txt(g, d[0], w / 2 + 10, h / 2 + 1, UI(700, 24), '#FFFFFF', 'center'); break;
    case 'inc': fillRR(g, 0, 0, w, h, h / 2, '#FFFFFF'); tile(g, 12, (h - 46) / 2, 46, d[0]); txt(g, d[1], 72, h / 2 + 1, UI(600, 18), C.ink, 'left', w - 86); break;
  }
}
// px: centro no quadro (px de desenho); w/h em unidades; dz: quanto salta
const POPS = [
  { scr: 'geral', when: 'hero', px: [1180, 810], w: 1.85, h: 0.46, dz: 0.75, kind: 'note', d: ['wa', 'Lembrete enviado', 'Rita Fonseca · visita amanhã às 10h'] },
  { scr: 'geral', when: 'hero', px: [1000, 175], w: 1.2, h: 0.5, dz: 0.5, kind: 'kpi', d: ['Faturado este mês', '18.400 €', '+12%'] },
  { scr: 'stand', px: [1290, 330], w: 1.85, h: 0.46, dz: 0.6, kind: 'note', d: ['swap', 'Transferência pedida', 'BMW 320d · Leiria → Pombal'] },
  { scr: 'stand', px: [1290, 780], w: 1.1, h: 0.5, dz: 0.85, kind: 'kpi', d: ['Vendas do mês', '23', '+4'] },
  { scr: 'oficina', px: [1180, 800], w: 1.85, h: 0.46, dz: 0.6, kind: 'bubble', d: ['wa', 'Oficina Matos · WhatsApp', 'O seu Golf está pronto!'] },
  { scr: 'oficina', px: [570, 800], w: 1.7, h: 0.46, dz: 0.85, kind: 'note', d: ['check', 'Orçamento aprovado', 'Peugeot 308 · pelo cliente'] },
  { scr: 'rest', px: [630, 760], w: 1.75, h: 0.46, dz: 0.6, kind: 'note', d: ['warn', 'Stock baixo', 'Vinho da casa: 4 garrafas'] },
  { scr: 'rest', px: [1240, 300], w: 1.7, h: 0.46, dz: 0.85, kind: 'note', d: ['check', 'Pedido pronto', 'Mesa 4 · 2 Bacalhau à Brás'] },
  { scr: 'orbis', px: [630, 760], w: 1.75, h: 0.46, dz: 0.6, kind: 'note', d: ['warn', 'Stock crítico', 'Frango: abaixo do mínimo'] },
  { scr: 'orbis', px: [1240, 300], w: 1.7, h: 0.46, dz: 0.85, kind: 'note', d: ['check', 'Pedido pronto', 'Mesa 4 · Leiria'] },
  { scr: 'p2g', px: [700, 320], w: 1.9, h: 0.46, dz: 0.6, kind: 'note', d: ['check', 'Proposta aceite', 'Hotel Atlântico · Energia'] },
  { scr: 'p2g', px: [1270, 560], w: 1.15, h: 0.5, dz: 0.85, kind: 'kpi', d: ['Comissão do mês', '2.140 €', '+8%'] },
  { scr: 'geral', when: 'stamp', px: [870, 470], w: 1.5, h: 0.52, dz: 0.6, kind: 'stamp', d: ['APROVADO'], rz: -0.14 },
  { scr: 'geral', when: 'launch', px: [640, 330], w: 1.9, h: 0.46, dz: 0.6, kind: 'note', d: ['sheet', 'Dados importados', '1.240 clientes do Excel'] },
  { scr: 'geral', when: 'launch', px: [1180, 560], w: 1.0, h: 0.36, dz: 0.85, kind: 'chip', d: ['No ar', '#059669'] },
  // incluído em todos: seis peças à volta do sistema
  ...[['users', 'Utilizadores ilimitados'], ['bolt', 'Automações'], ['wa', 'WhatsApp'], ['mail', 'Email'], ['chat', 'Mensagens internas'], ['sheet', 'Importação do Excel']].map((d, k) => (
    { scr: 'geral', when: 'inc', px: [k % 2 ? 1180 : 520, 220 + Math.floor(k / 2) * 260], w: 1.9, h: 0.42, dz: 0.55 + (k % 3) * 0.15, kind: 'inc', d, rz: (k % 2 ? -1 : 1) * 0.04 })),
];
const PK = POPS.map((S, i) => {
  const K = makeCard(board, S.w, S.h, 0xFFFFFF, (g, w, h, r) => drawPop(g, w, h, r, S), S.kind === 'chip' || S.kind === 'inc' ? S.h / 2 - 0.004 : 0.074);
  return Object.assign(K, S, { i, k: POPS.slice(0, i).filter((o) => o.when === S.when && o.scr === S.scr).length, pop: 0 });
});

/* ================= camada da frente (outro canvas, por cima do texto) ================= */
const fgCanvas = document.getElementById('fg');
const fgR = new THREE.WebGLRenderer({ canvas: fgCanvas, alpha: true, antialias: true });
fgR.setPixelRatio(1);
fgR.outputColorSpace = THREE.SRGBColorSpace; fgR.toneMapping = THREE.NeutralToneMapping; fgR.setClearColor(0x000000, 0);
const fgScene = new THREE.Scene();
fgScene.environment = new THREE.PMREMGenerator(fgR).fromScene(new RoomEnvironment(), 0.04).texture;
fgScene.add(new THREE.HemisphereLight(0xffffff, 0xbfd2da, 0.7));
const fgSun = new THREE.DirectionalLight(0xffffff, 1.5); fgSun.position.set(-3, 5, 4); fgScene.add(fgSun);
const fgCam = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 60);
const DEB = [['users', '#0891B2'], ['calendar', '#F43F5E'], ['euro', '#059669'], ['car', '#0284C7'], ['box', '#D97706'], ['chat', '#7C3AED'], ['sheet', '#15803D'], ['tool', '#0E86A8']].slice(0, innerWidth < 760 ? 5 : 8);
const debrisGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 3, 0.15), decalGeo = new THREE.PlaneGeometry(0.42, 0.42);
const debris = DEB.map(([ic, col], i) => {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const mat = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true });
  g.add(new THREE.Mesh(debrisGeo, mat));
  const dm = new THREE.MeshBasicMaterial({ map: iconTex(ic), transparent: true, depthWrite: false, toneMapped: false });
  const f = new THREE.Mesh(decalGeo, dm); f.position.z = 0.315; g.add(f);
  fgScene.add(g);
  return { g, mat, dm, right: i % 3 !== 0, rx: rnd(), y0: rnd(), d: 4.2 + rnd() * 4.2, dir: rnd() < .5 ? -1 : 1, sp: 0.3 + rnd() * 0.5 };
});
const FG_OP = [0.4, 0.2, 0.3, 0.5, 0.2, 0.55, 0.5];
const FG_MASK = {
  left: 'linear-gradient(90deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 38%,#000 60%)',
  right: 'linear-gradient(270deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 38%,#000 60%)',
  center: 'radial-gradient(ellipse 46% 42% at 50% 52%,rgba(0,0,0,.08) 60%,#000 100%)',
  bottom: 'linear-gradient(0deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 42%,#000 64%)',
  top: 'linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 44%,#000 66%)',
};
let fgMaskPos = '', fgOp = 0;

/* ================= partículas espalhadas pelo mundo ================= */
const CONF_N = innerWidth < 760 ? 90 : 170;
const confMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 });
const conf = new THREE.InstancedMesh(new RoundedBoxGeometry(0.16, 0.16, 0.05, 2, 0.02), confMat, CONF_N);
conf.frustumCulled = false; conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
const confData = [], CONF_COLS = ['#9FB4BE', '#7FB6C6', '#C5D3DA', '#0E86A8'].map(c => new THREE.Color(c));
for (let i = 0; i < CONF_N; i++){
  confData.push({ x: (rnd() < .5 ? -1 : 1) * (3 + rnd() * 9), y: FLOOR_Y + 0.5 + rnd() * 7, z: 6 - rnd() * 48, ph: rnd() * 6.28, sp: 0.4 + rnd() * 0.8, dir: rnd() < .5 ? -1 : 1, s: 0.6 + rnd() * 0.9 });
  conf.setColorAt(i, CONF_COLS[i % 4]);
}
scene.add(conf);
const dummy = new THREE.Object3D();

/* ================= layout ================= */
const L = {};
function layout(){
  const w = innerWidth, h = innerHeight;
  L.mobile = w < 760;
  L.camZ = L.mobile ? 13 : (w / h < 1.3 ? 12 : 10);
  L.boardS = 0.7;
  const textW = Math.min(608, w * 0.46), gap = 36;
  L.wppAt = (d) => d * Math.tan(THREE.MathUtils.degToRad(17)) * (w / h) / (w / 2);
  const wpp = L.wppAt(L.camZ), objPx = BOARD_W * L.boardS * 0.94 / wpp;
  L.cxPx = L.mobile ? 0 : (textW + gap) / 2;
  L.cx = L.cxPx * wpp;
  document.documentElement.style.setProperty('--stage-pad', `${Math.round(Math.max(w * 0.04, (w - (textW + gap + objPx)) / 2))}px`);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  fgCam.aspect = w / h; fgCam.updateProjectionMatrix();
  renderer.setSize(w, h, false); fgR.setSize(w, h, false);
}
layout();
addEventListener('resize', () => { layout(); measure(); });

function posSpec(pos){
  if (L.mobile) return [0, 0, 1];
  switch (pos){
    case 'right': return [-L.cx, 0, 1];
    case 'center': return [0, 0, 1];
    case 'bottom': return [0, 0.85, 0.78];
    default: return [L.cx, 0, 1];
  }
}
let [CX, CY, CS] = posSpec('left');
const side = () => (L.cx ? CX / L.cx : 0);

/* ================= capítulos e scroll ================= */
const chapters = [...ROOT.querySelectorAll('.chapter')].map((el, i) => ({
  el, i, beats: +el.dataset.beats, night: el.dataset.night === 'true', name: el.dataset.name, p: 0,
  layers: [...el.querySelectorAll('.layer')].map(l => ({ el: l, a: +l.dataset.in, b: +l.dataset.out, on: false,
    pos: (l.className.match(/pos-(\w+)/) || [, 'left'])[1], copy: l.querySelector('.copy'),
    mpos: l.classList.contains('m-high') ? 'high' : l.classList.contains('m-low') ? 'low' : 'mid' })),
}));
function measure(){ chapters.forEach(c => { const r = c.el.getBoundingClientRect(); c.top = r.top + scrollY; c.h = r.height; }); }
measure();
new ResizeObserver(() => measure()).observe(ROOT);
const dotsEl = document.getElementById('hud-dots');
dotsEl.innerHTML = chapters.map((c, i) => `<button type="button" data-go="${i}" aria-label="Ir para ${c.name}"></button>`).join('');
const dotEls = [...dotsEl.children];
const hudN = document.getElementById('hud-n'), hudName = document.getElementById('hud-name'), hudBar = document.getElementById('hud-bar');

const lenis = REDUCE ? null : new Lenis({ lerp: 0.085, smoothWheel: true });
document.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', (e) => {
  e.preventDefault();
  const c = chapters[+a.dataset.go];
  if (lenis) lenis.scrollTo(c.top, { duration: 2.2 }); else scrollTo(0, c.top);
}));

let state = { cur: 0, p: 0, beat: 0, bp: 0 }, lastCur = -1;
function readScroll(){
  const y = scrollY, vh = innerHeight, mid = y + vh * 0.5;
  let cur = 0;
  chapters.forEach((c, i) => { if (mid >= c.top) cur = i; c.p = clamp((y - c.top) / Math.max(1, c.h - vh), 0, 1); });
  const c = chapters[cur], bf = c.p * c.beats;
  const beat = Math.min(c.beats - 1, Math.floor(bf));
  state = { cur, p: c.p, beat, bp: clamp(bf - beat, 0, 1), bf };
  let pos = 'left', mpos = 'mid', copyEl = null;
  const drift = REDUCE ? 0 : (innerWidth < 760 ? 0.4 : 1);
  chapters.forEach(ch => ch.layers.forEach(l => {
    const on = ch.p >= l.a && (ch.p < l.b || (l.b >= 1 && ch.p >= 1));
    if (on !== l.on){ l.on = on; l.el.classList.toggle('is-in', on); if (on) l.el.querySelectorAll('[data-count]').forEach(countUp); }
    const lp = clamp((ch.p - l.a) / Math.max(0.0001, l.b - l.a), 0, 1);
    if (on && l.copy){
      const dx = l.pos === 'left' ? (lp - 0.5) * 40 : l.pos === 'right' ? (0.5 - lp) * 40 : 0;
      l.copy.style.setProperty('--dy', `${((0.5 - lp) * 80 * drift).toFixed(1)}px`);
      l.copy.style.setProperty('--dx', `${(dx * drift).toFixed(1)}px`);
    }
    if (on && ch === c){ pos = l.pos; mpos = l.mpos; copyEl = l.copy; }
  }));
  state.pos = pos; state.mpos = mpos; state.copyEl = copyEl;
  hudBar.style.width = `${(c.p * 100).toFixed(1)}%`;
  if (cur !== lastCur){
    lastCur = cur;
    hudN.textContent = String(cur + 1).padStart(2, '0'); hudName.textContent = c.name;
    dotEls.forEach((d, i) => { d.classList.toggle('on', i === cur); d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
    document.body.classList.toggle('night', c.night);
  }
}
function countUp(el){
  const to = +el.dataset.count, suf = el.dataset.suffix || '';
  if (REDUCE || !to){ el.textContent = String(to).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suf; return; }
  const s0 = performance.now(), dur = 900 + Math.min(600, to);
  const step = (now) => { const k = clamp((now - s0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = String(Math.round(to * e)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suf; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ================= rato ================= */
const mouse = { nx: 0, ny: 0, sx: 0, sy: 0 };
addEventListener('pointermove', (e) => { mouse.nx = e.clientX / innerWidth * 2 - 1; mouse.ny = -(e.clientY / innerHeight * 2 - 1); }, { passive: true });

// preço: no telemóvel os cartões deslizam de lado e abrem no recomendado
const planEls = [...ROOT.querySelectorAll('.plan')], plansEl = ROOT.querySelector('.plans'), planDots = [...ROOT.querySelectorAll('.plan-dots i')];
plansEl.addEventListener('scroll', () => {
  const mid = plansEl.getBoundingClientRect().left + plansEl.clientWidth / 2;
  let best = 1, bd = Infinity;
  planEls.forEach((el, k) => { const r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd){ bd = d; best = k; } });
  planDots.forEach((d, k) => d.classList.toggle('on', k === best));
}, { passive: true });
function centerRec(){
  if (innerWidth >= 760) return;
  const rec = plansEl.querySelector('.rec');
  plansEl.scrollLeft += rec.getBoundingClientRect().left - plansEl.getBoundingClientRect().left - (plansEl.clientWidth - rec.offsetWidth) / 2;
}
centerRec();
addEventListener('resize', centerRec);

/* ================= câmara ================= */
const camPos = new THREE.Vector3(0, 0.5, 10), camLook = new THREE.Vector3(), camPosT = new THREE.Vector3(), camLookT = new THREE.Vector3();
function cameraTarget(ch, p){
  const Z = L.camZ, sc = REDUCE ? 0.3 : 1;
  if (ch === 3){ camPosT.set(Math.sin(p * 0.9 - 0.45) * 1.5 * sc, 0.8 - p * 0.3, Z - 0.4); camLookT.set(0, 0, 0); return; }
  camPosT.set(Math.sin(p * 0.7 - 0.35) * 1.2 * sc, 0.4 + p * 0.25, Z - 0.3 - p * 0.3); camLookT.set(0, 0, 0);
}
const ENV = {
  day: { bg: new THREE.Color('#EEF2F3'), dot: new THREE.Color('#9FB4BE'), glow: new THREE.Color('#7CC6DA'), glowA: 0.55, env: 0.95 },
  night: { bg: new THREE.Color('#071824'), dot: new THREE.Color('#2C86A3'), glow: new THREE.Color('#2BDBFF'), glowA: 0.22, env: 0.45 },
};
let nightAmt = 0;

/* ================= o quadro em cada momento ================= */
// d: quanto da planta já está desenhado; b: quanto já é sistema a sério (0 a 1, por momento)
const SCENES = {
  '0.0': { scr: 'geral', hero: true, pops: 'hero' },
  '0.1': { scr: 'geral', d: 1, b: 1, pops: 'hero' },
  '1.0': { scr: 'stand', d: [0, 0.14], b: [0.18, 0.6], pops: 'ex' },
  '1.1': { scr: 'oficina', d: [0, 0.14], b: [0.18, 0.6], pops: 'ex' },
  '1.2': { scr: 'rest', d: [0, 0.14], b: [0.18, 0.6], pops: 'ex' },
  '2.0': { scr: 'geral', d: 1, b: 1, pops: 'inc' },
  '3.0': { scr: 'geral', d: [0.06, 0.8], b: 0 },
  '3.1': { scr: 'geral', d: 1, b: 0, pops: 'stamp' },
  '3.2': { scr: 'geral', d: 1, b: [0.08, 0.85] },
  '3.3': { scr: 'geral', d: 1, b: 1, pops: 'launch' },
  '4.0': { scr: 'orbis', d: [0, 0.12], b: [0.14, 0.5], pops: 'ex' },
  '4.1': { scr: 'p2g', d: [0, 0.12], b: [0.14, 0.5], pops: 'ex' },
  '5.0': { scr: 'geral', d: 1, b: 1, back: true },
  '6.0': { scr: 'geral', d: 1, b: 1 },
};
const val = (v, x) => Array.isArray(v) ? smooth(v[0], v[1], x) : v;
const bSt = { x: 0, y: 0, z: 0, ry: 0, rx: 0, s: 0.7 };
let dCur = 0, bCur = 0;
// telemóvel: o quadro vai para o espaço livre (por cima ou por baixo do texto) e encolhe para caber
function mobileSpot(){
  const H = innerHeight, r = state.copyEl?.getBoundingClientRect();
  let top = 70, bot = H - 34;
  if (r && state.mpos === 'low') bot = Math.max(top + 120, r.top - 10);
  else if (r && state.mpos === 'high') top = Math.min(bot - 120, r.bottom + 10);
  const dist = L.camZ + 0.2, ppu = H / (2 * dist * Math.tan(THREE.MathUtils.degToRad(17)));
  const sW = innerWidth * 0.94 / ppu / BOARD_W, sH = (bot - top) * 0.9 / ppu / BOARD_H;
  return { y: camLook.y + (H / 2 - (top + bot) / 2) / ppu, s: Math.min(0.62, sW, sH) };
}
function updateBoard(cur, beat, bp, p, t, dt){
  const S = SCENES[`${cur}.${beat}`] || SCENES['6.0'], x = chapters[cur].beats === 1 ? p : bp;
  let d, b;
  if (S.hero){ d = Math.max(clamp((t - 0.4) / 1.5, 0, 1), bp * 2); b = Math.max(clamp((t - 2.2) / 2.4, 0, 1), bp * 1.6); }
  else { d = val(S.d, x); b = val(S.b, x); }
  if (REDUCE){ d = d > 0 ? 1 : 0; }
  dCur += (d - dCur) * damp(dt, 8); bCur += (b - bCur) * damp(dt, 8);
  if (Math.abs(dCur - d) < 0.002) dCur = d; if (Math.abs(bCur - b) < 0.002) bCur = b;
  drawBoard(S.scr, dCur, bCur, nightAmt > 0.5);
  const drawing = dCur > 0.001 && dCur < 0.999;

  // posição: ao lado do texto (desktop) ou no espaço livre (telemóvel); no preço fica por trás dos cartões
  const m = L.mobile, ms = m ? mobileSpot() : null;
  const tg = { x: CX, y: m ? ms.y : CY + 0.02, z: 0, ry: m ? 0 : -0.32 * side(), rx: 0.04, s: m ? ms.s : L.boardS * CS };
  if (S.back){ tg.x = 0; tg.y = m ? -0.4 : -0.45; tg.z = -3.5; tg.ry = 0; tg.rx = 0.2; tg.s = m ? 0.5 : L.boardS * 1.05; }
  if (cur === 6) tg.ry = Math.sin(t * 0.35) * 0.1 * (REDUCE ? 0 : 1);
  stepTo(bSt, tg, damp(dt, 2.6));
  board.position.set(bSt.x, bSt.y + (REDUCE ? 0 : Math.sin(t * 0.8) * 0.04), bSt.z);
  board.rotation.set(bSt.rx + VEL * 0.03, bSt.ry, 0);
  board.scale.setScalar(bSt.s);

  // réguas e lápis: só enquanto é planta
  const blue = (1 - bCur) * (dCur > 0.05 ? 1 : 0);
  rulers.forEach((Rl) => {
    Rl.op += (blue - Rl.op) * damp(dt, 4); Rl.g.visible = Rl.op > 0.01; if (!Rl.g.visible) return;
    if (Rl.v) Rl.g.position.set(-BOARD_W / 2 - 0.22 - (1 - Rl.op) * 0.4, 0, 0.12); else Rl.g.position.set(0, BOARD_H / 2 + 0.22 + (1 - Rl.op) * 0.4, 0.12);
    Rl.mats.forEach((mt) => { mt.opacity = Rl.op; });
  });
  pencil.op += ((drawing ? 1 : 0) - pencil.op) * damp(dt, drawing ? 6 : 3);
  pencil.g.visible = pencil.op > 0.01;
  if (pencil.g.visible){
    pencil.g.position.set(-BOARD_W / 2 + dCur * BOARD_W, Math.sin(t * 6.5) * BOARD_H * 0.32, 0.07 + (1 - pencil.op) * 0.6);
    pencil.g.rotation.set(0.62, 0.2, -0.55); pencil.g.scale.setScalar(Math.max(0.0001, pencil.op * 1.2));
  }
  // cartões que saltam
  PK.forEach((K) => {
    let want = 0;
    if (K.scr === S.scr && K.when === S.pops || (!K.when && S.pops === 'ex' && K.scr === S.scr)){
      if (S.hero) want = clamp((t - 5 - K.k * 0.4) / 0.4, 0, 1) * (1 - smooth(0.78, 0.95, bp));
      else if (S.pops === 'hero') want = 1 - smooth(0.85, 0.97, bp);
      else if (S.pops === 'ex') want = smooth(0.64 + K.k * 0.08, 0.74 + K.k * 0.08, bp) * (1 - smooth(0.9, 0.98, bp));
      else if (S.pops === 'inc') want = smooth(0.08 + K.k * 0.07, 0.2 + K.k * 0.07, x);
      else want = smooth(0.15 + K.k * 0.14, 0.3 + K.k * 0.14, bp) * (1 - smooth(0.9, 0.98, bp));
    }
    K.pop += (want - K.pop) * damp(dt, want > K.pop ? 5 : 7);
    if (K.pop < 0.01){ K.g.visible = false; return; }
    K.g.position.set((K.px[0] - BW / 2) / PXU, (BH / 2 - K.px[1]) / PXU, 0.1 + K.pop * K.dz);
    K.g.rotation.set((1 - K.pop) * 0.5, Math.sin(t * 0.7 + K.i) * 0.06 * (REDUCE ? 0 : 1), K.rz || 0);
    K.g.scale.setScalar(Math.max(0.0001, backOut(K.pop)));
    setOp(K, Math.min(1, K.pop * 1.4));
  });
}

/* ================= ciclo ================= */
let last = performance.now(), t0 = last, slowFrames = 0;
let VEL = 0, ENERGY = 0, SY = 0, lastY = scrollY;
const lag = { cur: -1, pos: 'left', beat: 0, wantPos: 'left', wantBeat: 0, t: 0 };
function frame(now){
  lenis?.raf(now);
  const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
  const t = Math.max(0, (now - t0) / 1000);
  readScroll();
  const { cur, beat, bp, p } = state;

  const y = scrollY, rawV = lenis ? lenis.velocity : (y - lastY); lastY = y;
  const v = REDUCE ? 0 : clamp((rawV || 0) / 32, -2, 2);
  VEL += (v - VEL) * damp(dt, 6);
  ENERGY += (Math.min(1.6, Math.abs(v)) - ENERGY) * damp(dt, Math.abs(v) > ENERGY ? 9 : 2);
  SY = y / innerHeight;

  if (cur !== lag.cur){ lag.cur = cur; lag.pos = lag.wantPos = state.pos; lag.beat = lag.wantBeat = beat; }
  else if (state.pos !== lag.wantPos || beat !== lag.wantBeat){ lag.wantPos = state.pos; lag.wantBeat = beat; lag.t = now; }
  if (now - lag.t > 220){ lag.pos = lag.wantPos; lag.beat = lag.wantBeat; }

  const [cxT, cyT, csT] = posSpec(lag.pos), kp = damp(dt, REDUCE ? 6 : 2.4);
  CX += (cxT - CX) * kp; CY += (cyT - CY) * kp; CS += (csT - CS) * kp;

  if (dt > 0.026) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
  if (slowFrames > 90 && DPR > 1){ DPR = 1; renderer.setPixelRatio(1); renderer.setSize(innerWidth, innerHeight, false); slowFrames = 0; }

  nightAmt += ((chapters[cur].night ? 1 : 0) - nightAmt) * damp(dt, 2.2);
  BG.copy(ENV.day.bg).lerp(ENV.night.bg, nightAmt);
  scene.fog.color.copy(BG); floorMat.uniforms.uBg.value.copy(BG);
  floorMat.uniforms.uDot.value.copy(ENV.day.dot).lerp(ENV.night.dot, nightAmt);
  glowMat.uniforms.uColor.value.copy(ENV.day.glow).lerp(ENV.night.glow, nightAmt);
  glowMat.uniforms.uA.value = lerp(ENV.day.glowA, ENV.night.glowA, nightAmt);
  scene.environmentIntensity = lerp(ENV.day.env, ENV.night.env, nightAmt);
  hemi.intensity = lerp(0.6, 0.3, nightAmt);

  cameraTarget(cur, p);
  const kc = damp(dt, 2.2);
  camPos.lerp(camPosT, kc); camLook.lerp(camLookT, kc);
  mouse.sx += (mouse.nx - mouse.sx) * damp(dt, 3); mouse.sy += (mouse.ny - mouse.sy) * damp(dt, 3);
  camera.position.set(camPos.x + mouse.sx * 0.35, camPos.y + mouse.sy * 0.22, camPos.z);
  camera.lookAt(camLook);
  camera.updateMatrixWorld();
  floorMat.uniforms.uCam.value.copy(camera.position);
  sun.target.position.copy(camLook); sun.position.set(camLook.x - 4, camLook.y + 9, camLook.z + 6);

  updateBoard(cur, lag.beat, bp, p, t, dt);

  const nightGlow = nightAmt * 0.5;
  confMat.emissive.setRGB(0.05 * nightGlow, 0.4 * nightGlow, 0.5 * nightGlow);
  for (let i = 0; i < CONF_N; i++){
    const d = confData[i];
    dummy.position.set(d.x, d.y + Math.sin(t * 0.4 * d.sp + d.ph) * 0.15 + VEL * 0.35, d.z);
    dummy.rotation.set(d.ph + t * 0.2 * d.sp + SY * 0.8 * d.dir + ENERGY * 1.2, d.ph * 2 + t * 0.15 + SY * 0.6 * d.dir, Math.PI / 4);
    dummy.scale.setScalar(d.s);
    dummy.updateMatrix(); conf.setMatrixAt(i, dummy.matrix);
  }
  conf.instanceMatrix.needsUpdate = true;

  const past = lastChapterEl.getBoundingClientRect().bottom <= 0;
  if (past !== worldHidden){ worldHidden = past; canvas.style.visibility = fgCanvas.style.visibility = past ? 'hidden' : ''; }
  if (past) return;
  renderer.render(scene, camera);

  fgOp += (FG_OP[cur] * (REDUCE ? 0.5 : 1) - fgOp) * damp(dt, 2.5);
  const maskPos = L.mobile ? ({ high: 'top', low: 'bottom', mid: 'center' })[state.mpos] : state.pos;
  if (maskPos !== fgMaskPos){ fgMaskPos = maskPos; fgCanvas.style.setProperty('--fgmask', FG_MASK[maskPos] || FG_MASK.left); }
  fgCam.position.copy(camera.position); fgCam.quaternion.copy(camera.quaternion);
  const tanH = Math.tan(THREE.MathUtils.degToRad(17)), aspect = innerWidth / innerHeight, tmpV = new THREE.Vector3();
  debris.forEach((D) => {
    const h = D.d * tanH, w = h * aspect, range = 2.8 * h;
    const xr = D.right ? lerp(0.42, 0.98, D.rx) : lerp(-1.0, -0.62, D.rx);
    const yr = ((((D.y0 * range - SY * (5.5 / D.d)) % range) + range) % range) - range / 2;
    tmpV.set(xr * w, yr + VEL * 0.25, -D.d).applyQuaternion(camera.quaternion).add(camera.position);
    D.g.position.copy(tmpV);
    D.g.quaternion.copy(camera.quaternion);
    D.g.rotateY(SY * 0.9 * D.dir + t * D.sp * 0.3 + ENERGY * 0.8 * D.dir);
    D.g.rotateX(SY * 0.5 * D.dir + 0.3);
    D.g.scale.setScalar(0.72);
    D.mat.opacity = D.dm.opacity = fgOp;
    D.g.visible = fgOp > 0.02;
  });
  fgR.render(fgScene, fgCam);
}
// os ecrãs usam a Inter e as cotas a DM Mono: quando as letras chegarem, redesenha tudo
const lastChapterEl = chapters[chapters.length - 1].el;
let worldHidden = false;
function drawAll(){ boardKey = ''; PK.forEach((K) => K.redraw()); }
Promise.all([400, 500, 600, 700, 800].map((w) => document.fonts.load(`${w} 20px Inter`)).concat([document.fonts.load('500 15px "DM Mono"')])).then(drawAll).catch(() => {});
renderer.setAnimationLoop(frame);
// o mundo 3D entra com fade depois do primeiro frame (o texto já está à vista)
requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('sv2').classList.add('ready3d')));
