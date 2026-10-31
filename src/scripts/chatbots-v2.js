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
const rnd = rng(1144);
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

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
const Q = innerWidth < 760 ? 0.7 : 1;
const PXU = 300;   // px de desenho por unidade 3D
const UI = (w, s) => `${w} ${s}px Inter, "Segoe UI", system-ui, sans-serif`;
const C = { ink: '#0F172A', ink2: '#64748B', ink3: '#94A3B8', line: '#E2E8F0', soft: '#F1F5F9', petrol: '#0E86A8', deep: '#00708F', green: '#059669', wa: '#25D366', purple: '#6D28D9' };
const ICONS = {
  wa: { icon: 'wa', c: ['#4ADE80', '#16A34A'] }, site: { icon: 'window', c: ['#38BDF8', '#0E86A8'] }, mail: { icon: 'mail', c: ['#FDBA74', '#F97316'] },
  leads: { icon: 'users', c: ['#67E8F9', '#0891B2'] }, agenda: { icon: 'calendar', c: ['#FDA4AF', '#F43F5E'] }, doc: { icon: 'doc', c: ['#93C5FD', '#2563EB'] },
  clock: { icon: 'clock', c: ['#FCD34D', '#D97706'] }, star: { icon: 'star', c: ['#FDE68A', '#F59E0B'] }, pin: { icon: 'pin', c: ['#C4B5FD', '#7C3AED'] },
};
function mkCv(w, h){ const cv = document.createElement('canvas'); cv.width = Math.round(w * Q); cv.height = Math.round(h * Q);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { cv, g: cv.getContext('2d'), tex, w, h }; }
function begin(K){ const g = K.g; g.setTransform(K.cv.width / K.w, 0, 0, K.cv.height / K.h, 0, 0); g.clearRect(0, 0, K.w, K.h); return g; }
function fillRR(g, x, y, w, h, r, col){ rr(g, x, y, w, h, r); g.fillStyle = col; g.fill(); }
function strokeRR(g, x, y, w, h, r, col, lw = 1.5){ rr(g, x, y, w, h, r); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); }
function fit(g, s, max){ if (g.measureText(s).width <= max) return s; while (s.length > 1 && g.measureText(s + '…').width > max) s = s.slice(0, -1); return s.trimEnd() + '…'; }
function txt(g, s, x, y, font, col, align = 'left', max = 0){ g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(max ? fit(g, s, max) : s, x, y); }
function tile(g, x, y, s, key){
  const M = ICONS[key], gr = g.createLinearGradient(x, y, x, y + s); gr.addColorStop(0, M.c[0]); gr.addColorStop(1, M.c[1]);
  rr(g, x, y, s, s, s * 0.3); g.fillStyle = gr; g.fill(); glyph(g, M.icon, x + s / 2, y + s / 2, s * 0.6, '#FFFFFF', 20);
}
function avatar(g, cx, cy, r, ini, col){ g.fillStyle = col; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); txt(g, ini, cx, cy + 1, UI(600, r * 0.74), '#FFFFFF', 'center'); }
function glyph(g, name, cx, cy, size, col = '#FFFFFF', lw = 18){
  g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(size / 256, size / 256);
  g.strokeStyle = g.fillStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  const P = (pts, close = false) => { g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); g.stroke(); };
  const R = (x, y, w, h, r) => { rr(g, x, y, w, h, r); g.stroke(); };
  const O = (x, y, r, fill = false) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); fill ? g.fill() : g.stroke(); };
  const A = (x, y, r, a, b) => { g.beginPath(); g.arc(x, y, r, a, b); g.stroke(); };
  switch (name){
    case 'chat': R(44, 56, 168, 118, 34); P([[86, 172], [70, 212], [124, 174]]); break;
    case 'mail': R(44, 66, 168, 124, 20); P([[52, 78], [128, 136], [204, 78]]); break;
    case 'window': R(36, 52, 184, 152, 22); P([[36, 98], [220, 98]]); O(64, 75, 8, true); O(90, 75, 8, true); P([[70, 140], [150, 140]]); P([[70, 170], [186, 170]]); break;
    case 'wa': A(128, 122, 80, Math.PI * 0.72, Math.PI * 2.62); P([[80, 180], [62, 214], [102, 202]]); break;
    case 'check': P([[58, 132], [106, 180], [198, 84]]); break;
    case 'calendar': R(50, 66, 156, 144, 24); P([[50, 112], [206, 112]]); P([[94, 46], [94, 84]]); P([[162, 46], [162, 84]]); break;
    case 'users': O(102, 98, 32); A(102, 214, 62, Math.PI * 1.12, Math.PI * 1.88); O(172, 110, 24); A(180, 204, 44, Math.PI * 1.2, Math.PI * 1.8); break;
    case 'doc': P([[68, 40], [156, 40], [192, 76], [192, 216], [68, 216]], true); P([[156, 40], [156, 76], [192, 76]]); P([[98, 122], [162, 122]]); P([[98, 158], [162, 158]]); break;
    case 'clock': O(128, 128, 84); P([[128, 80], [128, 132], [162, 152]]); break;
    case 'star': g.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, d = k % 2 ? 40 : 92; g.lineTo(128 + Math.cos(a) * d, 136 + Math.sin(a) * d); } g.closePath(); g.stroke(); break;
    case 'pin': g.beginPath(); g.moveTo(128, 222); g.quadraticCurveTo(54, 140, 54, 106); g.arc(128, 106, 74, Math.PI, 0); g.quadraticCurveTo(202, 140, 128, 222); g.closePath(); g.stroke(); O(128, 106, 24); break;
    case 'spark': g.beginPath(); g.moveTo(128, 30); g.quadraticCurveTo(140, 116, 226, 128); g.quadraticCurveTo(140, 140, 128, 226); g.quadraticCurveTo(116, 140, 30, 128); g.quadraticCurveTo(116, 116, 128, 30); g.fill(); break;
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
// um cartão 3D: placa arredondada com a face desenhada num canvas
function makeCard(parent, w, h, color, draw, r = 0.1){
  const cv = mkCv(Math.round(w * PXU), Math.round(h * PXU));
  const g = new THREE.Group(); parent.add(g);
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2, transparent: true });
  const slab = new THREE.Mesh(slabGeo(w, h, 0.05, Math.min(r, h / 2 - 0.01)), m); slab.castShadow = true; g.add(slab);
  const fm = new THREE.MeshBasicMaterial({ map: cv.tex, transparent: true, toneMapped: false });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, h), fm); f.position.z = 0.037; g.add(f);
  const K = { g, slab, mats: [m, fm], cv, w, h, draw, rpx: Math.min(r, h / 2 - 0.01) * PXU };
  K.redraw = (...a) => { const c = begin(cv); draw(c, cv.w, cv.h, K.rpx, ...a); cv.tex.needsUpdate = true; };
  K.redraw();
  g.visible = false;
  return K;
}
const setOp = (K, op) => { K.mats.forEach((m) => { m.opacity = op; }); K.g.visible = op > 0.01; K.slab.castShadow = op > 0.6; };

/* ================= a conversa ================= */
// Exemplo fictício: o assistente da Clínica Aurora (estética, Leiria)
const CH_LABEL = { wa: 'WhatsApp', site: 'Chat do site', mail: 'Email' };
const MSG = {
  h1: { who: 'c', ch: 'wa', name: 'Sofia', time: '23:47', text: 'Olá! Fazem limpeza de pele ao sábado?' },
  h2: { who: 'b', time: '23:47', meta: 'em 4 s', text: 'Olá Sofia! Fazemos, sim: ao sábado das 9h às 13h. Quer que veja as vagas?' },
  h3: { who: 'c', ch: 'wa', name: 'Sofia', time: '23:48', text: 'Sim, por favor.' },
  h4: { who: 'b', time: '23:48', text: 'Tenho às 10h ou às 11h30. Qual prefere?' },
  h5: { who: 'c', ch: 'wa', name: 'Sofia', time: '23:48', text: 'Às 11h30.' },
  h6: { who: 'b', time: '23:48', text: 'Fica marcado para sábado às 11h30. Até lá!' },
  k1: { who: 'c', ch: 'wa', name: 'Rui', text: 'Têm vaga amanhã de manhã?' },
  k2: { who: 'b', text: 'Tenho às 10h e às 11h30.' },
  k3: { who: 'c', ch: 'site', name: 'Visitante', text: 'Têm estacionamento?' },
  k4: { who: 'b', text: 'Sim, mesmo em frente à clínica.' },
  k5: { who: 'c', ch: 'mail', name: 'Ana Ribeiro', text: 'Pedido de orçamento para 6 pessoas.' },
  k6: { who: 'b', text: 'Enviei-lhe a proposta por email.' },
  f1: { who: 'c', ch: 'site', name: 'Visitante', text: 'Quanto custa a limpeza de pele?' },
  f2: { who: 'b', meta: 'tabela de preços', text: 'A limpeza de pele custa 45€ e demora 60 minutos. Quer marcar?' },
  q1: { who: 'c', ch: 'wa', name: 'Sofia Pinto', text: 'Fazem maquilhagem para noivas?' },
  q2: { who: 'b', text: 'Fazemos! Para que data é o casamento?' },
  q3: { who: 'c', ch: 'wa', name: 'Sofia Pinto', text: '14 de junho. Somos 4 pessoas.' },
  q4: { who: 'b', text: 'Perfeito. A nossa equipa liga-lhe hoje com a proposta.' },
  m1: { who: 'c', ch: 'wa', name: 'Hugo Matos', text: 'Pode ser quinta de manhã?' },
  m2: { who: 'b', text: 'Quinta, dia 12, às 10h está livre. Marco?' },
  m3: { who: 'c', ch: 'wa', name: 'Hugo Matos', text: 'Sim, obrigado!' },
  m4: { who: 'b', text: 'Feito! Enviei a confirmação por WhatsApp.' },
  p1: { who: 'c', ch: 'mail', name: 'Carla Neves', text: 'Posso trocar o vale de oferta por outro tratamento?' },
  p2: { who: 'b', text: 'Boa pergunta! Vou passar a conversa à Inês, da nossa equipa.' },
  p3: { who: 'h', name: 'Inês Duarte', text: 'Olá Carla! Claro, já vejo isso consigo.' },
  s1: { who: 'b', text: 'Olá! Em que posso ajudar?' },
};
// cada momento da página: as mensagens (e cartões '@') e quando entram (0 a 1 do momento); -1 = já estavam
const SCENES = {
  '0.0': { msgs: [['h1', 0], ['h2', 0.55]], timed: true, tw: 0.3 },
  '0.1': { msgs: [['h1', -1], ['h2', -1], ['h3', 0.12], ['h4', 0.3], ['h5', 0.48], ['h6', 0.64]] },
  '1.0': { msgs: [['k1', 0.04], ['k2', 0.16], ['k3', 0.3], ['k4', 0.42], ['k5', 0.56], ['k6', 0.68]], sources: true },
  '2.0': { msgs: [['f1', 0.08], ['f2', 0.28]], faq: true },
  '2.1': { msgs: [['q1', 0.06], ['q2', 0.18], ['q3', 0.3], ['q4', 0.44], ['@lead', 0.58]] },
  '2.2': { msgs: [['m1', 0.06], ['m2', 0.18], ['m3', 0.32], ['m4', 0.44], ['@cal', 0.58]] },
  '2.3': { msgs: [['p1', 0.06], ['p2', 0.2], ['@hand', 0.38], ['p3', 0.52]] },
  '3.0': { msgs: [], diag: true, noHead: true },
  '3.1': { msgs: [], train: true, noHead: true },
  '3.2': { msgs: [], live: true, noHead: true },
  '4.0': { msgs: [['s1', 0.08]] },
};

const chat = new THREE.Group(); scene.add(chat);
const COL_W = 2.7, TOPY = 1.12, BOTY = -1.55, GAP = 0.12;
const BF = 28, BLH = 38, BPAD = 26, BMAX = 540, BMETA = 17;
const metaOf = (M) => M.who === 'c' ? `${M.name} · ${CH_LABEL[M.ch]}` : M.who === 'h' ? `${M.name} · equipa` : `Assistente${M.meta ? ' · ' + M.meta : ''}`;
const measureCtx = document.createElement('canvas').getContext('2d');
function bubbleSize(M){
  measureCtx.font = UI(500, BF); const lines = []; let line = '';
  for (const w of M.text.split(' ')){ const t = line ? line + ' ' + w : w; if (measureCtx.measureText(t).width > BMAX && line){ lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  const tw = Math.max(...lines.map((l) => measureCtx.measureText(l).width));
  measureCtx.font = UI(600, BMETA); const mw = measureCtx.measureText(metaOf(M)).width + (M.who === 'c' ? 20 : 0) + (M.time ? measureCtx.measureText(M.time).width + 28 : 0);
  return { lines, w: Math.ceil(Math.max(tw, mw, 90) * 1.08 + BPAD * 2), h: Math.ceil(BPAD * 2 + 26 + lines.length * BLH - 4) };
}
function drawBubble(g, w, h, r, M, lines){
  if (M.who === 'b'){ const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#18A3C6'); gr.addColorStop(1, C.deep); rr(g, 0, 0, w, h, r); g.fillStyle = gr; g.fill(); }
  else fillRR(g, 0, 0, w, h, r, M.who === 'h' ? '#EDE9FE' : '#FFFFFF');
  const mc = M.who === 'b' ? 'rgba(255,255,255,.8)' : M.who === 'h' ? C.purple : C.ink2;
  let mx = BPAD;
  if (M.who === 'c'){ g.fillStyle = { wa: C.wa, site: C.petrol, mail: '#F97316' }[M.ch]; g.beginPath(); g.arc(BPAD + 6, BPAD + 11, 6, 0, 7); g.fill(); mx += 20; }
  txt(g, metaOf(M), mx, BPAD + 11, UI(600, BMETA), mc);
  if (M.time) txt(g, M.time, w - BPAD, BPAD + 11, UI(500, BMETA - 1), mc, 'right');
  lines.forEach((l, k) => txt(g, l, BPAD, BPAD + 30 + BLH / 2 + k * BLH, UI(500, BF), M.who === 'b' ? '#FFFFFF' : C.ink));
}
// cartões que entram na conversa
const CARDS = {
  lead: { w: 1.95, h: 1.06, draw(g, w, h, r){
    fillRR(g, 0, 0, w, h, r, '#FFFFFF'); strokeRR(g, 1.5, 1.5, w - 3, h - 3, r, '#A5F3FC', 3);
    tile(g, 22, 20, 44, 'leads'); txt(g, 'Nova lead no Senvia OS', 80, 34, UI(700, 19), C.ink); txt(g, 'criada pelo assistente', 80, 56, UI(400, 14), C.ink2);
    [['Nome', 'Sofia Pinto'], ['Serviço', 'Maquilhagem de noiva'], ['Data', '14 de junho'], ['Pessoas', '4'], ['Origem', 'WhatsApp'], ['Atribuída a', 'Inês Duarte']].forEach(([l, v], k) => {
      const x = 22 + (k % 2) * (w / 2 - 6), y = 98 + Math.floor(k / 2) * 66;
      fillRR(g, x, y, w / 2 - 34, 56, 12, C.soft); txt(g, l, x + 14, y + 18, UI(500, 13), C.ink2); txt(g, v, x + 14, y + 39, UI(600, 16), C.ink, 'left', w / 2 - 62); });
  } },
  cal: { w: 1.95, h: 0.78, draw(g, w, h, r){
    fillRR(g, 0, 0, w, h, r, '#FFFFFF'); strokeRR(g, 1.5, 1.5, w - 3, h - 3, r, '#FECDD3', 3);
    tile(g, 22, 22, 50, 'agenda'); txt(g, 'Reunião marcada', 88, 38, UI(700, 19), C.ink); txt(g, 'Quinta, 12 de março · 10:00', 88, 62, UI(500, 15), C.ink2);
    fillRR(g, 22, 100, w - 44, 92, 14, '#ECFDF5'); g.fillStyle = C.green; g.beginPath(); g.arc(56, 146, 16, 0, 7); g.fill(); glyph(g, 'check', 56, 146, 20, '#FFFFFF', 30);
    txt(g, 'Hugo Matos · confirmou', 84, 134, UI(600, 16), '#065F46'); txt(g, 'Na agenda da equipa e no WhatsApp', 84, 160, UI(400, 14), '#047857', 'left', w - 120);
  } },
  hand: { w: 1.95, h: 0.56, draw(g, w, h, r){
    fillRR(g, 0, 0, w, h, r, '#FFFFFF'); strokeRR(g, 1.5, 1.5, w - 3, h - 3, r, '#DDD6FE', 3);
    avatar(g, 52, h / 2, 28, 'ID', '#7C3AED'); txt(g, 'A Inês Duarte entrou na conversa', 96, h / 2 - 14, UI(700, 17), C.ink, 'left', w - 116);
    txt(g, 'Recebeu o resumo do pedido', 96, h / 2 + 14, UI(400, 14), C.ink2);
  } },
};
const ITEMS = {};
function makeItem(id){
  let K;
  if (id[0] === '@'){ const D = CARDS[id.slice(1)]; K = makeCard(chat, D.w, D.h, 0xFFFFFF, D.draw, 0.1); K.side = 'c'; }
  else {
    const M = MSG[id], S = bubbleSize(M);
    K = makeCard(chat, S.w / PXU, S.h / PXU, M.who === 'b' ? 0x0B8DB2 : M.who === 'h' ? 0xEDE9FE : 0xFFFFFF, (g, w, h, r) => drawBubble(g, w, h, r, M, S.lines), 0.13);
    K.side = M.who === 'c' ? 'l' : 'r'; K.m = M;
  }
  Object.assign(K, { id, app: 0, sx: 0, sy: 0, fresh: true, ph: rnd() * 6.28 });
  ITEMS[id] = K; return K;
}
Object.values(SCENES).forEach((S) => S.msgs.forEach(([id]) => { if (!ITEMS[id]) makeItem(id); }));

// "a escrever...": uma bolha com três pontos que saltam
const typing = (() => {
  const g = new THREE.Group(); chat.add(g);
  const m = new THREE.MeshPhysicalMaterial({ color: 0x0B8DB2, roughness: 0.35, clearcoat: 0.6, transparent: true });
  const slab = new THREE.Mesh(slabGeo(0.7, 0.32, 0.05, 0.15), m); slab.castShadow = true; g.add(slab);
  const dm = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true });
  const dots = [-0.15, 0, 0.15].map((x) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), dm); d.position.set(x, 0, 0.045); g.add(d); return d; });
  g.visible = false;
  return { g, dots, mats: [m, dm], slab, app: 0, sx: 0, sy: 0, H: 0.32, W: 0.7 };
})();

// o assistente: uma cabecinha com dois olhos, ao lado do nome da clínica
const bot = (() => {
  const g = new THREE.Group(); chat.add(g);
  const body = new THREE.MeshPhysicalMaterial({ color: 0x0B8DB2, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, emissive: new THREE.Color('#0E86A8'), emissiveIntensity: 0 });
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.54, 0.48, 5, 0.18), body); head.castShadow = true; g.add(head);
  const em = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const eyes = [-0.12, 0.12].map((x) => { const e = new THREE.Mesh(new RoundedBoxGeometry(0.085, 0.16, 0.03, 2, 0.04), em); e.position.set(x, 0.03, 0.245); g.add(e); return e; });
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12, 8), body); stalk.position.y = 0.33; g.add(stalk);
  const tipM = new THREE.MeshBasicMaterial({ color: 0x25D366 });
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), tipM); tip.position.y = 0.41; g.add(tip);
  return { g, body, eyes, tip, st: { x: 0, y: 0, z: 0, s: 0.0 } };
})();
// o nome da clínica, por cima da conversa
const head = makeCard(chat, 1.5, 0.36, 0xFFFFFF, (g, w, h, r) => {
  fillRR(g, 0, 0, w, h, r, '#FFFFFF');
  txt(g, 'Clínica Aurora', 24, h / 2 - 12, UI(700, 18), C.ink);
  g.fillStyle = C.wa; g.beginPath(); g.arc(30, h / 2 + 15, 6, 0, 7); g.fill(); txt(g, 'Assistente · online', 44, h / 2 + 15, UI(500, 14), C.ink2);
}, 0.17);
head.app = 0;

// canais: três cubos (WhatsApp, chat do site e email) de onde as mensagens partem
const toolGeo = new RoundedBoxGeometry(0.52, 0.52, 0.52, 4, 0.13), decalGeo = new THREE.PlaneGeometry(0.34, 0.34);
const SRC = ['wa', 'site', 'mail'].map((ch, k) => {
  const g = new THREE.Group(); chat.add(g);
  const mat = new THREE.MeshPhysicalMaterial({ color: ICONS[ch].c[1], roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12, transparent: true });
  const b = new THREE.Mesh(toolGeo, mat); b.castShadow = true; g.add(b);
  const dm = new THREE.MeshBasicMaterial({ map: iconTex(ICONS[ch].icon), transparent: true, depthWrite: false, toneMapped: false });
  const f = new THREE.Mesh(decalGeo, dm); f.position.z = 0.265; g.add(f);
  g.visible = false;
  return { ch, k, g, mat, dm, app: 0, pulse: 0, pos: new THREE.Vector3() };
});
const SRC_BY = Object.fromEntries(SRC.map((s) => [s.ch, s]));

// dúvidas: o que o assistente sabe, em fichas por trás da conversa
const KN = [['doc', 'Tabela de preços', 'Atualizada em março'], ['clock', 'Horários', 'Seg a sáb'], ['star', 'Serviços', '24 tratamentos'], ['pin', 'Morada e estacionamento', 'Leiria']].map(([ic, t, s], k) => {
  const K = makeCard(chat, 1.3, 0.44, 0xFFFFFF, (g, w, h, r, lit) => {
    fillRR(g, 0, 0, w, h, r, '#FFFFFF'); if (lit) strokeRR(g, 2, 2, w - 4, h - 4, r, C.petrol, 4);
    tile(g, 16, (h - 46) / 2, 46, ic); txt(g, t, 74, h / 2 - 11, UI(700, 16), C.ink, 'left', w - 88); txt(g, s, 74, h / 2 + 13, UI(400, 13), C.ink2, 'left', w - 88);
  }, 0.1);
  return Object.assign(K, { k, app: 0, lit: 0, litDrawn: false });
});

// diagnóstico: as perguntas recebidas, agrupadas por assunto
const miniTex = (() => { const K = mkCv(150, 66), g = begin(K); fillRR(g, 0, 0, 150, 66, 22, '#FFFFFF'); fillRR(g, 18, 18, 100, 10, 5, '#CBD5E1'); fillRR(g, 18, 38, 70, 10, 5, '#E2E8F0'); K.tex.needsUpdate = true; return K.tex; })();
const STACKS = [6, 5, 3], MINIS = [];
STACKS.forEach((n, s) => { for (let k = 0; k < n; k++){
  const g = new THREE.Group(); chat.add(g);
  const m = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, roughness: 0.35, clearcoat: 0.6, transparent: true });
  const slab = new THREE.Mesh(slabGeo(0.5, 0.22, 0.04, 0.1), m); slab.castShadow = true; g.add(slab);
  const fm = new THREE.MeshBasicMaterial({ map: miniTex, transparent: true, toneMapped: false }); const f = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.22), fm); f.position.z = 0.032; g.add(f);
  g.visible = false;
  MINIS.push({ g, mats: [m, fm], slab, s, k, i: MINIS.length, from: new THREE.Vector3((rnd() - 0.5) * 3.4, (rnd() - 0.3) * 2.6, (rnd() - 0.5) * 1.4), rz: (rnd() - 0.5) * 0.8, app: 0 });
} });
const LABELS = [['Preços', '42%'], ['Marcações', '35%'], ['Horários', '23%']].map(([a, b], k) => Object.assign(makeCard(chat, 0.92, 0.32, 0x0B8DB2, (g, w, h, r) => {
  const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#18A3C6'); gr.addColorStop(1, C.deep); rr(g, 0, 0, w, h, r); g.fillStyle = gr; g.fill();
  txt(g, a, 18, h / 2 + 1, UI(600, 16), '#FFFFFF'); txt(g, b, w - 16, h / 2 + 1, UI(700, 16), '#FFFFFF', 'right');
}, 0.16), { k, app: 0 }));

// treino: os documentos da clínica entram no assistente
const DOCS = [['Tabela de preços', 'PDF'], ['Horários', 'Página'], ['Perguntas frequentes', 'Documento'], ['Site da clínica', 'Site']].map(([t, s], k) => Object.assign(makeCard(chat, 0.78, 0.98, 0xFFFFFF, (g, w, h, r) => {
  fillRR(g, 0, 0, w, h, r, '#FFFFFF'); g.save(); rr(g, 0, 0, w, h, r); g.clip(); g.fillStyle = C.petrol; g.fillRect(0, 0, w, 10); g.restore();
  tile(g, 18, 26, 44, 'doc'); txt(g, s.toUpperCase(), w - 16, 48, UI(700, 11), C.ink3, 'right');
  const lines = t.split(' '); let l1 = t, l2 = ''; if (t.length > 14){ const mid = Math.ceil(lines.length / 2); l1 = lines.slice(0, mid).join(' '); l2 = lines.slice(mid).join(' '); }
  txt(g, l1, 18, 104, UI(700, 16), C.ink, 'left', w - 30); if (l2) txt(g, l2, 18, 126, UI(700, 16), C.ink, 'left', w - 30);
  [0.86, 0.7, 0.8, 0.55].forEach((f, j) => fillRR(g, 18, 158 + j * 26, (w - 36) * f, 9, 4.5, '#E2E8F0'));
}, 0.06), { k, app: 0, ang: -2.4 + k * 1.15 }));
const trained = Object.assign(makeCard(chat, 2.2, 0.34, 0xFFFFFF, (g, w, h, r) => {
  fillRR(g, 0, 0, w, h, r, '#ECFDF5'); g.fillStyle = C.green; g.beginPath(); g.arc(28, h / 2, 13, 0, 7); g.fill(); glyph(g, 'check', 28, h / 2, 16, '#FFFFFF', 30);
  txt(g, 'Respostas testadas contigo antes de publicar', 52, h / 2 + 1, UI(600, 16), '#065F46', 'left', w - 66);
}, 0.17), { app: 0 });

// publicação: o assistente ligado aos três canais, com o resumo da semana
const LINK_GEO = new THREE.CylinderGeometry(0.014, 0.014, 1, 8);
const LINKS = SRC.map(() => { const m = new THREE.MeshBasicMaterial({ color: 0x3FC6E8, transparent: true, opacity: 0 }); const l = new THREE.Mesh(LINK_GEO, m); chat.add(l);
  const dm = new THREE.MeshBasicMaterial({ color: 0x8FF0FF, transparent: true, opacity: 0 }); const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), dm); chat.add(dot); return { l, m, dot, dm }; });
const report = Object.assign(makeCard(chat, 2.3, 0.66, 0xFFFFFF, (g, w, h, r) => {
  fillRR(g, 0, 0, w, h, r, '#FFFFFF'); txt(g, 'Esta semana', 24, 32, UI(600, 14), C.ink2);
  [['142', 'conversas'], ['38', 'marcações'], ['9', 'para a equipa']].forEach(([n, l], k) => { const x = 24 + k * (w - 48) / 3; txt(g, n, x, 88, UI(700, 34), C.ink); txt(g, l, x, 126, UI(500, 14), C.ink2); });
}, 0.14), { app: 0 });

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
// balões soltos a passar perto da câmara
const DEB = [['chat', '#25D366'], ['spark', '#0E86A8'], ['mail', '#F97316'], ['chat', '#0E86A8'], ['calendar', '#F43F5E'], ['chat', '#7C3AED'], ['users', '#0891B2'], ['chat', '#25D366']].slice(0, innerWidth < 760 ? 5 : 8);
const debrisGeo = new RoundedBoxGeometry(0.66, 0.5, 0.36, 3, 0.15);
const debris = DEB.map(([ic, col], i) => {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const mat = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true });
  g.add(new THREE.Mesh(debrisGeo, mat));
  const dm = new THREE.MeshBasicMaterial({ map: iconTex(ic), transparent: true, depthWrite: false, toneMapped: false });
  const f = new THREE.Mesh(decalGeo, dm); f.position.z = 0.185; g.add(f);
  fgScene.add(g);
  return { g, mat, dm, right: i % 3 !== 0, rx: rnd(), y0: rnd(), d: 4.2 + rnd() * 4.2, dir: rnd() < .5 ? -1 : 1, sp: 0.3 + rnd() * 0.5 };
});
const FG_OP = [0.4, 0.25, 0.2, 0.5, 0.5];
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
const conf = new THREE.InstancedMesh(new RoundedBoxGeometry(0.16, 0.12, 0.05, 2, 0.02), confMat, CONF_N);
conf.frustumCulled = false; conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
const confData = [], CONF_COLS = ['#9FB4BE', '#7FB6C6', '#C5D3DA', '#86EFAC'].map(c => new THREE.Color(c));
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
  L.camZ = L.mobile ? 12 : (w / h < 1.3 ? 12 : 10);
  L.chatS = L.mobile ? 0.82 : 0.95;
  const textW = Math.min(608, w * 0.46), gap = 36;
  L.wppAt = (d) => d * Math.tan(THREE.MathUtils.degToRad(17)) * (w / h) / (w / 2);
  const wpp = L.wppAt(L.camZ), objPx = 3.5 * L.chatS / wpp;
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
    case 'bottom': return [0, 0.85, 0.8];
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

/* ================= câmara ================= */
const camPos = new THREE.Vector3(0, 0.5, 10), camLook = new THREE.Vector3(), camPosT = new THREE.Vector3(), camLookT = new THREE.Vector3();
function cameraTarget(ch, p){
  const Z = L.camZ, sc = REDUCE ? 0.3 : 1, LY = L.mobile ? MLY : 0;
  if (ch === 3){ camPosT.set(Math.sin(p * 0.9 - 0.45) * 1.6 * sc, 0.9 - p * 0.3, Z - 0.5); camLookT.set(0, LY, 0); return; }
  camPosT.set(Math.sin(p * 0.7 - 0.35) * 1.2 * sc, 0.4 + p * 0.25, Z - 0.3 - p * 0.3); camLookT.set(0, LY, 0);
}
const ENV = {
  day: { bg: new THREE.Color('#EEF2F3'), dot: new THREE.Color('#9FB4BE'), glow: new THREE.Color('#7CC6DA'), glowA: 0.55, env: 0.95 },
  night: { bg: new THREE.Color('#0B1F2A'), dot: new THREE.Color('#2C86A3'), glow: new THREE.Color('#1FAF5B'), glowA: 0.3, env: 0.45 },
};
let nightAmt = 0;

/* ================= a conversa em cada momento ================= */
const chatSt = { x: 0, y: 0, ry: 0, s: 0.95, oy: 0 };
const tmpV = new THREE.Vector3(), tmpA = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
// lugares dos cubos dos canais: ao lado da conversa (canais) ou à volta do assistente (publicação)
const SRC_CANAIS = [[-COL_W / 2 - 0.5, 0.75], [-COL_W / 2 - 0.5, -0.05], [-COL_W / 2 - 0.5, -0.85]];
const SRC_LIVE = [[-1.7, 0.35], [1.7, 0.35], [0, 1.55]];
function updateChat(cur, beat, bp, p, t, dt){
  const key = `${cur}.${beat}`, S = SCENES[key] || { msgs: [] };
  const prog = S.timed ? Math.max(clamp((t - 0.7) / 2.4, 0, 1), bp * 1.6) : (chapters[cur].beats === 1 ? p : bp);
  const tw = S.tw || 0.1;
  // quem já está na conversa e se o assistente está a escrever
  const vis = []; let typingFor = null;
  for (const [id, at] of S.msgs){
    if (prog >= at) vis.push(id);
    else { const M = MSG[id]; if (M && M.who !== 'c' && prog >= at - tw) typingFor = id; break; }
  }
  // empilha de cima para baixo; quando passa do fundo, a conversa sobe (como num telemóvel)
  const stack = vis.map((id) => ITEMS[id]); if (typingFor) stack.push(typing);
  let y = TOPY; const slots = stack.map((K) => { const H = K === typing ? typing.H : K.h; const s = y - H / 2; y -= H + GAP; return s; });
  const bottom = y + GAP, shift = bottom < BOTY ? BOTY - bottom : 0;
  // altura ocupada (do nome da clínica à última mensagem), para centrar o conjunto
  let cTop = S.noHead ? 0 : TOPY + 0.62, cBot = stack.length ? bottom + shift : TOPY - 0.4;
  if (S.faq) cBot = Math.min(cBot, -1.4);
  if (S.noHead) cBot = 0;
  stack.forEach((K, k) => {
    const W = K === typing ? typing.W : K.w, sd = K === typing ? 'r' : K.side;
    K.tx = sd === 'l' ? -COL_W / 2 + W / 2 : sd === 'r' ? COL_W / 2 - W / 2 : 0;
    K.ty = slots[k] + shift; K.on = true;
  });
  // mensagens e cartões
  Object.values(ITEMS).forEach((K) => {
    const on = vis.includes(K.id);
    if (on && K.app < 0.02){ K.sx = K.tx; K.sy = K.ty; if (K.m?.ch && S.sources){ K.from = SRC_BY[K.m.ch].pos.clone(); SRC_BY[K.m.ch].pulse = 1; } else K.from = null; }
    K.app += ((on ? 1 : 0) - K.app) * damp(dt, on ? 5 : 8);
    if (K.app < 0.01){ K.g.visible = false; return; }
    if (on){ K.sx += (K.tx - K.sx) * damp(dt, 7); K.sy += (K.ty - K.sy) * damp(dt, 7); }
    const e = ease(K.app), zb = K.side === 'c' ? 0.42 : K.side === 'r' ? 0.16 : 0.06;
    const fx = K.from ? K.from.x : K.sx, fy = K.from ? K.from.y : K.sy - 0.35, fz = K.from ? K.from.z : zb + 0.45;
    K.g.position.set(lerp(fx, K.sx, e), lerp(fy, K.sy, e), lerp(fz, zb, e) + Math.sin(t * 0.8 + K.ph) * 0.02 * (REDUCE ? 0 : 1));
    K.g.rotation.set((1 - e) * 0.35, (K.side === 'l' ? 0.07 : K.side === 'r' ? -0.07 : 0) + Math.sin(t * 0.6 + K.ph) * 0.03 * (REDUCE ? 0 : 1), 0);
    K.g.scale.setScalar(Math.max(0.0001, on ? backOut(K.app) : 0.85 + 0.15 * K.app));
    // as mais antigas desvanecem ao subir por trás do nome da clínica
    const fade = 1 - smooth(TOPY - 0.1, TOPY + 0.25, K.sy + K.h / 2);
    setOp(K, Math.min(1, K.app * 1.3) * fade);
  });
  // a escrever...
  const tyOn = !!typingFor;
  if (tyOn && typing.app < 0.02){ typing.sx = typing.tx; typing.sy = typing.ty; }
  typing.app += ((tyOn ? 1 : 0) - typing.app) * damp(dt, tyOn ? 7 : 12);
  typing.g.visible = typing.app > 0.01;
  if (typing.g.visible){
    if (tyOn){ typing.sx += (typing.tx - typing.sx) * damp(dt, 7); typing.sy += (typing.ty - typing.sy) * damp(dt, 7); }
    typing.g.position.set(typing.sx, typing.sy, 0.16); typing.g.scale.setScalar(Math.max(0.0001, backOut(typing.app)));
    typing.dots.forEach((d, k) => { d.position.y = Math.max(0, Math.sin(t * 9 - k * 0.9)) * 0.06; });
    typing.mats.forEach((m) => { m.opacity = typing.app; });
  }
  // nome da clínica e o assistente
  const conv = !S.noHead;
  head.app += ((conv ? 1 : 0) - head.app) * damp(dt, 5);
  head.g.position.set(COL_W / 2 - 0.62 - 0.75, TOPY + 0.44, 0.35); head.g.rotation.set(0, -0.05, 0);
  head.g.scale.setScalar(Math.max(0.0001, 0.9 + 0.1 * head.app)); setOp(head, head.app);
  const bs = bot.st, talk = tyOn ? 1 : 0;
  let bt = { x: COL_W / 2 - 0.3, y: TOPY + 0.46, z: 0.25, s: 0.78 };
  if (S.train) bt = { x: 0, y: 0.25, z: 0.3, s: 1.7 };
  else if (S.live) bt = { x: 0, y: 0.15, z: 0.3, s: 1.3 };
  else if (S.diag) bt = { x: 0, y: TOPY + 0.7, z: -0.4, s: 0.0 };
  for (const k in bt) bs[k] += (bt[k] - bs[k]) * damp(dt, 4);
  bot.g.position.set(bs.x, bs.y + (REDUCE ? 0 : Math.sin(t * 2.2) * 0.03 + Math.abs(Math.sin(t * 8)) * 0.04 * talk), bs.z);
  bot.g.rotation.set(0.05, Math.sin(t * 0.7) * 0.25 * (REDUCE ? 0 : 1) - 0.2 * side(), 0);
  bot.g.scale.setScalar(Math.max(0.0001, bs.s)); bot.g.visible = bs.s > 0.02;
  const blink = (t % 3.6) < 0.12 ? 0.15 : 1; bot.eyes.forEach((e) => { e.scale.y = blink; });
  // canais
  SRC.forEach((Sc, k) => {
    const want = S.sources ? 1 : S.live ? 1 : 0, P = S.live ? SRC_LIVE[k] : SRC_CANAIS[k], mob = L.mobile && !S.live;
    Sc.app += (want - Sc.app) * damp(dt, 4); Sc.pulse *= Math.exp(-dt * 3);
    Sc.g.visible = Sc.app > 0.01; if (!Sc.g.visible) return;
    Sc.pos.set(mob ? -COL_W / 2 - 0.1 : P[0] * (L.mobile ? 0.72 : 1), P[1] + Math.sin(t * 1.1 + k) * 0.05 * (REDUCE ? 0 : 1), mob ? 0.3 : 0.45);
    Sc.g.position.copy(Sc.pos); Sc.g.rotation.set(0.15, t * 0.3 + k + Sc.pulse * 1.5, 0);
    Sc.g.scale.setScalar(Math.max(0.0001, backOut(Sc.app) * (1 + Sc.pulse * 0.25) * (mob ? 0.62 : 1)));
    Sc.mat.opacity = Sc.dm.opacity = Sc.app;
  });
  // dúvidas: as fichas atrás; a tabela de preços vem à frente quando o assistente responde
  const fOn = S.faq ? 1 : 0, f2 = vis.includes('f2');
  KN.forEach((K) => {
    K.app += (fOn - K.app) * damp(dt, 4);
    const litT = f2 && K.k === 0 ? 1 : 0; K.lit += (litT - K.lit) * damp(dt, 5);
    if ((K.lit > 0.5) !== K.litDrawn){ K.litDrawn = K.lit > 0.5; K.redraw(K.litDrawn); }
    if (K.app < 0.01){ K.g.visible = false; return; }
    const gx = K.k % 2 ? 0.7 : -0.7, gy = K.k < 2 ? -0.62 : -1.16;
    K.g.position.set(gx, gy + K.lit * 0.12, 0.12 + K.lit * 0.55 - (1 - K.app) * 0.6);
    K.g.rotation.set(0, (K.k % 2 ? -0.08 : 0.08), 0);
    K.g.scale.setScalar(Math.max(0.0001, backOut(K.app) * (1 + K.lit * 0.12)));
    setOp(K, K.app * (0.75 + 0.25 * K.lit + (f2 ? 0 : 0.25)));
  });
  // diagnóstico: as perguntas juntam-se em três pilhas
  const dOn = S.diag ? 1 : 0;
  MINIS.forEach((Mn) => {
    Mn.app += (dOn - Mn.app) * damp(dt, 4);
    if (Mn.app < 0.01){ Mn.g.visible = false; return; }
    const f = dOn ? smooth(0.08 + Mn.i * 0.02, 0.4 + Mn.i * 0.02, bp) : 1;
    const tx = (Mn.s - 1) * 1.05, ty = -0.95 + Mn.k * 0.27;
    Mn.g.position.set(lerp(Mn.from.x, tx, f), lerp(Mn.from.y, ty, f), lerp(Mn.from.z, 0.2, f));
    Mn.g.rotation.set(0, (1 - f) * 0.6, lerp(Mn.rz, 0, f));
    Mn.g.scale.setScalar(Math.max(0.0001, backOut(Mn.app)));
    setOp(Mn, Mn.app);
  });
  LABELS.forEach((K) => {
    const want = S.diag && bp > 0.45 + K.k * 0.06 ? 1 : 0; K.app += (want - K.app) * damp(dt, 5);
    if (K.app < 0.01){ K.g.visible = false; return; }
    K.g.position.set((K.k - 1) * 1.05, -1.33, 0.35); K.g.scale.setScalar(Math.max(0.0001, backOut(K.app))); setOp(K, K.app);
  });
  // treino: os documentos entram no assistente, um a um
  DOCS.forEach((K) => {
    const want = S.train ? 1 : 0; K.app += (want - K.app) * damp(dt, 4);
    if (K.app < 0.01){ K.g.visible = false; return; }
    const f = S.train ? smooth(0.12 + K.k * 0.14, 0.32 + K.k * 0.14, bp) : 0;
    const R = 1.75, ox = Math.cos(K.ang) * R * 1.05, oy = Math.sin(K.ang) * R * 0.62 + 0.2;
    K.g.position.set(lerp(ox, bs.x, f), lerp(oy, bs.y, f), lerp(0.2, bs.z, f));
    K.g.rotation.set(0, lerp(-ox * 0.12, 0, f), lerp(Math.sin(K.ang) * 0.12, 0, f) + f * 2);
    K.g.scale.setScalar(Math.max(0.0001, backOut(K.app) * (1 - f * 0.9)));
    setOp(K, K.app * (1 - smooth(0.85, 1, f)));
  });
  const eatenAll = S.train ? smooth(0.7, 0.85, bp) : 0;
  bot.body.emissiveIntensity += ((S.train ? 0.15 + eatenAll * 0.5 : S.live ? 0.2 : 0) * (1 + nightAmt) - bot.body.emissiveIntensity) * damp(dt, 3);
  trained.app += ((S.train && bp > 0.78 ? 1 : 0) - trained.app) * damp(dt, 5);
  trained.g.position.set(0, -1.25, 0.5); trained.g.scale.setScalar(Math.max(0.0001, backOut(trained.app))); setOp(trained, trained.app);
  // publicação: ligações a brilhar entre o assistente e os canais, e o resumo da semana
  LINKS.forEach((Lk, k) => {
    const a = S.live ? smooth(0.1 + k * 0.1, 0.35 + k * 0.1, bp) : 0;
    const Sc = SRC[k]; tmpA.set(bs.x, bs.y, bs.z); tmpV.copy(Sc.pos).sub(tmpA); const len = tmpV.length();
    Lk.l.position.copy(tmpA).addScaledVector(tmpV, 0.5 * a); Lk.l.scale.set(1, Math.max(0.0001, len * a), 1);
    Lk.l.quaternion.setFromUnitVectors(UP, tmpV.clone().normalize());
    Lk.m.opacity += ((a > 0.01 ? 0.75 : 0) - Lk.m.opacity) * damp(dt, 6); Lk.l.visible = Lk.m.opacity > 0.01;
    const u = (t * 0.45 + k / 3) % 1; Lk.dot.position.copy(Sc.pos).addScaledVector(tmpV, -u);
    Lk.dm.opacity = a > 0.95 ? 0.9 * Math.sin(Math.PI * u) : 0; Lk.dot.visible = Lk.dm.opacity > 0.01;
  });
  report.app += ((S.live && bp > 0.5 ? 1 : 0) - report.app) * damp(dt, 5);
  report.g.position.set(0, -1.28, 0.5); report.g.scale.setScalar(Math.max(0.0001, backOut(report.app))); setOp(report, report.app);

  // a conversa toda desliza para o lado oposto ao texto
  const m = L.mobile;
  let ty = CY - 0.05, ts = L.chatS * CS;
  if (m){
    const H = innerHeight, r = state.copyEl?.getBoundingClientRect(); let top = 70, bot = H - 34;
    if (r && state.mpos === 'low') bot = Math.max(top + 120, r.top - 10); else if (r && state.mpos === 'high') top = Math.min(bot - 120, r.bottom + 10);
    const ppu = H / (2 * L.camZ * Math.tan(THREE.MathUtils.degToRad(17)));
    ts = Math.min(L.chatS, (bot - top) * 0.94 / ppu / Math.max(1, cTop - cBot));
    ty = camLook.y + (H / 2 - (top + bot) / 2) / ppu;
  }
  stepTo(chatSt, { x: CX, y: ty, ry: m ? 0 : -0.28 * side(), s: ts, oy: -(cTop + cBot) / 2 }, damp(dt, 2.6));
  chat.position.set(chatSt.x, chatSt.y + chatSt.oy * chatSt.s + (REDUCE ? 0 : Math.sin(t * 0.8) * 0.04), 0);
  chat.rotation.set(0.04 + VEL * 0.03, chatSt.ry, 0);
  chat.scale.setScalar(chatSt.s);
}
function stepTo(st, tg, k){ for (const key in tg) st[key] += (tg[key] - st[key]) * k; }

/* ================= ciclo ================= */
let last = performance.now(), t0 = last, slowFrames = 0;
let VEL = 0, ENERGY = 0, SY = 0, lastY = scrollY;
const lag = { cur: -1, pos: 'left', mpos: 'mid', beat: 0, wantPos: 'left', wantMpos: 'mid', wantBeat: 0, t: 0 };
const MLY_T = { high: 0, low: 0, mid: 0 };
let MLY = 0;
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

  if (cur !== lag.cur){ lag.cur = cur; lag.pos = lag.wantPos = state.pos; lag.mpos = lag.wantMpos = state.mpos; lag.beat = lag.wantBeat = beat; }
  else if (state.pos !== lag.wantPos || state.mpos !== lag.wantMpos || beat !== lag.wantBeat){ lag.wantPos = state.pos; lag.wantMpos = state.mpos; lag.wantBeat = beat; lag.t = now; }
  if (now - lag.t > 220){ lag.pos = lag.wantPos; lag.mpos = lag.wantMpos; lag.beat = lag.wantBeat; }

  const [cxT, cyT, csT] = posSpec(lag.pos), kp = damp(dt, REDUCE ? 6 : 2.4);
  CX += (cxT - CX) * kp; CY += (cyT - CY) * kp; CS += (csT - CS) * kp;
  MLY += ((L.mobile ? MLY_T[lag.mpos] : 0) - MLY) * kp;

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

  updateChat(cur, lag.beat, bp, p, t, dt);

  const nightGlow = nightAmt * 0.5;
  confMat.emissive.setRGB(0.02 * nightGlow, 0.35 * nightGlow, 0.3 * nightGlow);
  for (let i = 0; i < CONF_N; i++){
    const d = confData[i];
    dummy.position.set(d.x, d.y + Math.sin(t * 0.4 * d.sp + d.ph) * 0.15 + VEL * 0.35, d.z);
    dummy.rotation.set(d.ph + t * 0.2 * d.sp + SY * 0.8 * d.dir + ENERGY * 1.2, d.ph * 2 + t * 0.15 + SY * 0.6 * d.dir, 0);
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
  const tanH = Math.tan(THREE.MathUtils.degToRad(17)), aspect = innerWidth / innerHeight;
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
// as mensagens usam a Inter: quando a letra chegar, redesenha tudo
const lastChapterEl = chapters[chapters.length - 1].el;
let worldHidden = false;
function drawAll(){ Object.values(ITEMS).forEach((K) => K.redraw()); head.redraw(); KN.forEach((K) => K.redraw(K.litDrawn)); LABELS.forEach((K) => K.redraw()); DOCS.forEach((K) => K.redraw()); trained.redraw(); report.redraw(); }
Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 20px Inter`))).then(drawAll).catch(() => {});
renderer.setAnimationLoop(frame);
// o mundo 3D entra com fade depois do primeiro frame (o texto já está à vista)
requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('sv2').classList.add('ready3d')));
