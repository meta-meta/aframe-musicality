(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{67:function(e,t,a){e.exports=a(87)},87:function(e,t,a){"use strict";a.r(t);var n=a(11),r=(a(68),a(69),a(117)),i=a(3),o=a.n(i),l=a(0),c=a.n(l),s=a(6),u=Object(s.a)({root:{fontSize:20,fontFamily:"jetBrainsMono",display:"inline-flex",height:30,width:30,alignItems:"center",justifyContent:"center"},el:{fontFamily:"Segoe UI"},odd:{left:15,position:"relative"}})(function(e){var t=e.children,a=e.classes,n=e.className,r=void 0===n?"":n,i=e.isOdd,o=e.style;return c.a.createElement("div",{className:"".concat(a.root," ").concat(r," ").concat(i?a.odd:""),style:o},t)}),m=Object(s.a)({fretMarker:{color:"purple"}})(function(e){var t=e.classes.fretMarker,a=e.frets;return o.a.range(o.a.last(a)+1).map(function(e){return o.a.includes(a,e)?e:""}).map(function(e,a){return c.a.createElement(u,{className:t,key:a},e)})}),h=function(e){return{10:"\u0aea",11:"\u0190"}[e%12]||e%12},d=Object(s.a)({el:{fontFamily:"Segoe UI"}})(function(e){var t=e.classes,a=e.n,n=e.isOdd,r=e.style;return c.a.createElement(u,{className:a%12===11?t.el:"",isOdd:n,style:r},h(a))}),p=[1,3,5,7,10,12,15,17,19],f=function(){return c.a.createElement("div",{style:{display:"block",flexShrink:0}},c.a.createElement(m,{frets:p}),c.a.createElement("br",null),[0,9,5,0,0].map(function(e,t){return c.a.createElement(c.a.Fragment,null,o.a.range(23).map(function(t){return(t+e)%12}).map(function(e,a){return 4===t&&a<5?c.a.createElement(u,{key:a}):c.a.createElement(d,{key:a,n:e})}),c.a.createElement("br",null))}),c.a.createElement(m,{frets:p}))},y=[0,5,7,12,15,17,19,24],E=function(){return c.a.createElement("div",{style:{display:"block",flexShrink:0}},c.a.createElement(m,{frets:y}),c.a.createElement("br",null),[4,11,7,2,9,4].map(function(e){return c.a.createElement(c.a.Fragment,null,o.a.range(25).map(function(t){return(t+e)%12}).map(function(e,t){return c.a.createElement(d,{key:t,n:e})}),c.a.createElement("br",null))}),c.a.createElement(m,{frets:y}))},v=function(){return c.a.createElement("div",{style:{height:"100%",overflowY:"auto",padding:"20% 10%"}},c.a.createElement("h1",null,"What is this nonsense all about?"),c.a.createElement("p",null,'When I learned how to play an instrument, we started with "Hot Cross Buns", "Mary Had a Little Lamb", etc. We started with the first 3 notes in the key of "C". Eventually, we\'d build up to the other 4 notes. Then a new key was introduced. This one has a "Bb" -- the key of "F". At some point we\'d be introduced to an "accidental".'),c.a.createElement("p",null,'This left a lasting impression that the notes C, D, E, F, G, A, and B were the main notes. And these other things were in another class. They were harder -- harder to think about, harder to play, harder to keep track of, harder to say. C, D, E, F, G, A, and B are all single syllables. The other 5 notes were thought of as modifications of these main notes. "B flat", "C sharp", "D flat", yada yada. Wait are there 5 or are there 10?'),c.a.createElement("p",null,'"B sharp" is one of the first little musical jokes you get to say when you\'re in the know, until you learn that when you really get in deep, actually "B sharp" ',c.a.createElement("i",null,"is"),' a real note. There\'s even a "B double sharp"! How many notes ',c.a.createElement("i",null,"are"),' there!? Answer: infinite, as there are infinite numbers between 0 and 1, there are infinite pitches. Another answer, and this is the one we\'ll focus on in this website, is 12. There are 12 pitch-classes in the musical system that westerners refer to as "music theory" and more formally 12-tone equal temperament. All the fancy names like "B flat" and "F sharp" are just various spellings of the 12 pitch-classes in 12-TET.'),c.a.createElement("p",null,'This is all kind of interesting for a while and makes a young musician wonder about how deep this labyrinth gets. But it\'s all a smoke screen. And it gets even worse when you start to learn about intervals. Honestly, what\'s the use of a "diminished second" if not to sound pedantic and "technically correct"?'),c.a.createElement("p",null,"While I'll concede that it sort of makes sense when you're talking about notes ",c.a.createElement("i",null,"written on a staff"),", I'll maintain that it's a bullshit system to think in and it's needlessly convoluted, scares off all but the masochistic academics and overachievers. It adds a layer of cognitive as well as verbal overhead to otherwise simple concepts, and all so that we can pretend that music all fits into this diatonic model, with a few outliers that we call \"accidentals\". It makes the white keys approachable and the black keys scary and hard to name. \"Is it a C# or a Db\"? Why do we care, when we really just want to think about the one pitch we're trying to finger?"),c.a.createElement("p",null,"If we're going to commit to this arguably artificial model of 12 notes, which is but one of a panoply of more naturally harmonious tunings, if we're going to compromise with this 12-TET model so that we end up with 12 equally spaced notes around the octave, let's go all in and treat it with the simple terms it asks for. Let's treat these 12 notes equally instead of imagining this additional layer of complexity on top of them."),c.a.createElement("br",null),c.a.createElement("hr",null),c.a.createElement("h2",null,"Please consider:"),c.a.createElement("pre",null,o.a.range(12).map(function(e){return c.a.createElement(d,{key:e,n:e})})),c.a.createElement("p",null,' That\'s "oh" "one" "two" "three" "four" "five" "six" "sev" "eight" "nine" "ten" "el".'))},g=function(){return c.a.createElement(c.a.Fragment,null,o.a.range(6).map(function(e){return c.a.createElement("div",{style:{display:"block",flexShrink:0,margin:"1em"}},o.a.range(13).map(function(t){return c.a.createElement(c.a.Fragment,null,o.a.range(13).map(function(a){return c.a.createElement(d,{key:a,n:e+a*t})}),c.a.createElement("br",null))}))}))},b=a(54),k=a(55),w=a(60),j=a(56),M=a(61),S=function(e){function t(){var e,a;Object(b.a)(this,t);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(a=Object(w.a)(this,(e=Object(j.a)(t)).call.apply(e,[this].concat(r)))).state={text:""},a.handleKeyPress=function(e){var t={Backquote:"0",Digit1:"1",Digit2:"2",Digit3:"3",Digit4:"4",Digit5:"5",Digit6:"6",Digit7:"7",Digit8:"8",Digit9:"9",Digit0:"\u0aea",Minus:"\u0190",Equal:"0",Numpad0:"0",Numpad1:"1",Numpad2:"2",Numpad3:"3",Numpad4:"4",Numpad5:"5",Numpad6:"6",Numpad7:"7",Numpad8:"8",Numpad9:"9",NumpadDivide:"\u0aea",NumpadMultiply:"\u0190",NumpadDecimal:" ",NumpadEnter:"\n",Enter:"\n",Space:" "}[e.code];t&&(e.preventDefault(),a.setState({text:a.state.text+t}))},a.handleChange=function(e){var t=e.target.value;return a.setState({text:t})},a}return Object(M.a)(t,e),Object(k.a)(t,[{key:"componentDidMount",value:function(){window.addEventListener("keypress",this.handleKeyPress)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keypress",this.handleKeyPress)}},{key:"render",value:function(){return c.a.createElement("div",null,c.a.createElement("h3",null,"Use the numpad to enter pitch classes"),c.a.createElement("textarea",{cols:24,rows:20,onChange:this.handleChange,style:{background:"black",color:"darkgray",fontSize:20},value:this.state.text}))}}]),t}(l.Component),I=a(43),O=a.n(I),x=a(37),D={beat:1,midi:o.a.zipObject(o.a.range(128),o.a.fill(new Array(128),0)),oscHost:"",seq:{}},T={clearSeq:function(e){return e.setState({seq:{}})},setBeat:function(e,t){return e.setState({beat:t})},setInSeq:function(e,t,a){return e.setState({seq:o.a.set(e.state.seq,[t],a)})},setMidiEvent:function(e,t){return e.setState({midi:o.a.merge(e.state.midi,t)})},setOscHost:function(e,t){return e.setState({oscHost:t})}},q=Object(x.a)(c.a,D,T),C=function(){var e=q(function(e){return{beat:e.beat,midi:e.midi,oscHost:e.oscHost,seq:e.seq}},function(e){return e}),t=Object(n.a)(e,2),a=t[0],r=t[1];Object(l.useEffect)(function(){var e={host:window.location.hostname,port:"8080"},t=new O.a({plugin:new O.a.WebsocketClientPlugin(e)});t.open();var a=r.clearSeq,i=r.setBeat,l=r.setInSeq;r.setMidiEvent,(0,r.setOscHost)(e),t.on("/midiSeq/clear",function(){return a()}),t.on("/midiSeq/beat",function(e){var t=Object(n.a)(e.args,1)[0];return i(t)}),t.on("/midiSeq/note/*",function(e){var t=e.address,a=e.args,r=parseInt(o.a.takeRight(t.split("/"),2)[0],10);l(r,o()(a).chunk(2).map(function(e){var t=Object(n.a)(e,2);return{note:t[0],vel:t[1]}}).value())})},[]);var i=(a.seq[a.beat]||[]).map(function(e){return e.note%12});return c.a.createElement("div",null,c.a.createElement("h1",null,a.beat),c.a.createElement("div",{style:{backgroundColor:"deeppink",color:"black",height:"30vh",position:"relative",width:"30vh"}},(a.seq[a.beat]||[]).map(function(e,t){var a=e.note;return e.vel,c.a.createElement(d,{key:t,n:a})}),o.a.range(12).map(function(e,t){var a=e/12*Math.PI*2;return c.a.createElement(d,{key:t,n:e,style:{color:o.a.includes(i,e)?"cyan":"black",fontSize:"1.5em",position:"absolute",left:"".concat(100*(.25*Math.sin(a)+.5),"%"),top:"".concat(100*(-.25*Math.cos(a)+.5),"%")}})})))},N=a(7),B=a.n(N),P=function(){return c.a.createElement("div",{style:{display:"block",flexShrink:0}},o.a.range(30).map(function(e){return c.a.createElement(c.a.Fragment,null,o.a.range(50).map(function(t){var a=((e%2>0?(e-1)/2*11+3:e/2*11)+7*t)%12;return c.a.createElement(d,{key:t,n:a,isOdd:e%2===1})}),c.a.createElement("br",null))}))},F=a(115);function H(e,t,a){var n,r,i,o,l,c,s,u;switch(1===arguments.length&&(t=e.s,a=e.v,e=e.h),c=a*(1-t),s=a*(1-(l=6*e-(o=Math.floor(6*e)))*t),u=a*(1-(1-l)*t),o%6){case 0:n=a,r=u,i=c;break;case 1:n=s,r=a,i=c;break;case 2:n=c,r=a,i=u;break;case 3:n=c,r=s,i=a;break;case 4:n=u,r=c,i=a;break;case 5:n=a,r=c,i=s}return function(e){var t=e.r,a=e.g,n=e.b;function r(e){var t=e.toString(16);return 1==t.length?"0"+t:t}return"#"+r(t)+r(a)+r(n)}({r:Math.round(255*n),g:Math.round(255*r),b:Math.round(255*i)})}var A=function(e){var t=e.n,a=e.midiIn,n=e.position,r=void 0===n?"0 0 0":n,i=e.scale,o=void 0===i?"1 1 1":i;return c.a.createElement("a-sphere",{color:"black",opacity:.3,position:r,radius:.15,scale:o},c.a.createElement("a-text",{align:"center",color:H(t/12,.75,1),font:"../segoeui-msdf.json",negate:"false","look-at":"#camera",opacity:a?1:.25,value:h(t)}))},z={input:void 0,inputDevices:[],isDeviceSelectorVisible:!1,midiIn:o.a.zipObject(o.a.range(128),o.a.fill(new Array(128),0))},W={setInputDevice:function(e,t){var a=e.state.counter+t;e.setState({counter:a})},setInputDevices:function(e,t){return e.setState({inputDevices:t})},setMidiEvent:function(e,t){return e.setState({midiIn:o.a.merge(e.state.midiIn,t)})},toggleDeviceSelector:function(e){return e.setState({isDeviceSelectorVisible:!e.state.isDeviceSelectorVisible})}},L=Object(x.a)(c.a,z,W),U=a(10),V=function(){var e=Object(l.useState)(!0),t=Object(n.a)(e,2),a=t[0],r=t[1];Object(l.useEffect)(function(){var e=function(e){"r"===e.key&&r(function(e){return!e})};return window.addEventListener("keyup",e),function(){return window.removeEventListener("keyup",e)}},[]);var i=L(),s=Object(n.a)(i,1)[0].midiIn,u=o()(12).range().map(function(e){return o()(s).pickBy(function(t,a){return a%12===e}).values().sum()}).value();return c.a.createElement(U.Entity,{animation:"property: rotation; to: 0 ".concat(a?180:0," 0; dur: 500;"),position:"0 0 -3"},o()(12).range().filter(function(e){return e%2==0}).map(function(e){return{n:e,r:1.5,x:-Math.sin(e*Math.PI/6),y:Math.cos(e*Math.PI/6)}}).map(function(e){var t=e.n,a=e.r,n=e.x,r=e.y;return c.a.createElement(A,{midiIn:u[t],n:t,position:"".concat(a*n," ").concat(a*r," 0")})}).value(),o()(48).range().filter(function(e){return!o.a.includes([6,7,0,1],e%8)}).map(function(e,t){return{i:t,n:(2*(t+1)+2*Math.floor(t/4))%12,r:1.5,x:Math.sin((e+.5)*Math.PI/24),y:Math.cos((e+.5)*Math.PI/24)}}).map(function(e){var t=e.n,a=e.r,n=e.x,r=e.y;return c.a.createElement(A,{midiIn:u[t],n:t,position:"".concat(a*n," ").concat(a*r," 0"),scale:"0.5 0.5 0.5"})}).value(),o()(12).range().filter(function(e){return e%2!=0}).map(function(e){return{n:(e+6)%12,r:1.2,x:-Math.sin(e*Math.PI/6),y:Math.cos(e*Math.PI/6)}}).map(function(e){var t=e.n,a=e.r,n=e.x,r=e.y;return c.a.createElement(A,{midiIn:u[t],n:t,position:"".concat(a*n," ").concat(a*r," 0")})}).value(),o()(48).range().filter(function(e){return!o.a.includes([4,5,6,7],e%8)}).map(function(e,t){return{i:t,n:(2*t+9+2*Math.floor(t/4))%12,r:1.2,x:Math.sin((e-1.5)*Math.PI/24),y:Math.cos((e-1.5)*Math.PI/24)}}).map(function(e){var t=e.n,a=e.r,n=e.x,r=e.y;return c.a.createElement(A,{midiIn:u[t],n:t,position:"".concat(a*n," ").concat(a*r," 0"),scale:"0.5 0.5 0.5"})}).value())},G=a(46),K=1.3305869973355013,J=2.152934986677507,R=[[0,-J,K],[0,J,-K],[J,-K,0],[-J,K,0],[0,-J,-K],[0,J,K],[-J,-K,0],[J,K,0],[-K,0,J],[K,0,-J],[K,0,J],[-K,0,-J]],_=function e(t){var a=t.rep,n=void 0===a?1:a,r=t.sat,i=t.stack,o=void 0===i?[]:i,l=t.n,s=void 0===l?0:l;return c.a.createElement(U.Entity,{position:"0 0 0"},R.map(function(e,t){return c.a.createElement(U.Entity,{key:t,color:H(t*(1/12),r||1,1),events:{click:function(){return console.log(t)}},primitive:"a-sphere",position:e.join(" "),scale:[1,1,1].map(function(e){return.3*e/(n*n)}).join(" ")})}),n<3&&R.map(function(t,a){return c.a.createElement(U.Entity,{key:a,position:t.map(function(e){return 2*e}).join(" "),text:"color: ".concat(H((o.length?o[o.length-1]:a)*(1/12),1,1),"; align: center; value: ").concat([].concat(Object(G.a)(o),[a]).join(",")," - ").concat((s+a)%12,"; width: 5; zOffset: 0")},c.a.createElement(e,{rep:n+1,sat:.3,stack:[].concat(Object(G.a)(o),[a]),n:(s+a)%12}))}))},Y=a(21),Q=function(e){var t=e.match.path;return c.a.createElement(U.Scene,null,c.a.createElement("a-assets",null,c.a.createElement("img",{id:"groundTexture",src:"https://cdn.aframe.io/a-painter/images/floor.jpg"}),c.a.createElement("img",{id:"skyTexture",src:"https://cdn.aframe.io/a-painter/images/sky.jpg"})),c.a.createElement(Y.c,null,c.a.createElement(Y.a,{path:"".concat(t,"/coltrane"),component:V}),c.a.createElement(Y.a,{path:"".concat(t,"/dod"),component:_})),c.a.createElement(U.Entity,{height:"2048",primitive:"a-sky",radius:"30",rotation:"90 0 0",src:"#skyTexture","theta-length":"90",width:"2048"}),c.a.createElement(U.Entity,{height:"2048",primitive:"a-sky",radius:"30",rotation:"90 0 180",src:"#skyTexture","theta-length":"90",width:"2048"}),c.a.createElement(U.Entity,{primitive:"a-camera",id:"camera",position:"0 0 0"},c.a.createElement(U.Entity,{primitive:"a-cursor",animation__click:{property:"scale",startEvents:"click",from:"0.1 0.1 0.1",to:"1 1 1",dur:150}})),c.a.createElement(U.Entity,{id:"leftHand","oculus-touch-controls":"hand: left"}),c.a.createElement(U.Entity,{id:"rightHand","oculus-touch-controls":"hand: right"}))},X=a(118),Z=a(119),$=a(120),ee=a(121),te=a(123),ae=a(28),ne=a(59),re=a(116),ie=a(122);B.a.render(c.a.createElement(function(){var e=Object(F.a)("(prefers-color-scheme: dark)"),t=c.a.useMemo(function(){return Object(ne.a)({palette:{action:{active:"#660000"},primary:{main:"#440044"},type:e?"dark":"light"}})},[e]),a=c.a.useState(null),i=Object(n.a)(a,2),o=i[0],l=i[1],s=function(){return l(null)};return c.a.createElement(re.a,{theme:t},c.a.createElement(r.a,null),c.a.createElement(ae.a,{basename:"/aframe-musicality"},c.a.createElement(Y.a,{path:"/",exact:!0,component:v}),c.a.createElement(Y.a,{path:"/vr",render:function(e){return c.a.createElement(Q,e)}}),c.a.createElement(Y.a,{path:"/multTableMod12",component:g}),c.a.createElement(Y.a,{path:"/numpadMod12",component:S}),c.a.createElement(Y.a,{path:"/osc",component:C}),c.a.createElement(Y.a,{path:"/tonnetz",component:P}),c.a.createElement(Y.a,{path:"/banjo",component:f}),c.a.createElement(Y.a,{path:"/guitar",component:E}),c.a.createElement(X.a,{position:"fixed",style:{top:"auto",bottom:0}},c.a.createElement(Z.a,null,c.a.createElement($.a,{edge:"start",color:"inherit","aria-label":"open drawer",onClick:function(e){var t=e.currentTarget;return l(t)}},c.a.createElement(ie.a,null)),c.a.createElement(ee.a,{anchorEl:o,open:!!o,onClose:s},c.a.createElement(te.a,null,c.a.createElement(ae.b,{style:{color:"lightgrey"},onClick:s,to:"/"},"Introduction")),c.a.createElement(te.a,{disabled:!0,divider:!0},"2D"),[["Numpad","/numpadMod12"],["Mod 12 Multiplication Tables","/multTableMod12"],["Tonnetz","/tonnetz"],["Banjo","/banjo"],["Guitar","/guitar"]].map(function(e,t){var a=Object(n.a)(e,2),r=a[0],i=a[1];return c.a.createElement(te.a,{key:t},c.a.createElement(ae.b,{style:{color:"pink"},onClick:s,to:i},r))}),c.a.createElement(te.a,{disabled:!0,divider:!0},"VR"),[["Coltrane Circle","/vr/coltrane"],["Dod","/vr/dod"]].map(function(e,t){var a=Object(n.a)(e,2),r=a[0],i=a[1];return c.a.createElement(te.a,{key:t},c.a.createElement(ae.b,{style:{color:"cyan"},onClick:s,to:i},r))}))))))},null),document.querySelector("#sceneContainer"))}},[[67,1,2]]]);
//# sourceMappingURL=main.233db284.chunk.js.map