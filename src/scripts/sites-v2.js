import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';


/* ================= conteúdo ================= */
// o texto vive no HTML da página (Astro); aqui fica só o que o 3D precisa
const ROOT = document.getElementById('sv2');
const IMGS = JSON.parse(ROOT.dataset.imgs || '{}');
const WORK = [...ROOT.querySelectorAll('#trabalho .layer')].map(l => ({ key: l.dataset.key, dom: l.dataset.dom }));
const ICONS = ['chat','cursor','target','pencil','search','chart','shield','globe','megaphone','bag','bolt','calendar'];

/* ================= cada losango é uma peça do teu site ================= */
const PIECES = {
  chat: ['WhatsApp', 'O contacto chega com contexto'],
  cursor: ['Botão de ação', 'Um passo claro a seguir'],
  target: ['Oferta clara', 'O que vendes e para quem'],
  pencil: ['Design', 'Profissional em desktop e telemóvel'],
  search: ['SEO', 'Títulos, estrutura e velocidade'],
  chart: ['Dados e tracking', 'De onde vêm os pedidos, em números'],
  shield: ['Segurança e confiança', 'SSL, manutenção e provas'],
  globe: ['Domínio e alojamento', 'Publicado e sempre no ar'],
  megaphone: ['Anúncios Meta', 'Criativos e público configurado'],
  bag: ['Venda online', 'Produtos, carrinho e checkout'],
  bolt: ['Rapidez', 'Pronto em até 14 dias'],
  calendar: ['Agendamento', 'Marcações direto no site'],
};
// peças usadas em cada projeto, tiradas dos detalhes reais de cada site
const WORK_PIECES = [
  ['pencil', 'bag', 'shield'],     // Dra. Cristina Sousa: menu com 6 secções, e-book de vendas, antes/depois e feedbacks
  ['globe', 'calendar', 'pencil'], // Longev Studio: multi-página, agendamento de avaliação, versão PT/EN
  ['bag', 'shield', 'chart'],      // Estúdio Tiago Pereira: programas e e-books, área de login, prova social em números
  ['cursor', 'calendar', 'chat'],  // Clínica Renascer: telefone direto no topo, agendamento, botão de WhatsApp
  ['calendar', 'chat', 'bolt'],    // Mira Way: registo em sessão, WhatsApp flutuante, prova de escassez
  ['search', 'bag', 'cursor'],     // RD Excursões: filtro por mês, catálogo, CTAs de reserva
  ['chart', 'chat', 'shield'],     // Delta Capital: simulador de crédito, WhatsApp no topo, selo Banco de Portugal
];
// peças de cada pacote (Presença, Validação Comercial, Loja Online)
const PKG = [
  ['globe', 'pencil', 'chat', 'search', 'shield'],
  ['globe', 'pencil', 'chat', 'search', 'shield', 'megaphone', 'target', 'chart', 'bolt'],
  ['globe', 'pencil', 'search', 'shield', 'bag', 'cursor'],
];
// a Solução monta um site a sério: cada peça voa para o sítio onde vive e "carimba" essa parte da página
// [peça, início, fim] em momentos do capítulo (0 a 3, um por frase)
const BUILD = [
  ['pencil', 0.06, 0.40], ['target', 0.34, 0.70],                                                      // clara e profissional
  ['cursor', 1.02, 1.28], ['chat', 1.12, 1.44], ['calendar', 1.32, 1.58], ['chart', 1.44, 1.74],     // contactos com contexto
  ['globe', 2.02, 2.26], ['shield', 2.16, 2.42], ['search', 2.32, 2.60], ['bolt', 2.48, 2.72],       // encontrado e sempre no ar
];
const BUILD_AT = Object.fromEntries(BUILD.map(([k, a, b], j) => [k, { a, b, j, beat: Math.floor(a) }]));
const PUBLISH = [2.74, 2.92];
// onde cada peça aterra e onde fica depois como marcador, em px do site desenhado (1280 × 1124)
const SITE = {
  pencil: { land: [957, 370], pin: [1236, 178] },   // grelha, menu, cores e imagem
  target: { land: [330, 320], pin: [30, 214] },     // título, subtítulo e serviços com preço
  cursor: { land: [182, 519], pin: [30, 519] },     // botões de marcação
  chat: { land: [910, 951], pin: [664, 951] },      // mensagem de WhatsApp com contexto
  calendar: { land: [352, 936], pin: [36, 800] },   // marcação online
  shield: { land: [952, 818], pin: [658, 818] },    // avaliações, SSL e cadeado
  globe: { land: [520, 35], pin: [222, 35] },       // domínio na barra do browser
  bolt: { land: [816, 219], pin: [700, 219] },      // carrega em 0,8 s
  search: { card: 'search' }, chart: { card: 'chart' }, // cartões que saltam para fora da janela
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
const tiles = ICONS.map((icon, i) => {
  const group = new THREE.Group(); group.rotation.order = 'YXZ';
  const mat = new THREE.MeshPhysicalMaterial({ color: BASES[i % 4].clone(), roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08,
    iridescence: 0.55, iridescenceIOR: 1.4, iridescenceThicknessRange: [120, 420] });
  const body = new THREE.Mesh(tileGeo, mat); body.castShadow = true; body.userData.i = i; group.add(body);
  const dmat = new THREE.MeshBasicMaterial({ map: iconTex(icon), transparent: true, toneMapped: false, depthWrite: false });
  const decal = new THREE.Mesh(decalGeo, dmat); decal.position.z = 0.1415; group.add(decal);
  scene.add(group);
  const cur = Object.fromEntries(KEYS.map(k => [k, 0])); cur.y = FLOOR_Y - 4; cur.s = 0.6;
  return { icon, group, body, mat, dmat, base: BASES[i % 4], cur, tgt: { ...cur }, rate: 3.4 + rnd() * 1.8,
    r: [rnd(), rnd(), rnd(), rnd(), rnd(), rnd()], spin: (rnd() < .5 ? -1 : 1) * (0.25 + rnd() * 0.35),
    dir: (i % 2 ? 1 : -1) * (0.7 + rnd() * 0.6), dir2: (rnd() < .5 ? -1 : 1) * (0.4 + rnd() * 0.5), lag: 0.5 + rnd() * 0.8 };
});
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
// no telemóvel o cartão do Google fica por cima do canto da janela (por cima dela não há espaço até ao menu)
const CARDS = { search: Object.assign(makeCard(2.0, 0.84), { at: innerWidth < 760 ? [1.2, 1.95, 0.42] : [1.3, 2.6, 0.42] }), chart: Object.assign(makeCard(1.5, 1.05), { at: [2.2, 0.55, 0.5] }) };
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
function sitePart(r, wire, draw, box){
  const g = pg;
  if (r < 1){ g.save(); g.globalAlpha = 1 - ease3(r); g.setLineDash([10, 8]); g.lineWidth = 2; g.strokeStyle = SC.wire; g.fillStyle = 'rgba(157,178,189,.32)'; wire(g); g.restore(); }
  if (r > 0){ const e = ease3(r); g.save(); g.globalAlpha = Math.min(1, r * 1.6); g.translate(0, (1 - e) * 14); draw(g); g.restore(); }
  const f = Math.sin(Math.PI * clamp(r, 0, 1));
  if (box && f > 0.02){ const [x, y, w, h, rad] = box; g.save(); g.globalAlpha = f * 0.85; g.strokeStyle = SC.petrol; g.lineWidth = 4; rr(g, x - 7, y - 7, w + 14, h + 14, rad + 7); g.stroke(); g.restore(); }
}
const dashBox = (g, x, y, w, h, rad) => { rr(g, x, y, w, h, rad); g.stroke(); };
const skel = (g, x, y, w, h) => { rr(g, x, y, w, h, Math.min(h / 2, 8)); g.fill(); };

function drawPage(R){
  const g = pg; g.setTransform(pageQ, 0, 0, pageQ, 0, 0); g.clearRect(0, 0, SW, SH);
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
  pageTex.needsUpdate = true;
}

// conteúdo dos dois cartões (desenhado uma vez, quando as fontes estão prontas)
function drawCards(){
  { const K = CARDS.search, g = K.cv.getContext('2d'), W = K.cv.width, H = K.cv.height; g.clearRect(0, 0, W, H);
    g.fillStyle = '#FFFFFF'; rr(g, 0, 0, W, H, 24); g.fill();
    g.fillStyle = '#F1F5F7'; rr(g, 20, 18, W - 40, 52, 26); g.fill();
    g.strokeStyle = SC.ink2; g.lineWidth = 3; g.beginPath(); g.arc(50, 42, 10, 0, 7); g.stroke(); g.beginPath(); g.moveTo(57, 49); g.lineTo(65, 57); g.stroke();
    txt(g, 'estética em leiria', 78, 44, SF(500, 22), SC.ink);
    g.fillStyle = SC.petrol; g.save(); g.translate(38, 110); g.rotate(Math.PI / 4); rr(g, -8, -8, 16, 16, 4); g.fill(); g.restore();
    txt(g, 'Studio Alma', 60, 101, SF(600, 18), SC.ink); txt(g, 'studioalma.pt', 60, 124, SF(400, 16), SC.ink2);
    g.fillStyle = SC.okBg; rr(g, W - 176, 92, 156, 32, 16); g.fill(); txt(g, '1.º resultado', W - 98, 109, SF(600, 15), SC.ok, 'center');
    txt(g, 'Estética em Leiria · Studio Alma', 20, 170, SF(600, 26), '#1A56C4');
    txt(g, 'Limpeza de pele, massagem e laser. Marca online em 30 segundos.', 20, 208, SF(400, 17), SC.ink2);
    g.fillStyle = SC.gold; for (let k = 0; k < 5; k++) star(g, 30 + k * 24, 254, 9);
    txt(g, '4,9 · 127 avaliações', 156, 255, SF(500, 16), SC.ink2);
    K.tex.needsUpdate = true; }
  { const K = CARDS.chart, g = K.cv.getContext('2d'), W = K.cv.width, H = K.cv.height; g.clearRect(0, 0, W, H);
    g.fillStyle = '#FFFFFF'; rr(g, 0, 0, W, H, 24); g.fill();
    txt(g, 'Pedidos esta semana', 26, 40, SF(500, 20), SC.ink2);
    txt(g, '23', 24, 104, SF(600, 68), SC.ink);
    g.fillStyle = SC.okBg; rr(g, 118, 88, 92, 34, 17); g.fill(); txt(g, '+38%', 164, 106, SF(600, 17), SC.ok, 'center');
    [56, 88, 70, 116, 98, 142, 170].forEach((h, k) => { g.fillStyle = k === 6 ? SC.petrol : '#CFE7EF'; rr(g, 26 + k * 78, 318 - h, 54, h, 10); g.fill();
      txt(g, 'STQQSSD'[k], 53 + k * 78, 342, SF(500, 15, 'DM Mono'), SC.ink2, 'center'); });
    g.fillStyle = SC.wa; g.beginPath(); g.arc(32, 374, 6, 0, 7); g.fill();
    txt(g, 'WhatsApp 14 · Formulário 9', 46, 375, SF(500, 17), SC.ink2);
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

/* ================= ecrãs 3D com os sites reais ================= */
const loader = new THREE.TextureLoader();
const screens = WORK.map((w, i) => {
  const g = new THREE.Group();
  const frameMat = new THREE.MeshPhysicalMaterial({ color: 0xF9FBFB, roughness: 0.35, clearcoat: 0.6, transparent: true });
  const frame = new THREE.Mesh(new RoundedBoxGeometry(4.36, 2.42, 0.08, 4, 0.08), frameMat); frame.castShadow = true; g.add(frame);
  const tex = loader.load(IMGS[w.key]); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const imgMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false });
  const img = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2 / 2.09), imgMat); img.position.set(0, -0.1, 0.042); g.add(img);
  const lc = document.createElement('canvas'); lc.width = 1024; lc.height = 52;
  const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace;
  const barMat = new THREE.MeshBasicMaterial({ map: lt, transparent: true, toneMapped: false });
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2 * 52 / 1024), barMat); bar.position.set(0, 1.04, 0.042); g.add(bar);
  g.position.set(i % 2 ? 0.55 : -0.55, 0.3, -1.8 - i * 5.4);
  g.rotation.y = i % 2 ? -0.16 : 0.16;
  scene.add(g);
  return { g, frame, mats: [frameMat, imgMat, barMat], lc, lt, w, op: 0 };
});
function drawBars(){
  screens.forEach(s => {
    const g = s.lc.getContext('2d'); g.clearRect(0, 0, 1024, 52);
    g.fillStyle = '#C5D3DA'; [0, 1, 2].forEach(k => { g.beginPath(); g.arc(18 + k * 22, 26, 7, 0, 7); g.fill(); });
    g.fillStyle = '#EEF2F3'; rr(g, 330, 8, 364, 36, 18); g.fill();
    g.fillStyle = '#4A6170'; g.font = '500 19px "DM Mono", Consolas, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(s.w.dom, 512, 27); s.lt.needsUpdate = true;
  });
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
const NODES = ['megaphone', 'globe', 'chat', 'chart'];
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
const DEBRIS_ICONS = (innerWidth < 760 ? ['chat', 'chart', 'search', 'bolt', 'globe', 'target'] : ['chat', 'chart', 'search', 'bolt', 'globe', 'target', 'cursor', 'calendar', 'bag', 'shield']);
const debris = DEBRIS_ICONS.map((icon, i) => {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const mat = new THREE.MeshPhysicalMaterial({ color: BASES[(i + 1) % 4].clone(), roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, iridescence: 0.5, iridescenceIOR: 1.4, transparent: true });
  const body = new THREE.Mesh(tileGeo, mat); body.rotation.z = Math.PI / 4; g.add(body);
  const dm = new THREE.MeshBasicMaterial({ map: iconTex(icon), transparent: true, toneMapped: false, depthWrite: false });
  const dec = new THREE.Mesh(decalGeo, dm); dec.position.z = 0.1415; g.add(dec);
  fgScene.add(g);
  // mais à direita do que à esquerda, e sempre fora da faixa central onde fica o texto centrado
  const right = i % 3 !== 0;
  return { g, mat, dm, right, rx: rnd(), y0: rnd(), d: 4.2 + rnd() * 4.2, dir: rnd() < .5 ? -1 : 1, sp: 0.3 + rnd() * 0.5 };
});
// intensidade por capítulo: mais presente onde só há texto, discreta onde há conteúdo 3D para ler
const FG_OP = [0.9, 0.9, 0.15, 0, 0.7, 0.3, 0.6]; // na Solução quase nada à frente do site a montar; no Trabalho, nada à frente dos ecrãs
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
  L.cx = L.mobile ? 0 : 2.3;
  L.cy = 0;
  L.camZ = L.mobile ? 15 : (w / h < 1.3 ? 12 : 10);
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
    case 'right': return [-2.3, 0, 1];
    case 'center': return [0, 0, 1];
    case 'bottom': return [0, 0.9, 0.78];
    case 'top': return [0, -0.8, 0.85];
    default: return [2.3, 0, 1];
  }
}
let [CX, CY, CS] = posSpec('right');
// a janela da Solução fica um pouco mais perto do centro (e do texto) do que o resto do 3D,
// e um pouco mais abaixo quando está de lado, para o cartão do Google caber por cima sem chegar ao menu
let SX = CX * 0.84, SOLY = 0;

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
// a altura das secções de detalhe (manutenção, perguntas) muda com as fontes e com as perguntas abertas
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
  if (REDUCE){ el.textContent = to + suf; return; }
  const s0 = performance.now(), dur = 900 + Math.min(600, to);
  const step = (now) => { const k = clamp((now - s0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(step); };
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
const MOSAIC = (() => { const rows = [1, 2, 3, 3, 2, 1], out = []; rows.forEach((n, r) => { for (let c = 0; c < n; c++) out.push([(c - (n - 1) / 2) * 0.98, (2.5 - r) * 0.64]); }); return out; })();
// Problema: três já estão caídos; os outros três caem um a um, um por frase (perfil, mensagens, clientes)
const PRE_FALLEN = [tileByIcon.search, tileByIcon.megaphone, tileByIcon.bolt];
const FALL1 = [tileByIcon.shield, tileByIcon.chat, tileByIcon.cursor];

// Tudo depende do progresso do scroll (p = capítulo, bf = momento), não só do tempo:
// cada pixel de scroll mexe os losangos. Nas formações arrumadas usa-se cos(π·bf), que vale 0 a meio
// de cada momento (forma perfeita para ler) e cresce nas passagens entre momentos (a forma "respira").
function formation(ch, beat, bp, p, bf, i, t, o){
  const T = tiles[i], [r1, r2, r3, r4, r5, r6] = T.r, mo = REDUCE ? 0 : 1, sc = REDUCE ? 0.3 : 1;
  const wob = Math.cos(Math.PI * bf) * sc;
  o.tint = 0; o.glow = 0; o.green = 0; o.rz = 0; o.fix = 0;
  switch (ch){
    case 0: { // órbita oval que emoldura o título centrado; com o scroll gira e deita-se num anel à volta da base dos números
      const k1 = smooth(0.42, 0.92, p), m = L.mobile;
      const th = (i / tiles.length + t * 0.008 * mo + p * 0.6 * sc) * Math.PI * 2;
      // no telemóvel a órbita é alta e estreita: passa por cima e por baixo do texto e espreita dos lados
      const RX = lerp(m ? 1.75 : 4.7, m ? 1.9 : 4.9, k1), RY = lerp(m ? 3.05 : 2.75, m ? 1.25 : 2.3, k1);
      tmpE.set(lerp(-0.22, -1.2, k1) + p * 0.15, lerp(0.12, -0.08, k1) - p * 0.15, 0); tmpM.makeRotationFromEuler(tmpE);
      tmpV.set(Math.cos(th) * RX, Math.sin(th) * RY, 0).applyMatrix4(tmpM);
      o.x = CX + tmpV.x;
      o.y = CY + lerp(0.1, m ? -0.4 : -1.15, k1) + tmpV.y + Math.sin(t * 0.8 + i) * 0.05 * mo;
      o.z = tmpV.z - 0.3;
      o.rx = -0.12 + p * 1.1 * T.dir2 * sc;
      o.ry = 0.3 * Math.sin(th) + p * Math.PI * 1.15 * T.dir * sc + Math.sin(t * 0.5 + i) * 0.06 * mo;
      o.dia = 1; o.s = lerp(m ? 0.72 : 0.84, m ? 0.8 : 0.95, k1);
      return;
    }
    case 1: { // ruído: espalhados pelo ecrã todo (alguns perto da câmara), sem cor, a rodar com o scroll
      const fk = FALL1.indexOf(i);
      if (PRE_FALLEN.includes(i) || (fk >= 0 && fk < FALL_N)){
        // no chão e sem cor; os que caem com as frases ficam alinhados à frente, bem à vista
        o.x = fk >= 0 ? CX * 0.4 + (fk - 1) * (L.mobile ? 1.15 : 2.2) : CX * 0.6 + (r1 - .5) * L.spreadX;
        o.y = FLOOR_Y + 0.14; o.z = fk >= 0 ? 1.5 : (r2 - .5) * 3 + 0.6;
        o.rx = -Math.PI / 2; o.ry = (r4 - .5) * 3 + p * 0.8 * T.dir; o.dia = r5 > .5 ? 1 : 0; o.s = fk >= 0 ? 0.95 : 0.82; o.tint = 0.92; return;
      }
      if (L.mobile){ // telemóvel: em duas faixas, por cima e por baixo do texto centrado
        const up = i % 2 === 0;
        o.x = (r1 - .5) * 3.6; o.y = (up ? 1.9 + r2 * 1.4 : -2.2 - r2 * 0.5) + p * (r6 - 0.3) * 0.6 + Math.sin(t * 0.6 + i) * 0.08 * mo;
        o.z = up ? -1.5 + r3 * 2.5 : 0.8 + r3 * 2.2;
      } else {
        o.x = CX * 0.45 + (r1 - .5) * L.spreadX * 2; o.y = -0.7 + r2 * 3.4 + p * (r6 - 0.3) * 1.2 + Math.sin(t * 0.6 + i) * 0.08 * mo;
        o.z = -2.6 + r3 * 5.6;
      }
      // ângulos limitados (sem voltas acumuladas), mas sempre a mexer com o scroll
      o.rx = (r4 - .5) * 2.4 + p * 2.2 * T.dir * sc + Math.sin(t * T.spin + i) * 0.5 * mo;
      o.ry = (r5 - .5) * 2.4 + p * 2.6 * T.dir2 * sc + Math.cos(t * T.spin * 0.8 + i) * 0.5 * mo;
      o.dia = r6 > .5 ? 1 : 0; o.s = 0.8; o.tint = 0.85 - p * 0.2;
      if (fk >= 0){ o.tint = 0; o.s = 0.95; } // ainda no ar e com cor: é este que vai cair
      return;
    }
    case 2: { // a montagem: as peças esperam à volta da janela vazia e, uma a uma, voam para o seu sítio no site e "carimbam" essa parte
      const m = L.mobile ? 0.62 : 0.76;
      if (T.icon === 'megaphone' || T.icon === 'bag'){ // anúncios e loja não fazem parte deste site: recolhem-se e desaparecem
        o.x = CX; o.y = 0.2 + CY; o.z = -0.4; o.rx = 0; o.ry = 0; o.dia = 1; o.s = 0.0001; o.tint = 0.6; return;
      }
      const B = BUILD_AT[T.icon], S = SPOT[T.icon], u = (bf - B.a) / (B.b - B.a);
      // voa até à frente do seu sítio, encosta à página (o conteúdo aparece por baixo) e encolhe para marcador no canto
      const a = smooth(0, 0.4, u), b = smooth(0.36, 0.6, u), c = smooth(0.62, 0.95, u);
      const th = (B.j / BUILD.length + t * 0.006 * mo + p * 0.3 * sc) * Math.PI * 2; // anel de espera, gira devagar e com o scroll
      const wx = Math.cos(th) * (L.mobile ? 2.3 : 3.05), wy = PYC + Math.sin(th) * (L.mobile ? 2.35 : 2.65), wz = 0.75 + Math.sin(th * 2 + 1) * 0.25;
      const [lx, ly, lz] = S.land, [qx, qy, qz] = S.pin;
      const x = lerp(lerp(wx, lx, a), qx, c), y = lerp(lerp(wy, ly, a), qy, c);
      const z = lerp(lerp(wz, lz + 1.0, a), lz + 0.24, b) + (qz - lz) * c;
      tmpE.set(SOLR.x, SOLR.y, 0); tmpM.makeRotationFromEuler(tmpE);
      tmpV.set(x * m, y * m, z * m).applyMatrix4(tmpM);
      o.x = SX + tmpV.x * CS; o.y = 0.2 + CY + SOLY + tmpV.y * CS; o.z = tmpV.z * CS;
      const wait = (1 - a) * mo;
      o.rx = SOLR.x + Math.sin(t * 0.7 + B.j) * 0.35 * wait;
      o.ry = SOLR.y + (Math.cos(t * 0.5 + B.j * 1.3) * 0.45 + p * 1.2 * T.dir * sc) * wait;
      o.dia = lerp(1 - a, 1, c);
      o.s = lerp(lerp(lerp(0.4, 0.82, a), 0.62, b), 0.26, c) * m * CS;
      o.fix = a; // presa à página: não recua com o foco nem balança com a inércia
      const now = B.beat === beat && u > 0; // a peça do momento actual acende; as anteriores ficam calmas no seu canto
      o.tint = a > 0.02 ? (now ? 0 : 0.12) : 0.4; o.glow = now ? 1 : 0; o.green = now && T.icon === 'chat' ? 1 : 0;
      return;
    }
    case 3: { // as peças usadas em cada site sobem e ficam sob o ecrã; as outras aterram no corredor
      const wk = (WORK_PIECES[Math.min(WORK.length - 1, beat)] || []).indexOf(T.icon);
      if (wk >= 0){
        const S = screens[Math.min(screens.length - 1, beat)].g.position;
        o.x = S.x + (wk - 1) * (L.mobile ? 0.7 : 0.8); o.y = L.mobile ? (lag.mpos === 'low' ? -0.62 : 1.12) : -1.05; o.z = S.z + 0.55; // no telemóvel ficam entre o ecrã e o texto
        o.rx = L.mobile ? 0.15 : -0.18; o.ry = Math.sin(t * 0.9 + wk) * 0.12 * mo; o.dia = 1; o.s = L.mobile ? 0.38 : 0.52;
        o.tint = 0; o.glow = 1; o.green = T.icon === 'chat' ? 1 : 0;
        return;
      }
      const side = i % 2 ? 1 : -1;
      const lift = Math.max(0, Math.sin(i * 1.3 - bf * Math.PI * 0.9)) * 0.2 * sc;
      o.x = side * (3.9 + (i % 3) * 0.45) * (L.mobile ? 0.62 : 1); o.y = FLOOR_Y + 0.14 + lift; o.z = -0.4 - i * 2.4;
      o.rx = -Math.PI / 2 + lift * 0.9; o.ry = r4 * 1.2 - 0.6 + bf * 0.35 * T.dir * sc; o.dia = 1; o.s = 0.78; o.tint = 0.15;
      return;
    }
    case 4: { // noite: nós de um percurso, deitados no chão
      const k = NODES.indexOf(T.icon);
      if (k >= 0){
        const P = NODE_POS[k], on = k <= beat, now = k === beat;
        o.x = P.x; o.z = P.z; o.y = FLOOR_Y + 0.2 + (now ? 0.45 + Math.sin(t * 2) * 0.05 * mo : 0) + wob * 0.12;
        o.rx = -Math.PI / 2 + (now ? 0.45 : 0.15); o.ry = wob * 0.4 * T.dir; o.dia = 1; o.s = (L.mobile ? 0.72 : 1) * (now ? 1.15 : 0.95);
        o.tint = on ? 0 : 0.55; o.glow = on ? 1 : 0; o.green = T.icon === 'chat' && on ? 1 : 0;
        return;
      }
      o.x = L.x4 + (r1 - .5) * (L.mobile ? 4.5 : 9); o.z = (r2 - .5) * 6 - 1.5; o.y = FLOOR_Y + 0.12 + Math.max(0, Math.sin(i + p * 6)) * 0.25 * sc;
      o.rx = -Math.PI / 2; o.ry = (r3 - .5) * 3 + p * 1.5 * T.dir * sc; o.dia = 1; o.s = 0.45; o.tint = 0.6;
      return;
    }
    case 5: { // pacotes: a órbita recua para o fundo; o protagonismo é das peças de cada pacote, por cima dos cartões
      const a = i / tiles.length * Math.PI * 2 + t * 0.04 * mo + p * 1.6 * sc, R = L.mobile ? 3.2 : 7.5;
      o.x = Math.cos(a) * R; o.y = (L.mobile ? -1.6 : 0.4) + Math.sin(a * 2) * 0.35; o.z = Math.sin(a) * 2.6 - 9;
      o.rx = 0.1 + p * 0.8 * T.dir2 * sc; o.ry = -a + Math.PI / 2; o.dia = 1; o.s = 0.72; o.tint = 0.5;
      return;
    }
    default: { // final: chegam espalhados à volta e montam o mosaico da marca à medida que desces
      const [mx, my] = MOSAIC[i], asm = smooth(0, 0.6, p);
      tmpE.set(0.05, -0.22 + Math.sin(t * 0.35) * 0.08 * mo, 0); tmpM.makeRotationFromEuler(tmpE);
      const k = L.mobile ? 0.7 : 1;
      tmpV.set(mx * k, my * k, 0).applyMatrix4(tmpM);
      const sa = i / tiles.length * Math.PI * 2 + p * 2 * sc, sr = L.mobile ? 2.2 : 4.4;
      o.x = lerp(CX * 0.5 + Math.cos(sa) * sr, CX + tmpV.x * CS, asm);
      o.y = lerp(0.4 + CY * 0.5 + Math.sin(sa) * (L.mobile ? 2 : 2.6), 0.3 + CY * 0.72 + tmpV.y * CS, asm) + Math.sin(t * 0.9 + i * 0.6) * 0.04 * mo;
      o.z = lerp(((i % 3) - 1) * 1.6, tmpV.z, asm);
      o.rx = lerp(r4 * 2 - 1 + p * 2 * T.dir2, 0.05, asm); o.ry = lerp(i * 0.8 + p * 3 * T.dir, -0.22, asm);
      o.dia = 1; o.s = 0.66 * k * CS; o.glow = T.icon === 'chat' ? asm : 0; o.green = T.icon === 'chat' ? asm : 0;
    }
  }
}

/* câmara por capítulo */
const camPos = new THREE.Vector3(0, 0.5, 10), camLook = new THREE.Vector3(), camPosT = new THREE.Vector3(), camLookT = new THREE.Vector3();
// a câmara também é coreografada pelo scroll: orbita, sobe e aproxima-se dentro de cada capítulo
function cameraTarget(ch, beat, bp, p){
  const Z = L.camZ, sc = REDUCE ? 0.3 : 1, LY = L.mobile ? MLY : 0;
  switch (ch){
    case 0: { const k1 = smooth(0.42, 0.92, p); camPosT.set(Math.sin(p * 0.6 - 0.1) * 2.2 * sc, 0.3 + p * 0.45, Z - p * 0.5 + k1 * 1.1); camLookT.set(0, LY + k1 * 0.1, 0); break; }
    case 1: camPosT.set(Math.sin(p * 0.9 - 0.45) * 2.6 * sc, 1.1 + p * 0.7, Z + 0.4 - p * 0.6); camLookT.set(CX * 0.25, LY - 0.2, 0); break;
    case 2: camPosT.set(Math.sin(p * 0.7 - 0.35) * 1.6 * sc, 0.5 + p * 0.3, Z - 0.6); camLookT.set(0, LY + 0.1, 0); break;
    case 3: {
      const n = screens.length, k = Math.min(n - 1, beat), next = Math.min(n - 1, beat + 1);
      const f = beat < n - 1 ? smooth(0.62, 1, bp) : 0;
      const A = screens[k].g.position, B = screens[next].g.position;
      const sx = lerp(A.x, B.x, f), sz = lerp(A.z, B.z, f);
      if (L.mobile){ camPosT.set(sx, 0.7, sz + 8.4); camLookT.set(sx, 0.3 + MLY * 0.55, sz); } // ecrã por cima ou por baixo do texto, alternando
      else { const sd = CX / 2.3; camPosT.set(sx - 0.3 * sd, 0.7, sz + 7.2); camLookT.set(sx - 1.1 * sd, 0.25, sz); } // ecrã do lado oposto ao texto, os dois perto do centro
      break;
    }
    case 4: { // vista de cima que orbita à volta do percurso; no desktop o percurso fica à direita do texto
      const a = (p - 0.5) * 0.8 * sc, ox = L.mobile ? 0 : -0.3, oz = L.mobile ? 9.9 : 8.0;
      if (L.mobile) camLookT.set(0, FLOOR_Y + 1.7, -0.4); else camLookT.set(L.x4 - 1.9 * (CX / 2.3), FLOOR_Y, -0.4 + CY * 1.8);
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

  // foco no texto: com o texto completo no ecrã, o 3D recua, perde um pouco de cor e de energia;
  // nas passagens entre momentos volta a ter tudo. O losango activo nunca acalma.
  const focusT = FOCUS_ON ? (state.first ? 1 : smooth(0.12, 0.32, state.lp)) * (1 - smooth(0.78, 0.96, state.lp)) : 0;
  RF += (focusT - RF) * damp(dt, 3);

  // o 3D desliza para o lado oposto ao texto activo
  const [cxT, cyT, csT] = posSpec(lag.pos), kp = damp(dt, REDUCE ? 6 : 2.4);
  CX += (cxT - CX) * kp; CY += (cyT - CY) * kp; CS += (csT - CS) * kp;
  SX = CX * 0.84; SOLY = L.mobile ? 0 : -0.3 * smooth(0.5, 2, Math.abs(CX));
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
    SOLR.y = (L.mobile ? 0 : -0.42 * (CX / 2.3) + (p - 0.5) * 0.25) + w2 * 0.18; SOLR.x = w2 * 0.08 - smooth(0.3, 1, CY) * 0.12; }

  // passar o rato por cima de uma peça: levanta-se e mostra o nome
  hovered = -1;
  let hoverIcon = '';
  if (mouse.in){
    ndc.set(mouse.nx, mouse.ny); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pkgOp > 0.5 ? bodies.concat(pkgBodies) : bodies, false)[0];
    if (hit){ if (hit.object.userData.icon) hoverIcon = hit.object.userData.icon; else { hovered = hit.object.userData.i; hoverIcon = tiles[hovered].icon; } }
  }
  showTip(hoverIcon);

  // losangos
  tiles.forEach((T, i) => {
    formation(cur, beatL, bp, p, bf, i, t, T.tgt);
    T.tgt.h = i === hovered ? 1 : 0;
    const k = damp(dt, T.rate * (REDUCE ? 3 : 1));
    for (const key of KEYS) T.cur[key] += (T.tgt[key] - T.cur[key]) * k;
    const c = T.cur;
    const free = 1 - clamp(c.fix, 0, 1), calm = RF * (1 - clamp(c.glow, 0, 1)) * free, en = ENERGY * (1 - 0.5 * RF) * (1 - 0.75 * clamp(c.fix, 0, 1));
    // por cima da forma: ficam ligeiramente para trás do scroll e inclinam-se com a energia; em leitura recuam um pouco
    T.group.position.set(c.x, c.y + c.h * 0.18 + VEL * 0.22 * T.lag * free, c.z - calm * 0.55);
    T.group.rotation.set(c.rx + en * 0.3 * T.dir2, c.ry + c.h * 0.55 + en * 0.65 * T.dir, 0);
    T.group.scale.setScalar(Math.max(0.001, c.s * (1 + c.h * 0.12) * (1 - calm * 0.1)));
    T.body.rotation.z = c.dia * Math.PI / 4;
    T.mat.color.copy(T.base).lerp(GRAY, clamp(c.tint + calm * 0.22, 0, 1)).lerp(STRONG_C, clamp(c.glow, 0, 1)).lerp(GREEN_C, clamp(c.green, 0, 1) * 0.75);
    T.mat.emissive.copy(c.green > 0.5 ? GREEN_C : GLOW_C).multiplyScalar(clamp(c.glow, 0, 1) * 0.45 + nightAmt * 0.12 + c.h * 0.2);
    T.dmat.opacity = 1 - clamp(c.tint, 0, 1) * 0.35;
  });

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
    if (key !== pageKey){ pageKey = key; drawPage(R); }
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

  const covered = worldCovered();
  if (covered !== worldHidden){ worldHidden = covered; canvas.style.visibility = fgCanvas.style.visibility = covered ? 'hidden' : ''; }
  // o indicador de capítulo sai enquanto as secções de detalhe ocupam o meio do ecrã
  const ir = infoEl.getBoundingClientRect(), hudOff = ir.top < innerHeight * 0.6 && ir.bottom > innerHeight * 0.4;
  if (hudOff !== hudHidden){ hudHidden = hudOff; hudEl.style.visibility = hudOff ? 'hidden' : ''; }
  if (covered) return;
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
const infoEl = ROOT.querySelector('.info'), hudEl = ROOT.querySelector('.hud'), lastChapterEl = chapters[chapters.length - 1].el;
let worldHidden = false, hudHidden = false;
function worldCovered(){
  const a = infoEl?.getBoundingClientRect();
  if (a && a.top <= 0 && a.bottom >= innerHeight) return true;
  return lastChapterEl.getBoundingClientRect().bottom <= 0;
}
const infoIO = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting){ e.target.classList.add('is-in'); infoIO.unobserve(e.target); } }), { threshold: 0.15 });
ROOT.querySelectorAll('.info-block').forEach((el) => infoIO.observe(el));
drawBars(); drawCards();
document.fonts?.ready.then(() => { drawBars(); drawCards(); pageKey = ''; });
renderer.setAnimationLoop(frame);
// o mundo 3D entra com fade depois do primeiro frame (o texto já está à vista)
requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('sv2').classList.add('ready3d')));
