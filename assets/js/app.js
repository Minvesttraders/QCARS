// Global state
let currentUser = null, currentRole = 'guest', paymentsRequired = false;
let lang = 'en';

// UI Strings
const STR = {
  en: { login:'Log In', signup:'Sign Up', email:'Email', password:'Password',
        switchTo:'Switch to Urdu', search:'Search cars...', post:'+ Post Car',
        name:'Car Name', model:'Model', condition:'Condition', price:'Price',
        desc:'Description', upload:'Upload Images (max 20)', publish:'Publish',
        profile:'My Profile', globalChat:'Global Chat', privateChat:'Private Chat',
        send:'Send', adminPanel:'Admin Dashboard', paymentsToggle:'Require Payment',
        approve:'Approve', reject:'Reject', mute:'Mute', promote:'Promote', rating:'Rating' },
  ur:  { login:'لاگ ان', signup:'نیا اکاؤنٹ', email:'ای میل', password:'پاس ورڈ',
        switchTo:'Switch to English', search:'تلاش کریں...', post:'+ کار پوسٹ کریں',
        name:'گاڑی کا نام', model:'ماڈل', condition:'حالت', price:'قیمت',
        desc:'تفصیل', upload:'تصاویر اپلوڈ کریں', publish:'شائع کریں',
        profile:'میری پروفائل', globalChat:'عالمی چیٹ', privateChat:'پرائیویٹ چیٹ',
        send:'بھیجیں', adminPanel:'ایڈمن ڈیش بورڈ', paymentsToggle:'ادائیگی ضروری',
        approve:'منظور', reject:'رد', mute:'خاموش', promote:'ترفیع', rating:'درجہ بندی' }
};

// Utility: show/hide modals
function openModal(id){
  const m = document.getElementById(id);
  m.classList.remove('hidden');
  setTimeout(()=> m.querySelector('.fade-scale').classList.add('active'), 10);
}
function closeModal(id){
  const m = document.getElementById(id);
  m.querySelector('.fade-scale').classList.remove('active');
  setTimeout(()=> m.classList.add('hidden'), 300);
}

// Language switcher
function applyLang(){
  document.documentElement.lang = lang;
  // Apply to common elements (example for index.html)
  const search = document.getElementById('searchInput');
  if(search) search.placeholder = STR[lang].search;
  const postBtn = document.getElementById('postBtn');
  if(postBtn) postBtn.innerText = STR[lang].post;
  const langBtn = document.getElementById('langToggle');
  if(langBtn) langBtn.innerText = STR[lang].switchTo;
  // … similarly for other pages
}
document.getElementById('langToggle')?.addEventListener('click', ()=>{
  lang = lang==='en'? 'ur':'en';
  applyLang();
});

// AUTH (shared across pages)
async function initAuth(){
  try {
    currentUser = await account.get();
  } catch {
    showAuth(false); // show login
    return;
  }
  const udoc = await db.getDocument(APPWRITE.databases.id, APPWRITE.databases.collections.users, currentUser.$id);
  currentRole = udoc.role;
  paymentsRequired = udoc.paymentsRequired || false;
}

// Show login/signup modal
let isSignup=false;
function showAuth(signup=false){
  isSignup = signup;
  openModal('authModal');
  document.getElementById('authTitle').innerText = signup?STR[lang].signup:STR[lang].login;
  document.getElementById('authSubmit').innerText = signup?STR[lang].signup:STR[lang].login;
  document.getElementById('authSwitch').innerText = signup?STR[lang].login:STR[lang].signup;
}
document.getElementById('authSwitch')?.addEventListener('click', ()=>{
  showAuth(!isSignup);
});
document.getElementById('authForm')?.addEventListener('submit', async e=>{
  e.preventDefault();
  const email = e.target.email.value, pw = e.target.password.value;
  try {
    let session;
    if(isSignup){
      session = await account.create('unique()', email, pw);
      // create user doc
      await db.createDocument(
        APPWRITE.databases.id,
        APPWRITE.databases.collections.users,
        session.$id,
        { email, status:paymentsRequired?'payment_pending':'active', role:'user', joinedAt:new Date().toISOString() }
      );
      // auto-admin if first user
      const list = await db.listDocuments(APPWRITE.databases.id, APPWRITE.databases.collections.users, [],1,0,undefined,['$createdAt']);
      if(list.total===1){
        currentRole='admin';
        await db.updateDocument(APPWRITE.databases.id, APPWRITE.databases.collections.users, session.$id, { role:'admin', status:'active' });
      }
    } else {
      session = await account.createEmailSession(email,pw);
    }
    currentUser = await account.get();
    closeModal('authModal');
    window.location.reload();
  } catch(err){
    alert(err.message);
  }
});

// ROUTING based on page
document.addEventListener('DOMContentLoaded', async ()=>{
  applyLang();
  await initAuth();
  const page = window.location.pathname.split('/').pop();
  if(!page||page==='index.html'){
    loadFeed();
    setupFeedEvents();
  }
  if(page==='detail.html')   setupDetailPage();
  if(page==='profile.html')  setupProfilePage();
  if(page==='admin.html')    setupAdminPage();
});

// ===== INDEX (Feed) =====
async function loadFeed(){
  const resp = await db.listDocuments(APPWRITE.databases.id, APPWRITE.databases.collections.posts);
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  resp.documents.forEach(p=> {
    const c = document.createElement('div');
    c.className='bg-white p-4 rounded-lg hover-3d cursor-pointer';
    c.innerHTML=`
      <img src="${p.imageURLs?.[0]||''}" class="h-32 w-full object-cover rounded mb-2"/>
      <h3 class="font-bold">${p.title}</h3>
      <p class="text-gray-600">${p.model}</p>
      <p class="text-[#00C9B8]">$${p.price}</p>
    `;
    c.onclick = ()=> window.location.href=`detail.html?postId=${p.$id}`;
    feed.appendChild(c);
  });
}
function setupFeedEvents(){
  document.getElementById('postBtn')?.addEventListener('click', ()=> openModal('postModal'));
  document.getElementById('closePost')?.addEventListener('click', ()=> closeModal('postModal'));
  document.getElementById('postForm')?.addEventListener('submit', async e=>{
    e.preventDefault();
    const d=new FormData(e.target);
    const post = await db.createDocument(
      APPWRITE.databases.id,
      APPWRITE.databases.collections.posts,
      Appwrite.ID.unique(),
      { title:d.get('title'), model:d.get('model'),
        condition:d.get('condition'),
        price:Number(d.get('price')),
        description:d.get('description'),
        ownerId:currentUser.$id,
        createdAt:new Date().toISOString()
      }
    );
    // upload images
    const files = Array.from(document.getElementById('imgInput').files).slice(0,20);
    const urls = [];
    for(let f of files){
      const up = await storage.createFile(APPWRITE.storage.bucket,Appwrite.ID.unique(),f);
      urls.push(`${APPWRITE.endpoint}/storage/buckets/${up.bucketId}/files/${up.$id}/view`);
    }
    await db.updateDocument(APPWRITE.databases.id, APPWRITE.databases.collections.posts, post.$id, { imageURLs: urls });
    closeModal('postModal');
    loadFeed();
  });
}

// ===== DETAIL PAGE =====
async function setupDetailPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('postId');
  if(!id) return alert('Missing postId');
  const p = await db.getDocument(APPWRITE.databases.id, APPWRITE.databases.collections.posts, id);
  document.getElementById('detailTitle').innerText = p.title;
  // ... fill other fields similarly
  document.getElementById('backFeed').onclick = ()=> window.location.href='index.html';
}

// ===== PROFILE PAGE =====
async function setupProfilePage(){
  const params = new URLSearchParams(window.location.search);
  const uid = params.get('uid')||currentUser.$id;
  // fetch user & posts, fill UI
  document.getElementById('backFeed2').onclick = ()=> window.location.href='index.html';
}

// ===== ADMIN PAGE =====
async function setupAdminPage(){
  if(currentRole!=='admin'){
    return document.body.innerHTML='<h2 class="p-4">Access Denied</h2>';
  }
  // load pending users, toggle payments
  document.getElementById('backFeed3').onclick = ()=> window.location.href='index.html';
  }
