/* =========================================================
   Don Pirone - Sistema de Comandas (SPA em 1 página)
   Persistência em localStorage
   ========================================================= */

const APP_KEY = 'donpirone_state_v1';
const USER_KEY = 'donpirone_user_v1';

const state = loadState() || createInitialState();
saveState(); // garante estrutura no LS

// Produtos (6 categorias, 8 itens cada)
const CATEGORIES = [
  { id:'cervejas', label:'Cervejas', icon:'bi-beer' },
  { id:'naoalcool', label:'Bebidas não alcoólicas', icon:'bi-cup-straw' },
  { id:'petiscos', label:'Petiscos', icon:'bi-egg-fried' },
  { id:'espetinhos', label:'Espetinhos', icon:'bi-fire' },
  { id:'sanduiches', label:'Sanduíches', icon:'bi-bag' },
  { id:'drinks', label:'Drinks', icon:'bi-cup' },
];

// Gera produtos demo
const PRODUCTS = {
  cervejas: [
    {id:'cer1', name:'Brahma 600ml', price:12.9},
    {id:'cer2', name:'Spaten 600ml', price:14.9},
    {id:'cer3', name:'Heinehen 600ml', price:16.9},
    {id:'cer4', name:'Amstel 600ml', price:13.9},
    {id:'cer5', name:'Stella Artois 600ml', price:17.9},
    {id:'cer6', name:'Devassa 600ml', price:11.9},
    {id:'cer7', name:'Heineken (lata) Sem Álcool', price:10.5},
    {id:'cer8', name:'Brahma (lata) Sem Álcool', price:8.5},
  ],
  naoalcool: [
    {id:'na1', name:'Água sem gás', price:4.0},
    {id:'na2', name:'Água com gás', price:5.0},
    {id:'na3', name:'Refrigerante lata', price:7.0},
    {id:'na4', name:'Suco laranja', price:9.0},
    {id:'na5', name:'Energético', price:9.0},
    {id:'na6', name:'H2O 500ml', price:8.0},
    {id:'na7', name:'Refrigerante 1L', price:12.0},
    {id:'na8', name:'Tônica lata', price:8.5},
  ],
  petiscos: [
    {id:'pt1', name:'Batata frita', price:22.0},
    {id:'pt2', name:'Calabresa acebolada', price:28.0},
    {id:'pt3', name:'Frango a passarinho', price:35.0},
    {id:'pt4', name:'Dadinho de tapioca', price:27.0},
    {id:'pt5', name:'Isca de peixe', price:39.0},
    {id:'pt6', name:'Queijo coalho', price:26.0},
    {id:'pt7', name:'Onion rings', price:24.0},
    {id:'pt8', name:'Torresmo pururuca', price:29.0},
  ],
  espetinhos: [
    {id:'es1', name:'Boi', price:10.0},
    {id:'es2', name:'Frango', price:9.0},
    {id:'es3', name:'Queijo coalho', price:8.0},
    {id:'es4', name:'Kafta', price:9.0},
    {id:'es5', name:'Coração', price:9.5},
    {id:'es6', name:'Medalhão de carne', price:15.0},
    {id:'es7', name:'Medalhão de frango', price:14.0},
    {id:'es8', name:'Pão de alho', price:8.5},
  ],
  sanduiches: [
    {id:'sa1', name:'X-Burger', price:14.0},
    {id:'sa2', name:'X-Salada', price:15.0},
    {id:'sa3', name:'X-Bacon', price:22.0},
    {id:'sa4', name:'X-Frango', price:21.0},
    {id:'sa5', name:'X-Filé', price:25.0},
    {id:'sa6', name:'Don Pirone especial', price:29.0},
    {id:'sa7', name:'Passaport', price:20.0},
    {id:'sa8', name:'Hot Dog', price:14.0},
  ],
  drinks: [
    {id:'dk1', name:'Caipirinha', price:16.0},
    {id:'dk2', name:'Caipiroska', price:18.0},
    {id:'dk3', name:'Gin tônica', price:22.0},
    {id:'dk4', name:'Mojito', price:20.0},
    {id:'dk5', name:'Piña colada', price:24.0},
    {id:'dk6', name:'Negroni', price:26.0},
    {id:'dk7', name:'Aperol Spritz', price:25.0},
    {id:'dk8', name:'Clericot', price:28.0},
  ],
};

// ========= Helpers de Storage =========
function createInitialState(){
  const tables = {};
  for (let i=1;i<=10;i++){
    tables[i] = {
      items: [],           // [{id, name, price, qty}]
      extraValue: 0,       // R$
      extraPerc: 0,        // %
      discValue: 0,        // R$
      discPerc: 0,         // %
    };
  }
  return { tables, currentUser: null, currentMesa: null, currentCategory: 'cervejas' };
}

function loadState(){
  try{
    const raw = localStorage.getItem(APP_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function saveState(){
  localStorage.setItem(APP_KEY, JSON.stringify(state));
}

function loadUser(){
  try{
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function saveUser(u){
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}

// ========= Formatação de moeda =========
const fmtBRL = (v)=> v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

// ========= Navegação entre “views” =========
const viewLogin = document.getElementById('view-login');
const viewDash  = document.getElementById('view-dashboard');
const viewMesa  = document.getElementById('view-mesa');

function showView(id){
  [viewLogin, viewDash, viewMesa].forEach(s=>s.classList.add('d-none'));
  document.getElementById(id).classList.remove('d-none');
}

// ========= LOGIN =========
const formLogin = document.getElementById('formLogin');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const rememberMe = document.getElementById('rememberMe');
const forgotLink = document.getElementById('forgotLink');

(function hydrateLogin(){
  const u = loadUser();
  if(u){
    loginUser.value = u.user || '';
    loginPass.value = u.remember ? (u.pass || '') : '';
    rememberMe.checked = !!u.remember;
  }
})();

formLogin.addEventListener('submit', (e)=>{
  e.preventDefault();
  // Qualquer login pode entrar
  const user = loginUser.value.trim();
  const pass = loginPass.value.trim();

  state.currentUser = user || 'Usuário';
  saveState();

  // “Lembrar minha senha” (apenas DEMO – não use em produção)
  saveUser({ user, pass: rememberMe.checked ? pass : '', remember: rememberMe.checked });

  renderDashboard();
  showView('view-dashboard');
});

forgotLink.addEventListener('click',(e)=>{
  e.preventDefault();
  alert('Demonstração: como é um sistema local, basta redefinir digitando outra senha :)');
});

// ========= DASHBOARD: Mesas =========
const gridMesas = document.getElementById('gridMesas');
const btnLogout = document.getElementById('btnLogout');
const btnLogout2 = document.getElementById('btnLogout2');

btnLogout.addEventListener('click', logout);
btnLogout2.addEventListener('click', logout);

function logout(){
  state.currentUser = null;
  saveState();
  showView('view-login');
}

function renderDashboard(){
  gridMesas.innerHTML = '';
  for (let i=1;i<=10;i++){
    const mesa = state.tables[i];
    const subtotal = mesa.items.reduce((s,it)=> s + it.price*it.qty, 0);
    const ajustes = calcAdjustments(mesa, subtotal);
    const total = subtotal + ajustes;
    const ocupada = mesa.items.length>0 || total>0;

    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';

    col.innerHTML = `
      <div class="mesa-card" data-mesa="${i}">
        <div class="d-flex justify-content-between align-items-start">
          <div class="mesa-title">
            <i class="bi bi-table"></i> Mesa ${i}
          </div>
          <span class="badge-status ${ocupada?'badge-ocupada':'badge-livre'}">
            ${ocupada ? 'Ocupada' : 'Livre'}
          </span>
        </div>
        <div class="mt-2 small text-muted">Total até o momento</div>
        <div class="fs-5 fw-bold">${fmtBRL(Math.max(total,0))}</div>
      </div>
    `;
    col.querySelector('.mesa-card').addEventListener('click',()=>{
      openMesa(i);
    });
    gridMesas.appendChild(col);
  }

  // Preencher selects e checkboxes dos modais
  fillTransferMergeControls();
}

function fillTransferMergeControls(){
  const transferFrom = document.getElementById('transferFrom');
  const transferTo   = document.getElementById('transferTo');
  const mergeTarget  = document.getElementById('mergeTarget');
  const mergeSources = document.getElementById('mergeSources');

  const opts = Array.from({length:10}, (_,k)=>k+1).map(n=>`<option value="${n}">Mesa ${n}</option>`).join('');
  transferFrom.innerHTML = opts;
  transferTo.innerHTML   = opts;
  mergeTarget.innerHTML  = opts;

  mergeSources.innerHTML = '';
  for (let i=1;i<=10;i++){
    const div = document.createElement('div');
    div.className = 'form-check';
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${i}" id="merge_${i}">
      <label class="form-check-label" for="merge_${i}">Mesa ${i}</label>
    `;
    mergeSources.appendChild(div);
  }
}

// Transferência
document.getElementById('formTransferir').addEventListener('submit',(e)=>{
  e.preventDefault();
  const from = parseInt(document.getElementById('transferFrom').value,10);
  const to   = parseInt(document.getElementById('transferTo').value,10);
  if(from===to){ alert('Escolha mesas diferentes.'); return; }
  // move tudo
  const A = state.tables[from];
  const B = state.tables[to];
  B.items = B.items.concat(A.items);
  B.extraValue += A.extraValue;
  B.extraPerc  += A.extraPerc;
  B.discValue  += A.discValue;
  B.discPerc   += A.discPerc;

  // limpa origem
  state.tables[from] = { items:[], extraValue:0, extraPerc:0, discValue:0, discPerc:0 };
  saveState();
  renderDashboard();
  bootstrap.Modal.getInstance(document.getElementById('modalTransferir')).hide();
});

// Junção
document.getElementById('formJuntar').addEventListener('submit',(e)=>{
  e.preventDefault();
  const target = parseInt(document.getElementById('mergeTarget').value,10);
  const checks = [...document.querySelectorAll('#mergeSources input[type=checkbox]:checked')].map(c=>parseInt(c.value,10));
  const sources = checks.filter(n=>n!==target);
  if(sources.length===0){ alert('Marque ao menos uma mesa para somar.'); return; }

  const T = state.tables[target];
  sources.forEach(n=>{
    const S = state.tables[n];
    T.items = T.items.concat(S.items);
    T.extraValue += S.extraValue;
    T.extraPerc  += S.extraPerc;
    T.discValue  += S.discValue;
    T.discPerc   += S.discPerc;
    state.tables[n] = { items:[], extraValue:0, extraPerc:0, discValue:0, discPerc:0 };
  });

  saveState();
  renderDashboard();
  bootstrap.Modal.getInstance(document.getElementById('modalJuntar')).hide();
});

// ========= TELA DA MESA =========
const sidebarMesas = document.getElementById('sidebarMesas');
const offcanvasMesasList = document.getElementById('offcanvasMesasList');
const mesaAtualLabel = document.getElementById('mesaAtualLabel');
const btnVoltarMesas = document.getElementById('btnVoltarMesas');

btnVoltarMesas.addEventListener('click', ()=>{ renderDashboard(); showView('view-dashboard'); });

function openMesa(n){
  state.currentMesa = n;
  saveState();
  renderMesa();
  showView('view-mesa');
}

function renderMesa(){
  // Lado esquerdo: lista de mesas (sidebar + offcanvas)
  sidebarMesas.innerHTML = '';
  offcanvasMesasList.innerHTML = '';
  for (let i=1;i<=10;i++){
    const b1 = document.createElement('button');
    b1.className = 'btn btn-sm ' + (i===state.currentMesa ? 'btn-primary' : 'btn-outline-secondary');
    b1.textContent = `Mesa ${i}`;
    b1.addEventListener('click',()=> openMesa(i));
    sidebarMesas.appendChild(b1);

    const b2 = document.createElement('button');
    b2.className = 'btn ' + (i===state.currentMesa ? 'btn-primary' : 'btn-outline-secondary');
    b2.textContent = `Mesa ${i}`;
    b2.setAttribute('data-bs-dismiss','offcanvas');
    b2.addEventListener('click',()=> openMesa(i));
    offcanvasMesasList.appendChild(b2);
  }

  mesaAtualLabel.textContent = state.currentMesa;

  // Categorias
  const catButtons = document.getElementById('catButtons');
  catButtons.innerHTML = '';
  CATEGORIES.forEach(c=>{
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm ' + (state.currentCategory===c.id ? 'btn-primary' : 'btn-outline-primary');
    btn.innerHTML = `<i class="bi ${c.icon}"></i> ${c.label}`;
    btn.addEventListener('click',()=>{
      state.currentCategory = c.id;
      saveState();
      renderProducts();
    });
    catButtons.appendChild(btn);
  });

  // Inputs de ajustes e dividir
  linkAdjustInputs();
  renderProducts();
  renderCart();
}

function renderProducts(){
  const grid = document.getElementById('produtosGrid');
  grid.innerHTML = '';
  const list = PRODUCTS[state.currentCategory] || [];
  list.forEach(p=>{
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4';
    col.innerHTML = `
      <div class="prod-card">
        <div>
          <div class="prod-title">${p.name}</div>
          <div class="small text-muted mb-2">Cód: ${p.id}</div>
          <div class="price mb-2">${fmtBRL(p.price)}</div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <div class="btn-group qty-group" role="group">
            <button class="btn btn-outline-secondary btn-sm" data-act="minus"><i class="bi bi-dash"></i></button>
            <button class="btn btn-outline-secondary btn-sm" data-act="add"><i class="bi bi-plus"></i></button>
          </div>
          <button class="btn btn-primary btn-sm" data-act="add"><i class="bi bi-cart-plus"></i> Adicionar</button>
        </div>
      </div>
    `;
    // Eventos
    col.querySelectorAll('[data-act="add"]').forEach(b=> b.addEventListener('click',()=> addItemToMesa(p)));
    col.querySelector('[data-act="minus"]').addEventListener('click',()=> addItemToMesa(p, -1));
    grid.appendChild(col);
  });
}

function addItemToMesa(prod, delta=1){
  const mesa = state.tables[state.currentMesa];
  let item = mesa.items.find(it=> it.id===prod.id);
  if(!item){
    if(delta<0) return; // não cria negativo
    item = { id:prod.id, name:prod.name, price:prod.price, qty:0 };
    mesa.items.push(item);
  }
  item.qty += delta;
  if(item.qty<=0){
    mesa.items = mesa.items.filter(it=> it.id!==prod.id);
  }
  saveState();
  renderCart();
}

function renderCart(){
  const cont = document.getElementById('listaComanda');
  cont.innerHTML = '';
  const mesa = state.tables[state.currentMesa];

  mesa.items.forEach((it, idx)=>{
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <div class="title">${it.name}</div>
          <div class="muted small">${fmtBRL(it.price)} × ${it.qty}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="btn-group" role="group">
            <button class="btn btn-outline-secondary btn-sm" data-act="minus"><i class="bi bi-dash"></i></button>
            <button class="btn btn-outline-secondary btn-sm" data-act="plus"><i class="bi bi-plus"></i></button>
          </div>
          <button class="btn btn-outline-danger btn-sm" data-act="del"><i class="bi bi-trash"></i></button>
        </div>
      </div>
      <div class="text-end fw-semibold mt-1">${fmtBRL(it.price*it.qty)}</div>
    `;
    row.querySelector('[data-act="minus"]').addEventListener('click',()=>{
      it.qty -= 1; if(it.qty<=0){ mesa.items.splice(idx,1); }
      saveState(); renderCart();
    });
    row.querySelector('[data-act="plus"]').addEventListener('click',()=>{
      it.qty += 1; saveState(); renderCart();
    });
    row.querySelector('[data-act="del"]').addEventListener('click',()=>{
      mesa.items.splice(idx,1); saveState(); renderCart();
    });

    cont.appendChild(row);
  });

  // Totais
  refreshTotals();
}

function linkAdjustInputs(){
  const mesa = state.tables[state.currentMesa];

  const inExtraValor = getEl('inExtraValor');
  const inExtraPerc  = getEl('inExtraPerc');
  const inDescValor  = getEl('inDescValor');
  const inDescPerc   = getEl('inDescPerc');
  const inPessoas    = getEl('inPessoas');

  inExtraValor.value = mesa.extraValue || 0;
  inExtraPerc.value  = mesa.extraPerc  || 0;
  inDescValor.value  = mesa.discValue  || 0;
  inDescPerc.value   = mesa.discPerc   || 0;

  [inExtraValor, inExtraPerc, inDescValor, inDescPerc, inPessoas].forEach(inp=>{
    inp.addEventListener('input', ()=>{
      mesa.extraValue = toNum(inExtraValor.value);
      mesa.extraPerc  = toNum(inExtraPerc.value);
      mesa.discValue  = toNum(inDescValor.value);
      mesa.discPerc   = toNum(inDescPerc.value);
      saveState();
      refreshTotals();
    });
  });

  getEl('btnLimparComanda').onclick = ()=>{
    if(confirm('Limpar TODOS os itens e ajustes desta mesa?')){
      state.tables[state.currentMesa] = { items:[], extraValue:0, extraPerc:0, discValue:0, discPerc:0 };
      saveState(); renderCart();
    }
  };

  getEl('btnFecharComanda').onclick = ()=>{
    const total = getTotals().total;
    if(confirm(`Fechar comanda da Mesa ${state.currentMesa} no valor de ${fmtBRL(Math.max(total,0))}?`)){
      // Aqui poderia registrar histórico. Para demo, vamos apenas limpar.
      state.tables[state.currentMesa] = { items:[], extraValue:0, extraPerc:0, discValue:0, discPerc:0 };
      saveState(); renderCart(); renderDashboard();
      alert('Comanda fechada! Obrigado.');
    }
  };
}

function toNum(v){ return parseFloat(v||'0') || 0; }

function getEl(id){ return document.getElementById(id); }

function getTotals(){
  const mesa = state.tables[state.currentMesa];
  const subtotal = mesa.items.reduce((s,it)=> s + it.price*it.qty, 0);
  const ajustes  = calcAdjustments(mesa, subtotal);
  const total    = subtotal + ajustes;
  const pessoas  = Math.max(1, parseInt(getEl('inPessoas').value || '1',10));
  return { subtotal, ajustes, total, pessoas, porPessoa: total/pessoas };
}

function calcAdjustments(mesa, subtotal){
  const addV = mesa.extraValue;
  const addP = subtotal * (mesa.extraPerc/100);
  const subV = mesa.discValue;
  const subP = subtotal * (mesa.discPerc/100);
  return (addV + addP) - (subV + subP);
}

function refreshTotals(){
  const { subtotal, ajustes, total, pessoas, porPessoa } = getTotals();
  getEl('lblSubtotal').textContent = fmtBRL(subtotal);
  getEl('lblAjustes').textContent  = fmtBRL(ajustes);
  getEl('lblTotal').textContent    = fmtBRL(Math.max(total,0));
  getEl('lblPorPessoa').textContent= fmtBRL(Math.max(porPessoa,0));
  // Atualiza rótulo do cabeçalho
  mesaAtualLabel.textContent = state.currentMesa;
  saveState();
}

/* ========= Boot inicial ========= */
(function boot(){
  if(state.currentUser){
    renderDashboard();
    showView('view-dashboard');
  }else{
    showView('view-login');
  }
})();
