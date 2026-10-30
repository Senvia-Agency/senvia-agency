import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';

/* Contactos: Leiria em maqueta 3D, vista de cima (castelo, rio Lis, avenidas e quarteirões). Cada canal de contacto é um ponto
   no mapa: o envelope (email), o telemóvel (WhatsApp e telefone) e o pin na R. de Atenas (morada). No fim anoitece e as janelas acendem.
   A cidade é uma ilustração: não é uma planta exata de Leiria. A conversa no telemóvel é fictícia. */

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
const C = { ink: '#0B1F2A', ink2: '#4A6170', petrol: '#0E86A8', petrolD: '#00708F', navy: '#0B1F2A', line: '#E3E8EA', wa: '#1DA851', amber: '#F2B53A' };
const UI = (w, s) => `${w} ${s}px Inter, "Segoe UI", system-ui, sans-serif`;
const MONO = (s, w = 500) => `${w} ${s}px "DM Mono", ui-monospace, Consolas, monospace`;
function rng(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* ================= motor ================= */
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
const MOBILE0 = innerWidth < 760;
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE0 ? 1.75 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const ANISO = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene();
const DAY = new THREE.Color(0xEEF2F3), NIGHT = new THREE.Color(0x0B1F2A);
scene.background = DAY.clone();
scene.fog = new THREE.Fog(DAY.clone(), 45, 95);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.28;
const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.6, 200);

const hemi = new THREE.HemisphereLight(0xFFFFFF, 0xB9C6CD, 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xFFF6EA, 2.2);
sun.position.set(-9, 16, 7); sun.castShadow = true;
sun.shadow.mapSize.set(MOBILE0 ? 1024 : 2048, MOBILE0 ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
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
// quebra o texto em linhas; devolve as linhas (para medir a altura dos balões)
function lines(c, s, maxW, font){
  c.font = font; const out = []; let line = '';
  for (const w of s.split(' ')){ const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }
  if (line) out.push(line);
  return out;
}
// o símbolo da SENVIA: um losango grande e dois pequenos
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
// placa deitada: largura em x, profundidade em z, espessura em y (a base fica em y = 0)
function slab(w, d, t, r, bevel = 0){
  const g = new THREE.ExtrudeGeometry(rrShape(w - bevel * 2, d - bevel * 2, Math.max(0.001, r - bevel)), {
    depth: Math.max(0.0005, t - bevel * 2), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
  g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0);
  return g;
}
// face plana com cantos redondos e UV de 0 a 1, virada para cima
function rrPlane(w, d, r){
  const g = new THREE.ShapeGeometry(rrShape(w, d, r), 10);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / d + 0.5);
  g.rotateX(-Math.PI / 2);
  return g;
}
const mesh = (geo, mat, y = 0) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; return m; };
// etiqueta flutuante (sprite) com texto numa pílula
function label(text, { bg = 'rgba(255,255,255,.92)', fg = C.ink, size = 0.42, dot } = {}){
  const K = mkCv(640, 128), c = K.c;
  c.font = UI(600, 46); const w = Math.min(620, c.measureText(text).width + (dot ? 108 : 72));
  fillRR(c, (640 - w) / 2, 14, w, 100, 50, bg);
  if (dot){ c.beginPath(); c.arc((640 - w) / 2 + 44, 64, 12, 0, Math.PI * 2); c.fillStyle = dot; c.fill(); }
  txt(c, text, 320 + (dot ? 18 : 0), 66, UI(600, 46), fg, 'center');
  K.tex.needsUpdate = true;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: K.tex, transparent: true, depthWrite: false }));
  s.scale.set(size * 5, size, 1); s.renderOrder = 5;
  return s;
}

/* ================= a cidade ================= */
const HILL = V3(-4.4, 0, -3.2), OFFICE = V3(7.2, 0, -2.9), EMAIL = V3(-1.0, 0, 4.4), WA = V3(-9.4, 0, 0.9);
const curve = (pts) => new THREE.CatmullRomCurve3(pts.map(([x, z]) => V3(x, 0, z)));
const RIVER = curve([[-13.4, 4.2], [-9, 3.0], [-5.5, 1.6], [-2.5, 2.6], [0.5, 1.0], [3.5, 2.2], [7, 1.0], [10, 2.6], [13.4, 1.8]]);
const AVES = [
  curve([[-13.4, -0.6], [-8, -0.4], [-1.5, -1.4], [3, -0.8], [8, -1.6], [13.4, -1.0]]),
  curve([[1.6, -9.4], [1.2, -5], [0.4, -2], [0.8, 1.5], [1.8, 5], [0.8, 9.4]]),
  curve([[4, -9.4], [5.2, -5.5], [8.5, -4.6], [13.4, -5.0]]),
  curve([[-13.4, 6.4], [-7, 7.0], [-2, 6.6], [4, 7.4], [13.4, 6.8]]),
];
const PARKS = [[2.6, -6.6, 1.5], [-9.8, -5.6, 1.4], [8.8, 5.4, 1.7], [-6.4, 5.4, 1.15]];
const samples = (cv, n = 260) => cv.getSpacedPoints(n);
const RIVER_S = samples(RIVER), AVE_S = AVES.map((a) => samples(a, 200));
const distTo = (S, x, z) => { let m = Infinity; for (const p of S){ const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < m) m = d; } return Math.sqrt(m); };
const hillH = (r) => 1.3 * Math.exp(-((r / 1.5) ** 2) * 1.1);
function free(x, z){
  if (Math.abs(x) > 12.2 || Math.abs(z) > 8.2) return false;
  if (distTo(RIVER_S, x, z) < 1.05) return false;
  if (AVE_S.some((S) => distTo(S, x, z) < 0.42)) return false;
  if (Math.hypot(x - HILL.x, z - HILL.z) < 3.15) return false;
  if (PARKS.some(([px, pz, r]) => Math.hypot(x - px, z - pz) < r + 0.15)) return false;
  if (Math.hypot(x - OFFICE.x, z - OFFICE.z) < 1.05) return false;
  if (Math.hypot(x - EMAIL.x, z - EMAIL.z) < 1.0 || Math.hypot(x - WA.x, z - WA.z) < 1.0) return false;
  return true;
}

// a placa da maqueta, com sombra no fundo
const TILE_W = 26, TILE_D = 18;
const tileMat = new THREE.MeshStandardMaterial({ color: 0xD9E1E5, roughness: 0.95 });
const tile = mesh(slab(TILE_W, TILE_D, 0.6, 0.9, 0.08), tileMat, -0.6); tile.receiveShadow = true; scene.add(tile);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.16 }));
ground.position.y = -0.62; ground.receiveShadow = true; scene.add(ground);

// fita plana ao longo de uma curva (rio, margens, avenidas)
function ribbon(cv, w, y, mat, segs = 260){
  const pts = cv.getSpacedPoints(segs), pos = [], idx = [];
  for (let i = 0; i <= segs; i++){
    const p = pts[i], a = pts[Math.max(0, i - 1)], b = pts[Math.min(segs, i + 1)];
    const tx = b.x - a.x, tz = b.z - a.z, l = Math.hypot(tx, tz) || 1, nx = -tz / l, nz = tx / l;
    pos.push(p.x + nx * w / 2, y, p.z + nz * w / 2, p.x - nx * w / 2, y, p.z - nz * w / 2);
    if (i < segs){ const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(pos.length).fill(0).map((_, k) => (k % 3 === 1 ? 1 : 0)), 3));
  const m = new THREE.Mesh(g, mat); m.receiveShadow = true; scene.add(m); return m;
}
ribbon(RIVER, 2.0, 0.006, new THREE.MeshStandardMaterial({ color: 0xB5D6AC, roughness: 0.95, side: THREE.DoubleSide }));
const water = ribbon(RIVER, 0.95, 0.014, new THREE.MeshStandardMaterial({ color: 0x5FAFC8, roughness: 0.45, metalness: 0, envMapIntensity: 0.25, side: THREE.DoubleSide }));
const aveMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.85, side: THREE.DoubleSide });
AVES.forEach((a) => ribbon(a, 0.46, 0.02, aveMat));

// parques e praças
const parkMat = new THREE.MeshStandardMaterial({ color: 0xADD3A2, roughness: 0.95 });
PARKS.forEach(([x, z, r]) => { const m = mesh(new THREE.CircleGeometry(r, 40).rotateX(-Math.PI / 2), parkMat, 0.008); m.position.x = x; m.position.z = z; m.receiveShadow = true; scene.add(m); });
const plazaMat = new THREE.MeshStandardMaterial({ color: 0xEDE4D3, roughness: 0.9 });
[EMAIL, WA].forEach((p) => { const m = mesh(new THREE.CircleGeometry(0.9, 40).rotateX(-Math.PI / 2), plazaMat, 0.01); m.position.x = p.x; m.position.z = p.z; m.receiveShadow = true; scene.add(m); });

// colina e castelo
const hill = new THREE.Mesh(new THREE.LatheGeometry(Array.from({ length: 30 }, (_, i) => new THREE.Vector2(3.1 * (1 - i / 29) + 0.0001, hillH(3.1 * (1 - i / 29)))), 64),
  new THREE.MeshStandardMaterial({ color: 0xB9DBAE, roughness: 0.95 }));
hill.position.copy(HILL); hill.receiveShadow = true; hill.castShadow = true; scene.add(hill);
const castle = new THREE.Group(); castle.position.copy(HILL); scene.add(castle);
{
  const stone = new THREE.MeshStandardMaterial({ color: 0xEDE3CF, roughness: 0.85 });
  const N = 7, R = 0.95, base = hillH(R);
  const pts = Array.from({ length: N }, (_, k) => { const a = (k / N) * Math.PI * 2 + 0.3, r = R * (k % 2 ? 0.92 : 1.08); return V3(Math.cos(a) * r, 0, Math.sin(a) * r); });
  pts.forEach((p, k) => {
    const q = pts[(k + 1) % N], len = p.distanceTo(q);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, 0.42, 0.1), stone);
    wall.position.set((p.x + q.x) / 2, base + 0.12, (p.z + q.z) / 2); wall.rotation.y = -Math.atan2(q.z - p.z, q.x - p.x); castle.add(wall);
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.62, 16), stone); tower.position.set(p.x, base + 0.2, p.z); castle.add(tower);
  });
  const keep = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.95, 0.5), stone); keep.position.set(0.12, hillH(0.15) + 0.4, -0.1); castle.add(keep);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 0.58), stone); top.position.set(0.12, hillH(0.15) + 0.9, -0.1); castle.add(top);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 6), new THREE.MeshStandardMaterial({ color: 0x8A8F93 })); pole.position.set(0.12, hillH(0.15) + 1.15, -0.1); castle.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14), new THREE.MeshStandardMaterial({ color: 0x0E86A8, side: THREE.DoubleSide })); flag.position.set(0.23, hillH(0.15) + 1.29, -0.1); castle.add(flag);
  castle.traverse((m) => { if (m.isMesh){ m.castShadow = true; m.receiveShadow = true; } });
  castle.userData.flag = flag;
}

// quarteirões e prédios (instanciados); a textura das janelas só acende à noite
function windowTex(){
  const K = mkCv(64, 64), c = K.c, R = rng(5);
  c.fillStyle = '#000'; c.fillRect(0, 0, 64, 64);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 4; k++) if (R() < 0.62){ c.fillStyle = R() < 0.25 ? '#FFE8B8' : '#FFC978'; c.fillRect(6 + k * 14, 5 + r * 11.5, 8, 6.5); }
  K.tex.needsUpdate = true; K.tex.colorSpace = THREE.SRGBColorSpace; return K.tex;
}
const bGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
{ const uv = bGeo.attributes.uv; for (let i = 8; i < 12; i++) uv.setXY(i, 0.01, 0.99); } // tampo sem janelas
const bMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.82, emissive: 0xFFC978, emissiveMap: windowTex(), emissiveIntensity: 0 });
const roofGeo = new THREE.ConeGeometry(0.7071, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0);
const roofMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8 });
const plateGeo = new THREE.BoxGeometry(1, 0.05, 1).translate(0, 0.025, 0);
const plateMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
const treeGeo = new THREE.IcosahedronGeometry(0.22, 0).translate(0, 0.24, 0);
const treeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8, flatShading: true });
const B = [], RF = [], PL = [], TR = [];
{
  const R = rng(42), PAL = ['#F4F6F8', '#E6ECEF', '#DCE4E9', '#EEE7DC', '#DFEAE5', '#E7E2EE', '#F2ECE1'];
  const STEP = 1.32;
  for (let gx = -12; gx <= 12; gx += STEP) for (let gz = -8; gz <= 8; gz += STEP){
    const x = gx + (R() - 0.5) * 0.12, z = gz + (R() - 0.5) * 0.12, rot = 0.1 * Math.sin(gx * 0.21) + 0.08 * Math.cos(gz * 0.33);
    const cs = Math.cos(rot), sn = Math.sin(rot), corner = (u, v) => [x + u * cs + v * sn, z - u * sn + v * cs];
    const area = (u, v, h) => [[0, 0], [h, h], [-h, h], [h, -h], [-h, -h]].every(([a, b]) => free(...corner(u + a, v + b)));
    const dc = Math.hypot(x - 0.5, z + 0.5), hd = Math.hypot(x - HILL.x, z - HILL.z);
    const old = hd < 5.4 && x > HILL.x - 1;
    const base = old ? 0.24 : lerp(1.05, 0.26, clamp(dc / 11.5));
    let lots;
    if (area(0, 0, 0.55)){
      // quarteirão inteiro
      PL.push([x, z, rot, 1.04, 1.04]);
      const pat = R();
      lots = pat < 0.35 ? [[0, 0, 0.8, 0.8]] : pat < 0.75 ? [[-0.21, 0, 0.36, 0.8], [0.21, 0, 0.36, 0.8]] : [[-0.21, -0.21, 0.36, 0.36], [0.21, -0.21, 0.36, 0.36], [-0.21, 0.21, 0.36, 0.36], [0.21, 0.21, 0.36, 0.36]];
    } else {
      // junto ao rio, às avenidas e aos parques: só os lotes que cabem
      lots = [[-0.27, -0.27], [0.27, -0.27], [-0.27, 0.27], [0.27, 0.27]].filter(([u, v]) => area(u, v, 0.24)).map(([u, v]) => [u, v, 0.38, 0.38]);
      if (!lots.length){ if (free(x, z) && R() < 0.35) TR.push([x, z, 0.8 + R() * 0.5, R()]); continue; }
      lots.forEach(([u, v]) => { const [px, pz] = corner(u, v); PL.push([px, pz, rot, 0.52, 0.52]); });
    }
    lots.forEach(([u, v, w, d]) => {
      const [bx, bz] = corner(u, v), h = Math.max(0.16, base * (old ? 0.8 + R() * 0.5 : 0.55 + R() * 0.9));
      B.push([bx, bz, rot, w, h, d, PAL[Math.floor(R() * PAL.length)]]);
      if (old || (R() < 0.12 && h < 0.45)) RF.push([bx, bz, rot, w * 1.04, 0.16 + R() * 0.06, d * 1.04, h, ['#D8875E', '#CF7B52', '#E0956C'][Math.floor(R() * 3)]]);
    });
  }
  // árvores: parques, margens do rio, colina e praças
  PARKS.forEach(([px, pz, r]) => { for (let k = 0; k < r * 9; k++){ const a = R() * Math.PI * 2, d = Math.sqrt(R()) * (r - 0.25); TR.push([px + Math.cos(a) * d, pz + Math.sin(a) * d, 0.8 + R() * 0.6, R()]); } });
  RIVER_S.forEach((p, i) => { if (i % 5) return; [-1, 1].forEach((s) => { const q = RIVER_S[Math.min(i + 1, RIVER_S.length - 1)], tx = q.x - p.x, tz = q.z - p.z, l = Math.hypot(tx, tz) || 1;
    const x = p.x - tz / l * 0.78 * s, z = p.z + tx / l * 0.78 * s; if (Math.abs(x) < 12.4 && !AVE_S.some((S) => distTo(S, x, z) < 0.4) && R() < 0.8) TR.push([x, z, 0.7 + R() * 0.4, R()]); }); });
  for (let k = 0; k < 46; k++){ const a = R() * Math.PI * 2, d = 1.35 + R() * 1.6; const x = HILL.x + Math.cos(a) * d, z = HILL.z + Math.sin(a) * d; TR.push([x, z, 0.7 + R() * 0.5, R(), hillH(d) - 0.04]); }
  [EMAIL, WA].forEach((p) => { for (let k = 0; k < 5; k++){ const a = (k / 5) * Math.PI * 2 + 0.4; TR.push([p.x + Math.cos(a) * 0.72, p.z + Math.sin(a) * 0.72, 0.65, R()]); } });
}
function instanced(geo, mat, list, set){
  const im = new THREE.InstancedMesh(geo, mat, list.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = V3(), s = V3(), col = new THREE.Color();
  list.forEach((it, i) => { set(it, p, q, s, col); m4.compose(p, q, s); im.setMatrixAt(i, m4); im.setColorAt(i, col); });
  im.castShadow = true; im.receiveShadow = true; scene.add(im); return im;
}
const UPV = V3(0, 1, 0);
instanced(plateGeo, plateMat, PL, ([x, z, r, w, d], p, q, s, col) => { p.set(x, 0, z); q.setFromAxisAngle(UPV, r); s.set(w, 1, d); col.set('#CBD6DC'); });
instanced(bGeo, bMat, B, ([x, z, r, w, h, d, c], p, q, s, col) => { p.set(x, 0.05, z); q.setFromAxisAngle(UPV, r); s.set(w, h, d); col.set(c); });
instanced(roofGeo, roofMat, RF, ([x, z, r, w, rh, d, h, c], p, q, s, col) => { p.set(x, 0.05 + h, z); q.setFromAxisAngle(UPV, r); s.set(w, rh, d); col.set(c); });
instanced(treeGeo, treeMat, TR, ([x, z, k, t, y = 0.01], p, q, s, col) => { p.set(x, y, z); q.setFromAxisAngle(UPV, t * 6); s.setScalar(k); col.setHSL(0.3 + t * 0.06, 0.36, 0.4 + t * 0.1); });

// candeeiros ao longo das avenidas: só se veem à noite
const GLOW = mkCv(128, 128);
{ const c = GLOW.c, g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,214,150,1)'); g.addColorStop(0.25, 'rgba(255,190,110,.55)'); g.addColorStop(1, 'rgba(255,170,90,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); GLOW.tex.needsUpdate = true; }
const lampMat = new THREE.SpriteMaterial({ map: GLOW.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
AVES.forEach((a, j) => a.getSpacedPoints(Math.round(a.getLength() / 1.25)).forEach((p, i) => {
  if (Math.abs(p.x) > 12.3 || Math.abs(p.z) > 8.3) return;
  const s = new THREE.Sprite(lampMat); s.position.set(p.x + (i % 2 ? 0.3 : -0.3), 0.22, p.z + (i % 2 ? 0.3 : -0.3)); s.scale.setScalar(0.55); scene.add(s);
}));

// etiquetas do mapa
const castleLabel = label('Castelo de Leiria', { dot: '#0E86A8' }); castleLabel.position.set(HILL.x, 2.75, HILL.z); scene.add(castleLabel);
const riverLabel = label('Rio Lis', { size: 0.34, fg: '#1F6F86' }); riverLabel.position.set(4.6, 0.4, 1.75); scene.add(riverLabel);

/* ================= objetos (canais de contacto) ================= */
const OBJS = [];
function addObj(o){
  o.root.position.copy(o.pos); o.root.rotation.set(o.tilt || 0, o.yaw, 0, 'YXZ'); o.q0 = o.root.quaternion.clone();
  o.lift = 0; o.hov = 0; o.wob = 0; o.liftH ??= 0; o.faceK ??= 0; o.stop ??= -1;
  o.root.traverse((m) => { if (m.isMesh){ m.castShadow = !m.userData.noShadow; m.receiveShadow = true; m.userData.obj = o; } });
  scene.add(o.root); OBJS.push(o); return o;
}
// pé e anel que pulsa: ligam o objeto flutuante ao sítio do mapa
function anchor(p, top, col){
  const g = new THREE.Group(); g.position.set(p.x, 0, p.z); scene.add(g);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, top, 6).translate(0, top / 2, 0), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5 })); g.add(stick);
  const rings = [0, 1].map(() => { const r = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.42, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, depthWrite: false })); r.position.y = 0.03; g.add(r); return r; });
  return (t) => rings.forEach((r, k) => { const ph = (t * 0.45 + k * 0.5) % 1; r.scale.setScalar(1 + ph * 2.2); r.material.opacity = (1 - ph) * 0.55; });
}

// --- envelope (email): a carta sai do envelope quando lá chegas
const envelope = (() => {
  const root = new THREE.Group(), W = 1.2, D = 0.76;
  root.add(mesh(slab(W, D, 0.03, 0.04, 0.008), new THREE.MeshStandardMaterial({ color: 0xEFE6D6, roughness: 0.95 })));
  const F = mkCv(960, 608), L = mkCv(800, 520);
  {
    let c = F.c; c.fillStyle = '#F7EFE1'; c.fillRect(0, 0, 960, 608);
    c.strokeStyle = 'rgba(11,31,42,.12)'; c.lineWidth = 6; c.strokeRect(10, 10, 940, 588);
    // selo e carimbo
    fillRR(c, 772, 40, 140, 170, 10, C.petrol); c.strokeStyle = '#FFFDF8'; c.setLineDash([8, 8]); c.lineWidth = 4; rr(c, 784, 52, 116, 146, 6); c.stroke(); c.setLineDash([]);
    logoMark(c, 822, 125, 16, '#FFFFFF');
    c.strokeStyle = 'rgba(11,31,42,.6)'; c.lineWidth = 5; c.beginPath(); c.arc(690, 150, 74, 0, Math.PI * 2); c.stroke();
    txt(c, 'LEIRIA', 690, 138, MONO(26, 600), 'rgba(11,31,42,.7)', 'center'); txt(c, '2415', 690, 172, MONO(22, 600), 'rgba(11,31,42,.6)', 'center');
    for (let k = 0; k < 4; k++){ c.beginPath(); for (let x = 760; x < 930; x += 10) c.lineTo(x, 250 + k * 16 + Math.sin(x * 0.08) * 5); c.stroke(); }
    txt(c, 'PARA', 90, 330, MONO(30, 600), C.ink2);
    txt(c, 'geral@senvia.pt', 88, 400, UI(800, 76), C.ink);
    c.fillStyle = C.petrol; c.fillRect(90, 456, 120, 7);
    txt(c, 'SENVIA · Leiria', 90, 520, UI(600, 34), C.ink2);
    F.tex.needsUpdate = true;
    c = L.c; c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, 800, 520);
    c.strokeStyle = 'rgba(11,31,42,.14)'; c.lineWidth = 6; c.strokeRect(3, 3, 794, 514);
    txt(c, 'Olá, SENVIA!', 60, 78, UI(700, 54), C.ink);
    ['Queria saber mais sobre um', 'sistema à medida para a', 'minha empresa.'].forEach((l, k) => txt(c, l, 60, 160 + k * 52, UI(500, 38), '#33454F'));
    L.tex.needsUpdate = true;
  }
  const letter = mesh(new THREE.PlaneGeometry(1.06, 0.69).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: L.tex, roughness: 0.8 }), 0.0325);
  letter.userData.noShadow = true; root.add(letter);
  root.add(mesh(rrPlane(W - 0.01, D - 0.01, 0.035), new THREE.MeshStandardMaterial({ map: F.tex, roughness: 0.8 }), 0.036));
  const tick = anchor(EMAIL, 2.1, 0x0E86A8);
  return addObj({ key: 'email', label: 'Email', stop: 1, root, pos: V3(EMAIL.x, 2.25, EMAIL.z), yaw: 0.15, tilt: 0.55, liftH: 0.55, faceK: 0.8, R: [0.95, 0.9],
    update(dt, t, e){ letter.position.z = -0.42 * smooth(clamp((e - 0.3) / 0.6)); tick(t); } });
})();

// --- telemóvel (WhatsApp e telefone): a conversa vai aparecendo quando lá chegas
const CHAT = [
  ['me', 'Olá! Tenho uma oficina e queria largar o Excel.'],
  ['them', 'Olá! Claro. Como fazem hoje as marcações e os orçamentos?'],
  ['me', 'Tudo em papel e numa folha de Excel.'],
  ['them', 'Dá para juntar tudo num sistema só. Combinamos uma conversa de 20 minutos?'],
  ['me', 'Combinado!'],
];
const phone = (() => {
  const root = new THREE.Group(), W = 0.78, D = 1.6;
  root.add(mesh(slab(W, D, 0.075, 0.12, 0.014), new THREE.MeshPhysicalMaterial({ color: 0x23292D, metalness: 0.5, roughness: 0.35, clearcoat: 0.6 })));
  root.add(mesh(rrPlane(W - 0.03, D - 0.03, 0.105), new THREE.MeshStandardMaterial({ color: 0x07090B, roughness: 0.12, metalness: 0.3 }), 0.0775));
  const SW = 432, SH = 900, K = mkCv(SW, SH);
  const scrMat = new THREE.MeshBasicMaterial({ map: K.tex, toneMapped: false });
  const scr = mesh(rrPlane(0.71, 1.48, 0.085), scrMat, 0.08); scr.userData.noShadow = true; root.add(scr);
  let prog = 0.2, shown = -1;
  const draw = () => {
    const c = K.c, n = CHAT.length, vis = Math.min(n, Math.floor(prog * n) + 1), typing = vis < n && CHAT[vis][0] === 'them' && prog * n - (vis - 1) > 0.45;
    c.fillStyle = '#EFEAE2'; c.fillRect(0, 0, SW, SH);
    // cabeçalho da conversa
    c.fillStyle = '#1B7F4B'; c.fillRect(0, 0, SW, 132);
    txt(c, '9:41', 34, 28, UI(600, 16), '#FFFFFF');
    fillRR(c, 22, 60, 56, 56, 28, C.navy); logoMark(c, 41, 88, 6.5, '#2BDBFF');
    txt(c, 'SENVIA', 92, 78, UI(700, 21), '#FFFFFF'); txt(c, 'online', 92, 102, UI(500, 15), 'rgba(255,255,255,.75)');
    // balões, de baixo para cima
    const items = CHAT.slice(0, vis).map(([who, s]) => { const ls = lines(c, s, 250, UI(500, 18)); return { who, ls, h: 30 + ls.length * 25 }; });
    if (typing) items.push({ who: 'them', typing: true, h: 46 });
    let y = SH - 96; for (let i = items.length - 1; i >= 0 && y > 150; i--){
      const it = items[i]; y -= it.h + 12;
      const bw = it.typing ? 84 : Math.max(...it.ls.map((l) => (c.font = UI(500, 18), c.measureText(l).width))) + 30, x = it.who === 'me' ? SW - 18 - bw : 18;
      fillRR(c, x, y, bw, it.h, 16, it.who === 'me' ? '#D7F5C6' : '#FFFFFF');
      if (it.typing) [0, 1, 2].forEach((k) => { c.beginPath(); c.arc(x + 24 + k * 18, y + 23, 5, 0, Math.PI * 2); c.fillStyle = `rgba(11,31,42,${0.25 + 0.2 * ((Math.floor(performance.now() / 260) + k) % 3 === 0)})`; c.fill(); });
      else it.ls.forEach((l, k) => txt(c, l, x + 15, y + 26 + k * 25, UI(500, 18), C.ink));
    }
    // caixa de escrever
    fillRR(c, 16, SH - 78, SW - 96, 52, 26, '#FFFFFF'); txt(c, 'Mensagem', 40, SH - 52, UI(500, 17), '#8A979E');
    c.beginPath(); c.arc(SW - 46, SH - 52, 26, 0, Math.PI * 2); c.fillStyle = '#1B7F4B'; c.fill();
    c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(SW - 56, SH - 63); c.lineTo(SW - 34, SH - 52); c.lineTo(SW - 56, SH - 41); c.closePath(); c.fill();
    K.tex.needsUpdate = true;
  };
  draw();
  const tick = anchor(WA, 2.15, 0x1DA851);
  return addObj({ key: 'phone', label: 'WhatsApp', stop: 2, root, pos: V3(WA.x, 2.3, WA.z), yaw: -0.2, tilt: 0.6, liftH: 0.5, faceK: 0.82, R: [1.0, 0.95], draw,
    update(dt, t, e){
      scrMat.color.setScalar(lerp(0.5, 1, e)); tick(t);
      if (e > 0.55 && prog < 1) prog = Math.min(1, prog + dt / 7);
      const s = Math.floor(prog * CHAT.length * 4); if (s !== shown || (e > 0.55 && prog < 1)){ shown = s; draw(); }
    } });
})();

// --- a morada da SENVIA na R. de Atenas: um pin por cima da rua
const office = (() => {
  const root = new THREE.Group();
  root.add(mesh(new THREE.CircleGeometry(0.95, 40).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xF6F1E7, roughness: 0.9 }), 0.012));
  // o pin
  const pinMat = new THREE.MeshPhysicalMaterial({ color: 0x0E86A8, roughness: 0.2, clearcoat: 1, emissive: 0x0E86A8, emissiveIntensity: 0 });
  const pin = new THREE.Group(); pin.position.y = 1.35; root.add(pin);
  pin.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 40, 24), pinMat));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.33, 0.78, 40).rotateX(Math.PI), pinMat); tip.position.y = -0.47; pin.add(tip);
  const LM = mkCv(128, 128); { logoMark(LM.c, 50, 64, 15, '#FFFFFF'); LM.tex.needsUpdate = true; }
  const logo = new THREE.Sprite(new THREE.SpriteMaterial({ map: LM.tex, transparent: true, depthWrite: false })); logo.scale.setScalar(0.42); pin.add(logo);
  const tick = anchor(OFFICE, 0.05, 0x7C3AED);
  const street = label('R. de Atenas, 149', { dot: '#7C3AED', size: 0.4 }); street.position.set(1.0, 1.15, 0.9); street.material.opacity = 0; root.add(street);
  return addObj({ key: 'office', label: 'SENVIA em Leiria', stop: 3, root, pos: OFFICE.clone(), yaw: -0.25, R: [1.9, 1.8], tOff: V3(0, 0.8, 0),
    update(dt, t, e, night){
      pin.position.y = 1.35 + Math.sin(t * 2.2) * 0.08 + e * 0.15; pin.rotation.y = t * 0.6;
      street.material.opacity = smooth(clamp((e - 0.4) / 0.5));
      pinMat.emissiveIntensity = night * 0.55; tick(t);
    } });
})();

/* ================= paragens ================= */
const N = 5;
const STOPS = [
  { label: 'Olá', T: V3(-0.6, 0, -0.4), R: [7.2, 5.4], ph: 52, yaw: -0.18, fit: 1.0 },
  { label: 'Email', obj: envelope, ph: 56, yaw: 0.12 },
  { label: 'WhatsApp', obj: phone, ph: 56, yaw: -0.12 },
  { label: 'Morada', obj: office, ph: 36, yaw: 0.2 },
  { label: 'Clientes', T: V3(3.4, 0, -1.6), R: [6.2, 4.8], ph: 58, yaw: 0.32, fit: 1.0 },
];
const UP = V3(0, 1, 0);
function liftPos(o, s, out = V3()){
  out.copy(o.pos); out.y += o.liftH;
  if (o.liftH) out.add(V3(Math.sin(s.yaw), 0, Math.cos(s.yaw)).multiplyScalar(0.3));
  return out;
}
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
    const note = notes[k], R = (s.R || s.obj.R)[L.mobile ? 1 : 0];
    let rw, rh, cx, cy;
    if (L.mobile){
      // telemóvel: o objeto fica no espaço entre o fundo do cartão e o fundo do ecrã
      const nb = note.offsetTop + note.offsetHeight + 18, bot = H - 44;
      rw = W - 24; rh = Math.max(150, bot - nb); cx = W / 2; cy = (nb + bot) / 2;
    } else {
      const left = note.classList.contains('left'), a = left ? note.offsetLeft + note.offsetWidth + 30 : 24, b = left ? W - 24 : note.offsetLeft - 30;
      rw = Math.max(200, b - a); rh = H - top - bottom; cx = (a + b) / 2; cy = (top + H - bottom) / 2;
    }
    s.d = R * H / (TAN * (s.fit || 0.88) * Math.min(rw, rh));
    s.ox = -(cx - W / 2); s.oy = H / 2 - cy;
    if (s.obj){ liftPos(s.obj, s, s.T || (s.T = V3())); if (s.obj.tOff) s.T.add(s.obj.tOff); }
  });
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
  if (lenis) lenis.scrollTo(y, { duration: 1.1 + 0.25 * Math.abs(k - state.p), easing: (t) => 1 - Math.pow(1 - t, 3) });
  else scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' });
}
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go(+a.dataset.go); }));
// copiar o email
document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const txt0 = b.textContent;
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copiado'; } catch { b.textContent = b.dataset.copy; }
  setTimeout(() => { b.textContent = txt0; }, 1800);
}));

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
  if (o){ tip.textContent = o.label; tip.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; tip.classList.add('on'); }
  else tip.classList.remove('on');
}, { passive: true });
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return; down = null;
  const o = pick(e.clientX, e.clientY); if (!o) return;
  if (o.stop >= 0 && Math.round(state.p) !== o.stop) go(o.stop); else o.wob = 1;
});

/* ================= ciclo ================= */
const state = { p: 0, intro: REDUCE ? 1 : 0, night: 0 };
const tmpT = V3(), tmpP = V3(), wobQ = new THREE.Quaternion();
const WATER_D = new THREE.Color(0x5FAFC8), WATER_N = new THREE.Color(0x1C3E52), HEMI_D = new THREE.Color(0xFFFFFF), HEMI_N = new THREE.Color(0x3A5670), SUN_D = new THREE.Color(0xFFF6EA), SUN_N = new THREE.Color(0x8FB3D9);
let worldHidden = false, navDark = false;
let last = performance.now(), t = 0, isNight = false;
notes.forEach((n) => { n._v = -1; [...n.children].forEach((c, i) => c.style.setProperty('--i', i)); });
function readP(){ return clamp((scrollY - track.offsetTop) / trackLen()) * (N - 1); }
function frame(now){
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
  const p = state.p = readP();
  state.intro = Math.min(1, state.intro + dt / 1.9);
  // câmara: entre duas paragens sobe um pouco e volta a descer, como num voo por cima da cidade
  const i = Math.min(N - 2, Math.floor(p)), f = p - i, e = smoother(clamp((f - 0.14) / 0.72));
  const A = STOPS[i], Bs = STOPS[i + 1];
  tmpT.lerpVectors(A.T, Bs.T, e);
  const hump = A.T.distanceTo(Bs.T) * 0.4 * Math.sin(Math.PI * e);
  const ie = 1 - smooth(state.intro);
  const s = { T: tmpT, ph: lerp(A.ph, Bs.ph, e) + ie * 16, yaw: lerp(A.yaw, Bs.yaw, e) - ie * 0.25 };
  const d = (lerp(A.d, Bs.d, e) + hump) * (1 + ie * 0.4);
  camera.position.copy(camPosFor(s, d));
  mouse.sx = damp(mouse.sx, L.mobile ? 0 : mouse.x, 3, dt); mouse.sy = damp(mouse.sy, L.mobile ? 0 : mouse.y, 3, dt);
  camera.position.x += mouse.sx * d * 0.02; camera.position.z += mouse.sy * d * 0.015;
  camera.lookAt(tmpT);
  camera.setViewOffset(L.W, L.H, lerp(A.ox, Bs.ox, e), lerp(A.oy, Bs.oy, e), L.W, L.H);
  // anoitece a caminho da última paragem
  const nt = state.night = smooth(clamp(p - (N - 2)));
  scene.background.lerpColors(DAY, NIGHT, nt); scene.fog.color.copy(scene.background);
  hemi.color.lerpColors(HEMI_D, HEMI_N, nt); hemi.intensity = lerp(1.0, 0.5, nt);
  sun.color.lerpColors(SUN_D, SUN_N, nt); sun.intensity = lerp(2.2, 0.35, nt);
  bMat.emissiveIntensity = nt * 1.15; lampMat.opacity = nt * 0.95;
  water.material.color.lerpColors(WATER_D, WATER_N, nt);
  isNight = nt > 0.5;
  castle.userData.flag.rotation.y = Math.sin(t * 3) * 0.25;
  // objetos: levantam-se ao chegar à sua paragem
  OBJS.forEach((o) => {
    const l = o.stop >= 0 ? smooth(clamp((0.62 - Math.abs(p - o.stop)) / 0.46)) : 0;
    o.lift = damp(o.lift, l, 6, dt);
    o.hov = damp(o.hov, hovered === o && o.lift < 0.4 ? 1 : 0, 9, dt);
    o.wob = Math.max(0, o.wob - dt * 1.4);
    const k = smooth(o.lift);
    tmpP.copy(o.pos);
    if (o.lp) tmpP.lerp(o.lp, k);
    tmpP.y += o.hov * 0.16 + (o.liftH ? Math.sin(t * 1.5 + o.pos.x) * 0.06 : 0);
    o.root.position.copy(tmpP);
    if (o.qFace) o.root.quaternion.slerpQuaternions(o.q0, o.qFace, o.faceK * k); else o.root.quaternion.copy(o.q0);
    if (o.wob > 0){ wobQ.setFromAxisAngle(V3(0, 0, 1), Math.sin(o.wob * 22) * 0.06 * o.wob); o.root.quaternion.multiply(wobQ); }
    o.update?.(dt, t, k, nt);
  });
  // cartões e botões
  const a = Math.round(p);
  notes.forEach((n, k) => {
    // cheio até 0,1 da paragem, desaparece até 0,42: entre duas paragens a câmara voa sem cartão por cima
    const v = REDUCE ? (Math.abs(p - k) < 0.42 ? 1 : 0) : smooth(clamp((0.42 - Math.abs(p - k)) / 0.32)), dir = p < k ? 1 : -1;
    if (Math.abs(v - n._v) < 0.002 && dir === n._dir) return;
    n._v = v; n._dir = dir;
    n.style.setProperty('--v', v.toFixed(3)); n.style.setProperty('--dir', dir);
    n.classList.toggle('vis', v > 0.01); n.classList.toggle('full', v > 0.995); n.classList.toggle('on', v > 0.6);
  });
  stopBtns.forEach((b, k) => b.classList.toggle('on', k === a));
  hint.classList.toggle('off', p > 0.15);
  const tb = track.getBoundingClientRect().bottom, past = tb <= 0, dark = tb < 72 || isNight;
  if (dark !== navDark){ navDark = dark; document.body.classList.toggle('night', dark); }
  if (past !== worldHidden){ worldHidden = past; canvas.style.visibility = past ? 'hidden' : ''; }
  if (past) return;
  renderer.render(scene, camera);
}
function loop(now){ lenis?.raf(now); frame(now); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
Promise.all([UI(500, 16), UI(600, 16), UI(700, 16), UI(800, 16), MONO(16)].map((f) => document.fonts.load(f))).then(() => {
  OBJS.forEach((o) => o.draw?.()); layout();
});
document.fonts.ready.then(layout);
