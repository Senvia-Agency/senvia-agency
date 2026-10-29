import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';


/* ================= conteúdo ================= */
// o texto vive no HTML da página (Astro); aqui fica só o que o 3D precisa
const ROOT = document.getElementById('sv2');
const WORK = [...ROOT.querySelectorAll('#servicos .layer')].map((l) => ({ key: l.dataset.key }));
const ICONS = ['sheet','users','invoice','box','calendar','chart','chat','cog','shield','euro','server','mail'];

/* ================= cada losango é uma peça da tua empresa ================= */
const PIECES = {
  sheet: ['Excel', 'O que hoje vive em folhas soltas'],
  users: ['Clientes', 'Fichas, histórico e contactos'],
  invoice: ['Faturação', 'Orçamentos e faturas num só sítio'],
  box: ['Stock', 'Entradas, saídas e alertas'],
  calendar: ['Agenda', 'Marcações e equipa'],
  chart: ['Relatórios', 'Números em tempo real'],
  chat: ['WhatsApp', 'Mensagens que viram pedidos'],
  cog: ['Automação', 'Tarefas que se fazem sozinhas'],
  shield: ['Segurança', 'Backups e acessos por pessoa'],
  euro: ['Licenças', 'O custo que cresce com a equipa'],
  server: ['Servidor SENVIA', '69€ por mês, servidor e manutenção'],
  mail: ['Email', 'Avisos automáticos aos clientes'],
};
// peças de cada forma de trabalhar connosco (sistema, sites, Senvia OS)
const WORK_PIECES = [
  ['sheet', 'cog', 'server'],
  ['chat', 'mail', 'chart'],
  ['users', 'calendar', 'chart'],
];
// peças de cada custo (construção, servidor e manutenção, evoluções)
// sem peças por cima dos cartões: nos custos os cubos recuam para o fundo
const PKG = [[], [], []];
// o sistema monta-se: cada peça voa para o sítio onde vive e "carimba" essa parte do ecrã
// [peça, início, fim] em momentos do capítulo (0 a 3, um por frase)
const BUILD = [
  ['sheet', 0.06, 0.36], ['users', 0.30, 0.62], ['calendar', 0.52, 0.80],                                   // tudo num sítio só
  ['cog', 1.04, 1.34], ['chat', 1.24, 1.56], ['mail', 1.46, 1.76],                                          // trabalho que se faz sozinho
  ['invoice', 2.02, 2.24], ['chart', 2.14, 2.40], ['box', 2.30, 2.52], ['shield', 2.42, 2.62], ['server', 2.54, 2.76], // números em tempo real
];
const BUILD_AT = Object.fromEntries(BUILD.map(([k, a, b], j) => [k, { a, b, j, beat: Math.floor(a) }]));
const PUBLISH = [2.78, 2.94];
// onde cada peça aterra e onde fica depois como marcador, em px do sistema desenhado (1280 × 1124)
const SITE = {
  sheet: { land: [120, 560], pin: [230, 96] },      // estrutura e menu lateral: os dados do Excel entram
  users: { land: [517, 520], pin: [262, 342] },     // tabela de clientes
  calendar: { land: [1021, 520], pin: [792, 342] }, // agenda de hoje
  cog: { land: [517, 990], pin: [262, 742] },       // automações
  mail: { land: [517, 912], pin: [262, 912] },      // email de boas-vindas
  invoice: { land: [1091, 236], pin: [946, 178] },  // faturado no mês
  box: { land: [1021, 915], pin: [792, 742] },      // stock com alerta
  shield: { land: [660, 35], pin: [560, 35] },      // backups e acessos
  server: { land: [1100, 35], pin: [964, 35] },     // servidor no ar
  chat: { card: 'chat' }, chart: { card: 'chart' }, // cartões que saltam para fora da janela
};

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
function rng(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = rng(1029);
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

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

// no telemóvel o chão desce, para haver espaço para o 3D por baixo do texto centrado
const FLOOR_Y = innerWidth < 760 ? -3.4 : -1.75;
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

// brilho de fundo preso à câmara (luz ambiente que muda de cor por capítulo)
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

/* ================= ícones ================= */
function iconTex(name){
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'); g.strokeStyle = '#FFFFFF'; g.fillStyle = '#FFFFFF'; g.lineWidth = 15; g.lineCap = 'round'; g.lineJoin = 'round';
  const P = (pts, close = true) => { g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); g.stroke(); };
  switch (name){
    case 'chat': rr(g, 44, 56, 168, 118, 34); g.stroke(); P([[86, 172], [70, 212], [124, 174]], false); [98, 128, 158].forEach(x => { g.beginPath(); g.arc(x, 115, 9, 0, 7); g.fill(); }); break;
    case 'cursor': P([[84, 46], [84, 204], [122, 166], [150, 220], [176, 207], [148, 154], [198, 154]]); break;
    case 'target': [80, 48].forEach(r => { g.beginPath(); g.arc(128, 128, r, 0, 7); g.stroke(); }); g.beginPath(); g.arc(128, 128, 15, 0, 7); g.fill(); break;
    case 'pencil': P([[62, 194], [78, 146], [168, 56], [200, 88], [110, 178]]); P([[148, 76], [180, 108]], false); break;
    case 'search': g.beginPath(); g.arc(112, 112, 58, 0, 7); g.stroke(); P([[154, 154], [206, 206]], false); break;
    case 'chart': P([[50, 208], [206, 208]], false); P([[78, 182], [78, 140]], false); P([[124, 182], [124, 108]], false); P([[170, 182], [170, 74]], false); break;
    case 'shield': g.beginPath(); g.moveTo(128, 42); g.lineTo(198, 70); g.lineTo(198, 124); g.quadraticCurveTo(198, 188, 128, 216); g.quadraticCurveTo(58, 188, 58, 124); g.lineTo(58, 70); g.closePath(); g.stroke(); P([[98, 128], [120, 150], [160, 106]], false); break;
    case 'globe': g.beginPath(); g.arc(128, 128, 80, 0, 7); g.stroke(); g.beginPath(); g.ellipse(128, 128, 34, 80, 0, 0, 7); g.stroke(); P([[48, 128], [208, 128]], false); break;
    case 'megaphone': P([[58, 108], [58, 152], [96, 152], [182, 200], [182, 60], [96, 108]]); P([[100, 156], [116, 206]], false); break;
    case 'bag': rr(g, 60, 96, 136, 116, 22); g.stroke(); g.beginPath(); g.arc(128, 96, 36, Math.PI, 0); g.stroke(); break;
    case 'bolt': P([[142, 40], [76, 142], [126, 142], [112, 218], [184, 108], [132, 108]]); break;
    case 'calendar': rr(g, 54, 70, 148, 138, 22); g.stroke(); P([[54, 114], [202, 114]], false); P([[96, 50], [96, 86]], false); P([[160, 50], [160, 86]], false); break;
    // peças da empresa (home)
    case 'sheet': rr(g, 52, 58, 152, 140, 18); g.stroke(); P([[52, 104], [204, 104]], false); P([[52, 150], [204, 150]], false); P([[104, 58], [104, 198]], false); P([[154, 58], [154, 198]], false); break;
    case 'users': g.beginPath(); g.arc(104, 100, 30, 0, 7); g.stroke(); g.beginPath(); g.arc(104, 206, 56, Math.PI * 1.12, Math.PI * 1.88); g.stroke();
      g.beginPath(); g.arc(170, 112, 24, 0, 7); g.stroke(); g.beginPath(); g.arc(178, 200, 42, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); break;
    case 'invoice': P([[70, 42], [158, 42], [192, 76], [192, 214], [70, 214]]); P([[158, 42], [158, 76], [192, 76]], false); P([[98, 116], [164, 116]], false); P([[98, 150], [164, 150]], false); P([[98, 184], [136, 184]], false); break;
    case 'box': P([[128, 46], [204, 84], [204, 172], [128, 210], [52, 172], [52, 84]]); P([[52, 84], [128, 122], [204, 84]], false); P([[128, 122], [128, 210]], false); break;
    case 'cog': { g.beginPath(); g.arc(128, 128, 46, 0, 7); g.stroke(); g.beginPath(); g.arc(128, 128, 16, 0, 7); g.fill();
      for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4; P([[128 + Math.cos(a) * 58, 128 + Math.sin(a) * 58], [128 + Math.cos(a) * 82, 128 + Math.sin(a) * 82]], false); } break; }
    case 'euro': g.beginPath(); g.arc(144, 128, 70, Math.PI * 0.28, Math.PI * 1.72); g.stroke(); P([[52, 108], [146, 108]], false); P([[52, 148], [140, 148]], false); break;
    case 'server': rr(g, 52, 56, 152, 62, 14); g.stroke(); rr(g, 52, 138, 152, 62, 14); g.stroke(); [87, 169].forEach(y => { g.beginPath(); g.arc(88, y, 9, 0, 7); g.fill(); }); P([[122, 87], [174, 87]], false); P([[122, 169], [174, 169]], false); break;
    case 'mail': rr(g, 46, 66, 164, 124, 18); g.stroke(); P([[52, 76], [128, 136], [204, 76]], false); break;
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

/* ================= o objeto-herói: losangos de vidro petróleo ================= */
const tileGeo = new RoundedBoxGeometry(1, 1, 0.28, 5, 0.12);
const decalGeo = new THREE.PlaneGeometry(0.54, 0.54);
// losangos num petróleo mais lavado e vidrado; a cor forte fica reservada ao losango activo e às palavras-chave do texto
const BASES = ['#5FB0C8', '#4CA2BD', '#6CBACF', '#4596B2'].map(c => new THREE.Color(c));
const GRAY = new THREE.Color('#AEBEC6'), GLOW_C = new THREE.Color('#0E86A8'), GREEN_C = new THREE.Color('#25D366'), STRONG_C = new THREE.Color('#0A7EA0');
const KEYS = ['x', 'y', 'z', 'rx', 'ry', 'rz', 'dia', 's', 'tint', 'glow', 'green', 'h', 'fix'];
// a home não usa os losangos da página de sites: o 3D são cubos de dados (ver «o mundo em cubos»)
const tiles = [];
const tileByIcon = Object.fromEntries(tiles.map((t, i) => [t.icon, i]));
const bodies = tiles.map(t => t.body);

/* ================= janela de browser da Solução (onde as peças montam a página) ================= */
const solPanel = new THREE.Group(); scene.add(solPanel);
const solMat = new THREE.MeshPhysicalMaterial({ color: 0xF9FBFB, roughness: 0.3, clearcoat: 0.6, transparent: true, opacity: 0 });
const solBody = new THREE.Mesh(new RoundedBoxGeometry(5.0, 4.4, 0.08, 6, 0.14), solMat);
solBody.position.set(0, 0.12, -0.06); solBody.castShadow = true; solPanel.add(solBody);
const SOLR = { x: 0, y: 0 };
let solOp = 0, solB = 0, pageKey = '';

// o site em si: desenhado num canvas na face da janela, parte a parte, à medida que as peças chegam
const PW = 4.9, PH = 4.3, PYC = 0.12, SW = 1280, SH = 1124; // face da janela (unidades) e o mesmo em px
const pageQ = innerWidth < 760 ? 0.6 : 1;
const pageCv = document.createElement('canvas'); pageCv.width = SW * pageQ; pageCv.height = SH * pageQ;
const pg = pageCv.getContext('2d');
const pageTex = new THREE.CanvasTexture(pageCv); pageTex.colorSpace = THREE.SRGBColorSpace; pageTex.anisotropy = 8;
const pageMat = new THREE.MeshBasicMaterial({ map: pageTex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
const pageMesh = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), pageMat); pageMesh.position.set(0, PYC, -0.01); solPanel.add(pageMesh);

// cartões que saltam para fora da janela: o resultado no Google e os pedidos da semana
function makeCard(w, h){
  const g = new THREE.Group(); g.visible = false; solPanel.add(g);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, roughness: 0.35, clearcoat: 0.5, transparent: true, opacity: 0 });
  const slab = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.06, 4, 0.08), mat); g.add(slab);
  const cv = document.createElement('canvas'); cv.width = Math.round((w - 0.06) * 400); cv.height = Math.round((h - 0.06) * 400);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const fmat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.06), fmat); face.position.z = 0.032; g.add(face);
  return { g, mat, fmat, cv, tex, slab, w, h };
}
// cartões que saltam para fora da janela: a mensagem de WhatsApp enviada sozinha e a faturação da semana
// (no telemóvel o do WhatsApp fica por cima do canto da janela: por cima dela não há espaço até ao menu)
const CARDS = { chat: Object.assign(makeCard(2.0, 0.84), { at: innerWidth < 760 ? [1.2, 1.95, 0.42] : [1.3, 2.6, 0.42] }), chart: Object.assign(makeCard(1.5, 1.05), { at: [2.2, 0.55, 0.5] }) };
Object.values(CARDS).forEach(K => K.g.position.set(...K.at));
// pontos locais (na janela) onde cada peça aterra e onde fica como marcador
const SPOT = Object.fromEntries(Object.entries(SITE).map(([k, S]) => {
  if (S.card){ const K = CARDS[S.card], [x, y, z] = K.at; return [k, { land: [x, y, z + 0.04], pin: [x - K.w / 2 + 0.1, y + K.h / 2 - 0.1, z + 0.04] }]; }
  const loc = ([px, py]) => [(px / SW - 0.5) * PW, (0.5 - py / SH) * PH + PYC, 0];
  return [k, { land: loc(S.land), pin: loc(S.pin) }];
}));

const SC = { ink: '#0B1F2A', ink2: '#4A6170', petrol: '#0E86A8', deep: '#00708F', soft: '#F2F7F8', line: '#DCE5E9', wire: '#9DB2BD', wa: '#25D366', okBg: '#E3F4EA', ok: '#13804A', gold: '#F2B53A' };
const SF = (w, s, fam = 'General Sans') => `${w} ${s}px "${fam}", "Segoe UI", system-ui, sans-serif`;
const ease3 = (r) => 1 - Math.pow(1 - r, 3);
const backOut = (x) => x <= 0 ? 0 : 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
function star(g, x, y, r){ g.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, d = k % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); }
function lock(g, x, y, col){ g.save(); g.translate(x, y); g.strokeStyle = g.fillStyle = col; g.lineWidth = 2.6; g.beginPath(); g.arc(0, -4, 5.5, Math.PI, 0); g.stroke(); rr(g, -8, -4, 16, 12, 3); g.fill(); g.restore(); }
function boltIcon(g, x, y, s, col){ g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); [[142, 40], [76, 142], [126, 142], [112, 218], [184, 108], [132, 108]].forEach(([a, b], k) => k ? g.lineTo(a - 128, b - 128) : g.moveTo(a - 128, b - 128)); g.closePath(); g.fill(); g.restore(); }
function txt(g, s, x, y, font, col, align = 'left'){ g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); }

// cada parte do site: esqueleto tracejado enquanto a peça não chega; quando chega, o conteúdo sobe e um contorno pisca
// (desenha no canvas que estiver ativo: o do sistema ou o do site de exemplo)
let PG = pg;
function sitePart(r, wire, draw, box){
  const g = PG;
  if (r < 1){ g.save(); g.globalAlpha = 1 - ease3(r); g.setLineDash([10, 8]); g.lineWidth = 2; g.strokeStyle = SC.wire; g.fillStyle = 'rgba(157,178,189,.32)'; wire(g); g.restore(); }
  if (r > 0){ const e = ease3(r); g.save(); g.globalAlpha = Math.min(1, r * 1.6); g.translate(0, (1 - e) * 14); draw(g); g.restore(); }
  const f = Math.sin(Math.PI * clamp(r, 0, 1));
  if (box && f > 0.02){ const [x, y, w, h, rad] = box; g.save(); g.globalAlpha = f * 0.85; g.strokeStyle = SC.petrol; g.lineWidth = 4; rr(g, x - 7, y - 7, w + 14, h + 14, rad + 7); g.stroke(); g.restore(); }
}
const dashBox = (g, x, y, w, h, rad) => { rr(g, x, y, w, h, rad); g.stroke(); };
const skel = (g, x, y, w, h) => { rr(g, x, y, w, h, Math.min(h / 2, 8)); g.fill(); };

// o site de exemplo (o mesmo da página de sites), aqui usado já pronto num dos ecrãs dos serviços
function drawPage(R, ctx = pg, q = pageQ){
  PG = ctx; const g = ctx; g.setTransform(q, 0, 0, q, 0, 0); g.clearRect(0, 0, SW, SH);
  g.save(); rr(g, 0, 0, SW, SH, 30); g.clip();
  // fundo: vidro vazio até chegar o design; depois página branca
  g.fillStyle = `rgba(255,255,255,${(0.22 + 0.78 * ease3(R.pencil)).toFixed(3)})`; g.fillRect(0, 0, SW, SH);

  // barra do browser: domínio (globe), cadeado (shield), carregamento (bolt) e "Publicado"
  g.fillStyle = '#E6EDF0'; g.fillRect(0, 0, SW, 70);
  g.fillStyle = '#B9C8CF'; [40, 66, 92].forEach(x => { g.beginPath(); g.arc(x, 35, 8, 0, 7); g.fill(); });
  g.fillStyle = '#F8FAFB'; rr(g, 250, 15, 780, 40, 20); g.fill();
  const dom = 'studioalma.pt', lk = ease3(R.shield), dx = 276 + lk * 26;
  if (R.shield > 0){ g.save(); g.globalAlpha = Math.min(1, R.shield * 1.5); lock(g, 282, 36, '#1E9E5A'); g.restore(); }
  if (R.globe < 0.06) txt(g, 'about:blank', dx, 36, SF(500, 19, 'DM Mono'), SC.wire);
  else { const n = Math.round(dom.length * smooth(0.06, 0.85, R.globe)), s = dom.slice(0, n);
    txt(g, s, dx, 36, SF(500, 19, 'DM Mono'), SC.ink);
    if (R.globe < 1){ g.font = SF(500, 19, 'DM Mono'); g.fillStyle = SC.petrol; g.fillRect(dx + g.measureText(s).width + 3, 24, 2.5, 24); } }
  if (R.pub > 0){ g.save(); g.globalAlpha = R.pub; g.fillStyle = SC.okBg; rr(g, 872, 20, 148, 30, 15); g.fill();
    g.fillStyle = '#1FAF5B'; g.beginPath(); g.arc(892, 35, 6, 0, 7); g.fill(); txt(g, 'Publicado', 906, 36, SF(600, 16), SC.ok); g.restore(); }
  if (R.bolt > 0 && R.bolt < 1){ g.save(); g.globalAlpha = 1 - smooth(0.7, 1, R.bolt); g.fillStyle = SC.petrol; g.fillRect(0, 70, SW * smooth(0, 0.55, R.bolt), 5); g.restore(); }

  // menu (pencil)
  sitePart(R.pencil, (g) => { skel(g, 60, 98, 170, 26); [560, 680, 800, 920].forEach(x => skel(g, x, 102, 84, 18)); },
    (g) => { g.fillStyle = SC.petrol; g.save(); g.translate(78, 111); g.rotate(Math.PI / 4); rr(g, -11, -11, 22, 22, 5); g.fill(); g.restore();
      txt(g, 'Studio Alma', 102, 111, SF(600, 26), SC.ink);
      ['Serviços', 'Preços', 'Sobre', 'Contactos'].forEach((s, k) => txt(g, s, 560 + k * 120, 111, SF(500, 19), SC.ink2));
      g.fillStyle = SC.line; g.fillRect(0, 150, SW, 2); });
  // imagem do topo (pencil)
  sitePart(R.pencil, (g) => { dashBox(g, 690, 180, 534, 380, 26); g.beginPath(); g.moveTo(690, 180); g.lineTo(1224, 560); g.moveTo(1224, 180); g.lineTo(690, 560); g.stroke(); },
    (g) => { const gr = g.createLinearGradient(690, 180, 1224, 560); gr.addColorStop(0, '#DDF0F4'); gr.addColorStop(1, '#7CC6DA');
      g.save(); rr(g, 690, 180, 534, 380, 26); g.fillStyle = gr; g.fill(); g.clip();
      g.fillStyle = '#F7DCC8'; g.beginPath(); g.arc(1078, 300, 84, 0, 7); g.fill();
      g.fillStyle = 'rgba(14,134,168,.5)'; g.beginPath(); g.moveTo(690, 470); g.bezierCurveTo(820, 410, 950, 520, 1224, 430); g.lineTo(1224, 560); g.lineTo(690, 560); g.fill();
      g.fillStyle = 'rgba(0,112,143,.85)'; g.beginPath(); g.moveTo(690, 524); g.bezierCurveTo(860, 474, 1000, 566, 1224, 500); g.lineTo(1224, 560); g.lineTo(690, 560); g.fill();
      g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.ellipse(846, 446, 72, 20, -0.08, 0, 7); g.fill();
      g.restore(); }, [690, 180, 534, 380, 26]);
  // rapidez (bolt): selo por cima da imagem
  if (R.bolt > 0){ const e = backOut(R.bolt); g.save(); g.globalAlpha = Math.min(1, R.bolt * 1.6); g.translate(816, 219); g.scale(e, e); g.translate(-816, -219);
    g.shadowColor = 'rgba(11,31,42,.18)'; g.shadowBlur = 16; g.shadowOffsetY = 4; g.fillStyle = '#FFFFFF'; rr(g, 708, 196, 216, 46, 23); g.fill(); g.shadowColor = 'transparent';
    boltIcon(g, 734, 219, 0.13, SC.petrol); txt(g, 'Carrega em 0,8 s', 754, 220, SF(600, 18), SC.ink); g.restore(); }

  // título, subtítulo (target)
  sitePart(R.target, (g) => { skel(g, 64, 206, 270, 16); skel(g, 64, 262, 520, 52); skel(g, 64, 334, 440, 52); skel(g, 64, 410, 500, 18); skel(g, 64, 442, 380, 18); },
    (g) => { g.letterSpacing = '2px'; txt(g, 'ESTÉTICA E BEM-ESTAR · LEIRIA', 64, 214, SF(500, 16, 'DM Mono'), SC.petrol); g.letterSpacing = '0px';
      txt(g, 'Pele cuidada,', 62, 290, SF(600, 60), SC.ink); txt(g, 'sem complicações.', 62, 360, SF(600, 60), SC.ink);
      txt(g, 'Tratamentos de rosto e corpo, com marcação', 64, 420, SF(400, 22), SC.ink2); txt(g, 'online e resposta no mesmo dia.', 64, 452, SF(400, 22), SC.ink2); },
    [56, 196, 600, 270, 16]);
  // botões (cursor)
  sitePart(R.cursor, (g) => { dashBox(g, 64, 488, 236, 62, 31); dashBox(g, 316, 488, 180, 62, 31); dashBox(g, 1072, 90, 152, 42, 21); },
    (g) => { g.fillStyle = SC.deep; rr(g, 64, 488, 236, 62, 31); g.fill(); txt(g, 'Marcar sessão', 182, 520, SF(600, 21), '#FFFFFF', 'center');
      g.strokeStyle = SC.ink; g.lineWidth = 2; rr(g, 316, 488, 180, 62, 31); g.stroke(); txt(g, 'Ver preços', 406, 520, SF(600, 21), SC.ink, 'center');
      g.fillStyle = SC.deep; rr(g, 1072, 90, 152, 42, 21); g.fill(); txt(g, 'Marcar', 1148, 112, SF(600, 18), '#FFFFFF', 'center');
      g.save(); g.translate(262, 532); g.fillStyle = SC.ink; g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath();
      [[0, 0], [0, 30], [8, 23], [14, 36], [20, 33], [14, 21], [24, 21]].forEach(([a, b], k) => k ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); g.stroke(); g.fill(); g.restore(); },
    [64, 488, 432, 62, 31]);
  // serviços com preço (target, um pouco depois do título)
  const rs = clamp((R.target - 0.3) / 0.7, 0, 1);
  const SV = [['Limpeza de pele', '60 min · todos os tipos de pele', '45€'], ['Massagem relaxante', '50 min · costas e pescoço', '50€'], ['Depilação a laser', 'por zona · sessão de 20 min', 'desde 25€']];
  sitePart(rs, (g) => { SV.forEach((_, k) => dashBox(g, 64 + k * 392, 600, 368, 140, 20)); },
    (g) => { SV.forEach(([a, b, c], k) => { const x = 64 + k * 392; g.fillStyle = SC.soft; rr(g, x, 600, 368, 140, 20); g.fill();
      txt(g, a, x + 24, 640, SF(600, 23), SC.ink); txt(g, b, x + 24, 676, SF(400, 17), SC.ink2); txt(g, c, x + 24, 714, SF(600, 25), SC.deep); }); },
    [64, 600, 1152, 140, 20]);
  // marcação online (calendar)
  sitePart(R.calendar, (g) => { dashBox(g, 64, 776, 576, 320, 22); },
    (g) => { g.fillStyle = SC.soft; rr(g, 64, 776, 576, 320, 22); g.fill();
      txt(g, 'Marca online', 92, 818, SF(600, 24), SC.ink); txt(g, 'Confirmação imediata', 612, 818, SF(400, 16), SC.ink2, 'right');
      ['SEG', 'TER', 'QUA', 'QUI', 'SEX'].forEach((d, k) => { const x = 92 + k * 106, on = k === 2;
        g.fillStyle = on ? SC.deep : '#FFFFFF'; rr(g, x, 846, 92, 84, 16); g.fill();
        txt(g, d, x + 46, 872, SF(500, 14, 'DM Mono'), on ? '#CFEAF2' : SC.ink2, 'center'); txt(g, String(12 + k), x + 46, 906, SF(600, 28), on ? '#FFFFFF' : SC.ink, 'center'); });
      ['10:00', '11:30', '15:00'].forEach((h, k) => { const x = 92 + k * 156, on = k === 1;
        g.fillStyle = on ? '#E6F3F7' : '#FFFFFF'; rr(g, x, 950, 140, 50, 25); g.fill(); if (on){ g.strokeStyle = SC.deep; g.lineWidth = 2; g.stroke(); }
        txt(g, h, x + 70, 976, SF(600, 19), on ? SC.deep : SC.ink, 'center'); });
      g.fillStyle = SC.ink; rr(g, 92, 1020, 300, 52, 26); g.fill(); txt(g, 'Confirmar marcação', 242, 1047, SF(600, 19), '#FFFFFF', 'center'); },
    [64, 776, 576, 320, 22]);
  // avaliações e segurança (shield)
  sitePart(R.shield, (g) => { dashBox(g, 680, 776, 544, 84, 20); },
    (g) => { g.fillStyle = SC.soft; rr(g, 680, 776, 544, 84, 20); g.fill();
      g.fillStyle = SC.gold; for (let k = 0; k < 5; k++) star(g, 710 + k * 28, 804, 11);
      txt(g, '4,9', 862, 805, SF(600, 20), SC.ink); txt(g, '127 avaliações no Google', 900, 805, SF(400, 17), SC.ink2);
      lock(g, 712, 838, '#1E9E5A'); txt(g, 'Site seguro com SSL e dados protegidos', 730, 838, SF(400, 16), SC.ink2); },
    [680, 776, 544, 84, 20]);
  // WhatsApp (chat): botão verde e a mensagem que já chega com contexto
  sitePart(R.chat, (g) => { g.beginPath(); g.arc(1176, 1056, 40, 0, 7); g.stroke(); },
    (g) => { g.fillStyle = SC.wa; g.beginPath(); g.arc(1176, 1056, 40, 0, 7); g.fill();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.arc(1176, 1054, 17, 0.75, Math.PI * 2 + 0.35); g.stroke();
      g.beginPath(); g.moveTo(1165, 1067); g.lineTo(1159, 1078); g.lineTo(1171, 1072); g.stroke();
      const e = backOut(clamp((R.chat - 0.25) / 0.75, 0, 1)); if (e <= 0) return;
      g.save(); g.translate(1130, 1018); g.scale(e, e); g.translate(-1130, -1018);
      g.shadowColor = 'rgba(11,31,42,.14)'; g.shadowBlur = 20; g.shadowOffsetY = 6; g.fillStyle = '#FFFFFF'; rr(g, 690, 884, 440, 134, 20); g.fill(); g.shadowColor = 'transparent';
      g.fillStyle = SC.okBg; rr(g, 712, 900, 272, 30, 15); g.fill(); txt(g, 'Novo pedido · Limpeza de pele', 726, 916, SF(600, 15), SC.ok);
      txt(g, 'Olá! Queria marcar uma limpeza de pele', 712, 958, SF(400, 19), SC.ink); txt(g, 'para sábado de manhã. Ainda há vaga?', 712, 984, SF(400, 19), SC.ink);
      txt(g, '09:41', 1112, 1002, SF(400, 14), SC.ink2, 'right'); g.restore(); },
    [690, 884, 526, 212, 20]);

  // site publicado: a janela inteira pisca a verde uma vez
  const f = Math.sin(Math.PI * R.pub);
  if (f > 0.02){ g.save(); g.globalAlpha = f * 0.9; g.strokeStyle = '#1FAF5B'; g.lineWidth = 8; rr(g, 4, 4, SW - 8, SH - 8, 28); g.stroke(); g.restore(); }
  g.restore();
  if (ctx === pg) pageTex.needsUpdate = true;
}

// o sistema da empresa: desenhado no canvas da janela, parte a parte, à medida que as peças chegam
const SYS = { side: '#0B1F2A', side2: '#16303D', muted: '#7F98A4', red: '#C2452D', redBg: '#FBE7E2' };
function drawSystem(R, ctx = pg, tex = pageTex){
  PG = ctx; const g = ctx; g.setTransform(pageQ, 0, 0, pageQ, 0, 0); g.clearRect(0, 0, SW, SH);
  g.save(); rr(g, 0, 0, SW, SH, 30); g.clip();
  // fundo: vidro vazio até chegar a estrutura; depois o ecrã da aplicação
  g.fillStyle = `rgba(247,250,251,${(0.22 + 0.78 * ease3(R.sheet)).toFixed(3)})`; g.fillRect(0, 0, SW, SH);

  // barra de cima: nome da empresa, backups (shield) e servidor no ar (server)
  g.fillStyle = '#E6EDF0'; g.fillRect(0, 0, SW, 70);
  g.fillStyle = '#B9C8CF'; [40, 66, 92].forEach(x => { g.beginPath(); g.arc(x, 35, 8, 0, 7); g.fill(); });
  if (R.sheet > 0){ g.save(); g.globalAlpha = Math.min(1, R.sheet * 1.6); txt(g, 'A tua empresa · Gestão', 128, 36, SF(600, 20), SC.ink); g.restore(); }
  sitePart(R.shield, (g) => { dashBox(g, 560, 18, 230, 34, 17); },
    (g) => { g.fillStyle = SC.okBg; rr(g, 560, 18, 230, 34, 17); g.fill(); lock(g, 584, 36, '#1E9E5A'); txt(g, 'Backup feito às 03:00', 602, 36, SF(600, 15), SC.ok); });
  sitePart(R.server, (g) => { dashBox(g, 964, 18, 280, 34, 17); },
    (g) => { g.fillStyle = SC.ink; rr(g, 964, 18, 280, 34, 17); g.fill(); g.fillStyle = '#25D366'; g.beginPath(); g.arc(986, 35, 6, 0, 7); g.fill();
      txt(g, 'No ar · servidor SENVIA', 1000, 36, SF(600, 15), '#F8FAFA'); });

  // menu lateral (sheet): cada entrada acende quando a sua peça chega
  sitePart(R.sheet, (g) => { dashBox(g, 0, 70, 230, SH - 70, 0); [140, 198, 256, 314, 372, 430, 488].forEach(y => skel(g, 28, y - 10, 150, 20)); },
    (g) => { g.fillStyle = SYS.side; g.fillRect(0, 70, 230, SH - 70);
      g.fillStyle = '#2BDBFF'; g.save(); g.translate(40, 108); g.rotate(Math.PI / 4); rr(g, -9, -9, 18, 18, 4); g.fill(); g.restore();
      txt(g, 'Gestão', 62, 109, SF(600, 20), '#F8FAFA');
      const MENU = [['Painel', 'sheet'], ['Clientes', 'users'], ['Agenda', 'calendar'], ['Automação', 'cog'], ['Faturação', 'invoice'], ['Stock', 'box'], ['Relatórios', 'chart']];
      MENU.forEach(([s, k], j) => { const y = 170 + j * 58, on = clamp(R[k], 0, 1);
        if (j === 0){ g.fillStyle = SYS.side2; rr(g, 14, y - 22, 202, 44, 10); g.fill(); }
        g.save(); g.globalAlpha = 0.28 + 0.72 * on; g.fillStyle = j === 0 ? '#2BDBFF' : '#5FB0C8'; g.save(); g.translate(36, y); g.rotate(Math.PI / 4); g.fillRect(-4, -4, 8, 8); g.restore();
        txt(g, s, 56, y + 1, SF(500, 18), '#E6EDF0'); g.restore(); });
      // os dados do Excel entram: um aviso pequeno no fundo do menu
      g.fillStyle = SYS.side2; rr(g, 14, SH - 96, 202, 70, 12); g.fill();
      txt(g, 'Excel importado', 30, SH - 72, SF(600, 15), '#F8FAFA'); txt(g, '1.284 linhas · 0 erros', 30, SH - 48, SF(400, 14), SYS.muted); },
    [0, 70, 230, SH - 70, 0]);
  // cabeçalho do painel (sheet)
  sitePart(R.sheet, (g) => { skel(g, 262, 100, 260, 30); skel(g, 262, 140, 180, 14); },
    (g) => { txt(g, 'Bom dia, Ana', 262, 114, SF(600, 30), SC.ink); txt(g, 'Terça-feira, 14 de outubro', 262, 148, SF(400, 16), SC.ink2); });

  // indicadores: clientes (users), marcações (calendar), faturado (invoice)
  const KPI = [['users', 'Clientes ativos', '248', '+12 este mês'], ['calendar', 'Marcações hoje', '12', '3 por confirmar'], ['invoice', 'Faturado no mês', '18.420€', '+8% que setembro']];
  KPI.forEach(([k, a, b, c], j) => { const x = 262 + j * 338;
    sitePart(R[k], (g) => { dashBox(g, x, 172, 318, 128, 18); },
      (g) => { g.fillStyle = '#FFFFFF'; rr(g, x, 172, 318, 128, 18); g.fill(); g.strokeStyle = SC.line; g.lineWidth = 1.5; g.stroke();
        txt(g, a, x + 22, 200, SF(500, 16), SC.ink2); txt(g, b, x + 22, 244, SF(600, 38), SC.ink); txt(g, c, x + 22, 280, SF(500, 14), k === 'invoice' ? SC.ok : SC.petrol); }); });

  // clientes (users)
  const CL = [['Rita Fonseca', 'Ativo', 'há 2 dias'], ['Auto Lis, Lda.', 'Proposta', 'hoje'], ['João Marques', 'Ativo', 'há 1 semana'], ['Clínica Mar', 'Novo', 'ontem'], ['Sofia Pinto', 'Ativo', 'há 3 dias'], ['Ferragens Leiria', 'Proposta', 'há 5 dias']];
  const CHIP = { Ativo: ['#E3F4EA', SC.ok], Proposta: ['#FFF3D6', '#7A5A00'], Novo: ['#E2F2F8', SC.deep] };
  sitePart(R.users, (g) => { dashBox(g, 262, 330, 510, 380, 18); for (let k = 0; k < 6; k++) skel(g, 286, 400 + k * 50, 300, 18); },
    (g) => { g.fillStyle = '#FFFFFF'; rr(g, 262, 330, 510, 380, 18); g.fill(); g.strokeStyle = SC.line; g.lineWidth = 1.5; g.stroke();
      txt(g, 'Clientes', 286, 362, SF(600, 20), SC.ink); txt(g, 'Último contacto', 748, 362, SF(500, 13), SC.ink2, 'right');
      CL.forEach(([n, e, d], k) => { const y = 410 + k * 50; g.fillStyle = SC.line; g.fillRect(286, y - 25, 462, 1);
        txt(g, n, 286, y, SF(500, 17), SC.ink); const [bg, fg] = CHIP[e]; g.fillStyle = bg; rr(g, 520, y - 13, 92, 26, 13); g.fill(); txt(g, e, 566, y + 1, SF(600, 13), fg, 'center');
        txt(g, d, 748, y, SF(400, 14), SC.ink2, 'right'); }); },
    [262, 330, 510, 380, 18]);
  // agenda de hoje (calendar)
  const AG = [['09:30', 'Rita Fonseca', 'Revisão'], ['10:00', 'João Marques', 'Primeira consulta'], ['11:30', 'Clínica Mar', 'Reunião'], ['14:00', 'Sofia Pinto', 'Acompanhamento'], ['16:30', 'Auto Lis, Lda.', 'Entrega']];
  sitePart(R.calendar, (g) => { dashBox(g, 792, 330, 458, 380, 18); for (let k = 0; k < 5; k++) skel(g, 816, 400 + k * 58, 260, 18); },
    (g) => { g.fillStyle = '#FFFFFF'; rr(g, 792, 330, 458, 380, 18); g.fill(); g.strokeStyle = SC.line; g.lineWidth = 1.5; g.stroke();
      txt(g, 'Agenda de hoje', 816, 362, SF(600, 20), SC.ink);
      AG.forEach(([h, n, s], k) => { const y = 412 + k * 58; g.fillStyle = k === 1 ? '#E6F3F7' : SC.soft; rr(g, 816, y - 22, 410, 46, 12); g.fill();
        g.fillStyle = k === 1 ? SC.deep : SC.petrol; g.fillRect(816, y - 22, 4, 46);
        txt(g, h, 834, y + 1, SF(600, 16, 'DM Mono'), SC.ink); txt(g, n, 904, y - 6, SF(600, 16), SC.ink); txt(g, s, 904, y + 13, SF(400, 13), SC.ink2); }); },
    [792, 330, 458, 380, 18]);

  // automações (cog): o painel e uma tarefa; o WhatsApp (chat) e o email (mail) ligam-se depois, cada um com o seu interruptor
  const AU = [['chat', 'Lembrete de marcação por WhatsApp', 'Na véspera, às 18:00'], ['mail', 'Email de boas-vindas a novos clientes', 'Logo após o registo'], ['cog', 'Seguimento de propostas paradas', 'Ao fim de 5 dias sem resposta']];
  sitePart(R.cog, (g) => { dashBox(g, 262, 730, 510, 360, 18); },
    (g) => { g.fillStyle = '#FFFFFF'; rr(g, 262, 730, 510, 360, 18); g.fill(); g.strokeStyle = SC.line; g.lineWidth = 1.5; g.stroke();
      txt(g, 'Automações', 286, 764, SF(600, 20), SC.ink); txt(g, 'Funcionam sozinhas', 748, 764, SF(500, 13), SC.ink2, 'right'); },
    [262, 730, 510, 360, 18]);
  AU.forEach(([k, a, b], j) => { const y = 830 + j * 82, on = ease3(clamp(R[k], 0, 1));
    if (k !== 'cog') sitePart(R[k], () => {}, () => {}, [286, y - 32, 462, 66, 14]); // o interruptor liga-se quando a peça chega
    sitePart(R.cog, (g) => { skel(g, 286, y - 12, 330, 22); },
      (g) => { g.fillStyle = SC.soft; rr(g, 286, y - 32, 462, 66, 14); g.fill();
        txt(g, a, 306, y - 8, SF(600, 16), SC.ink); txt(g, b, 306, y + 15, SF(400, 13), SC.ink2);
        // interruptor: desligado até a peça chegar
        g.fillStyle = on > 0.5 ? '#25D366' : '#C5D3DA'; rr(g, 676, y - 14, 52, 28, 14); g.fill();
        g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(690 + on * 24, y, 10, 0, 7); g.fill(); }); });

  // stock (box): com um alerta de stock baixo
  const ST = [['Filtros de óleo', 3, 40, true], ['Pastilhas de travão', 18, 40, false], ['Óleo 5W30 (litros)', 64, 120, false], ['Escovas limpa-vidros', 22, 30, false]];
  sitePart(R.box, (g) => { dashBox(g, 792, 730, 458, 360, 18); for (let k = 0; k < 4; k++) skel(g, 816, 800 + k * 66, 300, 18); },
    (g) => { g.fillStyle = '#FFFFFF'; rr(g, 792, 730, 458, 360, 18); g.fill(); g.strokeStyle = SC.line; g.lineWidth = 1.5; g.stroke();
      txt(g, 'Stock', 816, 764, SF(600, 20), SC.ink);
      ST.forEach(([n, q, max, low], k) => { const y = 812 + k * 68; txt(g, n, 816, y, SF(500, 16), SC.ink); txt(g, `${q} un.`, 1226, y, SF(600, 15, 'DM Mono'), low ? SYS.red : SC.ink2, 'right');
        g.fillStyle = SC.line; rr(g, 816, y + 16, 410, 8, 4); g.fill(); g.fillStyle = low ? SYS.red : SC.petrol; rr(g, 816, y + 16, 410 * q / max, 8, 4); g.fill();
        if (low){ g.fillStyle = SYS.redBg; rr(g, 1030, y - 12, 92, 24, 12); g.fill(); txt(g, 'Encomendar', 1076, y + 1, SF(600, 12), SYS.red, 'center'); } }); },
    [792, 730, 458, 360, 18]);

  // sistema no ar: a janela inteira pisca a verde uma vez
  const f = Math.sin(Math.PI * R.pub);
  if (f > 0.02){ g.save(); g.globalAlpha = f * 0.9; g.strokeStyle = '#1FAF5B'; g.lineWidth = 8; rr(g, 4, 4, SW - 8, SH - 8, 28); g.stroke(); g.restore(); }
  g.restore();
  tex.needsUpdate = true; PG = pg;
}

// conteúdo dos dois cartões (desenhado uma vez, quando as fontes estão prontas)
function drawCards(){
  { const K = CARDS.chat, g = K.cv.getContext('2d'), W = K.cv.width, H = K.cv.height; g.clearRect(0, 0, W, H);
    g.fillStyle = '#FFFFFF'; rr(g, 0, 0, W, H, 24); g.fill();
    g.fillStyle = SC.okBg; rr(g, 20, 18, 250, 34, 17); g.fill(); txt(g, 'Lembrete enviado sozinho', 145, 36, SF(600, 15), SC.ok, 'center');
    txt(g, 'WhatsApp · ontem, 18:00', W - 20, 36, SF(400, 14), SC.ink2, 'right');
    g.fillStyle = '#E7F8EE'; rr(g, 20, 70, W - 150, 120, 18); g.fill();
    txt(g, 'Olá Rita! Lembramos a tua marcação amanhã às 09:30.', 40, 106, SF(500, 19), SC.ink);
    txt(g, 'Responde SIM para confirmar.', 40, 140, SF(500, 19), SC.ink); txt(g, '18:00', W - 150, 172, SF(400, 13), SC.ink2, 'right');
    g.fillStyle = SC.soft; rr(g, W - 220, 206, 200, 56, 18); g.fill(); txt(g, 'SIM', W - 120, 235, SF(600, 20), SC.ink, 'center');
    g.fillStyle = SC.deep; rr(g, 20, 220, 300, 40, 20); g.fill(); txt(g, 'Marcação confirmada', 170, 241, SF(600, 15), '#FFFFFF', 'center');
    K.tex.needsUpdate = true; }
  { const K = CARDS.chart, g = K.cv.getContext('2d'), W = K.cv.width, H = K.cv.height; g.clearRect(0, 0, W, H);
    g.fillStyle = '#FFFFFF'; rr(g, 0, 0, W, H, 24); g.fill();
    txt(g, 'Faturado por semana', 26, 40, SF(500, 20), SC.ink2);
    txt(g, '4.910€', 24, 104, SF(600, 60), SC.ink);
    g.fillStyle = SC.okBg; rr(g, 228, 88, 92, 34, 17); g.fill(); txt(g, '+11%', 274, 106, SF(600, 17), SC.ok, 'center');
    [82, 104, 96, 128, 118, 150, 170].forEach((h, k) => { g.fillStyle = k === 6 ? SC.petrol : '#CFE7EF'; rr(g, 26 + k * 78, 318 - h, 54, h, 10); g.fill(); });
    txt(g, 'Últimas 7 semanas · atualizado agora', 26, 360, SF(500, 16), SC.ink2);
    K.tex.needsUpdate = true; }
}

/* ================= peças de cada pacote (espreitam por cima de cada cartão) ================= */
const ICON_TEX = Object.fromEntries(ICONS.map(n => [n, iconTex(n)]));
const pkgPieces = PKG.map((icons, k) => icons.map((icon, j) => {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color: BASES[j % 4].clone(), roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, iridescence: 0.5, iridescenceIOR: 1.4, transparent: true, opacity: 0 });
  const body = new THREE.Mesh(tileGeo, mat); body.rotation.z = Math.PI / 4; body.userData.icon = icon; g.add(body);
  const dmat = new THREE.MeshBasicMaterial({ map: ICON_TEX[icon], transparent: true, toneMapped: false, depthWrite: false, opacity: 0 });
  const dec = new THREE.Mesh(decalGeo, dmat); dec.position.z = 0.1415; g.add(dec);
  g.visible = false; scene.add(g);
  return { g, body, mat, dmat, j, lit: k === 1 ? 1 : 0 };
}));
const pkgBodies = pkgPieces.flat().map(P => P.body);
let pkgOp = 0, pkgHover = 1;

/* ================= estações dos serviços ================= */
// só posições: a câmara percorre-as como um corredor; as esculturas de cada serviço são feitas pelos cubos
const screens = WORK.map((w, i) => {
  const g = new THREE.Group();
  g.position.set(i % 2 ? 0.55 : -0.55, 0.3, -1.8 - i * 5.4);
  g.rotation.y = i % 2 ? -0.16 : 0.16;
  scene.add(g);
  return { g, frame: g, mats: [], w, op: 0 };
});

/* ================= o mundo em cubos de dados (voxels) ================= */
// Um só conjunto de cubos atravessa a página e muda de forma em cada capítulo:
// folha de Excel → caos → painel de sistema → barras da conta → dados a entrar no sistema →
// esculturas dos serviços → blocos do processo → logo da SENVIA.
const VN = innerWidth < 760 ? 300 : 400;
const VS = 0.2;                               // distância entre cubos (cada cubo tem 0,17)
const voxGeo = new RoundedBoxGeometry(0.17, 0.17, 0.17, 2, 0.026);
const voxMat = new THREE.MeshPhysicalMaterial({ roughness: 0.34, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.25 });
const vox = new THREE.InstancedMesh(voxGeo, voxMat, VN);
vox.castShadow = true; vox.frustumCulled = false; vox.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(vox);
const VC = Object.fromEntries(Object.entries({
  cell: '#F4F7F8', grey: '#DDE6EA', data: '#C6D4DA', head: '#BFDDE7', sel: '#0E86A8', light: '#5FB0C8', pale: '#9FD3E2',
  goldL: '#FFD66B', cost: '#C98B7A', costDark: '#B06F5E', ink: '#1E3746', green: '#25D366', cyan: '#2BDBFF', gold: '#F2B53A', red: '#E07A5F', dim: '#20404E',
}).map(([k, v]) => [k, new THREE.Color(v)]));
const V = Array.from({ length: VN }, () => ({
  r: [rnd(), rnd(), rnd(), rnd(), rnd()], x: 0, y: FLOOR_Y - 2, z: 0, rx: 0, ry: 0, rz: 0, s: 0, c: VC.cell.clone(),
  t: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, c: VC.cell }, rate: 2.8 + rnd() * 2.6,
}));
V.forEach((v, i) => vox.setColorAt(i, v.c));

// cinco estrelas (avaliações Google): cada estrela é uma grelha de cubos recortada em estrela
const STARS = (() => { const out = [], step = 0.11, Ro = 0.5, Ri = 0.21;
  const poly = Array.from({ length: 10 }, (_, j) => { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? Ri : Ro; return [Math.cos(a) * r, -Math.sin(a) * r]; });
  const inside = (x, y) => { let c = false; for (let a = 0, b = 9; a < 10; b = a++){ const [xi, yi] = poly[a], [xj, yj] = poly[b]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  for (let k = 0; k < 5; k++) for (let y = -Ro; y <= Ro + 1e-6; y += step) for (let x = -Ro; x <= Ro + 1e-6; x += step) if (inside(x, y)) out.push({ x: (k - 2) * 1.2 + x, y, k, c: (Math.round((x + y) / step) % 3) ? VC.gold : VC.goldL });
  return out; })();
// o logo da SENVIA em cubos: três losangos (como no ficheiro original)
const LOGO = (() => { const out = [], big = VN === 400;
  [[-1.1, -0.1, big ? 7 : 6], [0.4, 1.7, big ? 6 : 5], [0.25, -1.69, big ? 5 : 4]].forEach(([cx, cy, n]) => {
    for (let layer = 0; layer < 2; layer++) for (let u = 0; u < n; u++) for (let w = 0; w < n; w++){
      const a = (u - (n - 1) / 2) * VS, b = (w - (n - 1) / 2) * VS, k = Math.SQRT1_2;
      out.push({ x: cx * (big ? 1 : 0.85) + (a - b) * k, y: cy * (big ? 1 : 0.85) + (a + b) * k, z: -layer * VS, c: layer ? VC.sel : VC.cyan });
    } });
  return out; })();

// ---------- o processo: um bloco por etapa, que cresce quando a etapa chega ----------
let PROC = [], procBeat = -1;
function buildProc(beat){
  procBeat = beat; PROC = [];
  NODE_POS.forEach((P, k) => {
    const h = k < beat ? 4 : k === beat ? 6 : 1;
    for (let j = 0; j < h * 9; j++){ const a = j % 9, layer = Math.floor(j / 9);
      PROC.push({ x: P.x + ((a % 3) - 1) * VS, y: FLOOR_Y + VS / 2 + 0.02 + layer * VS, z: P.z + (Math.floor(a / 3) - 1) * VS,
        c: k > beat ? VC.dim : k === beat && layer === h - 1 ? VC.green : layer % 2 ? VC.cyan : VC.sel }); }
  });
}

// cubos que sobram numa forma: um tapete no chão, com uma onda suave
function carpet(j, t, o, mo){
  const col = j % 26, row = Math.floor(j / 26);
  o.x = CX * 0.35 + (col - 12.5) * 0.44; o.z = -1.6 - row * 0.44; o.y = FLOOR_Y + 0.09 + Math.max(0, Math.sin(col * 0.5 + row * 0.7 - t * 1.4)) * 0.06 * mo;
  o.rx = 0; o.ry = 0; o.rz = 0; o.s = 0.6; o.c = nightAmt > 0.5 ? VC.dim : VC.grey;
}

// ---------- onde está cada cubo em cada capítulo ----------
function voxTarget(ch, beat, bp, p, bf, i, t, o){
  const v = V[i], [r1, r2, r3, r4, r5] = v.r, m = L.mobile, mo = REDUCE ? 0 : 1, sc = REDUCE ? 0.3 : 1;
  o.rx = 0; o.ry = 0; o.rz = 0; o.s = 1;
  switch (ch){
    case 0: case 1: case 2: case 3: { // a primeira metade usa objetos reais: os cubos esperam escondidos no chão
      carpet(i, t, o, mo); o.s = 0; return;
    }
    case 6: { // avaliações: cinco estrelas de cubos dourados
      const D = STARS[i], sk = m ? 0.6 : 1;
      if (D){ o.x = CX + D.x * sk; o.y = (m ? 0.15 : 1.62) + CY * 0.5 + D.y * sk + Math.sin(t * 1.3 + D.k) * 0.05 * mo; o.z = 0.2;
        o.ry = Math.sin(t * 0.6 + D.k) * 0.3 * mo; o.s = 0.62 * sk; o.c = D.c; return; }
      carpet(i - STARS.length, t, o, mo); o.s = 0.5; return;
    }
    case 4: { // processo (noite): um bloco por etapa
      if (beat !== procBeat) buildProc(beat);
      const D = PROC[i];
      if (D){ o.x = D.x; o.y = D.y; o.z = D.z; o.c = D.c; return; }
      carpet(i - PROC.length, t, o, mo); o.x += L.x4; return;
    }
    case 5: { // custos: os cubos recuam para um anel ao fundo, atrás dos cartões
      const a = (i / VN) * Math.PI * 2 + t * 0.04 * mo + p * 1.6 * sc, R = m ? 3.2 : 7.5;
      o.x = Math.cos(a) * R; o.y = (m ? -1.6 : 0.4) + Math.sin(a * 3) * 0.4; o.z = Math.sin(a) * 2.6 - 9;
      o.rx = a; o.ry = a * 0.7; o.c = i % 3 ? VC.pale : VC.light;
      return;
    }
    default: { // contacto: os cubos montam o logo da SENVIA; os que sobram ficam a orbitar à volta
      const asm = smooth(0, 0.6, p), D = LOGO[i], sk = CS * (m ? 0.72 : 0.62);
      const sa = r1 * Math.PI * 2 + p * 2 * sc, sr = m ? 2.0 : 4.2;
      const fx = CX * 0.5 + Math.cos(sa) * sr, fy = 0.4 + CY * 0.5 + Math.sin(sa) * (m ? 2 : 2.4), fz = (r2 - 0.5) * 3;
      if (D){ tmpE.set(0.05, -0.2 + Math.sin(t * 0.35) * 0.08 * mo, 0); tmpM.makeRotationFromEuler(tmpE); tmpV.set(D.x * sk, D.y * sk, D.z * sk).applyMatrix4(tmpM);
        o.x = lerp(fx, CX + tmpV.x, asm); o.y = lerp(fy, (m ? 0.42 : 0.6) + CY * 0.75 + tmpV.y, asm); o.z = lerp(fz, tmpV.z, asm);
        o.rz = Math.PI / 4 * asm; o.ry = -0.2 * asm; o.s = sk; o.c = asm > 0.5 ? D.c : VC.pale; return; }
      const a = r2 * Math.PI * 2 + t * 0.12 * mo, R = (m ? 1.7 : 2.6) + r3 * 0.9;
      o.x = CX + Math.cos(a) * R; o.y = 0.35 + CY * 0.75 + Math.sin(a) * R * 0.75; o.z = Math.sin(a * 2) * 0.8 - 0.6;
      o.rx = a; o.ry = a; o.s = 0.5; o.c = VC.pale;
    }
  }
}
// (zonas do sistema desenhado, em px; ficam para referência das secções)
const SECT = {
  sheet: [0, 70, 230, 1054], users: [262, 330, 510, 380], calendar: [792, 330, 458, 380], cog: [262, 730, 510, 360],
  mail: [286, 880, 462, 66], invoice: [938, 172, 318, 128], box: [792, 730, 458, 360], shield: [560, 18, 230, 34], server: [964, 18, 280, 34],
};
const vDummy = new THREE.Object3D();
function updateVoxels(cur, beat, bp, p, bf, t, dt){
  for (let i = 0; i < VN; i++){
    const v = V[i], o = v.t;
    voxTarget(cur, beat, bp, p, bf, i, t, o);
    const k = damp(dt, v.rate * (REDUCE ? 3 : 1));
    v.x += (o.x - v.x) * k; v.y += (o.y - v.y) * k; v.z += (o.z - v.z) * k;
    v.rx += (o.rx - v.rx) * k; v.ry += (o.ry - v.ry) * k; v.rz += (o.rz - v.rz) * k; v.s += (o.s - v.s) * k;
    v.c.lerp(o.c, damp(dt, 3));
    vDummy.position.set(v.x, v.y + VEL * 0.12 * v.r[4], v.z);
    vDummy.rotation.set(v.rx, v.ry, v.rz); vDummy.scale.setScalar(Math.max(0.0001, v.s));
    vDummy.updateMatrix(); vox.setMatrixAt(i, vDummy.matrix); vox.setColorAt(i, v.c);
  }
  vox.instanceMatrix.needsUpdate = true; vox.instanceColor.needsUpdate = true;
  voxMat.emissive.setRGB(0.02 * nightAmt, 0.3 * nightAmt, 0.4 * nightAmt);
}

/* ================= objetos reais da primeira metade ================= */
// portátil e telemóvel (os dois serviços), um Excel verdadeiro que se vira no sistema, faturas de licenças
// e os dispositivos dos serviços. Tudo desenhado em canvases, para se reconhecer à primeira.
function mkCv(w, h){ const cv = document.createElement('canvas'); cv.width = Math.round(w); cv.height = Math.round(h);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { cv, g: cv.getContext('2d'), tex }; }
const SYS_CV = mkCv(SW * pageQ, SH * pageQ), XLS_CV = mkCv(SW * pageQ, SH * pageQ), OS_CV = mkCv(SW * pageQ, SH * pageQ), PH_CV = mkCv(600 * pageQ, 1200 * pageQ);
const INV_CV = mkCv(560, 760), REC_CV = mkCv(420, 560), TAG_L = mkCv(560, 150), TAG_S = mkCv(560, 150), YEAR_CV = mkCv(300, 300);
const SYS_ALL = Object.fromEntries(BUILD.map(([k]) => [k, 1]).concat([['pub', 0]]));

// o Excel de hoje: ficheiro "FINAL_v3", duplicados, erros e células a amarelo
function drawExcel(){
  const g = XLS_CV.g; g.setTransform(pageQ, 0, 0, pageQ, 0, 0); g.clearRect(0, 0, SW, SH);
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, SW, SH);
  g.fillStyle = '#1D6F42'; g.fillRect(0, 0, SW, 64); txt(g, 'Clientes_2026_FINAL_v3 (2).xlsx', SW / 2, 33, SF(600, 22), '#FFFFFF', 'center');
  g.fillStyle = '#F3F3F3'; g.fillRect(0, 64, SW, 66); ['Ficheiro', 'Base', 'Inserir', 'Fórmulas', 'Dados', 'Rever'].forEach((s, k) => txt(g, s, 32 + k * 128, 97, SF(500, 19), k === 1 ? '#1D6F42' : '#333'));
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 130, SW, 50); g.fillStyle = '#D0D0D0'; g.fillRect(0, 179, SW, 1); g.fillRect(90, 138, 1, 34);
  txt(g, 'D47', 26, 155, SF(500, 18, 'DM Mono'), '#333'); txt(g, 'fx', 110, 155, SF(600, 18), '#888'); txt(g, '=SOMA(D2:D46)*1,23', 150, 155, SF(500, 19, 'DM Mono'), '#222');
  const x0 = 64, y0 = 180, rh = 46, CW = [300, 230, 190, 240, 256], XS = [x0]; CW.forEach((w, k) => XS.push(XS[k] + w));
  g.fillStyle = '#EFEFEF'; g.fillRect(0, y0, SW, rh); g.fillRect(0, y0, x0, SH - y0);
  ['A', 'B', 'C', 'D', 'E'].forEach((c, k) => txt(g, c, XS[k] + CW[k] / 2, y0 + 24, SF(500, 18), '#555', 'center'));
  const ROWS = [['Nome', 'Telefone', 'Valor', 'Estado', 'Obs.'], ['Rita Fonseca', '912 345 678', '480€', 'pago', ''], ['Auto Lis, Lda.', '244 812 …', '6.500', 'PROPOSTA??', 'ligar 2ª'],
    ['João Marques', '', '950€', 'pago', ''], ['Clínica Mar', '913 222 101', '#N/D', 'novo', 'ver email'], ['Sofia Pinto', '916 004 512', '2.100€', 'pago', ''],
    ['Ferragens Leiria', '244 …', '2900', 'proposta', 'URGENTE'], ['Rita Fonseca', '912 345 678', '480€', 'duplicado?', ''], ['Hotel Atlântico', '', '12.400€', '', 'falar c/ Ana'],
    ['Padaria Sol', '934 …', '1.800€', 'novo', ''], ['TransLeiria', '244 820 …', '9.800', 'ganho', ''], ['Estúdio Vela', '', '#REF!', 'proposta', '???'],
    ['joao marques', '91…', '950', 'PAGO', 'repetido'], ['Café Central', '', '', 'novo', ''], ['Óptica Lis', '244 …', '760€', 'perdido?', ''],
    ['', '', '', '', ''], ['TOTAL', '', '#VALOR!', '', 'não bate certo'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']];
  ROWS.forEach((row, r) => { const y = y0 + rh * (r + 1);
    txt(g, String(r + 1), x0 / 2, y + 24, SF(500, 16), '#666', 'center');
    if (row[4] === 'URGENTE'){ g.fillStyle = '#FFF2A8'; g.fillRect(x0, y, XS[5] - x0, rh); }
    if (row[3] === 'duplicado?' || row[4] === 'repetido'){ g.fillStyle = '#FDE2DD'; g.fillRect(x0, y, XS[5] - x0, rh); }
    row.forEach((c, k) => { if (!c) return; const err = c.startsWith('#'), head = r === 0;
      txt(g, c, XS[k] + 12, y + 24, SF(head ? 600 : 400, 18), err ? '#C00000' : head ? '#111' : '#222'); }); });
  g.fillStyle = '#D9D9D9'; for (let r = 0; r <= 21; r++) g.fillRect(0, y0 + rh * r, SW, 1); XS.forEach(x => g.fillRect(x, y0, 1, SH - y0));
  g.strokeStyle = '#1D6F42'; g.lineWidth = 3; g.strokeRect(XS[3], y0 + rh * 17, CW[3], rh); // a célula do total, selecionada
  XLS_CV.tex.needsUpdate = true;
}
// o site de exemplo, no telemóvel
function drawPhoneSite(){
  const g = PH_CV.g, W = 600, H = 1200; g.setTransform(pageQ, 0, 0, pageQ, 0, 0); g.clearRect(0, 0, W, H);
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H);
  txt(g, '09:41', 40, 40, SF(600, 22), SC.ink); g.fillStyle = '#F1F5F7'; rr(g, 30, 72, 540, 52, 26); g.fill(); lock(g, 66, 99, '#1E9E5A'); txt(g, 'studioalma.pt', 86, 99, SF(500, 21, 'DM Mono'), SC.ink);
  g.fillStyle = SC.petrol; g.save(); g.translate(52, 172); g.rotate(Math.PI / 4); rr(g, -12, -12, 24, 24, 5); g.fill(); g.restore(); txt(g, 'Studio Alma', 80, 173, SF(600, 26), SC.ink);
  g.fillStyle = SC.ink; [160, 172, 184].forEach(y => g.fillRect(520, y, 40, 4));
  const gr = g.createLinearGradient(0, 220, W, 560); gr.addColorStop(0, '#DDF0F4'); gr.addColorStop(1, '#7CC6DA');
  g.save(); rr(g, 30, 220, 540, 330, 26); g.fillStyle = gr; g.fill(); g.clip();
  g.fillStyle = '#F7DCC8'; g.beginPath(); g.arc(430, 320, 74, 0, 7); g.fill();
  g.fillStyle = 'rgba(0,112,143,.85)'; g.beginPath(); g.moveTo(30, 500); g.bezierCurveTo(200, 450, 360, 540, 570, 470); g.lineTo(570, 550); g.lineTo(30, 550); g.fill(); g.restore();
  g.letterSpacing = '2px'; txt(g, 'ESTÉTICA · LEIRIA', 34, 600, SF(500, 18, 'DM Mono'), SC.petrol); g.letterSpacing = '0px';
  txt(g, 'Pele cuidada,', 32, 660, SF(600, 52), SC.ink); txt(g, 'sem complicações.', 32, 720, SF(600, 52), SC.ink);
  txt(g, 'Marca online em 30 segundos.', 34, 780, SF(400, 24), SC.ink2);
  g.fillStyle = SC.deep; rr(g, 30, 820, 540, 76, 38); g.fill(); txt(g, 'Marcar sessão', 300, 859, SF(600, 26), '#FFFFFF', 'center');
  g.fillStyle = SC.soft; rr(g, 30, 920, 540, 150, 22); g.fill(); txt(g, 'Limpeza de pele', 56, 966, SF(600, 26), SC.ink); txt(g, '60 min · todos os tipos de pele', 56, 1004, SF(400, 20), SC.ink2); txt(g, '45€', 56, 1044, SF(600, 26), SC.deep);
  g.fillStyle = SC.wa; g.beginPath(); g.arc(510, 1120, 44, 0, 7); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 5; g.beginPath(); g.arc(510, 1118, 19, 0.75, Math.PI * 2 + 0.35); g.stroke();
  PH_CV.tex.needsUpdate = true;
}
// o Senvia OS: pipeline de vendas, em tema escuro com o ciano da marca
function drawOS(){
  const g = OS_CV.g; g.setTransform(pageQ, 0, 0, pageQ, 0, 0); g.clearRect(0, 0, SW, SH);
  g.fillStyle = '#0E1A22'; g.fillRect(0, 0, SW, SH);
  g.fillStyle = '#0B1F2A'; g.fillRect(0, 0, SW, 70); g.fillRect(0, 70, 230, SH - 70);
  g.fillStyle = '#2C4654'; [40, 66, 92].forEach(x => { g.beginPath(); g.arc(x, 35, 8, 0, 7); g.fill(); });
  g.fillStyle = '#16303D'; rr(g, 420, 16, 440, 38, 19); g.fill(); txt(g, 'app.senvia.pt', 640, 36, SF(500, 17, 'DM Mono'), '#A9C3CE', 'center');
  g.fillStyle = '#2BDBFF'; [[40, 112, 10], [56, 98, 7], [56, 126, 7]].forEach(([x, y, s]) => { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); rr(g, -s, -s, s * 2, s * 2, 3); g.fill(); g.restore(); });
  txt(g, 'Senvia OS', 76, 113, SF(600, 21), '#F8FAFA');
  ['Pipeline', 'Contactos', 'Tarefas', 'Equipa', 'Relatórios'].forEach((s, j) => { const y = 180 + j * 56;
    if (!j){ g.fillStyle = '#16303D'; rr(g, 14, y - 22, 202, 44, 10); g.fill(); }
    txt(g, s, 40, y + 1, SF(500, 18), j ? '#A9C3CE' : '#F8FAFA'); });
  txt(g, 'Pipeline', 262, 116, SF(600, 32), '#F8FAFA'); txt(g, '23 oportunidades · 41.300€', 262, 152, SF(400, 16), '#A9C3CE');
  g.fillStyle = '#2BDBFF'; rr(g, 1070, 96, 170, 44, 22); g.fill(); txt(g, '+ Novo lead', 1155, 119, SF(600, 16), '#0B1F2A', 'center');
  const COLS = [['Novo', 6, [['Clínica Mar', '1.200€'], ['Rita Fonseca', '480€'], ['Ferragens Leiria', '2.900€']]], ['Contactado', 7, [['Auto Lis, Lda.', '6.500€'], ['João Marques', '950€']]],
    ['Proposta', 5, [['Hotel Atlântico', '12.400€'], ['Padaria Sol', '1.800€'], ['Estúdio Vela', '3.200€']]], ['Ganho', 5, [['Sofia Pinto', '2.100€'], ['TransLeiria', '9.800€']]]];
  COLS.forEach(([n, c, cards], j) => { const x = 262 + j * 250;
    g.fillStyle = '#13252F'; rr(g, x, 186, 232, 900, 16); g.fill();
    txt(g, n, x + 18, 220, SF(600, 17), '#F8FAFA'); g.fillStyle = '#20404E'; rr(g, x + 180, 206, 36, 28, 14); g.fill(); txt(g, String(c), x + 198, 221, SF(600, 14), '#A9C3CE', 'center');
    cards.forEach(([a, v], k) => { const y = 252 + k * 122; g.fillStyle = '#1B3340'; rr(g, x + 12, y, 208, 106, 12); g.fill();
      g.fillStyle = j === 3 ? '#25D366' : '#2BDBFF'; g.fillRect(x + 12, y, 4, 106);
      txt(g, a, x + 30, y + 30, SF(600, 16), '#F8FAFA'); txt(g, v, x + 30, y + 60, SF(600, 18, 'DM Mono'), j === 3 ? '#7EE2A8' : '#8FE6FF');
      txt(g, k % 2 ? 'Ligar amanhã' : 'Enviar proposta', x + 30, y + 86, SF(400, 13), '#A9C3CE'); }); });
  OS_CV.tex.needsUpdate = true;
}
// a fatura mensal das licenças (muda com a calculadora) e o recibo da SENVIA
function drawInvoice(users, price){
  const g = INV_CV.g, W = 560, H = 760; g.clearRect(0, 0, W, H); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#B06F5E'; g.fillRect(0, 0, W, 12);
  txt(g, 'FATURA', 40, 70, SF(700, 40), SC.ink); txt(g, 'N.º 2026/0147', W - 40, 72, SF(500, 20, 'DM Mono'), SC.ink2, 'right');
  txt(g, 'Licenças · software de gestão', 40, 130, SF(500, 24), SC.ink2);
  g.fillStyle = SC.line; g.fillRect(40, 170, W - 80, 2);
  txt(g, `${users} utilizadores × ${price}€`, 40, 214, SF(500, 26), SC.ink); txt(g, `${users * price}€`, W - 40, 214, SF(600, 26), SC.ink, 'right');
  txt(g, 'Período: este mês', 40, 258, SF(400, 22), SC.ink2);
  g.fillStyle = SC.line; g.fillRect(40, 300, W - 80, 2);
  txt(g, 'Total a pagar', 40, 360, SF(500, 26), SC.ink2); txt(g, `${users * price}€`, W - 40, 430, SF(700, 72), '#9A3B26', 'right');
  g.fillStyle = '#FBE7E2'; rr(g, 40, 500, W - 80, 64, 32); g.fill(); txt(g, 'Renova todos os meses', W / 2, 533, SF(600, 22), '#9A3B26', 'center');
  txt(g, '+1 utilizador = +1 licença', W / 2, 620, SF(400, 22), SC.ink2, 'center');
  INV_CV.tex.needsUpdate = true;
}
function drawReceipt(){
  const g = REC_CV.g, W = 420, H = 560; g.clearRect(0, 0, W, H); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H);
  g.fillStyle = SC.petrol; g.fillRect(0, 0, W, 12);
  g.fillStyle = '#2BDBFF'; [[46, 66, 12], [64, 50, 8], [64, 82, 8]].forEach(([x, y, s]) => { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); rr(g, -s, -s, s * 2, s * 2, 3); g.fill(); g.restore(); });
  txt(g, 'SENVIA', 90, 68, SF(700, 30), SC.ink);
  txt(g, 'Servidor e manutenção', 34, 140, SF(500, 22), SC.ink2);
  txt(g, 'desde', W / 2, 176, SF(500, 22), SC.ink2, 'center'); txt(g, '69€', W / 2, 250, SF(700, 96), SC.deep, 'center'); txt(g, 'por mês', W / 2, 318, SF(500, 24), SC.ink2, 'center');
  g.fillStyle = '#E2F2F8'; rr(g, 34, 380, W - 68, 60, 30); g.fill(); txt(g, 'Utilizadores ilimitados', W / 2, 411, SF(600, 20), SC.deep, 'center');
  txt(g, 'A equipa cresce, o valor não.', W / 2, 490, SF(400, 20), SC.ink2, 'center');
  REC_CV.tex.needsUpdate = true;
}
function drawTag(T, big, small, col){ const g = T.g; g.clearRect(0, 0, 560, 150);
  g.fillStyle = 'rgba(255,255,255,.92)'; rr(g, 6, 6, 548, 138, 28); g.fill();
  txt(g, big, 280, 66, SF(700, 64), col, 'center'); txt(g, small, 280, 118, SF(500, 24), SC.ink2, 'center'); T.tex.needsUpdate = true; }
// o calendário dos anos: folha com a barra de cima em petróleo e o número grande
function drawYear(y){
  const g = YEAR_CV.g; g.clearRect(0, 0, 300, 300);
  g.fillStyle = '#FFFFFF'; rr(g, 8, 8, 284, 284, 34); g.fill(); g.strokeStyle = SC.line; g.lineWidth = 3; g.stroke();
  g.save(); rr(g, 8, 8, 284, 284, 34); g.clip(); g.fillStyle = SC.deep; g.fillRect(8, 8, 284, 74); g.restore();
  g.fillStyle = '#FFFFFF'; [96, 204].forEach(x => { rr(g, x - 7, -4, 14, 34, 7); g.fill(); });
  g.letterSpacing = '6px'; txt(g, 'ANO', 150, 48, SF(700, 32), '#FFFFFF', 'center'); g.letterSpacing = '0px';
  txt(g, String(y), 150, 178, SF(700, 140), SC.ink, 'center');
  [0, 1, 2].forEach(k => { g.fillStyle = k < y ? SC.petrol : SC.line; g.beginPath(); g.arc(122 + k * 28, 262, 8, 0, 7); g.fill(); });
  YEAR_CV.tex.needsUpdate = true;
}
function drawObjects(){ drawSystem(SYS_ALL, SYS_CV.g, SYS_CV.tex); drawExcel(); drawPhoneSite(); drawOS(); drawReceipt(); updateCalc?.(); }

// ---------- dispositivos ----------
const SCR_RATIO = SH / SW;
function screenMat(tex){ return new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true }); }
function makeLaptop(tex, sw = 2.5){
  const g = new THREE.Group(), body = new THREE.MeshPhysicalMaterial({ color: 0xC5CFD5, roughness: 0.32, metalness: 0.35, clearcoat: 0.4, transparent: true });
  const sh = sw * SCR_RATIO;
  const base = new THREE.Mesh(new RoundedBoxGeometry(sw + 0.5, 0.08, 1.7, 3, 0.035), body); base.position.set(0, -sh / 2 - 0.1, 0.78); base.castShadow = true; g.add(base);
  const lid = new THREE.Group(); lid.position.set(0, -sh / 2 - 0.08, 0); lid.rotation.x = -0.1; g.add(lid);
  const shell = new THREE.Mesh(new RoundedBoxGeometry(sw + 0.18, sh + 0.18, 0.06, 3, 0.05), body); shell.position.set(0, sh / 2 + 0.06, -0.035); shell.castShadow = true; lid.add(shell);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), screenMat(tex)); scr.position.set(0, sh / 2 + 0.06, 0.0); lid.add(scr);
  g.userData.mats = [body, scr.material]; return g;
}
function makePhone(tex, h = 2.0){
  const g = new THREE.Group(), body = new THREE.MeshPhysicalMaterial({ color: 0x14232C, roughness: 0.3, metalness: 0.4, clearcoat: 0.8, transparent: true });
  const shell = new THREE.Mesh(new RoundedBoxGeometry(h * 0.5 + 0.1, h + 0.12, 0.09, 4, 0.12), body); shell.castShadow = true; g.add(shell);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(h * 0.5, h), screenMat(tex)); scr.position.z = 0.047; g.add(scr);
  g.userData.mats = [body, scr.material]; return g;
}
function makeWindow(tex, sw = 3.3){
  const g = new THREE.Group(), body = new THREE.MeshPhysicalMaterial({ color: 0xF9FBFB, roughness: 0.35, clearcoat: 0.6, transparent: true });
  const sh = sw * SCR_RATIO, frame = new THREE.Mesh(new RoundedBoxGeometry(sw + 0.16, sh + 0.16, 0.08, 4, 0.1), body); frame.castShadow = true; g.add(frame);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), screenMat(tex)); scr.position.z = 0.042; g.add(scr);
  g.userData.mats = [body, scr.material]; return g;
}
const setOp = (obj, op) => { obj.visible = op > 0.01; obj.userData.mats.forEach(m => { m.opacity = op; }); };

// hero: os dois serviços, um de cada lado do título
const heroLaptop = makeLaptop(SYS_CV.tex), heroPhone = makePhone(PH_CV.tex);
scene.add(heroLaptop, heroPhone);
// serviços: um dispositivo por estação (sistema no portátil, site no telemóvel, Senvia OS numa janela)
[makeLaptop(SYS_CV.tex, 3.0), makePhone(PH_CV.tex, 2.6), makeWindow(OS_CV.tex)].forEach((d, k) => { screens[k].g.add(d); screens[k].mats = d.userData.mats; screens[k].dev = d; });

// ---------- o Excel que se vira no sistema: quadradinhos com o Excel à frente e o sistema atrás ----------
const MOS = (() => {
  const C = (innerWidth < 760) ? 8 : 10, R = (innerWidth < 760) ? 7 : 9, W = 3.2, H = W * SCR_RATIO, tw = W / C, th = H / R;
  const grp = new THREE.Group(); scene.add(grp);
  const fm = new THREE.MeshBasicMaterial({ map: XLS_CV.tex, toneMapped: false, transparent: true });
  const bm = new THREE.MeshBasicMaterial({ map: SYS_CV.tex, toneMapped: false, transparent: true });
  const tiles = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
    const t = new THREE.Group(), u0 = c / C, u1 = (c + 1) / C, v1 = 1 - r / R, v0 = 1 - (r + 1) / R;
    const fg = new THREE.PlaneGeometry(tw * 0.985, th * 0.985), uv = fg.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, lerp(u0, u1, uv.getX(k)), lerp(v0, v1, uv.getY(k)));
    const bg = fg.clone(); bg.rotateY(Math.PI);
    t.add(new THREE.Mesh(fg, fm), new THREE.Mesh(bg, bm));
    const bx = (c + 0.5) * tw - W / 2, by = H / 2 - (r + 0.5) * th;
    t.position.set(bx, by, 0); grp.add(t);
    tiles.push({ t, bx, by, s: 0.62 * (c / C + r / R) / 2 + rnd() * 0.12, j: rnd() - 0.5 });
  }
  return { grp, tiles, mats: [fm, bm], op: 0 };
})();

// ---------- a conta: faturas de licenças a empilhar, contra um recibo de 69€ ----------
const INV_N = 36;
const paper = (cv, w, h) => { const m = new THREE.MeshStandardMaterial({ map: cv.tex, roughness: 0.85, transparent: true });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.008, h), [m, m, m, m, m, m]); mesh.castShadow = true; mesh.receiveShadow = true; return { mesh, m }; };
const PILES = { lic: [], sen: [] };
for (let k = 0; k < INV_N; k++){
  const a = paper(INV_CV, 0.84, 1.14), b = paper(REC_CV, 0.6, 0.8);
  scene.add(a.mesh, b.mesh);
  PILES.lic.push({ ...a, y: 6, rz: (rnd() - 0.5) * 0.25, dx: (rnd() - 0.5) * 0.06, dz: (rnd() - 0.5) * 0.06 });
  PILES.sen.push({ ...b, y: 6, rz: (rnd() - 0.5) * 0.25, dx: (rnd() - 0.5) * 0.04, dz: (rnd() - 0.5) * 0.04 });
}
const tagMat = (T) => new THREE.MeshBasicMaterial({ map: T.tex, toneMapped: false, transparent: true, depthWrite: false });
const tagL = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.375), tagMat(TAG_L)), tagS = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.375), tagMat(TAG_S));
const yearMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), tagMat(YEAR_CV));
scene.add(tagL, tagS, yearMesh);
let pileOp = 0, PILE = { n: 12, lic: 0.045, sen: 0.011 }, yearPulse = 0, yearShown = 0;

// ---------- movimento por capítulo ----------
const heroSt = { lap: { x: -4, y: 0, z: 0, ry: 0, s: 0.8, op: 0 }, ph: { x: 4, y: 0, z: 0, ry: 0, s: 0.9, op: 0 } };
function stepTo(st, tg, k){ for (const key in tg) st[key] += (tg[key] - st[key]) * k; }
function updateObjects(cur, p, bf, t, dt){
  const m = L.mobile, mo = REDUCE ? 0 : 1, k = damp(dt, 3), bob = Math.sin(t * 0.9) * 0.06 * mo;
  // hero: portátil (sistemas) e telemóvel (sites), um de cada lado; saem quando entra o Excel
  const inHero = cur === 0 && p < 0.55 ? 1 : 0, e = smooth(0.3, 0.55, p);
  // no telemóvel os dois ficam juntos por cima do texto
  stepTo(heroSt.lap, m ? { x: -0.45, y: 3.05 + bob, z: -0.6, ry: 0.3 + p * 0.8, s: 0.4, op: inHero }
    : { x: -(L.heroX + 1.55) - e * 2, y: -0.25 + bob, z: -0.6, ry: 0.55 + p * 0.9, s: 0.7, op: inHero }, k);
  stepTo(heroSt.ph, m ? { x: 1.05, y: 3.0 - bob, z: -0.2, ry: -0.3 - p * 0.8, s: 0.42, op: inHero }
    : { x: L.heroX + 0.6 + e * 2, y: -0.05 - bob, z: -0.2, ry: -0.5 - p * 0.9, s: 0.9, op: inHero }, k);
  [[heroLaptop, heroSt.lap], [heroPhone, heroSt.ph]].forEach(([o, s]) => { o.position.set(s.x, s.y, s.z); o.rotation.set(0, s.ry, 0); o.scale.setScalar(s.s); setOp(o, s.op); });

  // o Excel vira-se no sistema, quadradinho a quadradinho (na segunda metade do início)
  MOS.op += ((cur === 0 && p > 0.42 ? 1 : 0) - MOS.op) * k;
  MOS.grp.visible = MOS.op > 0.01; MOS.mats.forEach(mt => { mt.opacity = MOS.op; });
  if (MOS.grp.visible){
    const f = smooth(0.56, 0.94, p), spread = 1 + 0.16 * Math.sin(Math.PI * f);
    MOS.grp.position.set(CX + (m ? 0 : -0.1), CY + (m ? -0.45 : 0.05) + bob * 0.5, m ? 0 : -0.2);
    MOS.grp.rotation.set(-0.06, m ? 0 : -0.32 + (1 - f) * 0.08, 0); MOS.grp.scale.setScalar(m ? 0.78 : 1);
    MOS.tiles.forEach((T) => { const fi = smooth(T.s, T.s + 0.3, f), lift = Math.sin(Math.PI * fi);
      T.t.position.set(T.bx * spread, T.by * spread, lift * 0.35); T.t.rotation.set(lift * 0.35 * T.j, Math.PI * fi, lift * 0.25 * T.j); });
  }

  // a conta: uma fatura por mês (a altura acompanha o valor), contra o recibo de 69€
  pileOp += ((cur === 1 ? 1 : 0) - pileOp) * k;
  const showPiles = pileOp > 0.01, n = PILE.n, base = FLOOR_Y + 0.01;
  const lx = CX + (m ? -0.75 : -0.55), sx = CX + (m ? 0.8 : 1.15), pz = m ? 0.4 : 0.6;
  PILES.lic.forEach((P, j) => { const on = j < n, ty = on ? base + j * PILE.lic : base + 5 + j * 0.1;
    P.y += (ty - P.y) * damp(dt, on ? 4 + (j % 4) : 2); P.mesh.position.set(lx + P.dx, P.y, pz + P.dz); P.mesh.rotation.set(0, P.rz, 0);
    P.m.opacity = pileOp * (on ? 1 : 0); P.mesh.visible = showPiles && P.y < base + 4.9; });
  PILES.sen.forEach((P, j) => { const on = j < n, ty = on ? base + j * PILE.sen : base + 5 + j * 0.1;
    P.y += (ty - P.y) * damp(dt, on ? 4 + (j % 4) : 2); P.mesh.position.set(sx + P.dx, P.y, pz + P.dz); P.mesh.rotation.set(0, P.rz, 0);
    P.m.opacity = pileOp * (on ? 1 : 0); P.mesh.visible = showPiles && P.y < base + 4.9; });
  const topL = base + n * PILE.lic, topS = base + n * PILE.sen;
  tagL.position.set(lx, topL + 0.45, pz); tagS.position.set(sx, topS + 0.45, pz);
  [tagL, tagS].forEach((tg) => { tg.quaternion.copy(camera.quaternion); tg.material.opacity = pileOp; tg.visible = showPiles; tg.scale.setScalar(m ? 0.8 : 1); });
  // o calendário dos anos, por cima da pilha da SENVIA: dá um salto quando o ano muda
  yearPulse *= Math.exp(-dt * 4);
  yearMesh.position.set(sx, topS + (m ? 1.05 : 1.15) + yearPulse * 0.12, pz); yearMesh.quaternion.copy(camera.quaternion);
  yearMesh.rotateZ(Math.sin(yearPulse * Math.PI * 2) * 0.12);
  yearMesh.scale.setScalar((m ? 0.85 : 1) * (1 + 0.28 * yearPulse)); yearMesh.material.opacity = pileOp; yearMesh.visible = showPiles;
}

/* ================= caminho de luz (capítulo noturno) ================= */
const pathGroup = new THREE.Group(); scene.add(pathGroup);
const pathMat = new THREE.ShaderMaterial({
  uniforms: { uDraw: { value: 0 }, uTime: { value: 0 }, uA: { value: 0 }, uColor: { value: new THREE.Color('#3FC6E8') }, uPulse: { value: new THREE.Color('#25D366') } },
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform float uDraw; uniform float uTime; uniform float uA; uniform vec3 uColor; uniform vec3 uPulse; varying vec2 vUv;
    void main(){
      if (vUv.x > uDraw) discard;
      float head = exp(-pow((vUv.x - uDraw) * 40.0, 2.0));
      float p = fract(uTime * 0.22) * max(uDraw, 0.001);
      float pulse = exp(-pow((vUv.x - p) * 26.0, 2.0));
      vec3 col = uColor * 0.75 + uPulse * pulse * 1.6 + vec3(1.0) * head * 0.6;
      gl_FragColor = vec4(col, uA * (0.55 + pulse * 0.45 + head * 0.4));
      #include <colorspace_fragment>
    }`,
});
let pathMesh = null, pathCurve = null;
const NODES = ['chat', 'cog', 'server', 'shield']; // diagnóstico, construção, publicação, manutenção
let NODE_POS = [];
function buildPath(){
  const m = L.mobile ? 0.5 : 0.8, X = L.x4;
  NODE_POS = [[-2.8, 1.1], [-0.95, -0.8], [0.95, 1.0], [2.8, -0.7]].map(([x, z]) => new THREE.Vector3(X + x * m, FLOOR_Y + 0.08, z * m - 0.2));
  pathCurve = new THREE.CatmullRomCurve3(NODE_POS, false, 'centripetal');
  if (pathMesh){ pathGroup.remove(pathMesh); pathMesh.geometry.dispose(); }
  pathMesh = new THREE.Mesh(new THREE.TubeGeometry(pathCurve, 220, 0.035, 8, false), pathMat);
  pathGroup.add(pathMesh);
}
const leadDot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), new THREE.MeshBasicMaterial({ color: 0x25D366, transparent: true, toneMapped: false }));
pathGroup.add(leadDot);

/* ================= camada da frente (outro canvas, por cima do texto) ================= */
const fgCanvas = document.getElementById('fg');
const fgR = new THREE.WebGLRenderer({ canvas: fgCanvas, alpha: true, antialias: true });
fgR.setPixelRatio(1); // está desfocada por CSS, não precisa de resolução alta
fgR.outputColorSpace = THREE.SRGBColorSpace; fgR.toneMapping = THREE.NeutralToneMapping; fgR.setClearColor(0x000000, 0);
const fgScene = new THREE.Scene();
fgScene.environment = new THREE.PMREMGenerator(fgR).fromScene(new RoomEnvironment(), 0.04).texture;
fgScene.add(new THREE.HemisphereLight(0xffffff, 0xbfd2da, 0.7));
const fgSun = new THREE.DirectionalLight(0xffffff, 1.5); fgSun.position.set(-3, 5, 4); fgScene.add(fgSun);
const fgCam = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 60);
const DEBRIS_ICONS = (innerWidth < 760 ? ['chat', 'chart', 'sheet', 'cog', 'users', 'box'] : ['chat', 'chart', 'sheet', 'cog', 'users', 'box', 'invoice', 'calendar', 'mail', 'euro']);
const debrisGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 3, 0.09);
const debris = DEBRIS_ICONS.map((icon, i) => {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const mat = new THREE.MeshPhysicalMaterial({ color: BASES[(i + 1) % 4].clone(), roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, iridescence: 0.5, iridescenceIOR: 1.4, transparent: true });
  const body = new THREE.Mesh(debrisGeo, mat); g.add(body);
  const dm = mat;
  fgScene.add(g);
  // mais à direita do que à esquerda, e sempre fora da faixa central onde fica o texto centrado
  const right = i % 3 !== 0;
  return { g, mat, dm, right, rx: rnd(), y0: rnd(), d: 4.2 + rnd() * 4.2, dir: rnd() < .5 ? -1 : 1, sp: 0.3 + rnd() * 0.5 };
});
// intensidade por capítulo: mais presente onde só há texto, discreta onde há conteúdo 3D para ler
const FG_OP = [0.45, 0.35, 0.15, 0, 0.7, 0.3, 0.3, 0.6]; // na Solução quase nada à frente do site a montar; no Trabalho, nada à frente dos ecrãs
// zona de proteção: onde está o texto, a camada da frente fica quase transparente
const FG_MASK = {
  left: 'linear-gradient(90deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 38%,#000 60%)',
  right: 'linear-gradient(270deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 38%,#000 60%)',
  center: 'radial-gradient(ellipse 46% 42% at 50% 52%,rgba(0,0,0,.08) 60%,#000 100%)',
  bottom: 'linear-gradient(0deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 42%,#000 64%)',
  top: 'linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.1) 44%,#000 66%)',
};
let fgMaskPos = '';
let fgOp = 0;

/* ================= partículas em losango espalhadas pelo mundo ================= */
const CONF_N = innerWidth < 760 ? 90 : 170;
const confMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 });
const conf = new THREE.InstancedMesh(new RoundedBoxGeometry(0.16, 0.16, 0.05, 2, 0.02), confMat, CONF_N);
conf.frustumCulled = false; conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
const confData = [], CONF_COLS = ['#7FB6C6', '#9FB4BE', '#0E86A8', '#C5D3DA'].map(c => new THREE.Color(c));
for (let i = 0; i < CONF_N; i++){
  confData.push({ x: (rnd() < .5 ? -1 : 1) * (2.4 + rnd() * 9), y: FLOOR_Y + 0.5 + rnd() * 7, z: 7 - rnd() * 48, ph: rnd() * 6.28, sp: 0.4 + rnd() * 0.8, dir: rnd() < .5 ? -1 : 1, s: 0.6 + rnd() * 0.9 });
  conf.setColorAt(i, CONF_COLS[i % 4]);
}
scene.add(conf);
const dummy = new THREE.Object3D();

/* ================= layout ================= */
const L = {};
function layout(){
  const w = innerWidth, h = innerHeight;
  L.mobile = w < 760;
  L.cy = 0;
  L.camZ = L.mobile ? 15 : (w / h < 1.3 ? 12 : 10);
  // composição centrada em qualquer largura: texto (31rem) + intervalo + objeto 3D formam um só bloco no meio do ecrã.
  // As contas são em px e passam para o mundo 3D com a escala da câmara (px → unidades a uma dada distância).
  const textW = Math.min(496, w * 0.4), gap = 64;
  L.wppAt = (d) => d * Math.tan(THREE.MathUtils.degToRad(17)) * (w / h) / (w / 2);
  const wpp = L.wppAt(L.camZ), objPx = 3.4 / wpp;
  L.cxPx = L.mobile ? 0 : (textW + gap) / 2;          // do centro do ecrã ao centro do objeto
  L.cx = L.cxPx * wpp;
  L.heroX = (Math.min(736, w * 0.9) / 2 + 40) * wpp;  // do centro à borda dos dispositivos do início
  document.documentElement.style.setProperty('--stage-pad', `${Math.round(Math.max(w * 0.055, (w - (textW + gap + objPx)) / 2))}px`);
  L.ring = L.mobile ? 1.5 : 2.1;
  L.ringBig = L.mobile ? 2.5 : 4.3;     // anel grande que envolve o texto centrado
  L.spreadX = L.mobile ? 2.4 : 5.6;
  L.grid = L.mobile ? 0.82 : 1.15;
  L.x4 = 0;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  fgCam.aspect = w / h; fgCam.updateProjectionMatrix();
  renderer.setSize(w, h, false); fgR.setSize(w, h, false);
  screens.forEach(s => s.g.scale.setScalar(L.mobile ? 0.51 : 0.72));
  buildPath();
}
layout();
addEventListener('resize', () => { layout(); measure(); });

// sinergia texto ↔ 3D: conforme a posição do texto activo, o conteúdo 3D vai para o lado oposto
// [x do conteúdo, y do conteúdo, escala]; CX/CY/CS amortecidos fazem o 3D deslizar entre posições
function posSpec(pos){
  if (L.mobile) return [0, 0, 1];
  switch (pos){
    case 'right': return [-L.cx, 0, 1];
    case 'center': return [0, 0, 1];
    case 'bottom': return [0, 0.9, 0.78];
    case 'top': return [0, -0.8, 0.85];
    default: return [L.cx, 0, 1];
  }
}
let [CX, CY, CS] = posSpec('right');
// de que lado está o 3D: -1 (esquerda), 0 (centro), 1 (direita)
const side = () => (L.cx ? CX / L.cx : 0);
// a janela da Solução fica um pouco mais perto do centro (e do texto) do que o resto do 3D,
// e um pouco mais abaixo quando está de lado, para o cartão do Google caber por cima sem chegar ao menu
let SX = CX, SOLY = 0;

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
  // camadas de texto: entram/saem por progresso e, enquanto visíveis, mexem-se com o scroll
  // (sobem devagar e as laterais deslizam um pouco para o centro)
  let pos = 'left', mpos = 'mid', lpCur = 0.5, first = false, fallN = 0;
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
    // frases que entram uma a uma dentro da mesma camada; as anteriores ficam esbatidas
    if (l.lines.length){
      let n = 0;
      l.lines.forEach((b, k) => {
        const bOn = on && lp >= b.at, bPast = bOn && !!l.lines[k + 1] && on && lp >= l.lines[k + 1].at;
        if (bOn) n++;
        if (bOn !== b.on){ b.on = bOn; b.el.classList.toggle('on', bOn); }
        if (bPast !== b.past){ b.past = bPast; b.el.classList.toggle('past', bPast); }
      });
      if (on && ch === c) fallN = n;
    }
    if (on && ch === c){ pos = l.pos; mpos = l.mpos; lpCur = lp; first = ch.i === 0 && l.a === 0; }
  }));
  state.pos = pos; state.mpos = mpos; state.lp = lpCur; state.first = first; state.fallN = fallN;
  // indicador e navegação
  hudBar.style.width = `${(c.p * 100).toFixed(1)}%`;
  if (cur !== lastCur){
    lastCur = cur;
    hudN.textContent = String(cur + 1).padStart(2, '0'); hudName.textContent = c.name;
    dotEls.forEach((d, i) => d.classList.toggle('on', i === cur));
    dotEls.forEach((d, i) => d.setAttribute('aria-current', i === cur ? 'true' : 'false'));
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

// foco no texto: sempre ligado (escolhido depois de comparar com e sem)
const FOCUS_ON = true;

/* ================= rato ================= */
const mouse = { nx: 0, ny: 0, sx: 0, sy: 0, in: false };
addEventListener('pointermove', (e) => { mouse.nx = e.clientX / innerWidth * 2 - 1; mouse.ny = -(e.clientY / innerHeight * 2 - 1); mouse.px = e.clientX; mouse.py = e.clientY; mouse.in = e.pointerType === 'mouse'; }, { passive: true });

// etiqueta com o nome da peça ao passar o rato
const tip = document.getElementById('tip'), tipName = tip.querySelector('b'), tipDesc = tip.querySelector('span');
let tipIcon = '';
function showTip(icon){
  if (icon !== tipIcon){ tipIcon = icon; if (icon){ tipName.textContent = PIECES[icon][0]; tipDesc.textContent = PIECES[icon][1]; } tip.classList.toggle('on', !!icon); }
  if (icon){ tip.style.left = `${Math.min(innerWidth - 240, mouse.px + 18)}px`; tip.style.top = `${Math.min(innerHeight - 70, mouse.py + 18)}px`; }
}

// passar o rato (ou o foco) por um cartão de pacote acende as peças desse pacote
const planEls = [...ROOT.querySelectorAll('.plan')];
planEls.forEach((el, k) => { el.addEventListener('pointerenter', () => { pkgHover = k; }); el.addEventListener('focusin', () => { pkgHover = k; }); });
const plansEl = ROOT.querySelector('.plans');
plansEl.addEventListener('pointerleave', () => { if (innerWidth >= 760) pkgHover = 1; });
// telemóvel: os cartões deslizam de lado; acendem as peças do cartão que está ao centro, e abre no recomendado
plansEl.addEventListener('scroll', () => {
  const mid = plansEl.getBoundingClientRect().left + plansEl.clientWidth / 2;
  let best = 1, bd = Infinity;
  planEls.forEach((el, k) => { const r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd){ bd = d; best = k; } });
  pkgHover = best;
  dotEls2.forEach((d, k) => d.classList.toggle('on', k === best));
}, { passive: true });
const dotEls2 = [...document.querySelectorAll('.plan-dots i')];
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
addEventListener('mouseout', (e) => { if (!e.relatedTarget) mouse.in = false; });
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

/* ================= formações: onde está cada losango em cada capítulo ================= */
const tmpV = new THREE.Vector3(), tmpE = new THREE.Euler(), tmpM = new THREE.Matrix4();
// a calculadora: pessoas × licença por pessoa × anos, contra 69€ por mês; a torre de lajes acompanha a conta
const calc = { users: document.getElementById('c-users'), price: document.getElementById('c-price'), years: 1 };
const euros = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '€';
function updateCalc(){
  const u = +calc.users.value, pr = +calc.price.value, y = calc.years, lic = u * pr * 12 * y;
  document.getElementById('c-n').textContent = u;
  document.getElementById('c-p').textContent = pr + '€';
  document.getElementById('c-y').textContent = y === 1 ? '1 ano' : y + ' anos';
  document.getElementById('c-lic').textContent = euros(lic);
  document.getElementById('c-us').textContent = euros(69 * 12 * y);
  // faturas: uma por mês; a altura de cada pilha é proporcional ao dinheiro (licenças contra 69€)
  PILE.n = 12 * y; PILE.lic = clamp(u * pr * 0.045 / 280, 0.012, 0.12); PILE.sen = 69 * 0.045 / 280;
  drawInvoice(u, pr); drawTag(TAG_L, euros(lic), y === 1 ? 'em licenças, 1 ano' : 'em licenças, ' + y + ' anos', '#9A3B26'); drawTag(TAG_S, euros(69 * 12 * y), y === 1 ? 'na SENVIA, 1 ano' : 'na SENVIA, ' + y + ' anos', SC.deep);
  if (y !== yearShown){ if (yearShown) yearPulse = 1; yearShown = y; drawYear(y); }
}
[calc.users, calc.price].forEach((el) => el.addEventListener('input', updateCalc));
updateCalc();

/* câmara por capítulo */
const camPos = new THREE.Vector3(0, 0.5, 10), camLook = new THREE.Vector3(), camPosT = new THREE.Vector3(), camLookT = new THREE.Vector3();
// a câmara também é coreografada pelo scroll: orbita, sobe e aproxima-se dentro de cada capítulo
function cameraTarget(ch, beat, bp, p){
  const Z = L.camZ, sc = REDUCE ? 0.3 : 1, LY = L.mobile ? MLY : 0;
  switch (ch){
    case 0: { const k1 = smooth(0.42, 0.92, p); camPosT.set(Math.sin(p * 0.6 - 0.1) * 2.2 * sc, 0.3 + p * 0.45, Z - p * 0.5 + k1 * 1.1); camLookT.set(0, LY + k1 * 0.1, 0); break; }
    case 1: camPosT.set(Math.sin(p * 0.9 - 0.45) * 2.6 * sc, 1.1 + p * 0.7, Z + 0.4 - p * 0.6); camLookT.set(CX * 0.25, LY - (L.mobile ? 1.5 : 0.2), 0); break; // no telemóvel olha mais abaixo: as barras da conta ficam à vista
    case 2: camPosT.set(Math.sin(p * 0.7 - 0.35) * 1.6 * sc, 0.5 + p * 0.3, Z - 0.6); camLookT.set(0, LY + 0.1, 0); break;
    case 3: {
      const n = screens.length, k = Math.min(n - 1, beat), next = Math.min(n - 1, beat + 1);
      const f = beat < n - 1 ? smooth(0.62, 1, bp) : 0;
      const A = screens[k].g.position, B = screens[next].g.position;
      const sx = lerp(A.x, B.x, f), sz = lerp(A.z, B.z, f);
      if (L.mobile){ camPosT.set(sx, 0.7, sz + 8.4); camLookT.set(sx, 0.3 + MLY * 0.55, sz); } // ecrã por cima ou por baixo do texto, alternando
      else { const off = L.cxPx * L.wppAt(7.2) * side() * (k === 1 ? 0.62 : 1); /* o telemóvel é estreito: fica mais perto do texto */ camPosT.set(sx - 0.27 * off, 0.7, sz + 7.2); camLookT.set(sx - off, 0.25, sz); } // ecrã do lado oposto ao texto, os dois perto do centro
      break;
    }
    case 4: { // vista de cima que orbita à volta do percurso; no desktop o percurso fica à direita do texto
      const a = (p - 0.5) * 0.8 * sc, ox = L.mobile ? 0 : -0.3, oz = L.mobile ? 9.9 : 8.0;
      if (L.mobile) camLookT.set(0, FLOOR_Y + 1.7, -0.4); else camLookT.set(L.x4 - L.cxPx * L.wppAt(8.5) * 1.85 * side(), FLOOR_Y, -0.4 + CY * 1.8);
      camPosT.set(camLookT.x + ox * Math.cos(a) + oz * Math.sin(a), L.mobile ? FLOOR_Y + 9.95 : 5.4 - p * 0.6, camLookT.z - ox * Math.sin(a) + oz * Math.cos(a));
      break;
    }
    case 5: camPosT.set(Math.sin(p * 0.6 - 0.3) * 2 * sc, 0.6, Z + 0.5); camLookT.set(0, LY * 0.5, -1); break;
    default: camPosT.set(0, 0.3 + (1 - p) * 0.6, Z - 0.4 - p * 0.7); camLookT.set(0, LY + 0.25, 0);
  }
}

/* ambiente: dia / noite */
const ENV = {
  day: { bg: new THREE.Color('#EEF2F3'), dot: new THREE.Color('#9FB4BE'), glow: new THREE.Color('#7CC6DA'), glowA: 0.55, env: 0.95 },
  night: { bg: new THREE.Color('#0B1F2A'), dot: new THREE.Color('#2C86A3'), glow: new THREE.Color('#1FAF5B'), glowA: 0.3, env: 0.45 },
};
let nightAmt = 0;

/* ================= ciclo ================= */
let last = performance.now(), t0 = last, slowFrames = 0, hovered = -1;
// inércia: a velocidade do scroll vira "energia" que inclina e atrasa os objectos, e assenta quando paras
let VEL = 0, ENERGY = 0, SY = 0, lastY = scrollY;
// RF = quanto o 3D está em "modo leitura" (0 a 1); lag = o 3D obedece ao texto com um pequeno atraso
let RF = 0, workHide = 0, FALL_N = 0;
const lag = { cur: -1, pos: 'right', mpos: 'mid', beat: 0, wantPos: 'right', wantMpos: 'mid', wantBeat: 0, t: 0 };
// telemóvel: para onde a câmara olha (amortecido). Texto em cima → olha acima e o 3D fica em baixo; texto em baixo → o contrário
const MLY_T = { high: 2.2, low: -1.9, mid: 0 };
let MLY = 0;
function frame(now){
  lenis?.raf(now);
  const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
  const t = Math.max(0, (now - t0) / 1000);
  readScroll();
  const { cur, beat, bp, p, bf } = state;

  const y = scrollY, rawV = lenis ? lenis.velocity : (y - lastY); lastY = y;
  const v = REDUCE ? 0 : clamp((rawV || 0) / 32, -2, 2);
  VEL += (v - VEL) * damp(dt, 6);
  ENERGY += (Math.min(1.6, Math.abs(v)) - ENERGY) * damp(dt, Math.abs(v) > ENERGY ? 9 : 2);
  SY = y / innerHeight;

  // o texto entra primeiro: dentro do mesmo capítulo, o 3D só reage ~0,22s depois de o momento mudar
  if (cur !== lag.cur){ lag.cur = cur; lag.pos = lag.wantPos = state.pos; lag.mpos = lag.wantMpos = state.mpos; lag.beat = lag.wantBeat = beat; }
  else if (state.pos !== lag.wantPos || state.mpos !== lag.wantMpos || beat !== lag.wantBeat){ lag.wantPos = state.pos; lag.wantMpos = state.mpos; lag.wantBeat = beat; lag.t = now; }
  if (now - lag.t > 220){ lag.pos = lag.wantPos; lag.mpos = lag.wantMpos; lag.beat = lag.wantBeat; }
  const beatL = lag.beat;
  FALL_N = state.fallN || 0;
  // na conta, os anos passam com o scroll (1, 2, 3)
  if (cur === 1){ const yrs = clamp(1 + Math.floor(bf * 1.5), 1, 3); if (yrs !== calc.years){ calc.years = yrs; updateCalc(); } }

  // foco no texto: com o texto completo no ecrã, o 3D recua, perde um pouco de cor e de energia;
  // nas passagens entre momentos volta a ter tudo. O losango activo nunca acalma.
  const focusT = FOCUS_ON ? (state.first ? 1 : smooth(0.12, 0.32, state.lp)) * (1 - smooth(0.78, 0.96, state.lp)) : 0;
  RF += (focusT - RF) * damp(dt, 3);

  // o 3D desliza para o lado oposto ao texto activo
  const [cxT, cyT, csT] = posSpec(lag.pos), kp = damp(dt, REDUCE ? 6 : 2.4);
  CX += (cxT - CX) * kp; CY += (cyT - CY) * kp; CS += (csT - CS) * kp;
  SX = CX; SOLY = L.mobile ? 0 : -0.3 * smooth(0.5, 2, Math.abs(CX));
  MLY += ((L.mobile ? MLY_T[lag.mpos] : 0) - MLY) * kp;

  // desempenho: se a máquina sofrer, baixa a resolução uma vez
  if (dt > 0.026) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
  if (slowFrames > 90 && DPR > 1){ DPR = 1; renderer.setPixelRatio(1); renderer.setSize(innerWidth, innerHeight, false); slowFrames = 0; }

  // ambiente
  nightAmt += ((chapters[cur].night ? 1 : 0) - nightAmt) * damp(dt, 2.2);
  BG.copy(ENV.day.bg).lerp(ENV.night.bg, nightAmt);
  scene.fog.color.copy(BG); floorMat.uniforms.uBg.value.copy(BG);
  floorMat.uniforms.uDot.value.copy(ENV.day.dot).lerp(ENV.night.dot, nightAmt);
  glowMat.uniforms.uColor.value.copy(ENV.day.glow).lerp(ENV.night.glow, nightAmt);
  glowMat.uniforms.uA.value = lerp(ENV.day.glowA, ENV.night.glowA, nightAmt);
  scene.environmentIntensity = lerp(ENV.day.env, ENV.night.env, nightAmt);
  hemi.intensity = lerp(0.6, 0.25, nightAmt);

  // câmara
  cameraTarget(cur, beat, bp, p);
  const kc = damp(dt, cur === 3 ? 2.6 : 2.2);
  camPos.lerp(camPosT, kc); camLook.lerp(camLookT, kc);
  mouse.sx += (mouse.nx - mouse.sx) * damp(dt, 3); mouse.sy += (mouse.ny - mouse.sy) * damp(dt, 3);
  camera.position.set(camPos.x + mouse.sx * 0.35, camPos.y + mouse.sy * 0.22, camPos.z);
  camera.lookAt(camLook);
  camera.updateMatrixWorld();
  floorMat.uniforms.uCam.value.copy(camera.position);
  sun.target.position.copy(camLook); sun.position.set(camLook.x - 4, camLook.y + 9, camLook.z + 6);

  // inclinação da página da Solução (partilhada pela janela e pelas peças)
  { const w2 = Math.cos(Math.PI * bf) * (REDUCE ? 0.3 : 1);
    SOLR.y = (L.mobile ? 0 : -0.42 * side() + (p - 0.5) * 0.25) + w2 * 0.18; SOLR.x = w2 * 0.08 - smooth(0.3, 1, CY) * 0.12; }

  // passar o rato por cima de uma peça: levanta-se e mostra o nome
  hovered = -1;
  let hoverIcon = '';
  if (mouse.in){
    ndc.set(mouse.nx, mouse.ny); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pkgOp > 0.5 ? bodies.concat(pkgBodies) : bodies, false)[0];
    if (hit){ if (hit.object.userData.icon) hoverIcon = hit.object.userData.icon; else { hovered = hit.object.userData.i; hoverIcon = tiles[hovered].icon; } }
  }
  showTip(hoverIcon);

  updateVoxels(cur, beatL, bp, p, bf, t, dt);
  updateObjects(cur, p, bf, t, dt);

  // janela de browser da Solução: o site vai-se montando com o scroll, parte a parte, quando cada peça encosta
  solOp += ((cur === 2 ? 1 : 0) - solOp) * damp(dt, 3);
  solB += ((cur === 2 ? bf : cur > 2 ? 3 : 0) - solB) * damp(dt, 4.5); // ritmo parecido com o das peças, para o conteúdo surgir quando elas chegam
  solPanel.visible = solOp > 0.01;
  if (solPanel.visible){
    const m = L.mobile ? 0.62 : 0.76;
    solPanel.position.set(SX, 0.2 + CY + SOLY, 0); solPanel.rotation.set(SOLR.x, SOLR.y, 0); solPanel.scale.setScalar(m * CS * (0.92 + 0.08 * solOp));
    solMat.opacity = solOp * 0.92; pageMat.opacity = solOp; solBody.castShadow = solOp > 0.6;
    const R = { pub: smooth(PUBLISH[0], PUBLISH[1], solB) };
    let key = R.pub.toFixed(2);
    BUILD.forEach(([k, a, b]) => { R[k] = smooth(lerp(a, b, 0.42), b, solB); key += R[k].toFixed(2); });
    if (key !== pageKey){ pageKey = key; drawSystem(R); }
    for (const k in CARDS){
      const K = CARDS[k], r = R[k], op = solOp * Math.min(1, r * 1.5);
      K.g.visible = r > 0.002; K.g.scale.setScalar(Math.max(0.0001, backOut(r)));
      K.mat.opacity = op * 0.96; K.fmat.opacity = op; K.slab.castShadow = op > 0.6;
    }
  }

  // peças de cada pacote: posicionadas a partir do próprio cartão no ecrã, a espreitar por cima dele
  pkgOp += ((cur === 5 ? 1 : 0) - pkgOp) * damp(dt, 3);
  if (pkgOp > 0.01){
    const D = 7, wpp = 2 * D * Math.tan(THREE.MathUtils.degToRad(17)) / innerHeight;
    planEls.forEach((el, k) => {
      const r = el.getBoundingClientRect(), list = pkgPieces[k], n = list.length, size = Math.min(46, (r.width - 28) / n);
      list.forEach((P) => {
        const px = r.left + 14 + size * (P.j + 0.5), py = r.top - size * 0.42;
        ndc.set(px / innerWidth * 2 - 1, -(py / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); ray.ray.at(D, tmpV);
        P.lit += ((k === pkgHover ? 1 : 0) - P.lit) * damp(dt, 6);
        P.g.position.copy(tmpV); P.g.quaternion.copy(camera.quaternion);
        P.g.rotateY(Math.sin(t * 0.8 + P.j) * 0.3 * (REDUCE ? 0 : 1)); P.g.translateY(Math.sin(t * 2.2 + P.j) * size * wpp * 0.08 * P.lit);
        P.g.scale.setScalar(Math.max(0.0001, size * 0.8 * wpp * (0.86 + 0.2 * P.lit) * pkgOp));
        P.mat.opacity = P.dmat.opacity = pkgOp; P.g.visible = true;
        P.mat.color.copy(BASES[P.j % 4]).lerp(GRAY, (1 - P.lit) * 0.5).lerp(STRONG_C, P.lit * 0.55).lerp(GREEN_C, P.body.userData.icon === 'chat' ? P.lit * 0.6 : 0);
        P.mat.emissive.copy(GLOW_C).multiplyScalar(P.lit * 0.25);
      });
    });
  } else pkgPieces.forEach(list => list.forEach(P => { P.g.visible = false; }));

  // ecrãs
  screens.forEach((s, i) => {
    // o ecrã actual desvanece antes de a câmara lhe passar perto; o seguinte ganha força à medida que nos aproximamos;
    // os já passados (ou demasiado perto da câmara) desaparecem
    const n = screens.length, leaving = beat < n - 1 ? smooth(0.6, 0.82, bp) : 0;
    const tooClose = s.g.position.z > camera.position.z - 3.4;
    let want = 0;
    if (cur === 3 && !tooClose){
      if (i === beat) want = 1 - leaving;
      else if (i === beat + 1) want = lerp(0.45, 1, smooth(0.55, 0.95, bp));
      else if (i > beat) want = 0.45;
    }
    s.op += (want - s.op) * damp(dt, 3);
    s.g.visible = s.op > 0.01;
    s.mats.forEach(m => { m.opacity = s.op; });
    s.frame.castShadow = s.op > 0.6;
    s.g.position.y = 0.3 + Math.sin(t * 0.7 + i) * 0.05 * (REDUCE ? 0 : 1);
  });

  // caminho de luz
  const pathWant = cur === 4 ? 1 : 0;
  pathMat.uniforms.uA.value += (pathWant - pathMat.uniforms.uA.value) * damp(dt, 3);
  const drawT = cur === 4 ? clamp((beat + smooth(0, 0.6, bp)) / (NODES.length - 1), 0, 1) : 0;
  pathMat.uniforms.uDraw.value += (drawT - pathMat.uniforms.uDraw.value) * damp(dt, 3);
  pathMat.uniforms.uTime.value = t;
  pathGroup.visible = pathMat.uniforms.uA.value > 0.01;
  if (pathGroup.visible && pathCurve){
    const d = pathMat.uniforms.uDraw.value, u = (t * 0.22 % 1) * Math.max(d, 0.001);
    pathCurve.getPointAt(u, tmpV); leadDot.position.set(tmpV.x, tmpV.y + 0.08, tmpV.z);
    leadDot.material.opacity = pathMat.uniforms.uA.value * (d > 0.02 ? 1 : 0);
  }

  // partículas em losango: paralaxe, rotação com o scroll e com a energia (no corredor do Trabalho saem do caminho)
  workHide += ((cur === 3 ? 1 : 0) - workHide) * damp(dt, 3);
  const nightGlow = nightAmt * 0.5;
  confMat.emissive.setRGB(0.02 * nightGlow, 0.35 * nightGlow, 0.45 * nightGlow);
  for (let i = 0; i < CONF_N; i++){
    const d = confData[i];
    dummy.position.set(d.x, d.y + Math.sin(t * 0.4 * d.sp + d.ph) * 0.15 + VEL * 0.35, d.z);
    dummy.rotation.set(d.ph + t * 0.2 * d.sp + SY * 0.8 * d.dir + ENERGY * 1.2, d.ph * 2 + t * 0.15 + SY * 0.6 * d.dir, Math.PI / 4);
    dummy.scale.setScalar(Math.max(0.0001, d.s * (1 - workHide * (Math.abs(d.x) < 5 ? 1 : 0))));
    dummy.updateMatrix(); conf.setMatrixAt(i, dummy.matrix);
  }
  conf.instanceMatrix.needsUpdate = true;

  const past = lastChapterEl.getBoundingClientRect().bottom <= 0;
  if (past !== worldHidden){ worldHidden = past; canvas.style.visibility = fgCanvas.style.visibility = past ? 'hidden' : ''; }
  if (past) return;
  renderer.render(scene, camera);

  // camada da frente: losangos que passam perto da câmara, em espaço da câmara, com paralaxe forte
  fgOp += (FG_OP[cur] * (REDUCE ? 0.5 : 1) * (1 - 0.7 * RF) - fgOp) * damp(dt, 2.5);
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
drawCards(); drawObjects();
document.fonts?.ready.then(() => { drawCards(); drawObjects(); pageKey = ''; });
renderer.setAnimationLoop(frame);
