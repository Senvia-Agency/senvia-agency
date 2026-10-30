import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';

/* ================= conteúdo ================= */
const ROOT = document.getElementById('sv2');
// o ecrã que a app mostra em cada capítulo e momento ('idle' = painel sem cartões a saltar; 'explode' = painel com as áreas)
const MOD_BY = [['painel', 'explode'], ['idle', 'idle'], ['inbox', 'email', 'feed'], ['leads', 'proposals', 'sales'], ['finance', 'finance2'], ['auto', 'otto'], ['agenda', 'tasks'], ['idle'], ['painel']];
const SCREEN = { idle: 'painel', explode: 'painel' };
// o item aceso na barra lateral
const ACTIVE = { idle: 'painel', explode: 'painel', finance2: 'finance', otto: 'auto' };

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
const damp = (dt, rate) => 1 - Math.exp(-dt * rate);
const backOut = (x) => x <= 0 ? 0 : 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
function rng(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = rng(2027);
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function stepTo(st, tg, k){ for (const key in tg) st[key] += (tg[key] - st[key]) * k; }

/* ================= renderer e cena ================= */
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
let DPR = Math.min(devicePixelRatio, 2);
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

const FLOOR_Y = innerWidth < 760 ? -3.4 : -2.3;
// chão com grelha de pontos, a desvanecer com a distância
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
const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.ShadowMaterial({ color: 0x0B1F2A, opacity: 0.12 }));
shadowCatcher.rotation.x = -Math.PI / 2; shadowCatcher.position.set(0, FLOOR_Y + 0.002, -40); shadowCatcher.receiveShadow = true; scene.add(shadowCatcher);

// brilho de fundo preso à câmara (muda de cor de dia para a noite)
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

/* ================= desenho da interface do Senvia OS (canvas) ================= */
// Os ecrãs são desenhados à mão em canvas, com a letra (Inter) e as cores do próprio Senvia OS. Dados fictícios.
const Q = innerWidth < 760 ? 0.6 : 1;          // resolução das texturas
const PXU = 300;                                // px de desenho por unidade 3D
const UI = (w, s) => `${w} ${s}px Inter, "Segoe UI", system-ui, sans-serif`;
const C = { ink: '#0F172A', ink2: '#64748B', ink3: '#94A3B8', line: '#E2E8F0', bg: '#F8FAFC', soft: '#F1F5F9', blue: '#2563EB', blue2: '#3B82F6', blueSoft: '#EFF6FF',
  green: '#059669', red: '#DC2626', amber: '#D97706', purple: '#7C3AED', purpleSoft: '#EDE9FE', wa: '#25D366' };
const ST = { g: [C.green, '#DCFCE7'], b: [C.blue, '#DBEAFE'], r: [C.red, '#FEE2E2'], n: ['#475569', '#E2E8F0'], p: [C.purple, '#EDE9FE'], a: [C.amber, '#FEF3C7'] };
// módulos: nome, ícone e as cores do quadradinho (como na barra lateral do Senvia OS)
const MODS = {
  painel: { label: 'Painel', icon: 'grid', c: ['#60A5FA', '#2563EB'] },
  feed: { label: 'Feed', icon: 'news', c: ['#FB7185', '#E11D48'] },
  inbox: { label: 'Caixa de entrada', icon: 'chat', c: ['#A78BFA', '#7C3AED'] },
  email: { label: 'Email', icon: 'at', c: ['#FDBA74', '#F97316'] },
  marketing: { label: 'Marketing', icon: 'mail', c: ['#7DD3FC', '#3B82F6'] },
  tasks: { label: 'Tarefas', icon: 'list', c: ['#6EE7B7', '#10B981'] },
  agenda: { label: 'Agenda', icon: 'calendar', c: ['#FDA4AF', '#F43F5E'] },
  leads: { label: 'Leads', icon: 'users', c: ['#67E8F9', '#0891B2'] },
  clients: { label: 'Clientes', icon: 'user', c: ['#7DD3FC', '#0EA5E9'] },
  proposals: { label: 'Propostas', icon: 'doc', c: ['#93C5FD', '#0284C7'] },
  sales: { label: 'Vendas', icon: 'bag', c: ['#67E8F9', '#0284C7'] },
  prospects: { label: 'Prospects', icon: 'search', c: ['#5EEAD4', '#0D9488'] },
  finance: { label: 'Financeiro', icon: 'wallet', c: ['#6EE7B7', '#059669'] },
  auto: { label: 'Automações', icon: 'flow', c: ['#A5B4FC', '#4F46E5'] },
};
const ICONS = { ...MODS,
  wa: { icon: 'wa', c: ['#4ADE80', '#16A34A'] }, ig: { icon: 'insta', c: ['#FBBF24', '#DB2777'] }, internal: { icon: 'chat', c: ['#C4B5FD', '#7C3AED'] },
  star: { icon: 'star', c: ['#FDE68A', '#F59E0B'] }, check: { icon: 'check', c: ['#6EE7B7', '#059669'] }, clock: { icon: 'clock', c: ['#FCD34D', '#D97706'] },
  warn: { icon: 'clock', c: ['#FCA5A5', '#DC2626'] }, bolt: { icon: 'bolt', c: ['#A5B4FC', '#4F46E5'] }, mega: { icon: 'mega', c: ['#FDBA74', '#EA580C'] },
};
const SIDEBAR = [['Visão geral', ['painel']], ['Comunicação', ['feed', 'inbox', 'email', 'marketing']], ['Trabalho', ['tasks', 'agenda']], ['Comercial', ['leads', 'clients', 'proposals', 'sales', 'prospects']], ['Gestão', ['finance', 'auto']]];

function mkCv(w, h){ const cv = document.createElement('canvas'); cv.width = Math.round(w * Q); cv.height = Math.round(h * Q);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const g = cv.getContext('2d'); return { cv, g, tex, w, h }; }
function begin(C2){ const g = C2.g; g.setTransform(Q * C2.cv.width / (C2.w * Q), 0, 0, Q * C2.cv.height / (C2.h * Q), 0, 0); g.clearRect(0, 0, C2.w, C2.h); return g; }
function fillRR(g, x, y, w, h, r, col){ rr(g, x, y, w, h, r); g.fillStyle = col; g.fill(); }
function strokeRR(g, x, y, w, h, r, col, lw = 1.5){ rr(g, x, y, w, h, r); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); }
function fit(g, s, max){ if (g.measureText(s).width <= max) return s; while (s.length > 1 && g.measureText(s + '…').width > max) s = s.slice(0, -1); return s.trimEnd() + '…'; }
function txt(g, s, x, y, font, col, align = 'left', max = 0){ g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(max ? fit(g, s, max) : s, x, y); }
function spaced(g, s, x, y, font, col, sp = 2, align = 'left'){ g.letterSpacing = `${sp}px`; txt(g, s, x, y, font, col, align); g.letterSpacing = '0px'; }
function wrap(g, s, x, y, maxW, lh, font, col, maxLines = 9){
  g.font = font; let line = '', n = 0;
  for (const w of s.split(' ')){ const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line){ txt(g, line, x, y + n * lh, font, col); n++; line = w; if (n >= maxLines) return n; } else line = t; }
  if (line){ txt(g, line, x, y + n * lh, font, col); n++; } return n;
}
function pill(g, x, y, s, font, fg, bg, padX = 12, h = 30, align = 'left'){
  g.font = font; const w = g.measureText(s).width + padX * 2, X = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  fillRR(g, X, y - h / 2, w, h, h / 2, bg); txt(g, s, X + w / 2, y + 1, font, fg, 'center'); return w;
}
function card(g, x, y, w, h, r = 18, bg = '#FFFFFF', border = C.line){
  g.save(); g.shadowColor = 'rgba(15,23,42,.06)'; g.shadowBlur = 16; g.shadowOffsetY = 4; fillRR(g, x, y, w, h, r, bg); g.restore(); strokeRR(g, x, y, w, h, r, border, 1.5);
}
function btn(g, x, y, w, h, label, primary){
  if (primary){ const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, '#4F8EF7'); gr.addColorStop(1, C.blue); rr(g, x, y, w, h, 12); g.fillStyle = gr; g.fill(); }
  else { fillRR(g, x, y, w, h, 12, '#FFFFFF'); strokeRR(g, x, y, w, h, 12, C.blue2, 2); }
  txt(g, label, x + w / 2, y + h / 2 + 1, UI(600, 16), primary ? '#FFFFFF' : C.blue, 'center');
}
function tile(g, x, y, s, key){
  const M = ICONS[key], gr = g.createLinearGradient(x, y, x, y + s); gr.addColorStop(0, M.c[0]); gr.addColorStop(1, M.c[1]);
  rr(g, x, y, s, s, s * 0.3); g.fillStyle = gr; g.fill(); glyph(g, M.icon, x + s / 2, y + s / 2, s * 0.6, '#FFFFFF', 20);
}
function softTile(g, x, y, s, icon, col){ g.save(); g.globalAlpha = 0.12; fillRR(g, x, y, s, s, s * 0.3, col); g.restore(); glyph(g, icon, x + s / 2, y + s / 2, s * 0.56, col, 20); }
const initials = (n) => n.replace(/[^\p{L}\s&]/gu, ' ').split(/\s+/).filter((w) => w && w !== '&').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
function avatar(g, cx, cy, r, ini, col){ g.fillStyle = col; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); txt(g, ini, cx, cy + 1, UI(600, r * 0.74), '#FFFFFF', 'center'); }
function avatarSoft(g, cx, cy, r, ini, col){ g.save(); g.globalAlpha = 0.14; g.fillStyle = col; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); g.restore(); txt(g, ini, cx, cy + 1, UI(700, r * 0.68), col, 'center'); }
function chDot(g, x, y, ch){ const col = { wa: C.wa, ig: '#DB2777', mail: '#F97316' }[ch]; g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); g.fillStyle = col; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); }
// o símbolo da SENVIA: um losango grande e dois pequenos
function logoMark(g, x, y, s, col){ g.fillStyle = col; [[0, 0, 1], [1.5, -1.33, 0.67], [1.5, 1.33, 0.67]].forEach(([dx, dy, k]) => { g.save(); g.translate(x + dx * s, y + dy * s); g.rotate(Math.PI / 4); rr(g, -s * k, -s * k, s * k * 2, s * k * 2, s * k * 0.3); g.fill(); g.restore(); }); }

// ícones de traço (desenhados numa caixa de 256)
function glyph(g, name, cx, cy, size, col = '#FFFFFF', lw = 18){
  g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(size / 256, size / 256);
  g.strokeStyle = g.fillStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  const P = (pts, close = false) => { g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); g.stroke(); };
  const R = (x, y, w, h, r) => { rr(g, x, y, w, h, r); g.stroke(); };
  const O = (x, y, r, fill = false) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); fill ? g.fill() : g.stroke(); };
  const A = (x, y, r, a, b) => { g.beginPath(); g.arc(x, y, r, a, b); g.stroke(); };
  switch (name){
    case 'grid': R(48, 48, 70, 70, 18); R(138, 48, 70, 70, 18); R(48, 138, 70, 70, 18); R(138, 138, 70, 70, 18); break;
    case 'news': R(54, 46, 148, 164, 22); P([[86, 96], [170, 96]]); P([[86, 132], [170, 132]]); P([[86, 168], [136, 168]]); break;
    case 'chat': R(44, 56, 168, 118, 34); P([[86, 172], [70, 212], [124, 174]]); break;
    case 'at': O(128, 128, 32); A(128, 128, 80, Math.PI * 0.2, Math.PI * 1.95); P([[160, 98], [160, 150], [176, 170], [204, 160], [208, 128]]); break;
    case 'mail': R(44, 66, 168, 124, 20); P([[52, 78], [128, 136], [204, 78]]); break;
    case 'list': [84, 128, 172].forEach((y) => { O(66, y, 11, true); P([[100, y], [200, y]]); }); break;
    case 'check': P([[58, 132], [106, 180], [198, 84]]); break;
    case 'calendar': R(50, 66, 156, 144, 24); P([[50, 112], [206, 112]]); P([[94, 46], [94, 84]]); P([[162, 46], [162, 84]]); break;
    case 'users': O(102, 98, 32); A(102, 214, 62, Math.PI * 1.12, Math.PI * 1.88); O(172, 110, 24); A(180, 204, 44, Math.PI * 1.2, Math.PI * 1.8); break;
    case 'user': O(116, 94, 36); A(116, 222, 74, Math.PI * 1.14, Math.PI * 1.86); P([[166, 168], [186, 188], [218, 150]]); break;
    case 'doc': P([[68, 40], [156, 40], [192, 76], [192, 216], [68, 216]], true); P([[156, 40], [156, 76], [192, 76]]); P([[98, 122], [162, 122]]); P([[98, 158], [162, 158]]); break;
    case 'bag': R(56, 92, 144, 124, 24); A(128, 94, 36, Math.PI, 0); break;
    case 'search': O(110, 110, 60); P([[154, 154], [208, 208]]); break;
    case 'wallet': R(44, 70, 168, 128, 24); P([[44, 108], [212, 108]]); O(170, 152, 11, true); break;
    case 'flow': R(40, 44, 72, 56, 14); R(144, 44, 72, 56, 14); R(92, 156, 72, 56, 14); P([[76, 100], [76, 128], [128, 128], [128, 156]]); P([[180, 100], [180, 128], [128, 128]]); break;
    case 'sheet': R(48, 54, 160, 148, 20); P([[48, 102], [208, 102]]); P([[48, 150], [208, 150]]); P([[102, 54], [102, 202]]); P([[156, 54], [156, 202]]); break;
    case 'euro': A(144, 128, 72, Math.PI * 0.28, Math.PI * 1.72); P([[50, 108], [146, 108]]); P([[50, 148], [140, 148]]); break;
    case 'bolt': P([[142, 36], [74, 142], [126, 142], [112, 220], [186, 108], [132, 108]], true); break;
    case 'bell': g.beginPath(); g.moveTo(60, 180); g.quadraticCurveTo(84, 158, 84, 118); g.quadraticCurveTo(84, 62, 128, 62); g.quadraticCurveTo(172, 62, 172, 118); g.quadraticCurveTo(172, 158, 196, 180); g.closePath(); g.stroke(); P([[110, 210], [146, 210]]); break;
    case 'clock': O(128, 128, 84); P([[128, 80], [128, 132], [162, 152]]); break;
    case 'shield': g.beginPath(); g.moveTo(128, 40); g.lineTo(200, 68); g.lineTo(200, 124); g.quadraticCurveTo(200, 190, 128, 218); g.quadraticCurveTo(56, 190, 56, 124); g.lineTo(56, 68); g.closePath(); g.stroke(); break;
    case 'star': g.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, d = k % 2 ? 40 : 92; g.lineTo(128 + Math.cos(a) * d, 136 + Math.sin(a) * d); } g.closePath(); g.stroke(); break;
    case 'spark': g.beginPath(); g.moveTo(128, 30); g.quadraticCurveTo(140, 116, 226, 128); g.quadraticCurveTo(140, 140, 128, 226); g.quadraticCurveTo(116, 140, 30, 128); g.quadraticCurveTo(116, 116, 128, 30); g.fill(); break;
    case 'insta': R(50, 50, 156, 156, 46); O(128, 128, 36); O(172, 84, 10, true); break;
    case 'wa': A(128, 122, 80, Math.PI * 0.72, Math.PI * 2.62); P([[80, 180], [62, 214], [102, 202]]); break;
    case 'mega': P([[56, 106], [56, 154], [96, 154], [184, 202], [184, 58], [96, 106]], true); P([[100, 158], [116, 208]]); break;
    case 'send': P([[48, 126], [208, 54], [164, 212], [128, 146]], true); P([[128, 146], [208, 54]]); break;
    case 'plus': P([[128, 60], [128, 196]]); P([[60, 128], [196, 128]]); break;
    case 'updown': P([[96, 104], [128, 72], [160, 104]]); P([[96, 152], [128, 184], [160, 152]]); break;
    case 'building': R(64, 44, 128, 172, 14); [92, 128, 164].forEach((x) => [84, 124].forEach((y) => O(x, y, 8, true))); P([[112, 216], [112, 172], [144, 172], [144, 216]]); break;
  }
  g.restore();
}

/* ---------- dados fictícios ---------- */
const INBOX = [['Rita Fonseca', 'Olá! Ainda têm vaga para sexta?', 'agora', 'wa', '#F97316'], ['Hotel Atlântico', 'Pedido de orçamento: 40 quartos', '5 min', 'mail', '#2563EB'],
  ['estudio.vela', 'Quanto custa a sessão completa?', '12 min', 'ig', '#DB2777'], ['Hugo Matos', 'Perfeito, fica combinado.', '1 h', 'wa', '#0D9488'],
  ['Padaria Sol', 'Segue a fatura em anexo.', 'ontem', 'mail', '#CA8A04'], ['Beatriz Faria', 'Obrigada pela rapidez!', 'ontem', 'ig', '#7C3AED'], ['Carla Neves', 'Podemos falar amanhã?', '2 dias', 'wa', '#0891B2']];
const MAILS = [['Ana Ribeiro', 'Pedido de orçamento: 40 quartos', '10:39', '#2563EB'], ['Carla Neves', 'RE: Proposta 0142', '09:12', '#F97316'], ['Luís Gomes', 'Encomenda de março', 'ontem', '#0D9488'],
  ['Sofia Pinto', 'Fotografias do evento', 'ontem', '#DB2777'], ['Contabilidade', 'Fecho do mês de fevereiro', '28/02', '#64748B'], ['Café Central', 'Obrigado pela visita', '27/02', '#CA8A04'],
  ['TransLeiria', 'Contrato renovado', '26/02', '#7C3AED'], ['Óptica Lis', 'Nova loja em Leiria', '25/02', '#0891B2'], ['Hugo Matos', 'Dúvida sobre a fatura', '24/02', '#16A34A'], ['Beatriz Faria', 'Obrigada!', '23/02', '#9333EA']];
const KANBAN = [
  ['Novo', '#3B82F6', '16.660 €', [['Hotel Atlântico', 'Ana Ribeiro', '12.400 €', 'Meta', 'Inês Duarte', '#DB2777'], ['Café Central', 'Joana Reis', '1.200 €', 'Formulário', 'Marta Silva', '#8B5CF6'], ['Óptica Lis', 'Paulo Brito', '760 €', 'Instagram', 'Rui Costa', '#2563EB'], ['Matos & Filhos', 'Hugo Matos', '2.300 €', 'WhatsApp', 'Inês Duarte', '#DB2777']]],
  ['Contactado', '#F59E0B', '6.100 €', [['Ferragens Leiria', 'Luís Gomes', '2.900 €', 'Indicação', 'Rui Costa', '#2563EB'], ['Estúdio Vela', 'Sofia Pinto', '3.200 €', 'Formulário', 'Inês Duarte', '#DB2777']]],
  ['Proposta', '#8B5CF6', '10.190 €', [['Clínica Aurora', 'Carla Neves', '1.890 €', 'Meta', 'Rui Costa', '#2563EB'], ['Padaria Sol', 'Rosa Lima', '1.800 €', 'Formulário', 'Marta Silva', '#8B5CF6'], ['Auto Lis', 'Vasco Rocha', '6.500 €', 'Indicação', 'Rui Costa', '#2563EB']]],
  ['Ganho', '#10B981', '11.900 €', [['TransLeiria', 'Mário Sá', '9.800 €', 'Indicação', 'Rui Costa', '#2563EB'], ['Beatriz Faria', 'Beatriz Faria', '2.100 €', 'Instagram', 'Inês Duarte', '#DB2777']]],
];
const PROPS = [['Clínica Aurora', '#0142', '12 mar', '1.890 €', 'Aceite', 'g'], ['Hotel Atlântico', '#0141', '11 mar', '12.400 €', 'Enviada', 'b'], ['Auto Lis', '#0140', '9 mar', '6.500 €', 'Enviada', 'b'],
  ['Padaria Sol', '#0139', '8 mar', '1.800 €', 'Rascunho', 'n'], ['Estúdio Vela', '#0137', '4 mar', '3.200 €', 'Perdida', 'r'], ['Café Central', '#0136', '2 mar', '1.200 €', 'Aceite', 'g'], ['Óptica Lis', '#0135', '27 fev', '760 €', 'Enviada', 'b']];
const SALES = [['Clínica Aurora', '#0031', '12 mar 2027', 'Em progresso', 'b', null, '1.890,00 €'], ['Padaria Sol', '#0030', '10 mar 2027', 'Concluída', 'g', ['Serviço: ativo', 'Cobrança: em dia · Stripe'], '79,00 €', '79,00 €/mês'],
  ['TransLeiria', '#0029', '8 mar 2027', 'Concluída', 'g', null, '9.800,00 €'], ['Matos & Filhos', '#0028', '5 mar 2027', 'Entregue', 'p', ['Serviço: ativo', 'Cobrança: por iniciar · Manual'], '49,00 €', '49,00 €/mês'],
  ['Café Central', '#0027', '2 mar 2027', 'Concluída', 'g', null, '1.200,00 €'], ['Óptica Lis', '#0026', '28 fev 2027', 'Cancelada', 'r', null, '760,00 €'],
  ['Estúdio Vela', '#0025', '25 fev 2027', 'Concluída', 'g', ['Serviço: ativo', 'Cobrança: em dia · Stripe'], '120,00 €', '120,00 €/mês']];
const RECS = [['Estúdio Vela', 'Venda 0025 · 120,00 €/mês', 'Vencida há 1 dia', 1], ['Padaria Sol', 'Venda 0030 · 79,00 €/mês', 'Em 2 dias'], ['Matos & Filhos', 'Venda 0028 · 49,00 €/mês', 'Em 5 dias']];
const IN_SERIES = [.18, .22, .12, .55, .3, .2, .85, .4, .3, .22, .5, .95, .42, .3, .6, .36, .24, .78, .5, .32, .4, .7, .33, .25, .9, .42, .3, .52, .62, .36, .48];
const OUT_SERIES = [.08, .1, .3, .06, .12, .4, .08, .1, .22, .06, .1, .14, .5, .08, .1, .18, .06, .12, .3, .08, .1, .14, .08, .42, .1, .08, .16, .1, .12, .2, .1];
const EVC = { b: ['#1D4ED8', '#DBEAFE'], g: ['#047857', '#D1FAE5'], y: ['#A16207', '#FEF9C3'], p: ['#6D28D9', '#EDE9FE'], o: ['#C2410C', '#FFEDD5'], r: ['#BE123C', '#FFE4E6'] };
const EV = { 2: [['10:00 Reunião Clínica Aurora', 'b']], 4: [['15:30 Ligar a Hugo Matos', 'g']], 9: [['Prazo: proposta Auto Lis', 'o']], 11: [['10:00 Visita Hotel Atlântico', 'b'], ['16:00 Follow-up Café Central', 'p']],
  16: [['Campanha de março', 'y']], 18: [['11:00 Formação da equipa', 'b']], 19: [['Dia do Pai', 'r']], 23: [['14:00 Chamada TransLeiria', 'g']], 25: [['Fecho do mês', 'o']], 30: [['10:00 Reunião geral', 'b']] };
const TODO = [['Enviar proposta à Auto Lis', 'Rui Costa', 'Hoje', '#2563EB'], ['Rever campanha de março', 'Pedro Lopes', 'Sexta', '#0D9488'], ['Atualizar preços de 2027', 'Marta Silva', '15 mar', '#8B5CF6'], ['Pedir avaliações no Google', 'Inês Duarte', '20 mar', '#DB2777'], ['Organizar fotos do evento', 'Pedro Lopes', '22 mar', '#0D9488']];
const DOING = [['Configurar WhatsApp da loja', 'Inês Duarte', 'Hoje', '#DB2777'], ['Preparar formação da equipa', 'Marta Silva', '18 mar', '#8B5CF6'], ['Contrato da TransLeiria', 'Rui Costa', '12 mar', '#2563EB']];
const DONE = [['Ligar ao Hotel Atlântico', 'Inês Duarte', 'Feito', '#DB2777'], ['Emitir fatura FT 2027/118', 'Pedro Lopes', 'Feito', '#0D9488'], ['Reunião com a Clínica Aurora', 'Rui Costa', 'Feito', '#2563EB'], ['Enviar newsletter de março', 'Marta Silva', 'Feito', '#8B5CF6'], ['Atualizar o site', 'Pedro Lopes', 'Feito', '#0D9488']];

/* ---------- a área de trabalho: um ecrã por módulo ---------- */
const CW = 1350, CH = 966;
const NODE_W = 360, NODE_H = 104;
// automação: x, y (centro), ícone, rótulo, texto
const AUTO = [[CW / 2, 200, 'bolt', 'Quando', 'Entra uma lead do site'], [CW / 2, 370, 'wa', 'Enviar WhatsApp', 'Olá {nome}, obrigado pelo pedido!'], [CW / 2, 540, 'clock', 'Esperar resposta', 'Até 2 dias'],
  [CW / 2 - 320, 730, 'agenda', 'Se respondeu', 'Marcar reunião na agenda'], [CW / 2 + 320, 730, 'email', 'Sem resposta', 'Enviar email de lembrete'], [CW / 2 + 320, 886, 'tasks', 'Depois', 'Criar tarefa: ligar ao cliente']];
function node(g, x, y, ic, a, b, flat){
  const X = x - NODE_W / 2, Y = y - NODE_H / 2;
  if (flat) fillRR(g, X, Y, NODE_W, NODE_H, 18, '#FFFFFF'); else card(g, X, Y, NODE_W, NODE_H, 18);
  tile(g, X + 20, Y + 24, 56, ic); txt(g, a, X + 92, Y + 38, UI(500, 14), C.ink2); txt(g, b, X + 92, Y + 66, UI(600, 17), C.ink, 'left', NODE_W - 110);
}
function leadCard(g, x, y, w, h, [co, ct, v, src, own, ocol], col, flat){
  if (flat){ fillRR(g, x, y, w, h, 14, '#FFFFFF'); strokeRR(g, x + 1, y + 1, w - 2, h - 2, 14, '#93C5FD', 2.5); } else card(g, x, y, w, h, 14);
  fillRR(g, x, y + 18, 4, h - 36, 2, col);
  txt(g, co, x + 20, y + 30, UI(600, 17), C.ink, 'left', w - 40); txt(g, ct, x + 20, y + 54, UI(400, 14), C.ink2, 'left', w - 40);
  txt(g, v, x + 20, y + 90, UI(700, 19), C.ink); pill(g, x + 20, y + 118, src, UI(600, 12), C.ink2, C.soft, 9, 24);
  avatar(g, x + w - 30, y + h - 30, 15, initials(own), ocol);
}
function areaLine(g, S, x0, x1, y0, y1, stroke, fill){
  const pts = S.map((v, i) => [lerp(x0, x1, i / (S.length - 1)), y1 - v * (y1 - y0)]);
  const path = () => { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++){ const [px, py] = pts[i - 1], [x, y] = pts[i]; g.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); } g.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  g.beginPath(); path(); g.lineTo(x1, y1); g.lineTo(x0, y1); g.closePath(); g.fillStyle = fill; g.fill();
  g.beginPath(); path(); g.strokeStyle = stroke; g.lineWidth = 3; g.stroke();
}
function titleRow(g, mod, title, count){ tile(g, 30, 28, 50, mod); txt(g, title, 94, 54, UI(700, 30), C.ink); g.font = UI(700, 30); if (count) pill(g, 94 + g.measureText(title).width + 14, 55, count, UI(600, 14), C.ink2, '#E2E8F0', 12, 28); }

const SCREENS = {
  painel(g){
    tile(g, 40, 34, 56, 'painel');
    txt(g, 'Olá, Marta', 112, 63, UI(700, 34), C.ink);
    txt(g, 'Bem-vinda ao painel da Lumen Studio.', 40, 122, UI(400, 18), C.ink2);
    strokeRR(g, CW - 404, 40, 184, 50, 14, '#93C5FD', 2); glyph(g, 'calendar', CW - 374, 65, 24, C.blue, 20); txt(g, 'Este mês', CW - 352, 66, UI(600, 17), C.blue);
    btn(g, CW - 206, 40, 166, 50, 'Editar painel', false);
    const K = [['Leads novas', '48', '+12%', 'g'], ['Propostas abertas', '12', '5 à espera', 'a'], ['Vendas do mês', '9.840 €', '+18%', 'g'], ['Conversão', '23%', '+3 pp', 'g']], kw = (CW - 80 - 36) / 4;
    K.forEach(([l, v, d, s], k) => { const x = 40 + k * (kw + 12); card(g, x, 160, kw, 130, 20);
      txt(g, l, x + 22, 194, UI(500, 16), C.ink2); txt(g, v, x + 22, 246, UI(700, 36), C.ink); pill(g, x + kw - 18, 194, d, UI(600, 13), ST[s][0], ST[s][1], 10, 26, 'right'); });
    const y0 = 316, lw = (CW - 92) / 2, hh = CH - y0 - 36;
    card(g, 40, y0, lw, hh, 22);
    tile(g, 62, y0 + 22, 38, 'tasks'); txt(g, 'Minhas tarefas', 112, y0 + 42, UI(600, 19), C.ink); pill(g, 266, y0 + 42, '2 atrasadas', UI(600, 12), C.red, '#FEE2E2', 10, 24);
    [['Enviar proposta à Clínica Aurora', 'Rui Costa', 'Atrasada', 1], ['Ligar ao Hotel Atlântico', 'Inês Duarte', 'Atrasada', 1], ['Confirmar reunião com a Padaria Sol', 'Marta Silva', 'Hoje 15:00'], ['Rever campanha de março', 'Pedro Lopes', 'Sexta'], ['Preparar formação da equipa', 'Marta Silva', '18 mar']].forEach(([tt, w, d, late], k) => {
      const y = y0 + 110 + k * 96;
      if (k){ g.fillStyle = C.line; g.fillRect(62, y - 48, lw - 44, 1.5); }
      txt(g, tt, 62, y - 10, UI(500, 17), C.ink, 'left', lw - 200); txt(g, w, 62, y + 18, UI(400, 14), C.ink3);
      txt(g, d, 40 + lw - 22, y, UI(600, 14), late ? C.red : C.ink2, 'right'); });
    const x2 = 52 + lw, w2 = CW - x2 - 40;
    card(g, x2, y0, w2, hh, 22);
    tile(g, x2 + 22, y0 + 22, 38, 'sales'); txt(g, 'Vendas por semana', x2 + 72, y0 + 42, UI(600, 19), C.ink); txt(g, '9.840 €', x2 + w2 - 22, y0 + 42, UI(700, 20), C.ink, 'right');
    const B = [1.2, 1.9, 1.4, 2.6, 2.1, 3.1, 2.7, 3.6], bw = (w2 - 68) / B.length, base = y0 + hh - 56, hm = hh - 150;
    B.forEach((b, k) => { const h = hm * b / 3.6, x = x2 + 34 + k * bw + bw * 0.16;
      if (k === B.length - 1){ const gr = g.createLinearGradient(0, base - h, 0, base); gr.addColorStop(0, '#60A5FA'); gr.addColorStop(1, C.blue); g.fillStyle = gr; } else g.fillStyle = '#DBEAFE';
      rr(g, x, base - h, bw * 0.68, h, 10); g.fill(); txt(g, 'S' + (k + 1), x + bw * 0.34, base + 26, UI(500, 13), C.ink3, 'center'); });
  },
  inbox(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, CW, 76); g.fillStyle = C.line; g.fillRect(0, 76, CW, 1.5);
    txt(g, 'WhatsApp', 30, 30, UI(600, 19), C.ink); txt(g, 'Caixa de entrada', 30, 54, UI(400, 14), C.ink2);
    strokeRR(g, CW - 76, 16, 46, 46, 12, '#93C5FD', 2); txt(g, '···', CW - 53, 38, UI(700, 18), C.blue, 'center');
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 78, 112, CH); g.fillStyle = C.line; g.fillRect(112, 78, 1.5, CH);
    txt(g, 'Caixas', 56, 108, UI(500, 14), C.ink2, 'center');
    [['Todas', 'inbox'], ['Internas', 'internal'], ['WhatsApp', 'wa'], ['Instagram', 'ig'], ['Email', 'email']].forEach(([n, ic], k) => {
      const y = 136 + k * 104; if (k === 2) fillRR(g, 10, y - 8, 92, 96, 16, C.blueSoft);
      tile(g, 32, y, 48, ic); txt(g, n, 56, y + 70, UI(500, 13), k === 2 ? C.blue : C.ink2, 'center'); });
    const lx = 114, lw = 420;
    g.fillStyle = '#FFFFFF'; g.fillRect(lx, 78, lw, CH); g.fillStyle = C.line; g.fillRect(lx + lw, 78, 1.5, CH);
    txt(g, 'Mensagens', lx + 24, 120, UI(700, 26), C.ink);
    fillRR(g, lx + 20, 150, lw - 40, 46, 14, C.soft); txt(g, 'Procurar conversa...', lx + 40, 174, UI(400, 16), C.ink3);
    pill(g, lx + 20, 228, 'Todas', UI(600, 14), '#FFFFFF', C.blue2, 14, 32); pill(g, lx + 100, 228, 'Não lidas', UI(500, 14), C.ink2, C.soft, 14, 32);
    INBOX.forEach(([n, msg, tm, ch, col], k) => { const y = 262 + k * 92;
      if (!k) fillRR(g, lx + 10, y, lw - 20, 84, 14, C.blueSoft);
      avatar(g, lx + 52, y + 42, 26, initials(n), col); chDot(g, lx + 72, y + 64, ch);
      txt(g, n, lx + 92, y + 30, UI(600, 17), C.ink, 'left', 220); txt(g, tm, lx + lw - 24, y + 30, UI(400, 13), C.ink3, 'right');
      txt(g, msg, lx + 92, y + 56, UI(400, 15), C.ink2, 'left', lw - 130); });
    const cx = lx + lw + 2, cw = CW - cx;
    g.fillStyle = '#FFFFFF'; g.fillRect(cx, 78, cw, 80); g.fillStyle = C.line; g.fillRect(cx, 158, cw, 1.5);
    avatar(g, cx + 46, 118, 24, 'RF', '#F97316'); txt(g, 'Rita Fonseca', cx + 82, 106, UI(600, 18), C.ink); txt(g, 'WhatsApp · Lead nova', cx + 82, 132, UI(400, 14), C.ink2);
    pill(g, CW - 28, 118, 'Atribuída a Inês', UI(600, 13), C.purple, C.purpleSoft, 12, 30, 'right');
    let y = 190;
    [['in', 'Boa tarde! Vi o vosso anúncio no Instagram.', '15:02'], ['in', 'Ainda têm vaga para sexta?', '15:02'], ['out', 'Olá Rita! Temos às 10h ou às 15h. Qual prefere?', '15:04'], ['in', 'Às 15h, por favor.', '15:05'], ['out', 'Fica marcado. Até sexta!', '15:05']].forEach(([s, m, tm]) => {
      g.font = UI(400, 17); const w = Math.min(cw * 0.76, g.measureText(m).width + 96), h = 54, x = s === 'in' ? cx + 28 : CW - 28 - w;
      fillRR(g, x, y, w, h, 18, s === 'in' ? '#FFFFFF' : '#D9FDD3'); if (s === 'in') strokeRR(g, x, y, w, h, 18, C.line, 1.5);
      txt(g, m, x + 18, y + h / 2 + 1, UI(400, 17), C.ink, 'left', w - 84); txt(g, tm, x + w - 14, y + h - 14, UI(400, 11), C.ink3, 'right');
      y += h + 14; });
    fillRR(g, cx + 24, CH - 86, cw - 112, 58, 29, '#FFFFFF'); strokeRR(g, cx + 24, CH - 86, cw - 112, 58, 29, C.line, 1.5);
    txt(g, 'Escrever mensagem...', cx + 50, CH - 56, UI(400, 16), C.ink3);
    g.fillStyle = C.wa; g.beginPath(); g.arc(CW - 56, CH - 57, 29, 0, 7); g.fill(); glyph(g, 'send', CW - 56, CH - 57, 30, '#FFFFFF', 22);
  },
  email(g){
    const fw = 250;
    const gr = g.createLinearGradient(18, 20, 18, 76); gr.addColorStop(0, '#4F8EF7'); gr.addColorStop(1, C.blue);
    rr(g, 18, 20, fw - 30, 56, 14); g.fillStyle = gr; g.fill(); glyph(g, 'plus', 50, 48, 24, '#FFFFFF', 26); txt(g, 'Escrever', 72, 49, UI(600, 18), '#FFFFFF');
    spaced(g, 'CAIXAS', 30, 112, UI(600, 12), C.ink3);
    fillRR(g, 20, 130, fw - 40, 46, 12, C.blueSoft); g.fillStyle = C.blue2; g.beginPath(); g.arc(42, 153, 6, 0, 7); g.fill(); txt(g, 'Geral Lumen', 58, 154, UI(600, 16), C.blue);
    spaced(g, 'PASTAS', 30, 210, UI(600, 12), C.ink3);
    [['Entrada', 'mail'], ['Não lidos', 'mail'], ['Com estrela', 'star'], ['Enviados', 'send'], ['Rascunhos', 'doc'], ['Campanhas', 'mega'], ['Arquivo', 'doc'], ['Lixo', 'doc']].forEach(([n, ic], k) => { const y = 248 + k * 50;
      if (!k) fillRR(g, 14, y - 22, fw - 28, 44, 12, C.blueSoft);
      glyph(g, ic, 40, y, 22, k ? C.ink2 : C.blue, 20); txt(g, n, 62, y + 1, UI(k ? 500 : 600, 16), k ? C.ink2 : C.blue); });
    g.fillStyle = C.line; g.fillRect(fw, 0, 1.5, CH);
    const lx = fw + 2, lw = 430;
    txt(g, 'Entrada', lx + 22, 46, UI(700, 24), C.ink);
    fillRR(g, lx + 18, 76, lw - 36, 46, 14, C.blueSoft); strokeRR(g, lx + 18, 76, lw - 36, 46, 14, '#BFDBFE', 1.5); glyph(g, 'search', lx + 44, 99, 20, C.ink2, 22); txt(g, 'Pesquisar emails...', lx + 64, 100, UI(400, 15), C.ink2);
    MAILS.forEach(([n, s, tm, col], k) => { const y = 144 + k * 80;
      if (!k){ g.fillStyle = C.bg; g.fillRect(lx, y, lw, 80); g.fillStyle = C.blue2; g.fillRect(lx, y, 4, 80); }
      g.fillStyle = C.line; g.fillRect(lx, y + 80, lw, 1);
      avatarSoft(g, lx + 38, y + 40, 20, initials(n), col);
      txt(g, n, lx + 70, y + 28, UI(k < 2 ? 700 : 500, 16), C.ink, 'left', lw - 150); txt(g, tm, lx + lw - 18, y + 28, UI(400, 13), C.ink3, 'right');
      txt(g, s, lx + 70, y + 54, UI(400, 14), C.ink2, 'left', lw - 96); });
    g.fillStyle = C.line; g.fillRect(lx + lw, 0, 1.5, CH);
    const rx = lx + lw + 2, rw = CW - rx;
    txt(g, 'Pedido de orçamento: 40 quartos', rx + 32, 52, UI(700, 23), C.ink, 'left', rw - 64);
    avatarSoft(g, rx + 54, 118, 24, 'AR', '#2563EB'); txt(g, 'Ana Ribeiro', rx + 90, 106, UI(600, 17), C.ink); txt(g, 'Hotel Atlântico · para geral', rx + 90, 130, UI(400, 14), C.ink2);
    txt(g, 'hoje, 10:39', CW - 30, 106, UI(400, 14), C.ink3, 'right');
    g.fillStyle = C.line; g.fillRect(rx + 32, 160, rw - 64, 1.5);
    ['Bom dia,', '', 'Gostaríamos de receber um orçamento para a', 'renovação dos 40 quartos do hotel, com', 'entrega até ao fim de abril.', '', 'Conseguem enviar a proposta até sexta?', '', 'Obrigada,', 'Ana Ribeiro'].forEach((l, k) => { if (l) txt(g, l, rx + 32, 196 + k * 30, UI(400, 17), C.ink); });
    fillRR(g, rx + 32, 506, 280, 64, 14, C.bg); strokeRR(g, rx + 32, 506, 280, 64, 14, C.line); tile(g, rx + 44, 518, 40, 'proposals');
    txt(g, 'Plantas_quartos.pdf', rx + 96, 530, UI(600, 14), C.ink); txt(g, '2,4 MB', rx + 96, 552, UI(400, 12), C.ink3);
    btn(g, rx + 32, 604, 150, 50, 'Responder', true); btn(g, rx + 194, 604, 150, 50, 'Criar lead', false); btn(g, rx + 356, 604, 160, 50, 'Criar tarefa', false);
  },
  feed(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    const mx = 36, mw = 830;
    txt(g, 'Feed', mx, 50, UI(700, 30), C.ink);
    fillRR(g, mx + mw - 300, 26, 300, 48, 24, '#FFFFFF'); strokeRR(g, mx + mw - 300, 26, 300, 48, 24, C.line); glyph(g, 'search', mx + mw - 270, 50, 20, C.ink2, 22); txt(g, 'Pesquisar no Feed', mx + mw - 248, 51, UI(400, 15), C.ink2);
    card(g, mx, 96, mw, 176, 24);
    avatar(g, mx + 52, 142, 28, 'MS', '#8B5CF6');
    fillRR(g, mx + 96, 116, mw - 120, 62, 16, C.bg); txt(g, 'Partilha uma novidade, Marta...', mx + 116, 147, UI(400, 17), C.ink3);
    let ax = mx + 100;
    [['Fotografia', 'insta'], ['Documento', 'doc'], ['Comunicado', 'mega'], ['Reconhecer', 'star']].forEach(([n, ic], k) => { const col = k === 3 ? C.blue : C.ink;
      glyph(g, ic, ax + 12, 226, 22, col, 20); txt(g, n, ax + 30, 227, UI(500, 15), col); g.font = UI(500, 15); ax += g.measureText(n).width + 64; });
    fillRR(g, mx + mw - 130, 204, 106, 46, 23, '#93C5FD'); txt(g, 'Publicar', mx + mw - 77, 228, UI(600, 16), '#FFFFFF', 'center');
    let fx = mx;
    [['Tudo', 1], ['Comunicados'], ['Publicações'], ['Reconhecimentos']].forEach(([n, on]) => { const w = pill(g, fx, 312, n, UI(600, 14), on ? '#FFFFFF' : C.ink2, on ? C.ink : '#FFFFFF', 18, 42); if (!on) strokeRR(g, fx, 291, w, 42, 21, C.line, 1.5); fx += w + 10; });
    const y1 = 356;
    { const gr = g.createLinearGradient(mx, y1, mx + mw, y1 + 250); gr.addColorStop(0, '#FFF7ED'); gr.addColorStop(1, '#FFEDD5'); rr(g, mx, y1, mw, 250, 24); g.fillStyle = gr; g.fill(); }
    strokeRR(g, mx, y1, mw, 250, 24, '#FED7AA', 2);
    tile(g, mx + 22, y1 + 24, 60, 'mega');
    txt(g, 'Marta Silva partilhou um comunicado', mx + 100, y1 + 44, UI(600, 18), C.ink); txt(g, 'Comunicado fixado', mx + 100, y1 + 72, UI(600, 15), '#EA580C');
    fillRR(g, mx + 100, y1 + 100, mw - 124, 64, 16, '#FFFFFF'); strokeRR(g, mx + 100, y1 + 100, mw - 124, 64, 16, '#FED7AA', 1.5);
    txt(g, 'Reunião geral sexta às 9h. Tragam os números do mês.', mx + 122, y1 + 133, UI(400, 17), C.ink);
    txt(g, 'há 2 dias · Toda a organização', mx + 100, y1 + 200, UI(400, 14), C.ink2);
    const y2 = y1 + 274; card(g, mx, y2, mw, 220, 24);
    avatar(g, mx + 50, y2 + 50, 26, 'RC', '#2563EB'); txt(g, 'Rui Costa', mx + 90, y2 + 40, UI(600, 18), C.ink); txt(g, 'há 3 horas · Toda a organização', mx + 90, y2 + 64, UI(400, 14), C.ink2);
    txt(g, 'Fechámos o Hotel Atlântico! Obrigado a todos pela ajuda.', mx + 24, y2 + 116, UI(400, 17), C.ink);
    strokeRR(g, mx + 24, y2 + 150, 100, 42, 21, C.line, 1.5); txt(g, 'Reagir', mx + 74, y2 + 171, UI(600, 14), C.ink2, 'center'); txt(g, 'Comentar', mx + mw - 30, y2 + 171, UI(600, 14), C.ink2, 'right');
    const rx = mx + mw + 24, rw = CW - rx - 30;
    card(g, rx, 26, rw, 230, 24); glyph(g, 'star', rx + 34, 66, 24, C.blue, 20); txt(g, 'Reconhecimentos', rx + 56, 67, UI(600, 18), C.ink);
    wrap(g, 'Valoriza o trabalho de um colega à frente de toda a equipa.', rx + 22, 108, rw - 44, 24, UI(400, 15), C.ink2, 2);
    strokeRR(g, rx + 22, 170, rw - 44, 50, 25, C.blue2, 2); txt(g, 'Reconhecer alguém', rx + rw / 2, 196, UI(600, 16), C.blue, 'center');
    card(g, rx, 276, rw, 360, 24); glyph(g, 'chat', rx + 34, 316, 24, C.purple, 20); txt(g, 'Mensagens internas', rx + 56, 317, UI(600, 18), C.ink);
    [['Inês Duarte', 'Já liguei à Clínica Aurora.', '#DB2777'], ['Pedro Lopes', 'A campanha sai amanhã às 10h.', '#0D9488'], ['Rui Costa', 'Boa! Obrigado.', '#2563EB']].forEach(([n, m, col], k) => { const y = 372 + k * 84;
      avatar(g, rx + 42, y + 10, 20, initials(n), col); txt(g, n, rx + 74, y, UI(600, 15), C.ink); txt(g, m, rx + 74, y + 24, UI(400, 14), C.ink2, 'left', rw - 96); });
    card(g, rx, 656, rw, 200, 24); glyph(g, 'mega', rx + 34, 696, 24, '#EA580C', 20); txt(g, 'Comunicados', rx + 56, 697, UI(600, 18), C.ink); pill(g, rx + rw - 22, 697, '1', UI(600, 13), C.ink2, C.soft, 10, 26, 'right');
    txt(g, 'Reunião geral sexta', rx + 22, 748, UI(500, 16), C.ink); txt(g, 'Fixado · Marta Silva', rx + 22, 774, UI(400, 13), C.ink2);
    txt(g, 'Ver comunicados →', rx + 22, 822, UI(600, 15), C.blue);
  },
  leads(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    titleRow(g, 'leads', 'Leads', '48'); btn(g, CW - 196, 28, 166, 50, '+ Nova lead', true);
    let fx = 30;
    ['Todas as origens', 'Todos os comerciais', 'Este mês'].forEach((n) => { g.font = UI(500, 14); const w = g.measureText(n).width + 52;
      fillRR(g, fx, 96, w, 40, 12, '#FFFFFF'); strokeRR(g, fx, 96, w, 40, 12, C.line); txt(g, n, fx + 16, 117, UI(500, 14), C.ink); P2(g, fx + w - 24, 116); fx += w + 10; });
    const cw = (CW - 60 - 36) / 4;
    KANBAN.forEach(([n, col, tot, cards], j) => { const x = 30 + j * (cw + 12);
      fillRR(g, x, 152, cw, CH, 18, C.soft);
      g.fillStyle = col; g.beginPath(); g.arc(x + 22, 182, 6, 0, 7); g.fill();
      txt(g, n, x + 38, 182, UI(600, 17), C.ink); pill(g, x + cw - 14, 182, String(cards.length), UI(600, 13), C.ink2, '#E2E8F0', 10, 26, 'right');
      txt(g, tot, x + 22, 210, UI(500, 13), C.ink3);
      cards.forEach((cd, k) => { const y = 232 + k * 150;
        // o primeiro cartão está "levantado" (é o que salta em 3D): fica só o lugar tracejado
        if (j === 0 && k === 0){ g.setLineDash([10, 8]); strokeRR(g, x + 10, y, cw - 20, 136, 14, '#93C5FD', 2); g.setLineDash([]); return; }
        leadCard(g, x + 10, y, cw - 20, 136, cd, col); }); });
  },
  proposals(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    titleRow(g, 'proposals', 'Propostas', '18');
    fillRR(g, 30, 98, 430, 46, 14, '#FFFFFF'); strokeRR(g, 30, 98, 430, 46, 14, C.line); glyph(g, 'search', 56, 121, 20, C.ink2, 22); txt(g, 'Pesquisar propostas...', 76, 122, UI(400, 15), C.ink3);
    PROPS.forEach(([cl, code, dt, v, st, sk], k) => { const y = 162 + k * 108, sel = !k;
      fillRR(g, 30, y, 430, 96, 16, '#FFFFFF'); strokeRR(g, 30, y, 430, 96, 16, sel ? C.blue2 : C.line, sel ? 2.5 : 1.5);
      txt(g, cl, 52, y + 32, UI(600, 17), C.ink, 'left', 250); txt(g, `${code} · ${dt}`, 52, y + 62, UI(400, 14), C.ink3);
      txt(g, v, 438, y + 32, UI(700, 17), C.ink, 'right'); pill(g, 438, y + 64, st, UI(600, 12), ST[sk][0], ST[sk][1], 10, 26, 'right'); });
    const dx = 490, dw = CW - dx - 30;
    card(g, dx, 28, dw, CH, 20);
    logoMark(g, dx + 48, 74, 8, C.ink); spaced(g, 'LUMEN STUDIO', dx + 78, 75, UI(700, 15), C.ink, 3);
    txt(g, 'Proposta 0142', dx + dw - 40, 68, UI(700, 26), C.ink, 'right'); txt(g, 'Válida até 31/03/2027', dx + dw - 40, 98, UI(400, 14), C.ink2, 'right');
    g.fillStyle = C.line; g.fillRect(dx + 40, 126, dw - 80, 1.5);
    spaced(g, 'PARA', dx + 40, 156, UI(600, 12), C.ink3); txt(g, 'Clínica Aurora', dx + 40, 184, UI(600, 19), C.ink); txt(g, 'Carla Neves · Leiria', dx + 40, 210, UI(400, 14), C.ink2);
    fillRR(g, dx + 40, 240, dw - 80, 44, 10, C.bg); txt(g, 'Descrição', dx + 60, 263, UI(600, 13), C.ink2); txt(g, 'Valor', dx + dw - 60, 263, UI(600, 13), C.ink2, 'right');
    [['Site institucional com marcação online', '1.200,00 €'], ['Lembretes por WhatsApp e email', '390,00 €'], ['Formação da equipa (3 horas)', '300,00 €']].forEach(([d, v], k) => { const y = 312 + k * 56;
      txt(g, d, dx + 60, y, UI(400, 17), C.ink); txt(g, v, dx + dw - 60, y, UI(500, 17), C.ink, 'right'); g.fillStyle = C.line; g.fillRect(dx + 40, y + 28, dw - 80, 1); });
    [['Subtotal', '1.890,00 €'], ['IVA (23%)', '434,70 €']].forEach(([l, v], k) => { const y = 498 + k * 34; txt(g, l, dx + dw - 300, y, UI(400, 16), C.ink2); txt(g, v, dx + dw - 60, y, UI(500, 16), C.ink, 'right'); });
    txt(g, 'Total', dx + dw - 300, 584, UI(600, 18), C.ink); txt(g, '2.324,70 €', dx + dw - 60, 584, UI(700, 28), C.ink, 'right');
    fillRR(g, dx + 40, 630, dw - 80, 58, 14, '#DCFCE7'); glyph(g, 'check', dx + 72, 659, 26, C.green, 26); txt(g, 'Aceite a 12/03/2027 por Carla Neves', dx + 96, 660, UI(600, 16), C.green);
    btn(g, dx + 40, 714, 230, 52, 'Converter em venda', true); btn(g, dx + 284, 714, 210, 52, 'Descarregar PDF', false);
  },
  sales(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    titleRow(g, 'sales', 'Vendas', '31');
    fillRR(g, 270, 30, 260, 50, 14, C.soft); fillRR(g, 276, 36, 124, 38, 10, '#DBEAFE'); txt(g, 'Vendas', 338, 56, UI(600, 15), C.blue, 'center'); txt(g, 'Comissões', 464, 56, UI(500, 15), C.ink2, 'center');
    btn(g, CW - 196, 28, 166, 50, '+ Nova venda', true);
    const K = [['Vendas', '31', '18.420 € em vendas', C.ink], ['Em progresso', '4', '3.130 €', C.blue], ['Entregues', '6', '2.340 €', C.purple], ['Concluídas', '21', '12.950 €', C.green]], kw = (CW - 60 - 36) / 4;
    K.forEach(([l, v, s, col], k) => { const x = 30 + k * (kw + 12); card(g, x, 100, kw, 112, 16); txt(g, l, x + 20, 128, UI(500, 15), C.ink2); txt(g, v, x + 20, 164, UI(700, 30), col); txt(g, s, x + 20, 194, UI(400, 13), C.ink3); });
    card(g, 30, 232, CW - 60, CH, 18);
    const COLX = [62, 520, 690, 860, CW - 64];
    ['Cliente', 'Venda', 'Estado', 'Recorrência', 'Valor'].forEach((h, k) => txt(g, h, COLX[k], 270, UI(600, 14), C.ink2, k === 4 ? 'right' : 'left'));
    g.fillStyle = C.line; g.fillRect(30, 294, CW - 60, 1.5);
    SALES.forEach(([cl, code, dt, st, sk, rec, v, per], k) => { const y = 336 + k * 86;
      avatarSoft(g, COLX[0] + 20, y, 20, initials(cl), C.blue); txt(g, cl, COLX[0] + 54, y, UI(600, 17), C.ink, 'left', 380);
      txt(g, code, COLX[1], y - 12, UI(600, 14), C.blue); txt(g, dt, COLX[1], y + 12, UI(400, 14), C.ink2);
      pill(g, COLX[2], y, st, UI(600, 13), ST[sk][0], ST[sk][1], 10, 28);
      if (rec){ txt(g, rec[0], COLX[3], y - 11, UI(500, 14), C.ink); txt(g, rec[1], COLX[3], y + 12, UI(400, 13), C.ink2); } else txt(g, '-', COLX[3], y, UI(400, 14), C.ink3);
      txt(g, v, COLX[4], y - (per ? 10 : 0), UI(700, 17), C.ink, 'right'); if (per) txt(g, per, COLX[4], y + 14, UI(400, 12), C.ink2, 'right');
      g.fillStyle = C.line; g.fillRect(50, y + 43, CW - 100, 1); });
  },
  finance(g, v = 1){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    spaced(g, 'GESTÃO FINANCEIRA', 30, 38, UI(600, 13), C.blue2, 3);
    txt(g, 'Financeiro', 30, 78, UI(700, 34), C.ink); txt(g, 'Faturação, recebimentos e despesas num só lugar.', 30, 114, UI(400, 16), C.ink2);
    btn(g, CW - 384, 44, 170, 52, '+ Nova fatura', true); btn(g, CW - 200, 44, 170, 52, '+ Nova despesa', false);
    ['Resumo', 'Contas', 'Faturas', 'Despesas'].forEach((n, k) => txt(g, n, 46 + k * 120, 160, UI(k ? 500 : 600, 16), k ? C.ink2 : C.ink));
    g.fillStyle = C.line; g.fillRect(30, 184, CW - 60, 1.5); g.fillStyle = C.blue2; g.fillRect(30, 182, 104, 3);
    const K = [['Faturado', '24.380 €', 'doc', C.blue], ['Recebido', '21.140 €', 'check', C.green], ['Pendente', '3.240 €', 'clock', C.amber], ['Despesas', '7.910 €', 'doc', C.red], ['Balanço', '13.230 €', 'euro', C.purple], ['A vencer · 7 dias', '890 €', 'calendar', C.blue]];
    const kw = (CW - 60 - 50) / 6;
    K.forEach(([l, val, ic, col], k) => { const x = 30 + k * (kw + 10), y = 204; card(g, x, y, kw, 120, 16); softTile(g, x + 16, y + 18, 40, ic, col);
      txt(g, l, x + 66, y + 38, UI(500, 14), C.ink2, 'left', kw - 76); txt(g, val, x + 16, y + 90, UI(700, 25), C.ink); });
    const y0 = 346, cw = Math.round((CW - 76) * 0.62), hh = CH - y0 - 28;
    card(g, 30, y0, cw, hh, 20); txt(g, 'Fluxo de caixa', 54, y0 + 40, UI(600, 19), C.ink); txt(g, 'Entradas e saídas em março', 54, y0 + 66, UI(400, 14), C.ink2);
    [['Entradas', C.green], ['Saídas', C.red]].forEach(([n, col], k) => { const x = 30 + cw - 210 + k * 108; g.fillStyle = col; g.beginPath(); g.arc(x, y0 + 41, 6, 0, 7); g.fill(); txt(g, n, x + 12, y0 + 42, UI(500, 14), C.ink2); });
    const px0 = 96, px1 = 30 + cw - 30, py0 = y0 + 110, py1 = y0 + hh - 60;
    ['6k', '4k', '2k', '0'].forEach((l, k) => { const y = lerp(py0, py1, k / 3); txt(g, l, 80, y, UI(400, 13), C.ink3, 'right'); g.fillStyle = '#EEF2F6'; g.fillRect(px0, y, px1 - px0, 1); });
    ['1 mar', '8', '15', '22', '29'].forEach((l, k) => txt(g, l, lerp(px0, px1, k / 4), py1 + 26, UI(400, 13), C.ink3, 'center'));
    areaLine(g, IN_SERIES, px0, px1, py0, py1, C.green, 'rgba(5,150,105,.12)'); areaLine(g, OUT_SERIES, px0, px1, py0, py1, C.red, 'rgba(220,38,38,.07)');
    const x2 = 30 + cw + 16, w2 = CW - x2 - 30;
    card(g, x2, y0, w2, hh, 20); if (v === 2) strokeRR(g, x2 + 1.5, y0 + 1.5, w2 - 3, hh - 3, 20, C.blue2, 3);
    glyph(g, 'clock', x2 + 36, y0 + 40, 24, C.amber, 22); txt(g, 'Próximas recorrências', x2 + 58, y0 + 41, UI(600, 18), C.ink); pill(g, x2 + w2 - 20, y0 + 41, '3', UI(600, 13), C.ink2, C.soft, 10, 28, 'right');
    txt(g, 'Cobranças próximas ou vencidas', x2 + 24, y0 + 72, UI(400, 14), C.ink2);
    RECS.forEach(([n, s, d, late], k) => { const y = y0 + 100 + k * 112;
      fillRR(g, x2 + 16, y, w2 - 32, 98, 16, late ? '#FEF2F2' : '#FFFFFF'); strokeRR(g, x2 + 16, y, w2 - 32, 98, 16, late ? '#FECACA' : C.line, 1.5);
      txt(g, n, x2 + 36, y + 34, UI(600, 17), C.ink); txt(g, s, x2 + 36, y + 64, UI(400, 14), C.ink2, 'left', w2 - 90);
      pill(g, x2 + w2 - 32, y + 34, d, UI(600, 12), late ? C.red : C.ink, late ? '#FEE2E2' : C.soft, 10, 26, 'right'); });
  },
  finance2(g){ SCREENS.finance(g, 2); },
  auto(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    g.fillStyle = '#CBD5E1'; for (let y = 120; y < CH; y += 30) for (let x = 15; x < CW; x += 30){ g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); }
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, CW, 92); g.fillStyle = C.line; g.fillRect(0, 92, CW, 1.5);
    tile(g, 28, 22, 48, 'auto'); txt(g, 'Automações', 92, 34, UI(500, 14), C.ink2); txt(g, 'Novas leads do site', 92, 62, UI(700, 22), C.ink);
    txt(g, '128 execuções este mês', CW - 190, 47, UI(400, 14), C.ink2, 'right');
    fillRR(g, CW - 166, 26, 136, 42, 21, '#DCFCE7'); fillRR(g, CW - 160, 32, 54, 30, 15, C.green); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(CW - 121, 47, 11, 0, 7); g.fill(); txt(g, 'Ativo', CW - 66, 48, UI(600, 15), C.green, 'center');
    const link = (a, b, label) => {
      const x1 = AUTO[a][0], y1 = AUTO[a][1] + NODE_H / 2, x2 = AUTO[b][0], y2 = AUTO[b][1] - NODE_H / 2, my = (y1 + y2) / 2;
      g.strokeStyle = '#94A3B8'; g.lineWidth = 3; g.beginPath(); g.moveTo(x1, y1); g.bezierCurveTo(x1, my, x2, my, x2, y2 - 10); g.stroke();
      g.fillStyle = '#94A3B8'; g.beginPath(); g.moveTo(x2 - 9, y2 - 14); g.lineTo(x2 + 9, y2 - 14); g.lineTo(x2, y2 - 1); g.closePath(); g.fill();
      if (label) pill(g, (x1 + x2) / 2, my, label, UI(600, 13), label === 'Sim' ? C.green : C.red, label === 'Sim' ? '#DCFCE7' : '#FEE2E2', 12, 28, 'center');
    };
    link(0, 1); link(1, 2); link(2, 3, 'Sim'); link(2, 4, 'Não'); link(4, 5);
    AUTO.forEach(([x, y, ic, a, b]) => node(g, x, y, ic, a, b));
  },
  otto(g){
    const lw = Math.round(CW * 0.6);
    const og = (x, y, r) => { const gr = g.createLinearGradient(x - r, y - r, x + r, y + r); gr.addColorStop(0, '#6366F1'); gr.addColorStop(1, '#EC4899'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); glyph(g, 'spark', x, y, r * 1.1, '#FFFFFF'); };
    og(66, 60, 28); txt(g, 'Otto', 108, 48, UI(700, 22), C.ink); txt(g, 'Assistente do Senvia OS', 108, 74, UI(400, 14), C.ink2);
    g.fillStyle = C.line; g.fillRect(0, 110, lw, 1.5); g.fillRect(lw, 0, 1.5, CH);
    const me = (y, s) => { g.font = UI(400, 17); const w = Math.min(lw - 160, g.measureText(s).width + 40); fillRR(g, lw - 30 - w, y, w, 52, 20, C.blue2); txt(g, s, lw - 30 - w + 20, y + 27, UI(400, 17), '#FFFFFF'); return y + 52; };
    const ot = (y, lines) => { const h = 22 + lines.length * 28; og(52, y + 22, 16); fillRR(g, 80, y, lw - 200, h, 20, C.soft); lines.forEach((l, k) => txt(g, l, 100, y + 26 + k * 28, UI(400, 17), C.ink)); return y + h; };
    let y = 140;
    y = me(y, 'Quantas leads entraram esta semana?') + 24;
    y = ot(y, ['Entraram 14 leads esta semana: 6 do formulário', 'do site, 5 do Instagram e 3 por indicação.']) + 16;
    card(g, 80, y, lw - 200, 200, 18); txt(g, 'Sem contacto há mais de 2 dias', 100, y + 34, UI(600, 15), C.ink2);
    [['Hotel Atlântico', '12.400 €'], ['Café Central', '1.200 €'], ['Óptica Lis', '760 €']].forEach(([n, v], k) => { const yy = y + 78 + k * 42;
      g.fillStyle = C.blue2; g.beginPath(); g.arc(106, yy, 5, 0, 7); g.fill(); txt(g, n, 122, yy, UI(500, 16), C.ink);
      pill(g, lw - 250, yy, 'Novo', UI(600, 12), C.blue, '#DBEAFE', 10, 24, 'right'); txt(g, v, lw - 144, yy, UI(600, 16), C.ink, 'right'); });
    y += 224;
    y = me(y, 'Cria uma lead para a Padaria Sol, 1.800 €.') + 24;
    ot(y, ['Feito. A Padaria Sol está na etapa Novo', 'e ficou atribuída a ti.']);
    fillRR(g, 30, CH - 92, lw - 60, 62, 31, C.bg); strokeRR(g, 30, CH - 92, lw - 60, 62, 31, C.line); txt(g, 'Pergunta ao Otto...', 62, CH - 60, UI(400, 17), C.ink3);
    { const x = lw - 62, yy = CH - 61, gr = g.createLinearGradient(x - 25, yy - 25, x + 25, yy + 25); gr.addColorStop(0, '#6366F1'); gr.addColorStop(1, '#EC4899'); g.fillStyle = gr; g.beginPath(); g.arc(x, yy, 25, 0, 7); g.fill(); glyph(g, 'send', x, yy, 26, '#FFFFFF', 22); }
    const rx = lw + 30, rw = CW - rx - 30;
    card(g, rx, 30, rw, 400, 20); txt(g, 'Resumo do funil', rx + 24, 70, UI(600, 18), C.ink); txt(g, '48 leads em março', rx + 24, 98, UI(400, 14), C.ink2);
    [['Novo', 18, '#3B82F6'], ['Contactado', 12, '#F59E0B'], ['Proposta', 9, '#8B5CF6'], ['Ganho', 9, '#10B981']].forEach(([n, v, col], k) => { const yy = 148 + k * 66;
      txt(g, n, rx + 24, yy, UI(500, 15), C.ink); txt(g, String(v), rx + rw - 24, yy, UI(700, 15), C.ink, 'right');
      fillRR(g, rx + 24, yy + 18, rw - 48, 12, 6, C.soft); fillRR(g, rx + 24, yy + 18, (rw - 48) * v / 18, 12, 6, col); });
    card(g, rx, 452, rw, 300, 20); txt(g, 'Pergunta ao Otto', rx + 24, 492, UI(600, 18), C.ink);
    ['Leads sem contacto', 'Resumo do funil', 'Criar uma lead', 'Mover de etapa'].forEach((s, k) => { const yy = 530 + k * 52;
      strokeRR(g, rx + 24, yy, rw - 48, 42, 21, '#C7D2FE', 1.5); glyph(g, 'spark', rx + 48, yy + 21, 16, '#6366F1'); txt(g, s, rx + 66, yy + 22, UI(500, 15), C.ink); });
  },
  agenda(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    txt(g, 'Agenda', 30, 54, UI(700, 30), C.ink);
    [['‹', 172], ['›', 300]].forEach(([s, x]) => { strokeRR(g, x - 22, 32, 44, 44, 22, C.line); txt(g, s, x, 53, UI(600, 22), C.ink, 'center'); });
    strokeRR(g, 202, 32, 72, 44, 22, C.line); txt(g, 'Hoje', 238, 55, UI(600, 15), C.ink, 'center');
    txt(g, 'Março de 2027', 340, 55, UI(600, 20), C.ink);
    fillRR(g, CW - 560, 28, 330, 50, 25, '#FFFFFF'); strokeRR(g, CW - 560, 28, 330, 50, 25, C.line);
    [['Dia', 52], ['Semana', 132], ['Mês', 216], ['Agenda', 286]].forEach(([s, dx], k) => { if (k === 2) fillRR(g, CW - 560 + dx - 34, 34, 68, 38, 19, C.ink); txt(g, s, CW - 560 + dx, 54, UI(600, 15), k === 2 ? '#FFFFFF' : C.ink2, 'center'); });
    btn(g, CW - 214, 28, 184, 50, '+ Novo evento', true);
    const gx = 30, gy = 100, gw = CW - 30 - 310, gh = CH - gy - 24, cwc = gw / 7, rh = (gh - 44) / 5;
    card(g, gx, gy, gw, gh, 20);
    ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].forEach((d, k) => txt(g, d, gx + cwc * (k + 0.5), gy + 24, UI(600, 13), C.ink2, 'center'));
    g.fillStyle = C.line; g.fillRect(gx, gy + 44, gw, 1.5);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++){
      const day = r * 7 + c + 1, x = gx + c * cwc, y = gy + 44 + r * rh, out = day > 31, num = out ? day - 31 : day;
      if (c){ g.fillStyle = C.line; g.fillRect(x, y, 1, rh); } if (r){ g.fillStyle = C.line; g.fillRect(gx, y, gw, 1); }
      if (day === 11){ fillRR(g, x + 3, y + 3, cwc - 6, rh - 6, 6, C.blueSoft); strokeRR(g, x + 3, y + 3, cwc - 6, rh - 6, 6, '#93C5FD', 2);
        g.fillStyle = C.blue2; g.beginPath(); g.arc(x + 26, y + 26, 17, 0, 7); g.fill(); txt(g, '11', x + 26, y + 27, UI(700, 15), '#FFFFFF', 'center'); }
      else txt(g, String(num), x + 16, y + 26, UI(600, 15), out ? C.ink3 : C.ink);
      (out ? [] : EV[day] || []).forEach(([s, col], k) => { const ey = y + 50 + k * 34; fillRR(g, x + 7, ey, cwc - 14, 28, 7, EVC[col][1]); txt(g, s, x + 14, ey + 15, UI(600, 12), EVC[col][0], 'left', cwc - 28); });
    }
    const sx = gx + gw + 20, sw = CW - sx - 30;
    card(g, sx, gy, sw, 300, 20); spaced(g, 'CALENDÁRIOS', sx + 24, gy + 36, UI(600, 13), C.ink2);
    [['Reuniões', 'b'], ['Chamadas', 'g'], ['Tarefas agendadas', 'y'], ['Follow-ups', 'p'], ['Prazos', 'o'], ['Feriados', 'r']].forEach(([n, c], k) => { const y = gy + 76 + k * 36;
      g.fillStyle = EVC[c][0]; g.beginPath(); g.arc(sx + 32, y, 10, 0, 7); g.fill(); glyph(g, 'check', sx + 32, y, 14, '#FFFFFF', 30); txt(g, n, sx + 52, y + 1, UI(500, 15), C.ink, 'left', sw - 64); });
    card(g, sx, gy + 320, sw, 200, 20); txt(g, '11 de março', sx + 24, gy + 360, UI(700, 18), C.ink);
    [['10:00 Visita Hotel Atlântico', 'b'], ['16:00 Follow-up Café Central', 'p']].forEach(([s, c], k) => { const y = gy + 396 + k * 48; fillRR(g, sx + 18, y, sw - 36, 38, 10, EVC[c][1]); txt(g, s, sx + 30, y + 20, UI(600, 13), EVC[c][0], 'left', sw - 60); });
  },
  tasks(g){
    g.fillStyle = C.bg; g.fillRect(0, 0, CW, CH);
    titleRow(g, 'tasks', 'Tarefas', '16'); btn(g, CW - 206, 28, 176, 50, '+ Nova tarefa', true);
    let fx = 30; [['Minhas', 1], ['Equipa'], ['Esta semana']].forEach(([n, on]) => { const w = pill(g, fx, 117, n, UI(600, 14), on ? '#FFFFFF' : C.ink2, on ? C.ink : '#FFFFFF', 16, 38); if (!on) strokeRR(g, fx, 98, w, 38, 19, C.line); fx += w + 10; });
    const cols = [['Para fazer', '#64748B', TODO], ['Em curso', '#3B82F6', DOING], ['Feito', '#10B981', DONE]], cw = (CW - 60 - 24) / 3;
    cols.forEach(([n, col, list], j) => { const x = 30 + j * (cw + 12);
      fillRR(g, x, 152, cw, CH, 18, C.soft); g.fillStyle = col; g.beginPath(); g.arc(x + 22, 182, 6, 0, 7); g.fill();
      txt(g, n, x + 38, 182, UI(600, 17), C.ink); pill(g, x + cw - 14, 182, String(list.length), UI(600, 13), C.ink2, '#E2E8F0', 10, 26, 'right');
      list.forEach(([tt, who, due, wc], k) => { const y = 214 + k * 136, done = j === 2; card(g, x + 12, y, cw - 24, 122, 14);
        if (done){ g.fillStyle = C.green; g.beginPath(); g.arc(x + 40, y + 34, 13, 0, 7); g.fill(); glyph(g, 'check', x + 40, y + 34, 18, '#FFFFFF', 30); }
        else { g.strokeStyle = '#CBD5E1'; g.lineWidth = 2.5; g.beginPath(); g.arc(x + 40, y + 34, 12, 0, 7); g.stroke(); }
        txt(g, tt, x + 64, y + 35, UI(600, 16), done ? C.ink2 : C.ink, 'left', cw - 100);
        avatar(g, x + 44, y + 86, 15, initials(who), wc); txt(g, who, x + 68, y + 87, UI(400, 14), C.ink2);
        pill(g, x + cw - 28, y + 87, due, UI(600, 12), due === 'Hoje' ? C.red : done ? C.green : C.ink2, due === 'Hoje' ? '#FEE2E2' : done ? '#DCFCE7' : '#FFFFFF', 10, 26, 'right'); }); });
  },
};
// pequena seta para baixo dos filtros
function P2(g, x, y){ g.strokeStyle = C.ink2; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 5, y - 3); g.lineTo(x, y + 2); g.lineTo(x + 5, y - 3); g.stroke(); }

/* ---------- barra lateral, topo e telemóvel ---------- */
const SIDE_W = 360, SIDE_H = 1110, TOP_W = 1380, TOP_H = 120;
// posições da barra lateral (px): onde fica cada item e cada grupo
const SIDE_POS = (() => { const items = {}, groups = {}; let y = 172;
  SIDEBAR.forEach(([grp, list]) => { const y0 = y; y += 26; list.forEach((m) => { items[m] = y + 22; y += 50; }); groups[grp] = [y0, y]; y += 10; });
  return { items, groups }; })();
let sideActive = 'painel';
const sideLit = {};
function drawSide(){
  const g = begin(SIDE_CV);
  fillRR(g, 0, 0, SIDE_W, SIDE_H, 30, '#0B0D10');
  logoMark(g, 34, 44, 9, '#FFFFFF'); txt(g, 'SENVIA', 64, 45, UI(800, 27), '#FFFFFF'); spaced(g, 'WORKPLACE', 26, 78, UI(600, 11), '#9CA3AF', 3);
  glyph(g, 'building', 34, 120, 22, '#9CA3AF', 18); txt(g, 'Lumen Studio', 56, 121, UI(600, 17), '#FFFFFF'); glyph(g, 'updown', SIDE_W - 34, 120, 22, '#9CA3AF', 20);
  g.fillStyle = '#1F2329'; g.fillRect(0, 148, SIDE_W, 1.5);
  SIDEBAR.forEach(([grp, list]) => { spaced(g, grp.toUpperCase(), 22, SIDE_POS.groups[grp][0] + 6, UI(600, 11), '#7C8591', 2);
    list.forEach((m) => { const yc = SIDE_POS.items[m], on = m === sideActive, lit = sideLit[m];
      if (lit){ g.save(); g.shadowColor = MODS[m].c[1]; g.shadowBlur = 26; fillRR(g, 8, yc - 24, SIDE_W - 16, 48, 14, MODS[m].c[1]); g.restore(); fillRR(g, 8, yc - 24, SIDE_W - 16, 48, 14, '#1E2228'); strokeRR(g, 8, yc - 24, SIDE_W - 16, 48, 14, MODS[m].c[0], 2); }
      else if (on){ fillRR(g, 8, yc - 24, SIDE_W - 16, 48, 14, '#1E2228'); strokeRR(g, 8, yc - 24, SIDE_W - 16, 48, 14, '#343A42', 1.5); }
      tile(g, 20, yc - 17, 34, m); txt(g, MODS[m].label, 68, yc + 1, UI(on || lit ? 700 : 500, 17), on || lit ? '#FFFFFF' : '#E5E7EB'); }); });
  txt(g, 'Senvia OS v26.11', SIDE_W / 2, SIDE_H - 24, UI(400, 12), '#4B5563', 'center');
  SIDE_CV.tex.needsUpdate = true;
}
function drawTop(){
  const g = begin(TOP_CV);
  fillRR(g, 0, 0, TOP_W, TOP_H, 30, '#0B0D10');
  fillRR(g, 24, 28, 540, 64, 32, '#16191E'); strokeRR(g, 24, 28, 540, 64, 32, '#2A2F36', 2);
  glyph(g, 'search', 62, 60, 28, '#9CA3AF', 22); txt(g, 'Procurar módulos e páginas...', 88, 61, UI(400, 20), '#9CA3AF');
  strokeRR(g, 474, 43, 74, 34, 8, '#3A4048', 2); txt(g, 'Ctrl K', 511, 61, UI(600, 13), '#9CA3AF', 'center');
  const time = new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  avatar(g, TOP_W - 56, 60, 30, 'M', '#F8FAFC'); txt(g, 'M', TOP_W - 56, 61, UI(700, 20), C.ink, 'center');
  const px = TOP_W - 106 - 226;
  fillRR(g, px, 28, 226, 64, 32, '#16191E'); strokeRR(g, px, 28, 226, 64, 32, '#2A2F36', 2);
  g.fillStyle = '#F59E0B'; g.beginPath(); g.arc(px + 28, 60, 5, 0, 7); g.fill(); glyph(g, 'clock', px + 56, 60, 26, '#E5E7EB', 22);
  txt(g, time, px + 76, 61, UI(600, 18), '#FFFFFF'); g.fillStyle = '#3A4048'; g.fillRect(px + 140, 44, 2, 32); txt(g, 'Ponto', px + 154, 61, UI(600, 18), '#FFFFFF');
  const bx = px - 50; strokeRR(g, bx - 32, 28, 64, 64, 32, '#2A2F36', 2); glyph(g, 'bell', bx, 60, 28, '#E5E7EB', 22);
  const ax = bx - 52 - 142; fillRR(g, ax, 28, 142, 64, 32, '#16191E'); strokeRR(g, ax, 28, 142, 64, 32, '#2A2F36', 2); glyph(g, 'shield', ax + 34, 60, 24, '#E5E7EB', 22); txt(g, 'Admin', ax + 56, 61, UI(600, 18), '#FFFFFF');
  TOP_CV.tex.needsUpdate = true;
}
// a versão do telemóvel: o painel com a notificação de uma lead nova
const PH_W = 600, PH_H = 1200;
function drawPhone(){
  const g = begin(PHONE_CV);
  g.save(); rr(g, 0, 0, PH_W, PH_H, 70); g.clip();
  g.fillStyle = C.bg; g.fillRect(0, 0, PH_W, PH_H);
  g.fillStyle = '#0B0D10'; g.fillRect(0, 0, PH_W, 180);
  txt(g, '09:41', 60, 44, UI(600, 22), '#FFFFFF'); fillRR(g, PH_W - 104, 34, 44, 20, 6, '#FFFFFF');
  logoMark(g, 52, 118, 10, '#FFFFFF'); txt(g, 'SENVIA', 86, 119, UI(800, 28), '#FFFFFF'); glyph(g, 'bell', PH_W - 64, 118, 34, '#FFFFFF', 20);
  g.save(); g.shadowColor = 'rgba(15,23,42,.18)'; g.shadowBlur = 30; g.shadowOffsetY = 8; fillRR(g, 24, 204, PH_W - 48, 124, 26, '#FFFFFF'); g.restore();
  tile(g, 46, 232, 66, 'leads'); txt(g, 'SENVIA OS · agora', 130, 242, UI(500, 15), C.ink3); txt(g, 'Nova lead: Hotel Atlântico', 130, 272, UI(700, 21), C.ink, 'left', PH_W - 170); txt(g, 'Meta · 12.400 €', 130, 302, UI(400, 16), C.ink2);
  txt(g, 'Olá, Marta', 36, 386, UI(700, 36), C.ink); txt(g, 'Quinta, 11 de março', 36, 426, UI(400, 18), C.ink2);
  [['Leads novas', '48', 'leads'], ['Vendas', '9.840 €', 'sales'], ['Tarefas', '5', 'tasks'], ['Ponto', '08:58', 'clock']].forEach(([l, v, ic], k) => { const x = 24 + (k % 2) * 282, y = 462 + Math.floor(k / 2) * 172;
    card(g, x, y, 270, 156, 22); tile(g, x + 20, y + 20, 44, ic); txt(g, l, x + 20, y + 94, UI(500, 17), C.ink2); txt(g, v, x + 20, y + 128, UI(700, 28), C.ink); });
  txt(g, 'Hoje', 36, 830, UI(700, 24), C.ink);
  [['10:00', 'Visita Hotel Atlântico', 'b'], ['16:00', 'Follow-up Café Central', 'p']].forEach(([h, s, c], k) => { const y = 860 + k * 88; card(g, 24, y, PH_W - 48, 76, 18); fillRR(g, 24, y + 14, 6, 48, 3, EVC[c][0]); txt(g, h, 52, y + 39, UI(700, 18), C.ink); txt(g, s, 130, y + 39, UI(500, 18), C.ink2, 'left', PH_W - 180); });
  g.fillStyle = '#FFFFFF'; g.fillRect(0, PH_H - 130, PH_W, 130); g.fillStyle = C.line; g.fillRect(0, PH_H - 130, PH_W, 1.5);
  [['painel', 'Painel'], ['leads', 'Leads'], ['clients', 'Clientes'], ['sales', 'Vendas'], ['agenda', 'Agenda']].forEach(([m, l], k) => { const x = 60 + k * 120, col = k ? C.ink3 : C.blue;
    glyph(g, MODS[m].icon, x, PH_H - 88, 34, col, 18); txt(g, l, x, PH_H - 50, UI(600, 14), col, 'center'); });
  g.restore();
  PHONE_CV.tex.needsUpdate = true;
}

/* ================= a app em 3D: camadas que se afastam ================= */
const APP_W = 5.8, APP_H = 3.7;
// retângulos de cada camada dentro da janela (unidades, a partir do canto de cima à esquerda)
const RECT = { side: [0, 0, 1.2, APP_H], top: [1.2, 0, APP_W - 1.2, 0.4], content: [1.26, 0.44, CW / PXU, CH / PXU] };
const SIDE_CV = mkCv(SIDE_W, SIDE_H), TOP_CV = mkCv(TOP_W, TOP_H), CONT_CV = mkCv(CW, CH), PHONE_CV = mkCv(PH_W, PH_H);
let screenCur = '';
function drawContent(key){
  const g = begin(CONT_CV);
  g.save(); rr(g, 0, 0, CW, CH, 34); g.clip(); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, CW, CH); SCREENS[key](g); g.restore();
  CONT_CV.tex.needsUpdate = true;
}
function slabGeo(w, h, d, r){
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 10 });
  geo.translate(0, 0, -d / 2); return geo;
}
const app = new THREE.Group(); scene.add(app);
function makeLayer(parent, w, h, color, cv, r, d = 0.04){
  const g = new THREE.Group(); parent.add(g);
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, clearcoat: 0.45, clearcoatRoughness: 0.3 });
  const slab = new THREE.Mesh(slabGeo(w, h, d, r), m); slab.castShadow = true; slab.receiveShadow = true; g.add(slab);
  const mats = [m];
  if (cv){ const fm = new THREE.MeshBasicMaterial({ map: cv.tex, transparent: true, toneMapped: false }); const f = new THREE.Mesh(new THREE.PlaneGeometry(w, h), fm); f.position.z = d / 2 + 0.012; g.add(f); mats.push(fm); }
  return { g, slab, mats, w, h };
}
const shell = makeLayer(app, APP_W, APP_H, 0x0B0D10, null, 0.16);
const LAYERS = {
  side: makeLayer(app, RECT.side[2], RECT.side[3], 0x0B0D10, SIDE_CV, 0.1),
  top: makeLayer(app, RECT.top[2], RECT.top[3], 0x0B0D10, TOP_CV, 0.1),
  content: makeLayer(app, RECT.content[2], RECT.content[3], 0xFFFFFF, CONT_CV, 0.11),
};
// centro de cada camada (unidades locais da app)
const center = (R) => [R[0] + R[2] / 2 - APP_W / 2, APP_H / 2 - (R[1] + R[3] / 2)];
// E = quanto a app está desmontada (0 = inteira, 1 = camadas afastadas)
function placeLayers(E){
  const [sx, sy] = center(RECT.side), [tx, ty] = center(RECT.top), [cx, cy] = center(RECT.content);
  LAYERS.side.g.position.set(sx - E * 0.32, sy, 0.07 + E * 0.62);
  LAYERS.top.g.position.set(tx + E * 0.08, ty + E * 0.3, 0.07 + E * 0.95);
  LAYERS.content.g.position.set(cx + E * 0.12, cy - E * 0.06, 0.07 + E * 0.34);
}

// o telemóvel (capítulo do trabalho): à frente da app, no canto de baixo
const phone = new THREE.Group(); app.add(phone);
{ const body = new THREE.MeshPhysicalMaterial({ color: 0x14181E, roughness: 0.3, metalness: 0.4, clearcoat: 0.8 });
  const sh = new THREE.Mesh(slabGeo(1.0, 2.0, 0.09, 0.16), body); sh.castShadow = true; phone.add(sh);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 1.84), new THREE.MeshBasicMaterial({ map: PHONE_CV.tex, transparent: true, toneMapped: false })); scr.position.z = 0.058; phone.add(scr);
  phone.userData.mats = [body, scr.material]; phone.visible = false; }
let phonePop = 0;

/* ---------- cartões que saltam da app (um conjunto por ecrã) ---------- */
// px: centro no canvas da camada (px de desenho); w/h em unidades; dz: quanto sai para a frente; move: para onde desliza
const WSPEC = [
  { mod: 'painel', px: [835, 225], w: 1.14, h: 0.5, dz: 0.55, kind: 'kpi', d: ['Vendas do mês', '9.840 €', '+18%'] },
  { mod: 'painel', px: [1040, 610], w: 1.72, h: 0.46, dz: 0.9, kind: 'note', d: ['leads', 'Nova lead: Hotel Atlântico', 'Meta · há 2 minutos'] },
  { mod: 'explode', layer: 'side', px: [580, 384], w: 1.2, h: 0.3, dz: 0.3, kind: 'chip', d: ['Comunicação', '#7C3AED'] },
  { mod: 'explode', layer: 'side', px: [580, 570], w: 1.2, h: 0.3, dz: 0.3, kind: 'chip', d: ['Trabalho', '#059669'] },
  { mod: 'explode', layer: 'side', px: [580, 781], w: 1.2, h: 0.3, dz: 0.3, kind: 'chip', d: ['Comercial', '#0891B2'] },
  { mod: 'explode', layer: 'side', px: [580, 992], w: 1.2, h: 0.3, dz: 0.3, kind: 'chip', d: ['Gestão', '#4F46E5'] },
  { mod: 'inbox', px: [330, 304], w: 1.72, h: 0.46, dz: 0.5, kind: 'bubble', d: ['wa', 'Rita Fonseca · WhatsApp', 'Olá! Ainda têm vaga para sexta?'] },
  { mod: 'inbox', px: [330, 396], w: 1.72, h: 0.46, dz: 0.75, kind: 'bubble', d: ['email', 'Hotel Atlântico · Email', 'Pedido de orçamento: 40 quartos'] },
  { mod: 'inbox', px: [330, 488], w: 1.72, h: 0.46, dz: 1.0, kind: 'bubble', d: ['ig', 'estudio.vela · Instagram', 'Quanto custa a sessão completa?'] },
  { mod: 'email', px: [1010, 629], w: 1.6, h: 0.46, dz: 0.6, kind: 'note', d: ['email', 'Resposta enviada', 'Para Ana Ribeiro · 10:52'] },
  { mod: 'email', px: [470, 760], w: 1.72, h: 0.46, dz: 0.85, kind: 'note', d: ['marketing', 'Campanha de março enviada', '1.240 contactos · 46% abriram'] },
  { mod: 'feed', px: [1100, 150], w: 1.6, h: 0.46, dz: 0.6, kind: 'note', d: ['star', 'Reconhecimento: Inês Duarte', 'Fechou 3 vendas esta semana'] },
  { mod: 'feed', px: [1100, 454], w: 1.6, h: 0.46, dz: 0.85, kind: 'bubble', d: ['internal', 'Pedro Lopes · Mensagem interna', 'A campanha sai amanhã às 10h.'] },
  { mod: 'leads', px: [187, 300], move: [513, 600], w: 1.08, h: 0.5, dz: 0.55, kind: 'lead', d: KANBAN[0][3][0] },
  { mod: 'leads', px: [1050, 770], w: 1.72, h: 0.46, dz: 0.85, kind: 'note', d: ['leads', 'Lead movida para Contactado', 'Hotel Atlântico · Inês Duarte'] },
  { mod: 'proposals', px: [1110, 330], w: 1.0, h: 0.36, dz: 0.6, kind: 'stamp', d: ['ACEITE'], rz: -0.16 },
  { mod: 'proposals', px: [700, 860], w: 1.6, h: 0.46, dz: 0.85, kind: 'note', d: ['proposals', 'Proposta_0142.pdf', 'Enviada a Carla Neves'] },
  { mod: 'sales', px: [520, 156], w: 1.2, h: 0.5, dz: 0.55, kind: 'kpi', d: ['Comissão · Rui Costa', '94,50 €', '5%'] },
  { mod: 'sales', px: [1000, 420], w: 1.72, h: 0.46, dz: 0.85, kind: 'note', d: ['sales', 'Cobrança recorrente', 'Padaria Sol · 79 €/mês · Stripe'] },
  { mod: 'finance', px: [300, 640], move: [1130, 560], w: 0.9, h: 1.16, dz: 0.7, kind: 'paper', d: [] },
  { mod: 'finance', px: [1080, 820], w: 1.72, h: 0.46, dz: 0.95, kind: 'note', d: ['email', 'Recibo enviado ao cliente', 'Clínica Aurora · 2.324,70 €'] },
  { mod: 'finance2', px: [1078, 496], w: 1.6, h: 0.46, dz: 0.6, kind: 'note', d: ['warn', 'Estúdio Vela: cobrança vencida', 'Lembrete enviado por email'] },
  { mod: 'finance2', px: [995, 264], w: 1.0, h: 0.5, dz: 0.85, kind: 'kpi', d: ['Balanço', '13.230 €', '+9%'] },
  { mod: 'auto', px: [AUTO[0][0], AUTO[0][1]], w: NODE_W / PXU, h: NODE_H / PXU, dz: 0.45, kind: 'node', d: AUTO[0] },
  { mod: 'auto', px: [AUTO[1][0], AUTO[1][1]], w: NODE_W / PXU, h: NODE_H / PXU, dz: 0.45, kind: 'node', d: AUTO[1] },
  { mod: 'auto', px: [AUTO[2][0], AUTO[2][1]], w: NODE_W / PXU, h: NODE_H / PXU, dz: 0.45, kind: 'node', d: AUTO[2] },
  { mod: 'otto', px: [320, 262], w: 1.7, h: 0.4, dz: 0.6, kind: 'otto', d: ['Entraram 14 leads esta semana.'] },
  { mod: 'otto', px: [1080, 800], w: 1.6, h: 0.46, dz: 0.85, kind: 'note', d: ['leads', 'Lead criada: Padaria Sol', 'Etapa Novo · 1.800 €'] },
  { mod: 'agenda', px: [534, 368], w: 1.6, h: 0.46, dz: 0.6, kind: 'note', d: ['agenda', 'Visita ao Hotel Atlântico', 'Hoje · 10:00 · Inês Duarte'] },
  { mod: 'agenda', px: [700, 770], w: 1.6, h: 0.46, dz: 0.85, kind: 'note', d: ['agenda', 'Chamada com a TransLeiria', '23 mar · 14:00 · Rui Costa'] },
  { mod: 'tasks', px: [420, 300], w: 1.6, h: 0.46, dz: 0.6, kind: 'note', d: ['check', 'Tarefa concluída', 'Ligar ao Hotel Atlântico'] },
  { mod: 'tasks', px: [760, 160], w: 1.5, h: 0.46, dz: 0.9, kind: 'note', d: ['clock', 'Ponto: entrada às 08:58', 'Marta Silva'] },
];
function drawWidget(W){
  const g = begin(W.cv), w = W.cv.w, h = W.cv.h, d = W.d;
  switch (W.kind){
    case 'kpi': fillRR(g, 0, 0, w, h, 22, '#FFFFFF'); txt(g, d[0], 24, h * 0.3, UI(500, 16), C.ink2, 'left', w - 120); txt(g, d[1], 24, h * 0.68, UI(700, 34), C.ink); pill(g, w - 20, h * 0.3, d[2], UI(600, 13), C.green, '#DCFCE7', 10, 26, 'right'); break;
    case 'note': fillRR(g, 0, 0, w, h, 22, '#FFFFFF'); tile(g, 20, (h - 58) / 2, 58, d[0]); txt(g, d[1], 94, h * 0.38, UI(600, 17), C.ink, 'left', w - 112); txt(g, d[2], 94, h * 0.66, UI(400, 14), C.ink2, 'left', w - 112); break;
    case 'bubble': fillRR(g, 0, 0, w, h, 22, { wa: '#DCFCE7', ig: '#FFFFFF', email: '#FFFFFF', internal: '#EEF2FF' }[d[0]]); tile(g, 20, (h - 58) / 2, 58, d[0]);
      txt(g, d[1], 94, h * 0.36, UI(600, 14), C.ink2, 'left', w - 112); txt(g, d[2], 94, h * 0.66, UI(500, 17), C.ink, 'left', w - 112); break;
    case 'lead': leadCard(g, 0, 0, w, h, d, '#3B82F6', true); break;
    case 'stamp': fillRR(g, 3, 3, w - 6, h - 6, 22, '#DCFCE7'); strokeRR(g, 6, 6, w - 12, h - 12, 18, '#16A34A', 5); glyph(g, 'check', 62, h / 2, 46, '#15803D', 30); spaced(g, d[0], w / 2 + 26, h / 2 + 2, UI(800, 40), '#15803D', 4, 'center'); break;
    case 'chip': fillRR(g, 0, 0, w, h, h / 2, d[1]); txt(g, d[0], w / 2, h / 2 + 1, UI(700, 24), '#FFFFFF', 'center'); break;
    case 'otto': { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#6366F1'); gr.addColorStop(1, '#A855F7'); rr(g, 0, 0, w, h, 22); g.fillStyle = gr; g.fill();
      g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(50, h / 2, 28, 0, 7); g.fill(); glyph(g, 'spark', 50, h / 2, 32, '#FFFFFF'); txt(g, d[0], 94, h / 2 + 1, UI(600, 18), '#FFFFFF', 'left', w - 110); break; }
    case 'node': node(g, w / 2, h / 2, d[2], d[3], d[4], true); break;
    case 'paper': fillRR(g, 0, 0, w, h, 10, '#FFFFFF'); g.save(); rr(g, 0, 0, w, h, 10); g.clip(); g.fillStyle = C.blue2; g.fillRect(0, 0, w, 12); g.restore();
      txt(g, 'FATURA', 24, 52, UI(800, 24), C.ink); txt(g, 'FT 2027/118', w - 22, 53, UI(600, 13), C.ink2, 'right');
      txt(g, 'Clínica Aurora', 24, 92, UI(600, 15), C.ink); txt(g, '12/03/2027', 24, 114, UI(400, 12), C.ink3);
      [0.8, 0.62, 0.7].forEach((f, k) => { fillRR(g, 24, 146 + k * 30, (w - 48) * f, 10, 5, C.soft); });
      g.fillStyle = C.line; g.fillRect(24, 246, w - 48, 1.5); txt(g, 'Total', 24, 272, UI(500, 14), C.ink2); txt(g, '2.324,70 €', w - 22, 272, UI(800, 20), C.ink, 'right');
      pill(g, w / 2, h - 34, 'Paga · recibo emitido', UI(600, 12), C.green, '#DCFCE7', 12, 28, 'center'); break;
  }
  W.cv.tex.needsUpdate = true;
}
const WG = WSPEC.map((S, i) => {
  const W = { ...S, i, pop: 0, cv: mkCv(Math.round(S.w * PXU), Math.round(S.h * PXU)) };
  W.k = WSPEC.slice(0, i).filter((o) => o.mod === S.mod).length;
  const r = S.kind === 'chip' ? S.h / 2 - 0.004 : S.kind === 'paper' ? 0.035 : 0.074;
  const L2 = makeLayer(app, S.w, S.h, 0xFFFFFF, W.cv, r, 0.03);
  L2.mats.forEach((m) => { m.transparent = true; });
  Object.assign(W, { g: L2.g, slab: L2.slab, mats: L2.mats }); W.g.visible = false;
  return W;
});

/* ---------- antes: as ferramentas soltas que entram na barra lateral ---------- */
function iconTex(name){ const c = document.createElement('canvas'); c.width = c.height = 256; glyph(c.getContext('2d'), name, 128, 128, 200, '#FFFFFF', 16);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const toolGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 4, 0.14), decalGeo = new THREE.PlaneGeometry(0.42, 0.42);
const TOOLS = [
  { icon: 'chat', col: '#25D366', mod: 'inbox', off: [-1.7, 1.85, 0.9] },
  { icon: 'mail', col: '#F97316', mod: 'email', off: [0.5, 2.05, 0.6] },
  { icon: 'doc', col: '#64748B', mod: 'finance', off: [2.0, 1.6, 1.2] },
  { icon: 'sheet', col: '#1D6F42', mod: 'leads', off: [2.1, -1.55, 1.1] },
  { icon: 'calendar', col: '#F43F5E', mod: 'agenda', off: [-0.3, -2.0, 1.4] },
  { icon: 'list', col: '#10B981', mod: 'tasks', off: [-2.0, -1.6, 1.0] },
].map((T, i) => {
  const g = new THREE.Group(), mat = new THREE.MeshPhysicalMaterial({ color: T.col, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12, transparent: true });
  const body = new THREE.Mesh(toolGeo, mat); body.castShadow = true; g.add(body);
  const dm = new THREE.MeshBasicMaterial({ map: iconTex(T.icon), transparent: true, depthWrite: false, toneMapped: false });
  const f = new THREE.Mesh(decalGeo, dm); f.position.z = 0.315; g.add(f);
  const b = new THREE.Mesh(decalGeo, dm); b.position.z = -0.315; b.rotation.y = Math.PI; g.add(b);
  scene.add(g); g.visible = false;
  return { ...T, i, g, mat, dm, a: 0, op: 0, done: false, ph: rnd() * 6.28 };
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
// os quadradinhos dos módulos, a passar perto da câmara
const DEBRIS = (innerWidth < 760 ? ['inbox', 'leads', 'agenda', 'finance', 'auto', 'sales'] : ['inbox', 'leads', 'agenda', 'finance', 'auto', 'sales', 'email', 'tasks', 'proposals', 'feed']);
const debrisGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 3, 0.15);
const debris = DEBRIS.map((m, i) => {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const mat = new THREE.MeshPhysicalMaterial({ color: MODS[m].c[1], roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true });
  g.add(new THREE.Mesh(debrisGeo, mat));
  const dm = new THREE.MeshBasicMaterial({ map: iconTex(MODS[m].icon), transparent: true, depthWrite: false, toneMapped: false });
  const f = new THREE.Mesh(decalGeo, dm); f.position.z = 0.315; g.add(f);
  fgScene.add(g);
  return { g, mat, dm, right: i % 3 !== 0, rx: rnd(), y0: rnd(), d: 4.2 + rnd() * 4.2, dir: rnd() < .5 ? -1 : 1, sp: 0.3 + rnd() * 0.5 };
});
// presença por capítulo: discreta onde a app tem conteúdo para ler
const FG_OP = [0.4, 0.3, 0.2, 0.2, 0.2, 0.5, 0.2, 0.55, 0.5];
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
const confData = [], CONF_COLS = ['#9FB4BE', '#93C5FD', '#C5D3DA', '#A5B4FC'].map(c => new THREE.Color(c));
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
  L.camZ = L.mobile ? 15 : (w / h < 1.3 ? 12 : 10);
  L.appS = L.mobile ? 0.58 : 0.7;
  // composição centrada: texto (31rem) + intervalo + app formam um só bloco no meio do ecrã
  const textW = Math.min(496, w * 0.4), gap = 64;
  L.wppAt = (d) => d * Math.tan(THREE.MathUtils.degToRad(17)) * (w / h) / (w / 2);
  const wpp = L.wppAt(L.camZ), objPx = APP_W * L.appS * 0.93 / wpp;
  L.cxPx = L.mobile ? 0 : (textW + gap) / 2;
  L.cx = L.cxPx * wpp;
  document.documentElement.style.setProperty('--stage-pad', `${Math.round(Math.max(w * 0.04, (w - (textW + gap + objPx)) / 2))}px`);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  fgCam.aspect = w / h; fgCam.updateProjectionMatrix();
  renderer.setSize(w, h, false); fgR.setSize(w, h, false);
}
layout();
addEventListener('resize', () => { layout(); measure(); });

// o texto de um lado, a app do outro; CX/CY/CS amortecidos fazem a app deslizar entre posições
function posSpec(pos){
  if (L.mobile) return [0, 0, 1];
  switch (pos){
    case 'right': return [-L.cx, 0, 1];
    case 'center': return [0, 0, 1];
    case 'bottom': return [0, 0.75, 0.8];
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
    mpos: l.classList.contains('m-high') ? 'high' : l.classList.contains('m-low') ? 'low' : 'mid',
    lines: [...l.querySelectorAll('.bl')].map(b => ({ el: b, at: +b.dataset.at, on: false, past: false })) })),
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
  let pos = 'left', mpos = 'mid', lpCur = 0.5, fallN = 0;
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
    if (l.lines.length){
      let n = 0;
      l.lines.forEach((b, k) => {
        const bOn = on && lp >= b.at, bPast = bOn && !!l.lines[k + 1] && lp >= l.lines[k + 1].at;
        if (bOn) n++;
        if (bOn !== b.on){ b.on = bOn; b.el.classList.toggle('on', bOn); }
        if (bPast !== b.past){ b.past = bPast; b.el.classList.toggle('past', bPast); }
      });
      if (on && ch === c) fallN = n;
    }
    if (on && ch === c){ pos = l.pos; mpos = l.mpos; lpCur = lp; }
  }));
  state.pos = pos; state.mpos = mpos; state.lp = lpCur; state.fallN = fallN;
  hudBar.style.width = `${(c.p * 100).toFixed(1)}%`;
  if (cur !== lastCur){
    lastCur = cur;
    hudN.textContent = String(cur + 1).padStart(2, '0'); hudName.textContent = c.name;
    dotEls.forEach((d, i) => { d.classList.toggle('on', i === cur); d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
    document.body.classList.toggle('night', c.night);
  }
}

// números que contam até ao valor quando a camada entra
function countUp(el){
  const to = +el.dataset.count, suf = el.dataset.suffix || '';
  if (REDUCE){ el.textContent = String(to).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suf; return; }
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
planEls.forEach((el) => el.addEventListener('click', (e) => {
  if (innerWidth >= 760 || e.target.closest('a')) return;
  const r = el.getBoundingClientRect(), p = plansEl.getBoundingClientRect();
  plansEl.scrollBy({ left: r.left + r.width / 2 - (p.left + p.width / 2), behavior: 'smooth' });
}));
function centerRec(){
  if (innerWidth >= 760) return;
  const rec = plansEl.querySelector('.rec');
  plansEl.scrollLeft += rec.getBoundingClientRect().left - plansEl.getBoundingClientRect().left - (plansEl.clientWidth - rec.offsetWidth) / 2;
}
centerRec();
addEventListener('resize', centerRec);

/* ================= câmara ================= */
const camPos = new THREE.Vector3(0, 0.5, 10), camLook = new THREE.Vector3(), camPosT = new THREE.Vector3(), camLookT = new THREE.Vector3();
function cameraTarget(ch, beat, bp, p){
  const Z = L.camZ, sc = REDUCE ? 0.3 : 1, LY = L.mobile ? MLY : 0;
  switch (ch){
    case 0: camPosT.set(Math.sin(p * 0.8 - 0.25) * 1.4 * sc, 0.35 + p * 0.7, Z - p * 0.6); camLookT.set(0, LY, 0); break;
    case 7: camPosT.set(Math.sin(p * 0.6 - 0.3) * 1.2 * sc, 0.6, Z + 0.5); camLookT.set(0, LY * 0.5 + 0.2, -1); break;
    default: camPosT.set(Math.sin(p * 0.7 - 0.35) * 1.2 * sc, 0.4 + p * 0.25, Z - 0.3 - p * 0.3); camLookT.set(0, LY, 0);
  }
}

/* ambiente: dia / noite */
const ENV = {
  day: { bg: new THREE.Color('#EEF2F3'), dot: new THREE.Color('#9FB4BE'), glow: new THREE.Color('#7CC6DA'), glowA: 0.55, env: 0.95 },
  night: { bg: new THREE.Color('#0B1F2A'), dot: new THREE.Color('#2C86A3'), glow: new THREE.Color('#6366F1'), glowA: 0.32, env: 0.45 },
};
let nightAmt = 0;

/* ================= a app em cada momento ================= */
const appSt = { x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 0.7, E: 0 };
let modCur = '';
function setModule(mod){
  if (mod === modCur) return;
  modCur = mod;
  const sk = SCREEN[mod] || mod; if (sk !== screenCur){ screenCur = sk; drawContent(sk); }
  const act = ACTIVE[mod] || mod; if (act !== sideActive){ sideActive = act; drawSide(); }
}
function updateApp(cur, beat, bp, t, dt){
  const m = L.mobile, tg = { x: CX, y: CY + 0.05, z: 0, rx: 0.05, ry: m ? 0 : -0.36 * side(), s: L.appS * CS, E: 0.08 };
  if (cur === 0 && beat === 1){ tg.E = 1; tg.ry = m ? 0.45 : -0.72 * side(); tg.rx = 0.16; }
  else if (cur >= 2 && cur <= 6) tg.E = 0.18 + 0.82 * Math.max(1 - smooth(0, 0.26, bp), smooth(0.8, 1, bp));
  else if (cur === 7){ tg.x = 0; tg.y = m ? -0.6 : -0.45; tg.z = -3.5; tg.rx = 0.22; tg.ry = 0; tg.E = 0.45; tg.s = L.appS * 1.05; }
  else if (cur === 8) tg.ry = Math.sin(t * 0.35) * 0.12 * (REDUCE ? 0 : 1);
  if (REDUCE) tg.E = Math.min(tg.E, 0.4);
  stepTo(appSt, tg, damp(dt, 2.6));
  const bob = Math.sin(t * 0.8) * 0.04 * (REDUCE ? 0 : 1);
  app.position.set(appSt.x, appSt.y + bob, appSt.z);
  app.rotation.set(appSt.rx + VEL * 0.03, appSt.ry, 0);
  app.scale.setScalar(appSt.s);
  placeLayers(appSt.E);
}
function updateWidgets(cur, beat, bp, t, dt){
  WG.forEach((W) => {
    let want = 0;
    if (W.mod === modCur){
      if (cur === 0 && beat === 0) want = (t > 0.9 + W.k * 0.4 ? 1 : 0) * (1 - smooth(0.78, 0.95, bp));
      else if (cur === 8) want = smooth(0.15 + W.k * 0.1, 0.3 + W.k * 0.1, bp);
      else { const a = 0.12 + W.k * 0.12; want = smooth(a, a + 0.14, bp) * (1 - smooth(0.82, 0.96, bp)); }
    }
    W.pop += (want - W.pop) * damp(dt, want > W.pop ? 5 : 7);
    W.g.visible = W.pop > 0.01;
    if (!W.g.visible) return;
    let px = W.px[0], py = W.px[1], arc = 0;
    if (W.move){ const f = smooth(0.34, 0.72, bp); px = lerp(px, W.move[0], f); py = lerp(py, W.move[1], f); arc = Math.sin(Math.PI * f) * 0.35; }
    const Ly = LAYERS[W.layer || 'content'];
    W.g.position.set(Ly.g.position.x + (px - Ly.w * PXU / 2) / PXU, Ly.g.position.y + (Ly.h * PXU / 2 - py) / PXU, Ly.g.position.z + 0.05 + W.pop * W.dz + arc + appSt.E * 0.2);
    W.g.rotation.set((1 - W.pop) * 0.5, Math.sin(t * 0.7 + W.i) * 0.06 * (REDUCE ? 0 : 1), W.rz || 0);
    W.g.scale.setScalar(Math.max(0.0001, backOut(W.pop)));
    W.mats.forEach((mt) => { mt.opacity = Math.min(1, W.pop * 1.4); });
    W.slab.castShadow = W.pop > 0.6;
  });
  // telemóvel
  const pw = cur === 6 && beat === 1 ? smooth(0.1, 0.3, bp) * (1 - smooth(0.86, 0.98, bp)) : 0;
  phonePop += (pw - phonePop) * damp(dt, 5);
  phone.visible = phonePop > 0.01;
  if (phone.visible){
    phone.position.set(APP_W / 2 - 0.8, -0.35 - (1 - phonePop) * 0.4, 0.9 + phonePop * 0.35);
    phone.rotation.set(0.04, -0.2 + Math.sin(t * 0.6) * 0.05 * (REDUCE ? 0 : 1), 0.04);
    phone.scale.setScalar(Math.max(0.0001, backOut(phonePop)));
    phone.userData.mats.forEach((mt) => { mt.transparent = true; mt.opacity = Math.min(1, phonePop * 1.4); });
  }
}
// antes: cada frase que entra puxa uma ferramenta solta para dentro da barra lateral, que acende
const tmpV = new THREE.Vector3(), tmpA = new THREE.Vector3();
function updateTools(cur, beat, t, dt){
  const m = L.mobile, sc = m ? 0.62 : 1;
  let litChanged = false;
  TOOLS.forEach((T, k) => {
    let trig = cur > 1 ? 1 : 0;
    if (cur === 1) trig = k < 4 ? (state.fallN > k || beat === 1 ? 1 : 0) : (beat === 1 && state.lp > (k === 4 ? 0.12 : 0.3) ? 1 : 0);
    T.a += (trig - T.a) * damp(dt, trig > T.a ? 2.4 : 4);
    const show = cur === 1 || (cur === 0 && state.p > 0.8) ? 1 : 0;
    T.op += (show - T.op) * damp(dt, 3);
    T.g.visible = T.op > 0.01 && T.a < 0.96;
    if (T.a > 0.9 && !T.done){ T.done = true; sideLit[T.mod] = performance.now(); litChanged = true; }
    if (T.a < 0.5) T.done = false;
    if (!T.g.visible) return;
    const bob = Math.sin(t * 0.9 + T.ph) * 0.12 * (REDUCE ? 0 : 1);
    tmpA.set(app.position.x + T.off[0] * sc, app.position.y + T.off[1] * sc + bob, T.off[2] * sc);
    const it = SIDE_POS.items[T.mod], Ls = LAYERS.side;
    tmpV.set(Ls.g.position.x + (37 - SIDE_W / 2) / PXU, Ls.g.position.y + (SIDE_H / 2 - it) / PXU, Ls.g.position.z + 0.05); app.localToWorld(tmpV);
    const e = T.a * T.a * (3 - 2 * T.a);
    T.g.position.lerpVectors(tmpA, tmpV, e); T.g.position.z += Math.sin(Math.PI * e) * 0.8;
    T.g.rotation.set(t * 0.3 + T.ph + e * 3, t * 0.4 + T.ph * 2 + e * 4, 0.3);
    T.g.scale.setScalar(Math.max(0.0001, (m ? 0.62 : 1) * (1 - e * 0.85) * T.op));
    T.mat.opacity = T.dm.opacity = T.op;
  });
  // a barra lateral acende o módulo que acabou de receber a ferramenta, e apaga passado pouco tempo
  const now = performance.now();
  for (const key in sideLit) if (now - sideLit[key] > 1300){ delete sideLit[key]; litChanged = true; }
  if (litChanged) drawSide();
}

/* ================= ciclo ================= */
let last = performance.now(), t0 = last, slowFrames = 0;
let VEL = 0, ENERGY = 0, SY = 0, lastY = scrollY;
const lag = { cur: -1, pos: 'left', mpos: 'mid', beat: 0, wantPos: 'left', wantMpos: 'mid', wantBeat: 0, t: 0 };
const MLY_T = { high: 2.2, low: -1.9, mid: 0 };
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

  // o texto entra primeiro: dentro do mesmo capítulo, a app só reage ~0,22s depois de o momento mudar
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

  cameraTarget(cur, beat, bp, p);
  const kc = damp(dt, 2.2);
  camPos.lerp(camPosT, kc); camLook.lerp(camLookT, kc);
  mouse.sx += (mouse.nx - mouse.sx) * damp(dt, 3); mouse.sy += (mouse.ny - mouse.sy) * damp(dt, 3);
  camera.position.set(camPos.x + mouse.sx * 0.35, camPos.y + mouse.sy * 0.22, camPos.z);
  camera.lookAt(camLook);
  camera.updateMatrixWorld();
  floorMat.uniforms.uCam.value.copy(camera.position);
  sun.target.position.copy(camLook); sun.position.set(camLook.x - 4, camLook.y + 9, camLook.z + 6);

  const mods = MOD_BY[cur]; setModule(mods[Math.min(lag.beat, mods.length - 1)]);
  updateApp(cur, lag.beat, bp, t, dt);
  updateWidgets(cur, lag.beat, bp, t, dt);
  updateTools(cur, lag.beat, t, dt);

  const nightGlow = nightAmt * 0.5;
  confMat.emissive.setRGB(0.1 * nightGlow, 0.12 * nightGlow, 0.45 * nightGlow);
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
const lastChapterEl = chapters[chapters.length - 1].el;
let worldHidden = false;
function drawAll(){ drawSide(); drawTop(); drawPhone(); if (screenCur) drawContent(screenCur); WG.forEach(drawWidget); }
setModule('painel'); drawAll();
// os ecrãs usam a Inter: quando a letra chegar, redesenha tudo
Promise.all([400, 500, 600, 700, 800].map((w) => document.fonts.load(`${w} 20px Inter`))).then(drawAll).catch(() => {});
setInterval(drawTop, 30000);
renderer.setAnimationLoop(frame);
