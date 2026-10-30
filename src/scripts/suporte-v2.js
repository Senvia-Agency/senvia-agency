import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';

/* Suporte remoto: um computador em 3D a receber ajuda. Cada paragem é um passo e o ecrã mostra-o a acontecer:
   o download, a instalação, a sessão remota com o cursor da SENVIA e o painel de segurança.
   O ecrã segue o sistema escolhido no download (Windows, macOS ou Linux), através do evento support:os. */

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
const C = { ink: '#0B1F2A', ink2: '#4A6170', petrol: '#0E86A8', petrolD: '#00708F', navy: '#0B1F2A', line: '#E3E8EA', green: '#1FAF5B', red: '#E5484D', amber: '#F2B53A' };
const UI = (w, s) => `${w} ${s}px Inter, "Segoe UI", system-ui, sans-serif`;
const MONO = (s, w = 500) => `${w} ${s}px "DM Mono", ui-monospace, Consolas, monospace`;

/* ================= motor ================= */
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
const MOBILE0 = innerWidth < 760;
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE0 ? 1.75 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const ANISO = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEF2F3);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.5;
const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.3, 120);
scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xC8D2D6, 1.25));
const sun = new THREE.DirectionalLight(0xFFF6EA, 2.3);
sun.position.set(-5, 9, 7); sun.castShadow = true;
sun.shadow.mapSize.set(MOBILE0 ? 1024 : 2048, MOBILE0 ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);

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
function logoMark(c, x, y, s, col){
  c.fillStyle = col;
  [[0, 0, 1], [1.5, -1.33, 0.67], [1.5, 1.33, 0.67]].forEach(([dx, dy, k]) => {
    c.save(); c.translate(x + dx * s, y + dy * s); c.rotate(Math.PI / 4); rr(c, -s * k, -s * k, s * k * 2, s * k * 2, s * k * 0.3); c.fill(); c.restore();
  });
}
function rrShape(w, h, r){
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function slab(w, d, t, r, bevel = 0){
  const g = new THREE.ExtrudeGeometry(rrShape(w - bevel * 2, d - bevel * 2, Math.max(0.001, r - bevel)), {
    depth: Math.max(0.0005, t - bevel * 2), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
  g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0);
  return g;
}
const mesh = (geo, mat, y = 0) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; return m; };

/* ================= a secretária ================= */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.14 }));
ground.position.y = -0.9; ground.receiveShadow = true; scene.add(ground);
const desk = mesh(slab(9.5, 4.6, 0.22, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0xF6F8F9, roughness: 0.55 }), -0.22);
desk.position.z = 0.1; desk.receiveShadow = true; desk.castShadow = true; scene.add(desk);

const OBJS = [];
function addObj(o){
  o.root.position.copy(o.pos); o.root.rotation.set(o.tilt || 0, o.yaw || 0, 0, 'YXZ'); o.q0 = o.root.quaternion.clone();
  o.lift = 0; o.hov = 0; o.wob = 0; o.stop ??= -1;
  o.root.traverse((m) => { if (m.isMesh){ m.castShadow = !m.userData.noShadow; m.receiveShadow = true; m.userData.obj = o; } });
  scene.add(o.root); OBJS.push(o); return o;
}

/* ================= o ecrã: cada passo desenhado em canvas ================= */
const SW = 1280, SH = 784;
const SCR = mkCv(SW, SH), PREV = mkCv(SW, SH);
let os = 'windows', fileName = 'SENVIA-suporte.exe', dirty = true;
function setOs(key, file){ os = key.startsWith('mac') ? 'macos' : key.startsWith('linux') ? 'linux' : 'windows'; fileName = file || fileName; dirty = true; }
document.addEventListener('support:os', (e) => setOs(e.detail.key, e.detail.filename));
const sel0 = document.getElementById('support-system'); if (sel0) setOs(sel0.value);

// fundo do ambiente de trabalho e a barra do sistema
function desktop(c){
  const g = c.createLinearGradient(0, 0, SW, SH); g.addColorStop(0, '#CFEAF2'); g.addColorStop(0.55, '#7CC3D6'); g.addColorStop(1, '#2C7F98');
  c.fillStyle = g; c.fillRect(0, 0, SW, SH);
  c.globalAlpha = 0.12; logoMark(c, 880, 420, 120, '#FFFFFF'); c.globalAlpha = 1;
  // ícone do SENVIA Suporte no ambiente de trabalho
  const ix = os === 'macos' ? SW - 120 : 40, iy = os === 'linux' ? 70 : 48;
  fillRR(c, ix + 14, iy, 72, 72, 18, C.navy); logoMark(c, ix + 40, iy + 36, 9, '#2BDBFF');
  txt(c, 'SENVIA', ix + 50, iy + 92, UI(600, 15), '#FFFFFF', 'center'); txt(c, 'Suporte', ix + 50, iy + 112, UI(600, 15), '#FFFFFF', 'center');
  if (os === 'windows'){
    c.fillStyle = 'rgba(243,245,247,.92)'; c.fillRect(0, SH - 56, SW, 56);
    const icons = [C.petrol, '#F2B53A', '#7C3AED', '#1FAF5B', C.navy];
    [-2, -1, 0, 1, 2].forEach((k, j) => { const x = SW / 2 + k * 56; if (j === 0){ [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => fillRR(c, x - 15 + a * 16, SH - 43 + b * 16, 14, 14, 2, '#0E86A8')); } else fillRR(c, x - 17, SH - 45, 34, 34, 8, icons[j]); });
    txt(c, '10:24', SW - 40, SH - 36, UI(500, 15), C.ink, 'right'); txt(c, '30/10/2026', SW - 40, SH - 17, UI(500, 13), C.ink2, 'right');
  } else if (os === 'macos'){
    c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(0, 0, SW, 30);
    c.beginPath(); c.arc(26, 15, 7, 0, Math.PI * 2); c.fillStyle = C.ink; c.fill();
    ['Finder', 'Ficheiro', 'Editar', 'Ver', 'Janela'].forEach((s, k) => txt(c, s, 52 + k * 82, 15, UI(k ? 500 : 700, 15), C.ink));
    txt(c, 'Qui 10:24', SW - 20, 15, UI(500, 15), C.ink, 'right');
    fillRR(c, SW / 2 - 230, SH - 86, 460, 74, 22, 'rgba(255,255,255,.55)');
    [C.petrol, '#F2B53A', '#7C3AED', '#1FAF5B', '#E5484D', C.navy].forEach((col, k) => fillRR(c, SW / 2 - 200 + k * 68, SH - 76, 54, 54, 14, col));
  } else {
    c.fillStyle = '#1F2933'; c.fillRect(0, 0, SW, 34);
    txt(c, 'Atividades', 20, 17, UI(600, 15), '#FFFFFF'); txt(c, 'qui 10:24', SW / 2, 17, UI(600, 15), '#FFFFFF', 'center');
    fillRR(c, 10, 120, 70, 380, 20, 'rgba(31,41,51,.85)');
    [C.petrol, '#F2B53A', '#7C3AED', '#1FAF5B', '#E5484D'].forEach((col, k) => fillRR(c, 22, 136 + k * 70, 46, 46, 12, col));
  }
}
// janela genérica, com os botões no sítio certo para cada sistema
function win(c, x, y, w, h, title){
  c.save(); c.shadowColor = 'rgba(11,31,42,.28)'; c.shadowBlur = 40; c.shadowOffsetY = 14; fillRR(c, x, y, w, h, 14, '#FFFFFF'); c.restore();
  fillRR(c, x, y, w, 44, 14, '#F2F5F6'); c.fillStyle = '#F2F5F6'; c.fillRect(x, y + 30, w, 14);
  if (os === 'macos'){ ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, k) => { c.beginPath(); c.arc(x + 24 + k * 22, y + 22, 7, 0, Math.PI * 2); c.fillStyle = col; c.fill(); }); txt(c, title, x + w / 2, y + 22, UI(600, 15), C.ink, 'center'); }
  else { txt(c, title, x + 20, y + 22, UI(600, 15), C.ink); ['–', '□', '×'].forEach((s, k) => txt(c, s, x + w - 92 + k * 32, y + 22, UI(500, 18), C.ink2, 'center')); }
}
function bar(c, x, y, w, k, col = C.petrol){ fillRR(c, x, y, w, 10, 5, '#E3E9EC'); if (k > 0) fillRR(c, x, y, Math.max(10, w * k), 10, 5, col); }
function check(c, x, y, s, col = C.green){ c.beginPath(); c.arc(x, y, s, 0, Math.PI * 2); c.fillStyle = col; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = s * 0.22; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x - s * 0.42, y); c.lineTo(x - s * 0.1, y + s * 0.32); c.lineTo(x + s * 0.45, y - s * 0.32); c.stroke(); }
// cursor: o teu (preto) ou o da SENVIA (petróleo, com etiqueta)
function cursor(c, x, y, senvia){
  c.save(); c.translate(x, y); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 30); c.lineTo(8, 23); c.lineTo(14, 36); c.lineTo(20, 33); c.lineTo(14, 21); c.lineTo(24, 21); c.closePath();
  c.fillStyle = senvia ? C.petrol : C.ink; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.stroke(); c.restore();
  if (senvia){ fillRR(c, x + 22, y + 30, 92, 30, 15, C.petrol); txt(c, 'SENVIA', x + 68, y + 46, UI(700, 14), '#fff', 'center'); }
}
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
// caminho do cursor por pontos-chave [tempo, x, y]
function path(keys, t){ for (let i = 1; i < keys.length; i++){ if (t <= keys[i][0]){ const [t0, x0, y0] = keys[i - 1], [t1, x1, y1] = keys[i], k = ease((t - t0) / (t1 - t0)); return [lerp(x0, x1, k), lerp(y0, y1, k)]; } } const l = keys[keys.length - 1]; return [l[1], l[2]]; }

const STEPS = [
  // 0: o ambiente de trabalho, com um aviso a dizer que a ajuda está a um clique
  (c, t) => {
    desktop(c);
    const k = ease(t / 0.8), y = (os === 'windows' ? SH - 220 : SH - 250) + (1 - k) * 30;
    c.globalAlpha = k; c.save(); c.shadowColor = 'rgba(11,31,42,.25)'; c.shadowBlur = 30; fillRR(c, SW - 440, y, 400, 140, 18, '#FFFFFF'); c.restore();
    fillRR(c, SW - 418, y + 22, 56, 56, 14, C.navy); logoMark(c, SW - 398, y + 50, 7, '#2BDBFF');
    txt(c, 'Precisas de ajuda?', SW - 344, y + 40, UI(700, 19), C.ink); txt(c, 'A SENVIA está a um clique.', SW - 344, y + 66, UI(500, 16), C.ink2);
    fillRR(c, SW - 344, y + 92, 150, 34, 17, C.petrol); txt(c, 'Abrir', SW - 269, y + 109, UI(600, 15), '#fff', 'center'); c.globalAlpha = 1;
  },
  // 1: o browser a descarregar o instalador
  (c, t) => {
    desktop(c);
    const x = 120, y = os === 'macos' ? 70 : os === 'linux' ? 74 : 40, w = SW - 240, h = SH - (os === 'windows' ? 150 : 190);
    c.save(); c.shadowColor = 'rgba(11,31,42,.28)'; c.shadowBlur = 40; fillRR(c, x, y, w, h, 14, '#FFFFFF'); c.restore();
    fillRR(c, x, y, w, 52, 14, '#ECF0F2'); c.fillStyle = '#ECF0F2'; c.fillRect(x, y + 38, w, 14);
    fillRR(c, x + 150, y + 12, 520, 30, 15, '#FFFFFF'); txt(c, 'senvia.pt/suporte', x + 176, y + 27, UI(500, 15), C.ink2);
    logoMark(c, x + 60, y + 110, 9, C.petrol); txt(c, 'SENVIA', x + 84, y + 110, UI(800, 22), C.ink);
    txt(c, 'Suporte remoto', x + 60, y + 190, MONO(15), C.petrol);
    c.font = UI(800, 46); c.fillStyle = C.ink; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText('A ajuda chega', x + 58, y + 250); c.fillText('ao teu computador.', x + 58, y + 304);
    fillRR(c, x + 60, y + 340, 300, 56, 14, C.ink); txt(c, 'Descarregar', x + 210, y + 368, UI(600, 18), '#fff', 'center');
    // painel de downloads
    const k = clamp((t - 0.5) / 2.4), done = k >= 1, px = x + w - 430, py = y + 62;
    c.save(); c.shadowColor = 'rgba(11,31,42,.22)'; c.shadowBlur = 30; fillRR(c, px, py, 410, 150, 14, '#FFFFFF'); c.restore();
    txt(c, 'Transferências', px + 22, py + 30, UI(700, 16), C.ink);
    fillRR(c, px + 22, py + 56, 48, 60, 8, '#EAF4F7'); txt(c, os === 'windows' ? 'EXE' : os === 'macos' ? 'ZIP' : 'TAR', px + 46, py + 86, MONO(13, 600), C.petrol, 'center');
    txt(c, fileName, px + 86, py + 70, UI(600, 16), C.ink, 'left', 300);
    if (done){ check(c, px + 96, py + 102, 10); txt(c, 'Concluído · Abrir ficheiro', px + 114, py + 102, UI(500, 14), C.green); }
    else { bar(c, px + 86, py + 94, 290, k); txt(c, `${Math.round(k * 100)}%`, px + 86, py + 124, UI(500, 13), C.ink2); }
    if (t > 0.1) { const [cx, cy] = path([[0, 760, 600], [0.5, x + 300, y + 372], [3.3, x + 300, y + 372], [4.2, px + 250, py + 102]], t); cursor(c, cx, cy, false); }
  },
  // 2: o instalador: confirmar e instalar
  (c, t) => {
    desktop(c);
    const w = 620, h = 360, x = (SW - w) / 2, y = (SH - h) / 2 - 20;
    win(c, x, y, w, h, 'Instalar SENVIA Suporte');
    fillRR(c, x + 40, y + 84, 72, 72, 18, C.navy); logoMark(c, x + 66, y + 120, 9, '#2BDBFF');
    txt(c, 'SENVIA Suporte', x + 134, y + 106, UI(700, 24), C.ink); txt(c, 'Assistência remota da SENVIA', x + 134, y + 138, UI(500, 16), C.ink2);
    const ask = t < 1.6, k = clamp((t - 1.8) / 2.6);
    if (k >= 1){ check(c, x + 58, y + 222, 16); txt(c, 'Instalado. Já podes falar connosco.', x + 88, y + 222, UI(600, 18), C.ink); }
    else { txt(c, k > 0 ? 'A instalar…' : 'Pronto para instalar neste computador.', x + 40, y + 210, UI(500, 17), C.ink2); bar(c, x + 40, y + 236, w - 80, k); }
    fillRR(c, x + w - 180, y + h - 70, 140, 44, 10, k >= 1 ? C.ink : C.petrol); txt(c, k >= 1 ? 'Concluir' : 'Instalar', x + w - 110, y + h - 48, UI(600, 16), '#fff', 'center');
    if (ask){
      // pedido de confirmação do sistema
      c.fillStyle = 'rgba(11,31,42,.35)'; c.fillRect(0, 0, SW, SH);
      const aw = 460, ah = 210, ax = (SW - aw) / 2, ay = (SH - ah) / 2;
      c.save(); c.shadowColor = 'rgba(11,31,42,.35)'; c.shadowBlur = 40; fillRR(c, ax, ay, aw, ah, 16, '#FFFFFF'); c.restore();
      txt(c, 'Permitir a instalação?', ax + 30, ay + 46, UI(700, 21), C.ink);
      txt(c, 'SENVIA Suporte · editor verificado', ax + 30, ay + 82, UI(500, 16), C.ink2);
      fillRR(c, ax + aw - 250, ay + ah - 70, 100, 44, 10, '#ECF0F2'); txt(c, 'Não', ax + aw - 200, ay + ah - 48, UI(600, 16), C.ink, 'center');
      fillRR(c, ax + aw - 136, ay + ah - 70, 106, 44, 10, C.petrol); txt(c, 'Sim', ax + aw - 83, ay + ah - 48, UI(600, 16), '#fff', 'center');
      const [cx, cy] = path([[0, 380, 640], [1.1, ax + aw - 86, ay + ah - 46], [1.6, ax + aw - 86, ay + ah - 46]], t); cursor(c, cx, cy, false);
    } else { const [cx, cy] = path([[0, (SW + 460) / 2 - 86, (SH + 210) / 2 - 46], [1.0, x + w - 110, y + h - 48]], t - 1.6); cursor(c, cx, cy, false); }
  },
  // 3: sessão remota: o cursor da SENVIA resolve o problema
  (c, t) => {
    desktop(c);
    const w = 640, h = 380, x = 170, y = os === 'windows' ? 110 : 130;
    win(c, x, y, w, h, 'Impressora do escritório');
    const fixed = t > 4.2;
    fillRR(c, x + 40, y + 80, 92, 92, 18, '#EAF4F7');
    c.strokeStyle = C.petrol; c.lineWidth = 6; strokeRR(c, x + 60, y + 112, 52, 34, 6, C.petrol, 5); fillRR(c, x + 70, y + 96, 32, 18, 3, C.petrol); fillRR(c, x + 70, y + 140, 32, 20, 3, '#fff'); strokeRR(c, x + 70, y + 140, 32, 20, 3, C.petrol, 4);
    txt(c, 'Estado', x + 160, y + 100, UI(500, 16), C.ink2);
    if (fixed){ check(c, x + 172, y + 136, 13); txt(c, 'A funcionar', x + 194, y + 136, UI(700, 22), C.green); }
    else { c.beginPath(); c.arc(x + 172, y + 136, 13, 0, Math.PI * 2); c.fillStyle = C.red; c.fill(); txt(c, '!', x + 172, y + 137, UI(800, 18), '#fff', 'center'); txt(c, 'Sem ligação', x + 194, y + 136, UI(700, 22), C.red); }
    [['Fila de impressão', fixed ? '0 documentos' : '3 documentos'], ['Rede', fixed ? 'Ligada' : 'Desligada']].forEach(([a, b], k) => { txt(c, a, x + 40, y + 222 + k * 44, UI(500, 17), C.ink2); txt(c, b, x + w - 40, y + 222 + k * 44, UI(600, 17), C.ink, 'right'); });
    const press = t > 3.5 && t < 4.2;
    fillRR(c, x + w - 210, y + h - 72, 170, 46, 10, fixed ? '#ECF0F2' : press ? C.petrolD : C.petrol); txt(c, fixed ? 'Resolvido' : 'Resolver', x + w - 125, y + h - 49, UI(600, 16), fixed ? C.ink2 : '#fff', 'center');
    // barra da sessão remota (sempre visível durante o acesso)
    const bw = 470, bx = (SW - bw) / 2, by = os === 'windows' ? 14 : 44;
    fillRR(c, bx, by, bw, 46, 23, C.navy); c.beginPath(); c.arc(bx + 26, by + 23, 7, 0, Math.PI * 2); c.fillStyle = (Math.floor(t * 2) % 2) ? '#FF6B6B' : C.red; c.fill();
    txt(c, 'Sessão remota · SENVIA ligada', bx + 44, by + 23, UI(600, 16), '#fff');
    fillRR(c, bx + bw - 110, by + 8, 98, 30, 15, 'rgba(255,255,255,.14)'); txt(c, 'Terminar', bx + bw - 61, by + 23, UI(600, 14), '#fff', 'center');
    if (fixed){ const k = ease((t - 4.4) / 0.6); c.globalAlpha = k; c.save(); c.shadowColor = 'rgba(11,31,42,.25)'; c.shadowBlur = 30; fillRR(c, SW - 420, SH - 230 + (1 - k) * 20, 380, 96, 16, '#fff'); c.restore();
      check(c, SW - 380, SH - 182 + (1 - k) * 20, 16); txt(c, 'Problema resolvido', SW - 352, SH - 194 + (1 - k) * 20, UI(700, 18), C.ink); txt(c, 'pela equipa SENVIA', SW - 352, SH - 168 + (1 - k) * 20, UI(500, 15), C.ink2); c.globalAlpha = 1; }
    const [cx, cy] = path([[0, SW - 160, 120], [1.2, x + 300, y + 140], [2.2, x + 330, y + 240], [3.4, x + w - 125, y + h - 49], [5.2, x + w - 125, y + h - 49], [6.4, SW - 250, SH - 300]], t);
    cursor(c, cx, cy, true);
  },
  // 4: segurança: o agente está instalado e tu controlas o acesso
  (c, t) => {
    desktop(c);
    const w = 520, h = 330, x = SW - w - 60, y = os === 'windows' ? SH - h - 80 : os === 'macos' ? 50 : 56, k = ease(t / 0.7);
    c.globalAlpha = k; win(c, x, y + (1 - k) * 20, w, h, 'SENVIA Suporte'); c.globalAlpha = 1;
    const yy = y + (1 - k) * 20;
    fillRR(c, x + 30, yy + 74, 60, 60, 16, C.navy); logoMark(c, x + 52, yy + 104, 7.5, '#2BDBFF');
    txt(c, 'Agente instalado', x + 108, yy + 94, UI(700, 20), C.ink); txt(c, 'Acesso remoto combinado com a SENVIA', x + 108, yy + 120, UI(500, 15), C.ink2);
    [['Barra de sessão visível', true], ['Acesso remoto', true]].forEach(([a], i) => { txt(c, a, x + 30, yy + 176 + i * 42, UI(500, 17), C.ink); fillRR(c, x + w - 84, yy + 162 + i * 42, 54, 28, 14, C.green); c.beginPath(); c.arc(x + w - 44, yy + 176 + i * 42, 11, 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill(); });
    fillRR(c, x + 30, yy + h - 66, 200, 42, 10, '#ECF0F2'); txt(c, 'Retirar acesso', x + 130, yy + h - 45, UI(600, 15), C.ink, 'center');
    fillRR(c, x + 244, yy + h - 66, 160, 42, 10, '#ECF0F2'); txt(c, 'Desinstalar', x + 324, yy + h - 45, UI(600, 15), C.ink, 'center');
    // cadeado
    const lx = 260, ly = 330; c.globalAlpha = k;
    fillRR(c, lx - 90, ly - 20, 180, 150, 30, 'rgba(255,255,255,.92)');
    c.strokeStyle = C.ink; c.lineWidth = 12; c.beginPath(); c.arc(lx, ly + 20, 34, Math.PI, 0); c.stroke();
    fillRR(c, lx - 50, ly + 20, 100, 76, 14, C.ink); c.beginPath(); c.arc(lx, ly + 52, 9, 0, Math.PI * 2); c.fillStyle = '#2BDBFF'; c.fill(); c.globalAlpha = 1;
  },
];
const SCENE_LEN = [1, 4.6, 4.6, 6.8, 0.8];
let cur = 0, curT = 0, fade = 1;
function showStep(k){ if (k === cur) return; PREV.c.drawImage(SCR.cv, 0, 0); cur = k; curT = 0; fade = 0; dirty = true; }
function drawScreen(dt, active){
  if (active) curT += dt;
  const animating = curT < SCENE_LEN[cur] + 0.1 || fade < 1 || cur === 3;
  if (!animating && !dirty) return;
  dirty = false;
  STEPS[cur](SCR.c, curT);
  if (fade < 1){ fade = Math.min(1, fade + dt / 0.45); SCR.c.globalAlpha = 1 - smooth(fade); SCR.c.drawImage(PREV.cv, 0, 0); SCR.c.globalAlpha = 1; }
  SCR.tex.needsUpdate = true;
}

/* ================= o computador ================= */
const MON = V3(0, 1.95, -0.75);
const monitor = (() => {
  const root = new THREE.Group();
  const body = new THREE.MeshPhysicalMaterial({ color: 0x2A3136, roughness: 0.35, metalness: 0.5, clearcoat: 0.5 });
  const alu = new THREE.MeshStandardMaterial({ color: 0xC9CFD3, roughness: 0.32, metalness: 0.7 });
  root.add(mesh(slab(1.25, 0.85, 0.04, 0.3, 0.012), alu));
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.25, 0.08), alu); neck.position.set(0, 0.62, -0.12); neck.rotation.x = -0.06; root.add(neck);
  const scrG = new THREE.Group(); scrG.position.set(0, MON.y, -0.08); root.add(scrG);
  const frame = new THREE.Mesh(slab(4.5, 2.82, 0.1, 0.12, 0.02).rotateX(Math.PI / 2), body); frame.position.z = -0.05; scrG.add(frame);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.72), new THREE.MeshStandardMaterial({ color: 0x07090B, roughness: 0.1, metalness: 0.2 })); glass.position.z = 0.052; glass.userData.noShadow = true; scrG.add(glass);
  const scrMat = new THREE.MeshBasicMaterial({ map: SCR.tex, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.26, 2.61), scrMat); screen.position.z = 0.056; screen.userData.noShadow = true; scrG.add(screen);
  return addObj({ key: 'monitor', label: 'O teu computador', root, pos: V3(0, 0, -0.75), R: [2.6, 2.5] });
})();
const keyboard = (() => {
  const root = new THREE.Group();
  root.add(mesh(slab(2.7, 0.88, 0.06, 0.08, 0.015), new THREE.MeshStandardMaterial({ color: 0xE9EDF0, roughness: 0.5 })));
  const K = mkCv(1024, 334), c = K.c; c.fillStyle = '#E9EDF0'; c.fillRect(0, 0, 1024, 334);
  [15, 14, 13, 12].forEach((n, r) => { const kw = (970 - (n - 1) * 8) / n; for (let k = 0; k < n; k++) fillRR(c, 27 + k * (kw + 8), 22 + r * 66, kw, 56, 9, '#FFFFFF'); });
  fillRR(c, 300, 22 + 4 * 66, 424, 40, 9, '#FFFFFF'); K.tex.needsUpdate = true;
  root.add(mesh(new THREE.PlaneGeometry(2.62, 0.82).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: K.tex, roughness: 0.5 }), 0.061));
  return addObj({ key: 'keyboard', label: 'Teclado', root, pos: V3(-0.15, 0, 0.65), yaw: 0.03 });
})();
const mouse3d = (() => {
  const root = new THREE.Group();
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshStandardMaterial({ color: 0xF4F6F7, roughness: 0.4 })); m.scale.set(0.2, 0.09, 0.32); m.position.y = 0.04; root.add(m);
  return addObj({ key: 'mouse', label: 'Rato', root, pos: V3(1.85, 0, 0.72), yaw: -0.12 });
})();
const plant = (() => {
  const root = new THREE.Group();
  root.add(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.27, 0.5, 40), new THREE.MeshStandardMaterial({ color: 0xF9FAFA, roughness: 0.5 })).translateY(0.25));
  root.add(mesh(new THREE.CircleGeometry(0.31, 32).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3B2A1E, roughness: 1 }), 0.47));
  const leafG = new THREE.SphereGeometry(1, 14, 10);
  [[7, 0.06, 1.1, 0.42, '#6FAF86'], [9, 0.12, 0.75, 0.55, '#5E9F78'], [11, 0.18, 0.45, 0.62, '#4F8E69']].forEach(([n, r, tilt, len, col], ring) => {
    const m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.55 });
    for (let k = 0; k < n; k++){ const a = (k / n) * Math.PI * 2 + ring * 0.4, g = new THREE.Group(); const leaf = new THREE.Mesh(leafG, m); leaf.scale.set(0.07, 0.03, len * 0.5); leaf.position.z = len * 0.45; g.add(leaf);
      g.position.set(Math.sin(a) * r, 0.5, Math.cos(a) * r); g.rotation.set(0, a, 0); g.rotateX(-tilt); root.add(g); }
  });
  return addObj({ key: 'plant', label: 'Planta', root, pos: V3(-3.3, 0, -0.6) });
})();

// a equipa SENVIA: um pin que flutua e envia ajuda para o ecrã
const BEACON = V3(3.7, 3.55, -1.4), TARGET = V3(1.2, 2.25, -0.68);
const beacon = (() => {
  const root = new THREE.Group();
  const pinMat = new THREE.MeshPhysicalMaterial({ color: 0x0E86A8, roughness: 0.2, clearcoat: 1, emissive: 0x0E86A8, emissiveIntensity: 0.15 });
  root.add(new THREE.Mesh(new THREE.SphereGeometry(0.36, 40, 24), pinMat));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 40).rotateX(Math.PI), pinMat); tip.position.y = -0.42; root.add(tip);
  const LM = mkCv(128, 128); { logoMark(LM.c, 50, 64, 15, '#FFFFFF'); LM.tex.needsUpdate = true; }
  const logo = new THREE.Sprite(new THREE.SpriteMaterial({ map: LM.tex, transparent: true, depthWrite: false })); logo.scale.setScalar(0.38); root.add(logo);
  return addObj({ key: 'beacon', label: 'Equipa SENVIA', stop: 3, root, pos: BEACON.clone(), R: [1, 1] });
})();
// o fluxo de ajuda: pontos que viajam do pin até ao ecrã
const flowCurve = new THREE.CatmullRomCurve3([BEACON.clone().add(V3(-0.1, -0.5, 0)), V3(2.9, 3.6, -0.9), V3(2.0, 3.0, -0.6), TARGET]);
const FLOW_N = 46;
const flow = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0x2BC7E8, transparent: true, opacity: 0.9, toneMapped: false }), FLOW_N);
flow.frustumCulled = false; scene.add(flow);
const fm = new THREE.Matrix4(), fp = V3(), fq = new THREE.Quaternion(), fs = V3();

/* ================= paragens ================= */
const N = 5;
const STOPS = [
  { label: 'Download', T: V3(0.2, 1.45, -0.3), R: [3.25, 2.9], ph: 14, yaw: -0.38 },
  { label: 'Passo 1', T: V3(0, 2.0, -0.75), R: [2.35, 2.35], ph: 6, yaw: 0.24 },
  { label: 'Passo 2', T: V3(0, 1.95, -0.75), R: [2.35, 2.35], ph: 10, yaw: -0.2 },
  { label: 'Passo 3', T: V3(0.9, 2.45, -0.9), R: [3.3, 3.0], ph: 12, yaw: 0.36 },
  { label: 'Segurança', T: V3(0, 1.85, -0.75), R: [2.5, 2.45], ph: 18, yaw: 0.02 },
];
const UP = V3(0, 1, 0);
const L = { W: innerWidth, H: innerHeight, mobile: MOBILE0 };
const notes = [...document.querySelectorAll('.card')];
const track = document.querySelector('.track');
function camPosFor(s, d = s.d){ const ph = rad(s.ph); return s.T.clone().add(V3(Math.sin(s.yaw) * Math.cos(ph), Math.sin(ph), Math.cos(s.yaw) * Math.cos(ph)).multiplyScalar(d)); }
function layout(){
  const W = innerWidth, H = innerHeight;
  L.W = W; L.H = H; L.mobile = W < 760;
  renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
  const top = 80, bottom = 74;
  STOPS.forEach((s, k) => {
    const note = notes[k], R = s.R[L.mobile ? 1 : 0];
    let rw, rh, cx, cy;
    if (L.mobile){
      const nb = note.offsetTop + note.offsetHeight + 18, bot = H - 44;
      rw = W - 24; rh = Math.max(140, bot - nb); cx = W / 2; cy = (nb + bot) / 2;
    } else {
      const left = note.classList.contains('left'), a = left ? note.offsetLeft + note.offsetWidth + 30 : 24, b = left ? W - 24 : note.offsetLeft - 30;
      rw = Math.max(200, b - a); rh = H - top - bottom; cx = (a + b) / 2; cy = (top + H - bottom) / 2;
    }
    s.d = R * H / (TAN * 0.9 * Math.min(rw, rh));
    s.ox = -(cx - W / 2); s.oy = H / 2 - cy;
  });
}
layout();
let relayout = 0;
addEventListener('resize', () => { cancelAnimationFrame(relayout); relayout = requestAnimationFrame(layout); });

/* ================= botões ================= */
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
let hovered = null, down = null;
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
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
  if (o){ tip.textContent = o.key === 'monitor' ? 'Ver o passo seguinte' : o.label; tip.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; tip.classList.add('on'); }
  else tip.classList.remove('on');
}, { passive: true });
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return; down = null;
  const o = pick(e.clientX, e.clientY); if (!o) return;
  // o ecrã leva ao passo seguinte; o pin leva à sessão remota; o resto abana
  if (o.key === 'monitor') go(Math.min(N - 1, Math.round(state.p) + 1));
  else if (o.stop >= 0 && Math.round(state.p) !== o.stop) go(o.stop);
  else o.wob = 1;
});

/* ================= ciclo ================= */
const state = { p: 0, intro: REDUCE ? 1 : 0 };
const tmpT = V3(), wobQ = new THREE.Quaternion();
let worldHidden = false, navDark = false;
let last = performance.now(), t = 0, flowK = 0;
notes.forEach((n) => { n._v = -1; [...n.children].forEach((c, i) => c.style.setProperty('--i', i)); });
function readP(){ return clamp((scrollY - track.offsetTop) / trackLen()) * (N - 1); }
function frame(now){
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
  const p = state.p = readP();
  state.intro = Math.min(1, state.intro + dt / 1.9);
  const i = Math.min(N - 2, Math.floor(p)), f = p - i, e = smoother(clamp((f - 0.14) / 0.72));
  const A = STOPS[i], Bs = STOPS[i + 1];
  tmpT.lerpVectors(A.T, Bs.T, e);
  const ie = 1 - smooth(state.intro);
  const s = { T: tmpT, ph: lerp(A.ph, Bs.ph, e) + ie * 10, yaw: lerp(A.yaw, Bs.yaw, e) - ie * 0.5 };
  const d = (lerp(A.d, Bs.d, e) + 0.6 * Math.sin(Math.PI * e)) * (1 + ie * 0.3);
  camera.position.copy(camPosFor(s, d));
  mouse.sx = damp(mouse.sx, L.mobile ? 0 : mouse.x, 3, dt); mouse.sy = damp(mouse.sy, L.mobile ? 0 : mouse.y, 3, dt);
  camera.position.x += mouse.sx * d * 0.03; camera.position.y -= mouse.sy * d * 0.02;
  camera.lookAt(tmpT);
  camera.setViewOffset(L.W, L.H, lerp(A.ox, Bs.ox, e), lerp(A.oy, Bs.oy, e), L.W, L.H);
  // o ecrã muda de passo perto de cada paragem
  const a = Math.round(p);
  if (Math.abs(p - a) < 0.45) showStep(a);
  drawScreen(dt, Math.abs(p - a) < 0.3);
  // o fluxo de ajuda corre no download e na sessão remota
  flowK = damp(flowK, (a === 1 || a === 3) && Math.abs(p - a) < 0.35 ? 1 : 0, 4, dt);
  for (let k = 0; k < FLOW_N; k++){
    const u = (t * 0.35 + k / FLOW_N) % 1; flowCurve.getPointAt(u, fp);
    fs.setScalar(flowK * (0.6 + 0.6 * Math.sin(u * Math.PI))); fm.compose(fp, fq, fs); flow.setMatrixAt(k, fm);
  }
  flow.instanceMatrix.needsUpdate = true;
  // objetos: o rato por cima levanta-os um pouco; o pin flutua
  OBJS.forEach((o) => {
    o.hov = damp(o.hov, hovered === o ? 1 : 0, 9, dt); o.wob = Math.max(0, o.wob - dt * 1.4);
    o.root.position.copy(o.pos); o.root.quaternion.copy(o.q0);
    if (o === beacon){ o.root.position.y += Math.sin(t * 1.8) * 0.1; o.root.rotation.y = t * 0.7; }
    else if (o !== monitor) o.root.position.y += o.hov * 0.08;
    if (o.wob > 0){ wobQ.setFromAxisAngle(V3(0, 0, 1), Math.sin(o.wob * 22) * 0.05 * o.wob); o.root.quaternion.multiply(wobQ); }
  });
  // cartões e botões
  notes.forEach((n, k) => {
    const v = REDUCE ? (Math.abs(p - k) < 0.42 ? 1 : 0) : smooth(clamp((0.42 - Math.abs(p - k)) / 0.32)), dir = p < k ? 1 : -1;
    if (Math.abs(v - n._v) < 0.002 && dir === n._dir) return;
    n._v = v; n._dir = dir;
    n.style.setProperty('--v', v.toFixed(3)); n.style.setProperty('--dir', dir);
    n.classList.toggle('vis', v > 0.01); n.classList.toggle('full', v > 0.995); n.classList.toggle('on', v > 0.6);
  });
  stopBtns.forEach((b, k) => b.classList.toggle('on', k === a));
  hint.classList.toggle('off', p > 0.15);
  const tb = track.getBoundingClientRect().bottom, past = tb <= 0, dark = tb < 72 || false;
  if (dark !== navDark){ navDark = dark; document.body.classList.toggle('night', dark); }
  if (past !== worldHidden){ worldHidden = past; canvas.style.visibility = past ? 'hidden' : ''; }
  if (past) return;
  renderer.render(scene, camera);
}
function loop(now){ lenis?.raf(now); frame(now); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
Promise.all([UI(500, 16), UI(600, 16), UI(700, 16), UI(800, 16), MONO(16)].map((f) => document.fonts.load(f))).then(() => { dirty = true; layout(); });
document.fonts.ready.then(layout);
