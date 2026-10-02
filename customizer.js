const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={style:'half',color:'black',size:'S',side:'front',scale:50,rotation:0,x:50,y:45,image:null};
const shirt=$('#shirt'), art=$('#artwork'), img=$('#artImage');
const names={half:'Half Sleeve',full:'Full Sleeve',oversized:'Oversized Tee',fitness:'Fitness Tee'};
const colors={black:'Black',white:'White',stone:'Stone',grey:'Grey'};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),2200)}
function render(){shirt.className='shirt '+state.color+' '+state.style; art.style.left=state.x+'%';art.style.top=state.y+'%';art.style.width=state.scale+'%';art.style.transform=`translate(-50%,-50%) rotate(${state.rotation}deg)`; $('#scaleOut').textContent=state.scale+'%';$('#rotateOut').textContent=state.rotation+'°';$('#stageMeta').textContent=`${names[state.style].toUpperCase()} · ${colors[state.color].toUpperCase()} · ${state.size}`;$('#sumStyle').textContent=names[state.style];$('#sumColor').textContent=colors[state.color];$('#sumSize').textContent=state.size;$('#sumSide').textContent=state.side==='front'?'Front':'Back';}
$$('.style-choice').forEach(b=>b.onclick=()=>{$$('.style-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.style=b.dataset.style;render()});
$$('.swatch').forEach(b=>b.onclick=()=>{$$('.swatch').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.color=b.dataset.color;render()});
$$('.size').forEach(b=>b.onclick=()=>{$$('.size').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.size=b.textContent;render()});
$$('.segmented button').forEach(b=>b.onclick=()=>{$$('.segmented button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.side=b.dataset.side;render()});
$('#scale').oninput=e=>{state.scale=+e.target.value;render()};$('#rotate').oninput=e=>{state.rotation=+e.target.value;render()};
$('#artUpload').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{state.image=ev.target.result;img.src=state.image;img.style.display='block';$('#dragTip').textContent='DRAG ARTWORK TO POSITION';render();toast('Artwork added to your tee')};r.readAsDataURL(f)};
let drag=null;art.addEventListener('pointerdown',e=>{if(!state.image)return;art.setPointerCapture(e.pointerId);drag={sx:e.clientX,sy:e.clientY,x:state.x,y:state.y};art.style.cursor='grabbing'});art.addEventListener('pointermove',e=>{if(!drag)return;const rect=$('#stage').getBoundingClientRect();state.x=drag.x+(e.clientX-drag.sx)/rect.width*100;state.y=drag.y+(e.clientY-drag.sy)/rect.height*100;state.x=Math.max(24,Math.min(76,state.x));state.y=Math.max(25,Math.min(70,state.y));render()});art.addEventListener('pointerup',()=>{drag=null;art.style.cursor='grab'});art.addEventListener('pointercancel',()=>drag=null);
$$('[data-move]').forEach(b=>b.onclick=()=>{const m=b.dataset.move;if(m==='up')state.y-=3;if(m==='down')state.y+=3;if(m==='left')state.x-=3;if(m==='right')state.x+=3;if(m==='center'){state.x=50;state.y=45}state.x=Math.max(24,Math.min(76,state.x));state.y=Math.max(25,Math.min(70,state.y));render()});
$('#reset').onclick=()=>{state.scale=50;state.rotation=0;state.x=50;state.y=45;state.image=null;img.removeAttribute('src');img.style.display='none';$('#artUpload').value='';render();toast('Design reset')};
$('#toggleGrid').onclick=()=>$('#stage').classList.toggle('clean');
$('#savePreview').onclick=()=>toast('Preview ready — order when you are happy with your design');
$('#addCustom').onclick=()=>{if(!state.image){toast('Upload your artwork first');return}const cart=+(localStorage.getItem('sthenoCart')||0)+1;localStorage.setItem('sthenoCart',cart);$('#cartCount').textContent=cart;toast('Custom T-shirt added to cart')};
$('#cartCount').textContent=localStorage.getItem('sthenoCart')||0;render();
