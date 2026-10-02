const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];
let cartCount=0;
let currentProduct=null;
let currentSide='front';

$('#year').textContent=new Date().getFullYear();

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
function addToCart(name,price){cartCount++;$('#cartCount').textContent=cartCount;toast(`${name} added to cart`)}

$('#menuButton').addEventListener('click',()=>$('#mobileMenu').classList.toggle('open'));
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>$('#mobileMenu').classList.remove('open')));

// Front / back switches on the oversized product cards.
$$('.product-switcher').forEach(card=>{
  const img=card.querySelector('.product-photo');
  const label=card.querySelector('.side-label');
  card.dataset.side='front';
  function show(side){card.dataset.side=side;img.style.opacity='0';setTimeout(()=>{img.src=side==='front'?card.dataset.front:card.dataset.back;img.alt=`${card.dataset.product} ${side}`;img.style.opacity='1';label.textContent=side.toUpperCase()},120)}
  card.querySelector('.left').addEventListener('click',e=>{e.stopPropagation();show(card.dataset.side==='front'?'back':'front')});
  card.querySelector('.right').addEventListener('click',e=>{e.stopPropagation();show(card.dataset.side==='front'?'back':'front')});
  const quick=card.querySelector('.quick-view');
  if(quick) quick.addEventListener('click',e=>{e.stopPropagation();openProduct(card.dataset.product,card.dataset.price,card.dataset.front,card.dataset.back)});
  card.addEventListener('click',e=>{if(e.target.closest('.side-arrow')||e.target.closest('.quick-view'))return;openProduct(card.dataset.product,card.dataset.price,card.dataset.front,card.dataset.back)})
});

function openProduct(name,price,front,back){
  currentProduct={name,price,front,back};currentSide='front';
  $('#modalTitle').textContent=name;$('#modalPrice').textContent=`₹${Number(price).toLocaleString('en-IN')}`;updateModal();$('#productModal').classList.add('open');$('#productModal').setAttribute('aria-hidden','false');
}
function updateModal(){const p=$('#modalProductImage');p.style.opacity='0';setTimeout(()=>{p.src=currentSide==='front'?currentProduct.front:currentProduct.back;p.alt=`${currentProduct.name} ${currentSide}`;p.style.opacity='1'},100);$('#modalSideLabel').textContent=currentSide.toUpperCase()}
function toggleModalSide(){currentSide=currentSide==='front'?'back':'front';updateModal()}
$('#modalPrev').addEventListener('click',toggleModalSide);$('#modalNext').addEventListener('click',toggleModalSide);$('#modalClose').addEventListener('click',closeModal);$$('[data-close-modal]').forEach(x=>x.addEventListener('click',closeModal));
function closeModal(){$('#productModal').classList.remove('open');$('#productModal').setAttribute('aria-hidden','true')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if($('#productModal').classList.contains('open')&&e.key==='ArrowLeft')toggleModalSide();if($('#productModal').classList.contains('open')&&e.key==='ArrowRight')toggleModalSide()});
$('#modalAdd').addEventListener('click',()=>{if(currentProduct)addToCart(currentProduct.name,currentProduct.price);closeModal()});
$$('.add-button').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.name,btn.dataset.price)));

// Custom T-shirt preview.
let customState={sleeve:'Half Sleeve',shirt:'black',size:'S',side:'front',scale:48,image:null};
function updateCustomPreview(){
  const shirt=$('#blankShirtPreview');shirt.classList.toggle('white',customState.shirt==='white');shirt.classList.toggle('grey',customState.shirt==='grey');
  $('#customDesign').style.width=`${customState.scale}%`;
  $('#customDesign').style.display=customState.image?'block':'none';
  $('#previewSideLabel').textContent=`${customState.side.toUpperCase()} PREVIEW · ${customState.sleeve.toUpperCase()}`;
}
$$('[data-sleeve]').forEach(b=>b.addEventListener('click',()=>{$$('[data-sleeve]').forEach(x=>x.classList.remove('active'));b.classList.add('active');customState.sleeve=b.dataset.sleeve;updateCustomPreview()}));
$$('.swatch').forEach(b=>b.addEventListener('click',()=>{$$('.swatch').forEach(x=>x.classList.remove('active'));b.classList.add('active');customState.shirt=b.dataset.shirt;updateCustomPreview()}));
$$('.size-choices .choice').forEach(b=>b.addEventListener('click',()=>{$$('.size-choices .choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');customState.size=b.textContent.trim()}));
$('#designUpload').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{customState.image=ev.target.result;$('#customDesign').src=ev.target.result;updateCustomPreview()};reader.readAsDataURL(file)});
$('#designScale').addEventListener('input',e=>{customState.scale=e.target.value;updateCustomPreview()});
function setSide(side){customState.side=side;$('#frontChoice').classList.toggle('active',side==='front');$('#backChoice').classList.toggle('active',side==='back');updateCustomPreview()}
$('#frontChoice').addEventListener('click',()=>setSide('front'));$('#backChoice').addEventListener('click',()=>setSide('back'));
$('#customAdd').addEventListener('click',()=>{if(!customState.image){toast('Please upload an image first');return}addToCart(`Custom ${customState.sleeve} T-Shirt · ${customState.size}`,599);toast(`Custom T-shirt saved · ${customState.size}`)});
updateCustomPreview();
