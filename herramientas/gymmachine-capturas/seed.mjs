// Siembra datos de DEMOSTRACIÓN en el Firebase Local Emulator (nunca en la base real).
// Auth: http://localhost:9099 · Firestore: http://localhost:8080 · proyecto gymmachine-54965
const P = 'gymmachine-54965';
const AUTH = 'http://localhost:9099/identitytoolkit.googleapis.com/v1';
const FS = `http://localhost:8080/v1/projects/${P}/databases/(default)/documents`;
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer owner' };

// ---------- helpers de tipos de Firestore REST ----------
const v = (x) => {
  if (x === null || x === undefined) return { nullValue: null };
  if (x instanceof Date) return { timestampValue: x.toISOString() };
  if (typeof x === 'boolean') return { booleanValue: x };
  if (typeof x === 'number') return Number.isInteger(x) && !x.__d ? { integerValue: String(x) } : { doubleValue: +x };
  if (typeof x === 'string') return { stringValue: x };
  if (Array.isArray(x)) return { arrayValue: { values: x.map(v) } };
  if (x.__dbl !== undefined) return { doubleValue: x.__dbl };
  return { mapValue: { fields: Object.fromEntries(Object.entries(x).map(([k, y]) => [k, v(y)])) } };
};
const D = (n) => ({ __dbl: n }); // fuerza double
const doc = (o) => ({ fields: Object.fromEntries(Object.entries(o).map(([k, y]) => [k, v(y)])) });
async function put(path, data) {
  const r = await fetch(`${FS}/${path}`, { method: 'PATCH', headers: H, body: JSON.stringify(doc(data)) });
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`);
}
let n = 0; const id = (p) => `${p}${(++n).toString(36).padStart(4, '0')}`;
async function signUp(email, password) {
  const r = await fetch(`${AUTH}/accounts:signUp?key=demo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
  const j = await r.json(); if (!j.localId) throw new Error(JSON.stringify(j)); return j.localId;
}
const hoy = new Date();
const dias = (d, h = 10, m = 0) => { const x = new Date(hoy); x.setDate(x.getDate() + d); x.setHours(h, m, 0, 0); return x; };

// ---------- limpiar emulador ----------
await fetch(`http://localhost:8080/emulator/v1/projects/${P}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://localhost:9099/emulator/v1/projects/${P}/accounts`, { method: 'DELETE' });

// ---------- gimnasio ----------
await put('gimnasio/config', {
  a_nombre: 'GymMachine · Celaya', a_dir: 'Av. Tecnológico 100, Celaya, Gto.', a_tel: '461 555 0102', a_email: 'hola@gymmachine.mx',
  a_diasAb: [1, 2, 3, 4, 5, 6], a_horDias: { 1: '06:00 – 22:00', 2: '06:00 – 22:00', 3: '06:00 – 22:00', 4: '06:00 – 22:00', 5: '06:00 – 22:00', 6: '08:00 – 14:00', 7: '' },
  a_diasPrev: 3, a_cupoMax: 50, a_avisoOn: true, a_logo: '',
});
const planes = [
  { id: 'mensual', a_nombre: 'Mensual', a_monto: 450, a_dias: 30, a_desc: 'Acceso ilimitado a sala y clases', a_popular: true },
  { id: 'trimestral', a_nombre: 'Trimestral', a_monto: 1200, a_dias: 90, a_desc: 'Ahorra $150 frente al mensual', a_popular: false },
  { id: 'anual', a_nombre: 'Anual', a_monto: 4200, a_dias: 365, a_desc: 'El mejor precio por mes', a_popular: false },
  { id: 'estudiante', a_nombre: 'Estudiante', a_monto: 400, a_dias: 30, a_desc: 'Tarifa especial con credencial vigente', a_popular: false },
];
for (const p of planes) { const { id: pid, ...r } = p; await put(`planes/${pid}`, r); }

// ---------- cuentas de login (solo existen en el emulador) ----------
const PASS = 'demo1234';
const uAdmin = await signUp('dueno@gymmachine.demo', PASS);
const uEntr = await signUp('entrenador@gymmachine.demo', PASS);
const uMiem = await signUp('miembro@gymmachine.demo', PASS);

await put(`administradores/${uAdmin}`, { a_nombre: 'Jesús', a_apelll: 'Vargas', a_email: 'dueno@gymmachine.demo', a_rol: 'administrador', a_foto: '' });
const entrenadores = [
  { uid: uEntr, a_nombre: 'Felipe', a_apelll: 'Hernández', a_email: 'entrenador@gymmachine.demo', a_wapp: '4611111111', a_espec: 'Fuerza e hipertrofia' },
  { uid: 'entr_daniela', a_nombre: 'Daniela', a_apelll: 'Ruiz', a_email: 'daniela@gymmachine.demo', a_wapp: '4612222222', a_espec: 'Funcional y pérdida de grasa' },
  { uid: 'entr_marco', a_nombre: 'Marco', a_apelll: 'López', a_email: 'marco@gymmachine.demo', a_wapp: '4613333333', a_espec: 'Acondicionamiento y movilidad' },
];
for (const e of entrenadores) { const { uid, ...r } = e; await put(`entrenadores/${uid}`, { ...r, a_foto: '', a_rol: 'entrenador' }); }

// ---------- miembros ----------
const imc = (p, a) => D(Math.round((p / (a * a)) * 10) / 10);
const miembros = [
  { uid: uMiem, a_nombre: 'Mike', a_apelll: 'García', a_email: 'miembro@gymmachine.demo', a_tel: '4614440101', a_peso: 78.5, a_altura: 1.75, a_objet: 'Ganar masa', a_trainId: uEntr, alta: -64, venc: 12, plan: 'mensual', enGym: false },
  { uid: 'm_sofia', a_nombre: 'Sofía', a_apelll: 'Ramírez', a_tel: '4614440102', a_peso: 61, a_altura: 1.63, a_objet: 'Tonificar', a_trainId: uEntr, alta: -120, venc: 2, plan: 'mensual', enGym: true },
  { uid: 'm_diego', a_nombre: 'Diego', a_apelll: 'Torres', a_tel: '4614440103', a_peso: 92, a_altura: 1.80, a_objet: 'Bajar grasa', a_trainId: uEntr, alta: -40, venc: 50, plan: 'trimestral', enGym: true },
  { uid: 'm_andrea', a_nombre: 'Andrea', a_apelll: 'Mendoza', a_tel: '4614440104', a_peso: 57, a_altura: 1.58, a_objet: 'Resistencia', a_trainId: uEntr, alta: -300, venc: 65, plan: 'anual', enGym: false },
  { uid: 'm_luis', a_nombre: 'Luis', a_apelll: 'Castillo', a_tel: '4614440105', a_peso: 84, a_altura: 1.77, a_objet: 'Ganar masa', a_trainId: uEntr, alta: -15, venc: -3, plan: 'mensual', enGym: false },
  { uid: 'm_valeria', a_nombre: 'Valeria', a_apelll: 'Ortiz', a_tel: '4614440106', a_peso: 66, a_altura: 1.66, a_objet: 'Bajar grasa', a_trainId: 'entr_daniela', alta: -90, venc: 20, plan: 'estudiante', enGym: true },
  { uid: 'm_jorge', a_nombre: 'Jorge', a_apelll: 'Navarro', a_tel: '4614440107', a_peso: 101, a_altura: 1.82, a_objet: 'Bajar grasa', a_trainId: 'entr_daniela', alta: -200, venc: 1, plan: 'mensual', enGym: false },
  { uid: 'm_paola', a_nombre: 'Paola', a_apelll: 'Silva', a_tel: '4614440108', a_peso: 59, a_altura: 1.60, a_objet: 'Tonificar', a_trainId: 'entr_daniela', alta: -30, venc: 28, plan: 'mensual', enGym: true },
  { uid: 'm_ricardo', a_nombre: 'Ricardo', a_apelll: 'Flores', a_tel: '4614440109', a_peso: 76, a_altura: 1.74, a_objet: 'Movilidad', a_trainId: 'entr_marco', alta: -150, venc: 40, plan: 'trimestral', enGym: false },
  { uid: 'm_fernanda', a_nombre: 'Fernanda', a_apelll: 'Reyes', a_tel: '4614440110', a_peso: 63, a_altura: 1.68, a_objet: 'Resistencia', a_trainId: 'entr_marco', alta: -60, venc: 9, plan: 'mensual', enGym: true },
  { uid: 'm_emilio', a_nombre: 'Emilio', a_apelll: 'Vega', a_tel: '4614440111', a_peso: 70, a_altura: 1.71, a_objet: 'Ganar masa', a_trainId: 'entr_marco', alta: -10, venc: 20, plan: 'mensual', enGym: false },
  { uid: 'm_camila', a_nombre: 'Camila', a_apelll: 'Morales', a_tel: '4614440112', a_peso: 55, a_altura: 1.57, a_objet: 'Tonificar', a_trainId: 'entr_daniela', alta: -5, venc: 25, plan: 'estudiante', enGym: true },
];
for (const m of miembros) {
  await put(`usuarios/${m.uid}`, {
    a_nombre: m.a_nombre, a_apelll: m.a_apelll, a_email: m.a_email || `${m.a_nombre.toLowerCase()}@correo.demo`, a_tel: m.a_tel,
    a_peso: D(m.a_peso), a_altura: D(m.a_altura), a_imc: imc(m.a_peso, m.a_altura), a_objet: m.a_objet, a_rol: 'miembro',
    a_trainId: m.a_trainId, a_fechaAlta: dias(m.alta), a_fechaVenc: dias(m.venc, 23, 59), a_enGym: m.enGym, a_ultAcceso: dias(0, 7 + (m.a_peso % 6), 15), a_foto: '',
  });
}

// ---------- pagos: 12 meses de historial + los de hoy ----------
const precio = Object.fromEntries(planes.map((p) => [p.id, p.a_monto]));
const metodos = ['efectivo', 'tarjeta', 'transferencia'];
let pagosHoy = 0;
for (let mes = 11; mes >= 0; mes--) {
  const cuantos = 14 + ((11 - mes) * 3) % 11; // crecimiento suave
  for (let k = 0; k < cuantos; k++) {
    const m = miembros[1 + ((k + mes) % (miembros.length - 1))]; // Mike tiene su propio historial abajo
    const d = new Date(hoy); d.setMonth(d.getMonth() - mes); d.setDate(1 + ((k * 7 + mes) % 27)); d.setHours(9 + (k % 10), (k * 13) % 60, 0, 0);
    if (d > hoy) continue;
    const pid = id('pg');
    const data = { a_uid: m.uid, a_nombre: `${m.a_nombre} ${m.a_apelll}`, a_monto: precio[m.plan], a_metodo: metodos[k % 3], a_planId: m.plan, a_fecha: d, a_nuevaVenc: new Date(d.getTime() + 30 * 864e5) };
    await put(`pagos/${pid}`, data);
  }
}
for (const [k, m] of [miembros[1], miembros[6], miembros[9]].entries()) { // cobros de hoy
  const data = { a_uid: m.uid, a_nombre: `${m.a_nombre} ${m.a_apelll}`, a_monto: precio[m.plan], a_metodo: metodos[k], a_planId: m.plan, a_fecha: dias(0, 8 + k * 2, 10), a_nuevaVenc: dias(30) };
  await put(`pagos/${id('pg')}`, data); pagosHoy++;
}
// historial propio de Mike (renovaciones mensuales)
for (const mesAtras of [2, 1, 0]) {
  const d = dias(-18 - 30 * mesAtras, 18, 20);
  const pm = id('pm'); const dataM = { a_uid: uMiem, a_nombre: 'Mike García', a_monto: 450, a_metodo: mesAtras ? 'efectivo' : 'tarjeta', a_planId: 'mensual', a_fecha: d, a_nuevaVenc: new Date(d.getTime() + 30 * 864e5) };
  await put(`usuarios/${uMiem}/pagos/${pm}`, dataM); await put(`pagos/${pm}`, dataM);
}

// ---------- rutinas de Mike (con ejercicios) ----------
const rutinas = [
  { nombre: 'Empuje · Pecho y tríceps', desc: 'Fuerza en press y aislamiento de tríceps', dias: [1, 4], activa: true,
    ej: [['Press de banca', 4, 8, 70], ['Press inclinado con mancuernas', 3, 10, 26], ['Aperturas en polea', 3, 12, 15], ['Fondos en paralelas', 3, 10, 0], ['Extensión de tríceps en polea', 3, 12, 25]] },
  { nombre: 'Jalón · Espalda y bíceps', desc: 'Dominadas, remos y curl', dias: [2, 5], activa: false,
    ej: [['Dominadas asistidas', 4, 8, 20], ['Remo con barra', 4, 10, 60], ['Jalón al pecho', 3, 12, 50], ['Curl con barra', 3, 10, 30], ['Curl martillo', 3, 12, 14]] },
  { nombre: 'Pierna completa', desc: 'Sentadilla, peso muerto rumano y accesorios', dias: [3, 6], activa: false,
    ej: [['Sentadilla libre', 4, 8, 90], ['Peso muerto rumano', 3, 10, 70], ['Prensa de pierna', 3, 12, 160], ['Zancadas', 3, 12, 16], ['Elevación de talones', 4, 15, 40]] },
];
for (const r of rutinas) {
  const rid = id('rt');
  await put(`usuarios/${uMiem}/rutinas/${rid}`, { a_nombre: r.nombre, a_desc: r.desc, a_dias: r.dias, a_fechaCrea: dias(-30), a_activa: r.activa });
  for (const [i, [nom, s, rep, peso]] of r.ej.entries()) await put(`usuarios/${uMiem}/rutinas/${rid}/ejercicios/${id('ej')}`, { a_nombre: nom, a_series: s, a_repeticiones: rep, a_peso: D(peso), a_orden: i });
}
// rutina para otra miembro (para que el entrenador vea más de un expediente con contenido)
{ const rid = id('rt'); await put(`usuarios/m_sofia/rutinas/${rid}`, { a_nombre: 'Glúteo y pierna', a_desc: 'Hip thrust y sentadilla búlgara', a_dias: [1, 3, 5], a_fechaCrea: dias(-12), a_activa: true });
  for (const [i, [nom, s, rep, peso]] of [['Hip thrust', 4, 10, 60], ['Sentadilla búlgara', 3, 10, 12], ['Abducción en máquina', 3, 15, 35]].entries()) await put(`usuarios/m_sofia/rutinas/${rid}/ejercicios/${id('ej')}`, { a_nombre: nom, a_series: s, a_repeticiones: rep, a_peso: D(peso), a_orden: i }); }

// ---------- dieta activa de Mike ----------
{
  const did = id('dt');
  await put(`usuarios/${uMiem}/dietas/${did}`, { a_nombre: 'Volumen limpio', a_objetivo: 'Ganar masa · 2,600 kcal', a_objt: 'Ganar masa · 2,600 kcal', a_activa: true, a_fechaCrea: dias(-20) });
  const comidas = [
    ['Avena con plátano y crema de cacahuate', 'Desayuno', '08:00', 620, 22, 88, 18, 1],
    ['Huevos revueltos con espinaca', 'Desayuno', '08:00', 280, 20, 4, 20, 1],
    ['Yogur griego con frutos rojos', 'Almuerzo', '12:00', 240, 20, 28, 5, 1],
    ['Pechuga a la plancha con arroz y brócoli', 'Comida', '15:00', 720, 55, 85, 14, 1],
    ['Tortillas de maíz', 'Comida', '15:00', 180, 4, 36, 2, 3],
    ['Salmón con papa al horno', 'Cena', '20:00', 560, 38, 45, 22, 1],
  ];
  for (const [nom, grp, hora, kcal, p, c, g, porc] of comidas) {
    await put(`usuarios/${uMiem}/dietas/${did}/comidas/${id('cm')}`, { a_nombre: nom, a_comida: grp, a_hora: hora, a_calorias: D(kcal), a_prot: D(p), a_carb: D(c), a_grasa: D(g), a_porciones: porc, a_foto: '', a_desc: `${porc} porción · ${grp}` });
  }
}

// ---------- sesiones de entrenamiento de Mike (este mes y el anterior) ----------
for (let d = -34; d <= 0; d++) {
  const f = dias(d, 7, 30); const wd = ((f.getDay() + 6) % 7) + 1; // 1=lunes
  if (wd === 7 || ((d % 5) + 5) % 5 === 3) continue; // descansa domingos y algunos días (hoy sí entrenó)
  const tot = 5, hechos = d % 6 === 0 ? 4 : 5;
  await put(`usuarios/${uMiem}/sesiones/${id('se')}`, { a_uid: uMiem, a_fecha: f, a_dur: 2700 + ((d * 97) % 900 + 900) % 900, a_ejer: hechos, a_ejerTot: tot, a_completa: hechos === tot });
}

// ---------- asistencia general del gimnasio (mes actual) ----------
const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
for (let d = new Date(inicioMes); d <= hoy; d.setDate(d.getDate() + 1)) {
  const wd = ((d.getDay() + 6) % 7) + 1; if (wd === 7) continue;
  for (const [k, m] of miembros.entries()) {
    if ((k + d.getDate()) % 3 === 0) continue;
    const f = new Date(d); f.setHours(6 + ((k * 3 + d.getDate()) % 14), (k * 11) % 60, 0, 0);
    if (f > hoy) continue;
    await put(`asistencia/${id('as')}`, { a_uid: m.uid, a_nombre: `${m.a_nombre} ${m.a_apelll}`, a_fecha: f, a_tipo: 'entrada' });
  }
}

// ---------- mediciones de Mike (progreso para la gráfica del entrenador) ----------
const med = [[-150, 72.0, 18.5, 33.0, 84, 96, 98], [-120, 73.4, 18.0, 33.8, 84, 97, 99], [-90, 74.9, 17.6, 34.6, 83, 97, 100], [-60, 76.2, 17.1, 35.5, 83, 98, 102], [-30, 77.6, 16.8, 36.2, 82, 98, 103], [-2, 78.5, 16.4, 36.9, 82, 99, 104]];
for (const [d, peso, grasa, musc, cint, cadr, pech] of med) {
  await put(`usuarios/${uMiem}/mediciones/${id('md')}`, { a_fecha: dias(d, 9), a_peso: D(peso), a_grasa: D(grasa), a_musc: D(musc), a_cint: D(cint), a_cadr: D(cadr), a_pech: D(pech), a_imc: imc(peso, 1.75) });
}

console.log(JSON.stringify({ ok: true, admin: uAdmin, entrenador: uEntr, miembro: uMiem, pagosHoy, docs: n }));
