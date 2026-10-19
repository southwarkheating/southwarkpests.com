(function(){
var d=document;
/* Southwark Pests settings. Change these here and nowhere else. */
var CFG={
 api:'https://ylyasshhvuhhpmpotera.supabase.co/functions/v1/boiler-sites-gateway',
 price:90,          /* standard visit price shown on the booking form, in pounds */
 stripe:'https://buy.stripe.com/00wcN6cpY3iVeR420Cc3m06', /* Southwark Heating £90 pest control Stripe Payment Link */
 phone:'020 8050 2022',
 mobile:'07988 991963'
};
window.SP_CFG=CFG;
/* clean URLs: /page.html -> /page */
if(location.protocol.indexOf('http')===0&&/\.html$/.test(location.pathname)){location.replace(location.pathname.replace(/(index)?\.html$/,'')+location.search+location.hash)}
/* mobile menu */
var b=d.querySelector('.menu'),n=d.getElementById('nav');
if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false')});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){n.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()}})}
/* dropdowns */
[].forEach.call(d.querySelectorAll('.ddbtn'),function(t){t.addEventListener('click',function(e){e.stopPropagation();var p=t.parentNode,o=p.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false')})});
d.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.dd'))[].forEach.call(d.querySelectorAll('.dd.open'),function(x){x.classList.remove('open')})});
/* area map animation */
var m=d.querySelector('.amap');
if(m&&'IntersectionObserver' in window){m.classList.add('amap-js');var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){m.classList.add('go');io.disconnect()}},{threshold:.45});io.observe(m)}
function uuid(){try{return crypto.randomUUID()}catch(x){return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,function(){return(Math.random()*16|0).toString(16)})}}
function val(f,k){return (f.elements[k]&&f.elements[k].value||'').trim()}
var PC=/^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/,EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function post(url,body){return fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw 0;return r.json().catch(function(){return{}})})}
function setMsg(m,cls,t){m.className='fmsg '+cls;m.textContent=t}
/* contact / callback form */
var f=d.getElementById('cform');
if(f){f.addEventListener('submit',function(e){e.preventDefault();var m=f.querySelector('.fmsg'),btn=f.querySelector('button[type=submit]');
var name=val(f,'name'),phone=val(f,'phone'),email=val(f,'email'),pc=val(f,'postcode').toUpperCase(),msg=val(f,'message'),bad=[];
if(name.length<2)bad.push('your name');
if(!/\d{10,}/.test(phone.replace(/\D/g,''))&&!EM.test(email))bad.push('a phone number or email');
if(pc&&!PC.test(pc))bad.push('a full postcode, like SE16 7SZ');
if(!msg)bad.push('what you need');
if(bad.length){setMsg(m,'err','Please add '+bad.join(', ')+'.');return}
btn.disabled=true;setMsg(m,'','Sending...');
post(CFG.api+'?to=enquiry',{enquiry_id:uuid(),name:name,phone:phone,email:email,postcode:pc,message:msg,category:'Pest Control',service:'Pest control enquiry',source:f.getAttribute('data-source')||'southwarkpests.com',_gotcha:val(f,'_gotcha')})
.then(function(){f.reset();setMsg(m,'ok','Thanks, '+name.split(' ')[0]+'. We have your message and will call or email you back.')})
.catch(function(){setMsg(m,'err','That did not send. Please call '+CFG.phone+' or '+CFG.mobile+' instead.')})
.then(function(){btn.disabled=false})})}
/* booking form */
var bf=d.getElementById('bform');
if(bf){
var dt=bf.elements['date'];if(dt){var t=new Date();t.setDate(t.getDate()+1);dt.min=t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2)}
[].forEach.call(d.querySelectorAll('.js-price'),function(pe){pe.textContent='£'+CFG.price});
var q=(location.search.match(/pest=([a-z-]+)/)||[])[1];if(q&&bf.elements['pest']){[].forEach.call(bf.elements['pest'].options,function(o){if(o.getAttribute('data-k')===q)o.selected=true})}
bf.addEventListener('submit',function(e){e.preventDefault();var m=bf.querySelector('.fmsg'),btn=bf.querySelector('button[type=submit]');
var name=val(bf,'name'),phone=val(bf,'phone'),email=val(bf,'email'),addr=val(bf,'address'),pc=val(bf,'postcode').toUpperCase(),pest=val(bf,'pest'),date=val(bf,'date'),time=val(bf,'time')||'No preference',msg=val(bf,'message'),bad=[];
if(name.length<2)bad.push('your name');if(!/\d{10,}/.test(phone.replace(/\D/g,'')))bad.push('a phone number');if(!EM.test(email))bad.push('a valid email');
if(addr.length<3)bad.push('the address');if(!PC.test(pc))bad.push('a full postcode, like SE16 7SZ');if(!pest)bad.push('the type of pest');
if(bad.length){setMsg(m,'err','Please add '+bad.join(', ')+'.');return}
var id=uuid();btn.disabled=true;setMsg(m,'','Booking...');
post(CFG.api+'?to=intake',{booking_id:id,service_key:'pest',name:name,email:email,phone:phone,address:addr,postcode:pc,price:CFG.price,preferred_date:date||null,preferred_time:time,message:'Pest: '+pest+(msg?'\n'+msg:''),_gotcha:val(bf,'_gotcha')})
.then(function(){
 post(CFG.api+'?to=notify',{booking_id:id}).catch(function(){}); /* alert in the app */
 if(CFG.stripe){setMsg(m,'ok','Booking received. Taking you to secure payment...');location.href=CFG.stripe+(CFG.stripe.indexOf('?')>-1?'&':'?')+'client_reference_id=bk_'+id+'&prefilled_email='+encodeURIComponent(email)}
 else{bf.reset();setMsg(m,'ok','Thanks, '+name.split(' ')[0]+'. Your booking request is in and we will confirm your date and time by phone or email.');btn.disabled=false}})
.catch(function(){setMsg(m,'err','That did not send and nothing has been charged. Please call '+CFG.phone+' or '+CFG.mobile+'.');btn.disabled=false})})}
/* pest library filter */
var fl=d.querySelector('.filter');
if(fl){var cards=[].slice.call(d.querySelectorAll('[data-g]')),sb=d.getElementById('psearch'),cur='all';
function run(){var s=(sb&&sb.value||'').toLowerCase();cards.forEach(function(c){var ok=(cur==='all'||c.getAttribute('data-g')===cur)&&(!s||c.textContent.toLowerCase().indexOf(s)>-1);c.style.display=ok?'':'none'})}
fl.addEventListener('click',function(e){var x=e.target.closest('button');if(!x)return;[].forEach.call(fl.querySelectorAll('button'),function(y){y.setAttribute('aria-pressed','false')});x.setAttribute('aria-pressed','true');cur=x.getAttribute('data-f');run()});
if(sb)sb.addEventListener('input',run)}
})();
