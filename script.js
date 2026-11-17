var KEY="zhyk_app_v1",S={tasks:[],habits:[],focus:{},items:[],goal:2000,prof:{}};
try{var r=localStorage.getItem(KEY);if(r){var q=JSON.parse(r);if(q&&Array.isArray(q.tasks)&&Array.isArray(q.habits)&&Array.isArray(q.items)){S=q;S.focus=S.focus||{};S.prof=S.prof||{};S.goal=S.goal||2000}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var $=function(i){return document.getElementById(i)};
var MON=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],DAYS=["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
function ds(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function pd(s){var a=s.split("-");return new Date(+a[0],+a[1]-1,+a[2])}
function add(s,n){var d=pd(s);d.setDate(d.getDate()+n);return ds(d)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
var TODAY=ds(new Date()),cur=TODAY;
/* Планер */
function drawT(){var g=new Date().getHours();$("gr").textContent=(g<6?"Доброй ночи":g<12?"Доброе утро":g<18?"Добрый день":"Добрый вечер")+"!";
var d=pd(cur);$("dt").textContent=(cur===TODAY?"Сегодня, ":DAYS[d.getDay()]+", ")+d.getDate()+" "+MON[d.getMonth()];
var L=S.tasks.filter(function(t){return t.d===cur}).sort(function(a,b){return (a.x?1:0)-(b.x?1:0)||b.p-a.p}),n=L.filter(function(t){return t.x}).length,p=L.length?Math.round(n/L.length*100):0;
$("pc").textContent=n+" из "+L.length+" выполнено";$("pp").textContent=p+"%";$("pf").style.width=p+"%";if(drawT.p!==undefined&&drawT.p<100&&p===100)burst(innerWidth/2,innerHeight/3);drawT.p=p;
$("tl").innerHTML=L.length?L.map(function(t){return '<div class="it p'+t.p+(t.x?' dd':'')+'"><button class="ck" data-k="'+t.id+'" aria-label="Выполнено">'+(t.x?"✓":"")+'</button><span>'+esc(t.t)+'</span><button class="rm" data-r="'+t.id+'" aria-label="Удалить">×</button></div>'}).join(""):'<p class="em">Задач на этот день нет.<br>Добавьте первую — и день станет понятнее.</p>'}
function drawW(){var m=add(cur,-((pd(cur).getDay()+6)%7)),h="";
for(var i=0;i<7;i++){(function(k){var dd=pd(k),L=S.tasks.filter(function(t){return t.d===k}),n=L.filter(function(t){return t.x}).length;
h+='<button class="wd'+(k===TODAY?' td':'')+(k===cur?' sel':'')+'" data-g="'+k+'"><b>'+DAYS[dd.getDay()]+' '+dd.getDate()+'</b><span>'+(L.length?n+"/"+L.length:"—")+'</span><small>'+L.slice(0,3).map(function(t){return esc(t.t)}).join(" · ")+'</small></button>'})(add(m,i))}
$("wk").innerHTML=h;var a=pd(m),b=pd(add(m,6));$("wl").textContent=a.getDate()+" "+MON[a.getMonth()]+" – "+b.getDate()+" "+MON[b.getMonth()]}
function addT(){var t=$("ti").value.trim();if(!t)return;S.tasks.push({id:uid(),t:t,d:cur,p:+$("tp").value,x:false});$("ti").value="";save();drawT()}
$("ta").onclick=addT;$("ti").onkeydown=function(e){if(e.key==="Enter")addT()};
$("tl").onclick=function(e){var k=e.target.dataset.k,r=e.target.dataset.r;if(k){S.tasks.forEach(function(t){if(t.id===k)t.x=!t.x})}else if(r){S.tasks=S.tasks.filter(function(t){return t.id!==r})}else return;save();drawT()};
$("pv").onclick=function(){cur=add(cur,-1);drawT()};$("nx").onclick=function(){cur=add(cur,1);drawT()};$("td").onclick=function(){cur=TODAY;drawT()};
$("wp").onclick=function(){cur=add(cur,-7);drawW()};$("wn").onclick=function(){cur=add(cur,7);drawW()};
$("wk").onclick=function(e){var b=e.target.closest("[data-g]");if(b){cur=b.dataset.g;sub("v-pl","s-t")}};
/* Привычки */
function streak(h){var i=h.l.indexOf(TODAY)>=0?0:1,n=0;while(h.l.indexOf(add(TODAY,-i))>=0){n++;i++}return n}
function drawH(){$("hl").innerHTML=S.habits.length?S.habits.map(function(h){var dots="",on=h.l.indexOf(TODAY)>=0;for(var i=6;i>=0;i--)dots+='<i style="--n:'+(6-i)+'" class="'+(h.l.indexOf(add(TODAY,-i))>=0?"on":"")+'"></i>';
return '<div class="c hb"><button class="ck'+(on?' on':'')+'" data-h="'+h.id+'" aria-label="Отметить">'+(on?"✓":"")+'</button><div class="gr"><b>'+esc(h.n)+'</b><div class="ds">'+dots+'</div></div><div class="st">🔥 '+streak(h)+'</div><button class="rm" data-x="'+h.id+'" aria-label="Удалить">×</button></div>'}).join(""):'<p class="em">Привычек пока нет.<br>Начните с маленькой — например, «Стакан воды утром».</p>'}
function addH(){var n=$("hi").value.trim();if(!n)return;S.habits.push({id:uid(),n:n,l:[]});$("hi").value="";save();drawH()}
$("ha").onclick=addH;$("hi").onkeydown=function(e){if(e.key==="Enter")addH()};
$("hl").onclick=function(e){var h=e.target.dataset.h,x=e.target.dataset.x;if(h){S.habits.forEach(function(o){if(o.id===h){var i=o.l.indexOf(TODAY);if(i>=0)o.l.splice(i,1);else o.l.push(TODAY);o.l=o.l.slice(-400)}})}else if(x){S.habits=S.habits.filter(function(o){return o.id!==x})}else return;save();drawH()};
/* Питание */
var FOOD=[["Овсянка",350,12,6,60],["Яйцо",75,6,5,1],["Куриная грудка",165,31,4,0],["Гречка",110,4,1,21],["Яблоко",52,0,0,14],["Творог 5%",121,17,5,3],["Лосось",208,20,13,0],["Авокадо",160,2,15,9],["Брокколи",34,3,0.4,7],["Паста",158,6,1,31]];
$("ch").innerHTML=FOOD.map(function(f,i){return '<button class="chip" data-i="'+i+'">'+em(f[0])+" "+f[0]+'</button>'}).join("");
$("ch").onclick=function(e){var f=FOOD[e.target.dataset.i];if(!f)return;$("dn").value=f[0];$("dk").value=f[1];$("dp").value=f[2];$("df").value=f[3];$("dc").value=f[4]};
$("da").onclick=function(){var n=$("dn").value.trim();if(!n||$("dk").value==="")return;S.items.push({n:n,k:+$("dk").value||0,p:+$("dp").value||0,f:+$("df").value||0,c:+$("dc").value||0,m:$("dm").value,d:TODAY});["dn","dk","dp","df","dc"].forEach(function(i){$(i).value=""});save();fly(em(n),$("da"),$("plate"));drawD()};
$("dl").onclick=function(e){var i=e.target.dataset.d;if(i==null)return;S.items.splice(+i,1);save();drawD()};
function drawD(){var t={k:0,p:0,f:0,c:0},h="";S.items.forEach(function(x){if(x.d===TODAY){t.k+=x.k;t.p+=x.p;t.f+=x.f;t.c+=x.c}});
["Завтрак","Обед","Ужин","Перекус"].forEach(function(m){var a=[];S.items.forEach(function(x,i){if(x.d===TODAY&&x.m===m)a.push([x,i])});if(!a.length)return;
h+='<div class="mt">'+m+' · '+Math.round(a.reduce(function(s,y){return s+y[0].k},0))+' ккал</div>';
a.forEach(function(y){var x=y[0];h+='<div class="it f"><b class="fe">'+em(x.n)+'</b><span>'+esc(x.n)+'<small>'+Math.round(x.k)+' ккал · Б '+x.p+' Ж '+x.f+' У '+x.c+'</small></span><button class="rm" data-d="'+y[1]+'" aria-label="Удалить">×</button></div>'})});
$("dl").innerHTML=h||'<p class="em">Пока пусто — добавьте первый приём пищи.</p>';
var left=Math.round(S.goal-t.k);cnt($("lf"),Math.abs(left));$("lf").style.color=left<0?"var(--r)":"";$("lt").textContent=(left<0?"ккал сверх нормы":"ккал осталось")+" · цель "+S.goal;
$("lb").style.width=Math.min(100,t.k/S.goal*100)+"%";$("lb").style.background=left<0?"var(--r)":"";cnt($("m1"),Math.round(t.p));cnt($("m2"),Math.round(t.f));cnt($("m3"),Math.round(t.c));plateDraw(S.items.filter(function(x){return x.d===TODAY}),t.k)}
function drawS(){var days=[],tot=0,n=0,mx=S.goal,i;
for(i=6;i>=0;i--){(function(i){var k=add(TODAY,-i),s=0,c=0,dt=pd(k);S.items.forEach(function(x){if(x.d===k){s+=x.k;c++}});if(c){tot+=s;n++}if(s>mx)mx=s;days.push({s:s,l:DAYS[dt.getDay()]})})(i)}
var set={};S.items.forEach(function(x){set[x.d]=1});var st=0;i=set[TODAY]?0:1;while(set[add(TODAY,-i)]&&i<400){st++;i++}
cnt($("sa"),n?Math.round(tot/n):0);cnt($("sd"),n);cnt($("ss"),st);
$("bars").innerHTML=days.map(function(d){return '<div class="bar"><small>'+(d.s?Math.round(d.s):'')+'</small><div class="bt"><i style="height:'+Math.round(d.s/mx*100)+'%;'+(d.s>S.goal?'background:var(--r)':'')+'"></i></div><em>'+d.l+'</em></div>'}).join("");
$("gt").textContent="Цель: "+S.goal+" ккал в день";
var p=0,f=0,c=0;S.items.forEach(function(x){if(x.d===TODAY){p+=x.p;f+=x.f;c+=x.c}});var kc=p*4+f*9+c*4;
$("ms").innerHTML=kc?[["Белки",p,p*4,"var(--ac)"],["Жиры",f,f*9,"var(--y)"],["Углеводы",c,c*4,"var(--b)"]].map(function(r){var q=Math.round(r[2]/kc*100);return '<div style="margin:10px 0"><div class="pm" style="border:0;padding:0 0 4px"><span>'+r[0]+'</span><span>'+Math.round(r[1])+' г · '+q+'%</span></div><div class="pb"><i style="width:'+q+'%;background:'+r[3]+'"></i></div></div>'}).join(""):'<p class="em">Сегодня записей пока нет.</p>'}
/* Фокус */
var M={w:25,s:5,l:15},mode="w",rem=1500,end=0,tm=null;
function drawF(){var tot=M[mode]*60;$("ft").textContent=("0"+Math.floor(rem/60)).slice(-2)+":"+("0"+rem%60).slice(-2);$("fa").style.strokeDashoffset=653.5*(rem/tot);
$("fs").textContent="Сессий сегодня: "+(S.focus[TODAY]||0);$("fb").textContent=tm?"Пауза":"Старт";document.querySelector(".fr").classList.toggle("run",!!tm);document.querySelectorAll("[data-m]").forEach(function(b){b.classList.toggle("on",b.dataset.m===mode)})}
function tick(){rem=Math.max(0,Math.round((end-Date.now())/1000));if(rem<=0){halt();if(mode==="w"){S.focus[TODAY]=(S.focus[TODAY]||0)+1;save()}try{navigator.vibrate&&navigator.vibrate(300)}catch(e){}$("fm").textContent=mode==="w"?"Сессия завершена! Отдохните 5 минут.":"Перерыв закончен — за дело!";rem=M[mode]*60}drawF()}
function halt(){clearInterval(tm);tm=null}
$("fb").onclick=function(){if(tm){halt()}else{end=Date.now()+rem*1000;tm=setInterval(tick,500);$("fm").textContent=""}drawF()};
$("fr").onclick=function(){halt();rem=M[mode]*60;$("fm").textContent="";drawF()};
document.querySelector(".md").onclick=function(e){var m=e.target.dataset.m;if(!m)return;halt();mode=m;rem=M[m]*60;$("fm").textContent="";drawF()};
/* Профиль */
function calcP(){var p=S.prof,a=+p.a,h=+p.h,w=+p.w,r=$("pres");
if(!(a>0&&h>0&&w>0)){r.innerHTML='<p>Заполните возраст, рост и вес.</p>';return}
var bmr=10*w+6.25*h-5*a+(p.s==="f"?-161:5),tg=Math.max(1200,Math.round((bmr*(+p.k||1.2)+(+p.g||0))/10)*10),b=w/Math.pow(h/100,2),cat=b<18.5?"недостаточный вес":b<25?"нормальный вес":b<30?"избыточный вес":"ожирение";
r.innerHTML='<div class="pm"><span>ИМТ</span><b>'+b.toFixed(1)+' · '+cat+'</b></div><div class="pm"><span>Рекомендуемая норма</span><b>'+tg+' ккал</b></div><button class="btn" style="margin-top:10px" data-t="'+tg+'">Применить как цель</button>'}
function loadP(){var p=S.prof;$("pn").value=p.n||"";$("ps").value=p.s||"m";$("pa").value=p.a||"";$("ph").value=p.h||"";$("pw").value=p.w||"";$("pk").value=p.k||"1.2";$("pg").value=p.g==null?"-400":p.g;$("pt").textContent=p.n?"Привет, "+p.n+"!":"";calcP()}
$("psv").onclick=function(){S.prof={n:$("pn").value.trim(),s:$("ps").value,a:$("pa").value,h:$("ph").value,w:$("pw").value,k:$("pk").value,g:$("pg").value};save();loadP()};
$("pres").onclick=function(e){var t=e.target.dataset.t;if(!t)return;S.goal=+t;save();drawD();e.target.textContent="Цель обновлена ✓"};
var rt;$("rst").onclick=function(){var b=$("rst");if(b.dataset.s){S={tasks:[],habits:[],focus:{},items:[],goal:2000,prof:{}};save();render();loadP();b.textContent="Очистить все данные";delete b.dataset.s;return}b.dataset.s=1;b.textContent="Нажмите ещё раз для подтверждения";clearTimeout(rt);rt=setTimeout(function(){b.textContent="Очистить все данные";delete b.dataset.s},4000)};
document.querySelectorAll("[data-q]").forEach(function(b){b.onclick=function(){var r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top);$("mg").textContent="Вы выбрали "+b.dataset.q+" подписку. Онлайн-оплата скоро будет подключена!"}});
/* Навигация */
function render(){drawT();drawW();drawH();drawD();drawS();drawF()}
function sub(v,s){var e=$(v);e.querySelectorAll(".sg button").forEach(function(b){b.classList.toggle("on",b.dataset.s===s)});e.querySelectorAll(".sv").forEach(function(x){x.classList.toggle("on",x.id===s)});go("pl");render()}
document.querySelectorAll(".sg").forEach(function(g){g.onclick=function(e){var b=e.target.closest("button");if(b){sub(g.parentNode.id,b.dataset.s);go(g.parentNode.id.slice(2))}}});
function go(v){document.body.dataset.tab=v;document.querySelector(".bn").dataset.i=["pl","fd","pr"].indexOf(v);["pl","fd","pr"].forEach(function(k){$("v-"+k).classList.toggle("on",k===v)});document.querySelectorAll(".bn button").forEach(function(b){b.classList.toggle("on",b.dataset.v===v)});window.scrollTo(0,0);ent();render()}
document.querySelector(".bn").onclick=function(e){var b=e.target.closest("button");if(b)go(b.dataset.v)};
document.querySelector(".sw").onclick=function(e){var b=e.target.closest("button");if(!b)return;var p=b.dataset.pl;this.dataset.p=p;this.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x===b)});document.querySelectorAll(".pgrid [data-pl]").forEach(function(c){var on=c.dataset.pl===p;if(on)c.style.setProperty("--i",0);c.classList.toggle("hide",!on)});$("mg").textContent=""};
function setTh(t){document.documentElement.dataset.theme=t;try{localStorage.setItem("zhyk_theme",t)}catch(e){}$("th").textContent=t==="dark"?"☀️":"🌙"}
$("th").onclick=function(){setTh(document.documentElement.dataset.theme==="dark"?"light":"dark")};
$("th").textContent=document.documentElement.dataset.theme==="dark"?"☀️":"🌙";
render();loadP();

/* ===== Анимации ===== */
function ent(){document.body.classList.add("ent");clearTimeout(ent.t);ent.t=setTimeout(function(){document.body.classList.remove("ent")},1100)}
function calm(){return matchMedia("(prefers-reduced-motion:reduce)").matches}
function cnt(el,to){var from=+el.dataset.v||0;el.dataset.v=to;if(from===to||calm()){el.textContent=to;return}var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/600);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}
function burst(x,y,n){if(calm())return;var cs=["#f5c542","#ff9d4d","#2e9e4f","#4a90d9","#e5484d"];for(var i=0;i<(n||30);i++){var e=document.createElement("i");e.className="cf";e.style.left=x+"px";e.style.top=y+"px";e.style.background=cs[i%5];document.body.appendChild(e);var a=Math.random()*6.28,d=80+Math.random()*150;e.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:"translate("+Math.cos(a)*d+"px,"+(Math.sin(a)*d+90)+"px) rotate("+Math.random()*720+"deg)",opacity:0}],{duration:900+Math.random()*500,easing:"cubic-bezier(.2,.7,.3,1)"}).onfinish=function(){this.effect.target.remove()}}}
ent();

/* ===== Тарелка дня и анимация продуктов ===== */
function em(n){n=n.toLowerCase();var T=[["овсян|каш|мюсли","🥣"],["яйц|омлет","🍳"],["кур|индейк|грудк","🍗"],["гречк|рис|плов","🍚"],["яблок","🍎"],["банан","🍌"],["апельсин|мандарин","🍊"],["клубник|ягод","🍓"],["авокадо","🥑"],["брокколи","🥦"],["морков","🥕"],["огур|помидор|томат|салат|овощ","🥗"],["картоф|пюре","🥔"],["паст|макарон|спагетти","🍝"],["пицц","🍕"],["бургер","🍔"],["суп|борщ","🍲"],["рыб|лосос|тунец|семг","🐟"],["мяс|говяд|свинин|стейк|котлет","🥩"],["сыр","🧀"],["творог|йогурт|кефир|молок","🥛"],["хлеб|тост|булк","🍞"],["кофе|капучино|латте","☕"],["чай","🍵"],["шоколад|конфет|торт|печень|пирож|мороженое","🍫"]];for(var i=0;i<T.length;i++)if(new RegExp(T[i][0]).test(n))return T[i][1];return"🍽️"}
function plateDraw(items,k){var prev=plateDraw.n||0,h="";
items.forEach(function(x,i){var a=i*2.399,r=Math.min(62,18+Math.sqrt(i)*28),s=Math.min(44,26+x.k/12);
h+='<span class="fd'+(plateDraw.ready&&i>=prev?" new":"")+'" style="left:'+(104+Math.cos(a)*r)+'px;top:'+(104+Math.sin(a)*r)+'px;font-size:'+s+'px;--d:'+(i*.35)+'s">'+em(x.n)+'</span>'});
$("dish").innerHTML=h;$("ept").style.opacity=items.length?0:1;
$("pg").style.strokeDashoffset=754*(1-Math.min(1,k/S.goal));$("pg").style.stroke=k>S.goal?"var(--r)":"";
$("pcap").textContent=items.length?"Позиций: "+items.length+" · "+Math.round(k)+" из "+S.goal+" ккал":"";
if(plateDraw.ready&&items.length>prev){var p=$("plate");p.classList.remove("hit");void p.offsetWidth;p.classList.add("hit");setTimeout(function(){var b=p.getBoundingClientRect();burst(b.left+b.width/2,b.top+b.height/2,12)},800)}
plateDraw.n=items.length;plateDraw.ready=1}
function fly(e,a,b){if(calm())return;var r1=a.getBoundingClientRect(),r2=b.getBoundingClientRect(),s=document.createElement("span"),x0=r1.left+r1.width/2,dx=r2.left+r2.width/2-x0,dy=r2.top+r2.height/2-r1.top;
s.className="fl";s.textContent=e;s.style.left=x0+"px";s.style.top=r1.top+"px";document.body.appendChild(s);
s.animate([{transform:"translate(-50%,0) scale(1) rotate(0)",opacity:1},{transform:"translate(calc(-50% + "+dx*.5+"px),"+(dy*.5-90)+"px) scale(1.7) rotate(180deg)",opacity:1,offset:.5},{transform:"translate(calc(-50% + "+dx+"px),"+dy+"px) scale(.6) rotate(360deg)",opacity:.9}],{duration:650,easing:"cubic-bezier(.4,0,.3,1)"}).onfinish=function(){s.remove()}}
(function(){var E=["🍎","🥑","🥦","🍋","🍓","🥕","🍇","🥐","🍳","🥛"],b=document.createElement("div");b.className="fbg";b.setAttribute("aria-hidden","true");
b.innerHTML=E.map(function(e,i){return '<span style="left:'+(i*10+3)+'%;animation-delay:-'+(i*1.7)+'s;animation-duration:'+(12+i%4*3)+'s;font-size:'+(22+i%3*10)+'px">'+e+'</span>'}).join("");document.body.appendChild(b);document.body.dataset.tab="pl"})();
