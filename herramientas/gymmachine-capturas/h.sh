ADB=~/Library/Android/sdk/platform-tools/adb
S=/private/tmp/claude-501/-Users-alan20111-Documents-CV/8623b208-2bc4-4bfc-a586-2aa230622abc/scratchpad/gym
dump(){ $ADB shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; $ADB pull /sdcard/ui.xml $S/ui.xml >/dev/null 2>&1; }
# centro de un elemento por resource-id (sufijo) o por texto exacto
centro(){ /opt/homebrew/bin/node -e "
const s=require('fs').readFileSync('$S/ui.xml','utf8');const q=process.argv[1];
const re=/<node [^>]*>/g;let m;while((m=re.exec(s))){const n=m[0];
const id=(n.match(/resource-id=\"([^\"]*)\"/)||[])[1]||'';const tx=(n.match(/ text=\"([^\"]*)\"/)||[])[1]||'';const cd=(n.match(/content-desc=\"([^\"]*)\"/)||[])[1]||'';
if(id.endsWith('/'+q)||tx===q||cd===q){const b=n.match(/bounds=\"\[(\d+),(\d+)\]\[(\d+),(\d+)\]\"/);console.log(((+b[1]+ +b[3])>>1)+' '+((+b[2]+ +b[4])>>1));process.exit(0)}}
process.exit(1)" "$1"; }
tapq(){ dump; local c; c=$(centro "$1") || { echo "NO ENCONTRADO: $1"; return 1; }; $ADB shell input tap $c; sleep ${2:-2}; }
escribe(){ $ADB shell input text "$1"; }
cap(){ sleep ${2:-1}; $ADB shell screencap -p /sdcard/s.png 2>/dev/null; $ADB pull /sdcard/s.png "$S/shots/$1.png" >/dev/null 2>&1; echo "📸 $1"; }
atras(){ $ADB shell input keyevent 4; sleep ${1:-2}; }
desliza(){ $ADB shell input swipe 540 1700 540 ${1:-700} 400; sleep 1; }
textos(){ dump; /opt/homebrew/bin/node -e "
const s=require('fs').readFileSync('$S/ui.xml','utf8');const out=[];const re=/<node [^>]*>/g;let m;
while((m=re.exec(s))){const n=m[0];const tx=(n.match(/ text=\"([^\"]*)\"/)||[])[1]||'';const id=((n.match(/resource-id=\"[^\"]*\/([^\"]*)\"/)||[])[1])||'';const cl=n.includes('clickable=\"true\"')?'*':'';
if(tx||(id&&cl))out.push((cl)+(id?'['+id+'] ':'')+tx)}console.log(out.join(' | '))"; }
entra(){ $ADB shell pm clear com.gymmachine.entrenador >/dev/null; $ADB shell cmd locale set-app-locales com.gymmachine.entrenador --locales es-MX >/dev/null 2>&1; $ADB shell monkey -p com.gymmachine.entrenador -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1; sleep 9; tapq a_email 1; escribe "$1"; tapq a_password 1; escribe "demo1234"; $ADB shell input keyevent 111; tapq a_btnLogin 7; }
