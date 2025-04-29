/**
 * TOOD - Code the whole site again properly :D
 * @author Henri Sarasvirta
 */

(function() {
	$().ready(function(){
		var title = $("#titletext");
		var titleResize = function()
		{
			if(window.innerWidth < 584)
			{
				title.text("Sceneradio");
			}
			else if(window.innerWidth < 994)
			{
				title.text("Sceneradio @ Wappuradio");
			}
			else
			{
				title.text("Sceneradio @ Wappuradio "/*- 23.4.2023 19:00-22:00"*/);
			}
		}
		$(window).resize(titleResize);
		titleResize();
		
		//Player
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		let audioCtx = null;
		let analyzer = null;
		let dataArray = null;
		var initAudio = ()=>{
			audioCtx = new AudioContext();
			analyzer = audioCtx.createAnalyser();
			analyzer.fftSize = 2048;
			var bufferLength = analyzer.frequencyBinCount;
			dataArray = new Uint8Array(bufferLength);
			analyzer.connect(audioCtx.destination);
		}
		
		
		var active = null;
		var clearTrack = ()=>{
			if(active)
			{
				active.audio.pause();
				active.jq.find("img").attr("src","img/play.png");
				try{
				active.track.disconnect(analyzer);
				}catch(e){}
			}
		}
		
		var playTrack = ( media )=>
		{
			if(!audioCtx) initAudio();
			if(!media.track) media.track = audioCtx.createMediaElementSource(media.audio);
			clearTrack();
			if(media == active)
			{
				active = null;
			}
			else
			{
				active = media;
				active.jq.find("img").attr("src","img/pause.png");
				media.track.connect(analyzer);
				media.audio.play();
			}
		}
		
		//Medias
		var playerDiv = $("#player");
		var players = [];
		var generatePlayer = (url, name, hideNumber, year) => {
			s  = document.createElement("ol");
			s.className = "player";
			s.dataset["url"] = url;
			
			s.innerHTML = "<img style='cursor:pointer' src='img/play.png' width='16' height='16'/>"+
			"<span class='time' style='position:relative; margin-left:10px; margin-right:10px;width:200px;height:10px; display:inline-block; border-radius:10px; background:rgba(136,88,160,0.75)'><span class='head' style='position:absolute;top:0px;display:inline-block;width:4px; height:10px;background:#4E0;'></span></span>"+name;
			
			if(hideNumber)
				s.style.listStyle = "none";
			playerDiv.append(s);
			
			var audioEl = document.createElement("audio");
			audioEl.src = url;
			
			var media ={
				jq:$(s),
				element: s,
				audio: audioEl,
				track: null
			};
			
			$(s).find("img").click( () => {
				playTrack(media);
			});
			media.year = year;
			players.push( media );
		};
		
		var changeYear = (to) => {
			clearTrack();
			players.forEach( p => p.element.style.display = "none");
			var show = players.filter( p => p.year == to);
			show.forEach( p => p.element.style.display = "block");
		}
		
		//2025 players.
		generatePlayer("2025compo/01_Tayskersantti_VonDemus_Viidakkoraivo.mp3", "1. Tayskersantti & VonDemus - Viidakkoraivo", false, 2025);
		generatePlayer("2025compo/02_TheWing_Citydream.mp3", "2. TheWing - Citydream", false, 2025);
		generatePlayer("2025compo/03_Tawsky_The_Call_of_Great_Tits.mp3", "3. Tawsky - The Call of Great Tits", false, 2025);
		generatePlayer("2025compo/04_Joner_Rapu_Tahlberg.mp3", "4. Joner - Rapu Tahlberg", false, 2025);
		generatePlayer("2025compo/05_OHRU_Bit_Walkers.mp3", "5. OHRU - Bit Walkers", false, 2025);
		
		//2024 players.
		generatePlayer("2024compo/01_Karl Phaser - Da-Capocalypse.mp3", "1. Karl Phaser - Da-Capocalypse", false, 2024);
		generatePlayer("2024compo/02_vurpo - soundinlavaytin_wappuaattona.mp3", "2. vurpo - Soundinläväytin wappuaattona", false, 2024);
		generatePlayer("2024compo/03_TheWing - Radiophone.mp3", "3. TheWing - Radiophone", false, 2024);
		generatePlayer("2024compo/04_conffa - WappuSIDsit.mp3", "4. conffa - WappuSIDsit", false, 2024);
		generatePlayer("2024compo/05_VonDemus - Ultrahai.mp3", "5. VonDemus - Ultrahai", false, 2024);
		generatePlayer("2024compo/06_eimink Try Again.mp3", "6. eimink - Try Again", false, 2024);
		generatePlayer("2024compo/07_zeppe - Wapun ydin.mp3", "7. zeppe - Wapun ydin", false, 2024);
		generatePlayer("2024compo/08_Tawsky - Kalevan Naakkaparvi.mp3", "8. Tawsky - Kalevan Naakkaparvi", false, 2024);
		
		//2023 players.
		generatePlayer("2023compo/01 - conffa - Mauri Mursun kaljanhakureissu (NES).mp3", "1. conffa - Mauri Mursun kaljanhakureissu (NES)", false, 2023);
		generatePlayer("2023compo/02 - VonDemus - Twilight of a Cold Star.mp3", "2. VonDemus - Twilight of a Cold Star", false, 2023);
		generatePlayer("2023compo/03 - Tawsky - View From the Edge.mp3", "3. Tawsky - View From the Edge", false, 2023);
		generatePlayer("2023compo/04 - eimink - samplejunkka.mp3", "4. eimink - samplejunkka", false, 2023);
		generatePlayer("2023compo/05 - Tuoreet Eksotit - Nousevan Auringon Maa.mp3", "5. Tuoreet Eksotit - Nousevan Auringon Maa", false, 2023);
		generatePlayer("2023compo/06 - bitofhope - vaihteeksi joku muu kuin pipeline koveri.mp3", "6. bitofhope - vaihteeksi joku muu kuin pipeline koveri", false, 2023);
		generatePlayer("2023compo/07 - IlmariTonttu - Ilman menoo.mp3", "Late entry: IlmariTonttu - Ilman menoo", false, 2023);
		
		//2022 players.
		generatePlayer("2022compo/01 - Leposyke - Nahkanaama.mp3", "1. Leposyke - Nahkanaama", false, 2022);
		generatePlayer("2022compo/02 - VonDemus - Phantom Charger.mp3", "2. VonDemus - Phantom Charger", false, 2022);
		generatePlayer("2022compo/03 - TheWing - Radiotalo.mp3", "3. TheWing - Radiotalo", false, 2022);
		generatePlayer("2022compo/04 - mutetus - sukkapuikko.mp3", "4. mutetus - sukkapuikko", false, 2022);
		generatePlayer("2022compo/05 - eUFOria UFO - Inside Out.mp3", "5. eUFOria UFO - Inside Out", false, 2022);
		generatePlayer("2022compo/06 - defilus - chiptonautilus 1 theme.mp3", "6. Defilus - Chiptonautilus 1 theme", false, 2022);
		generatePlayer("2022compo/07 - mankeli - mod.necrosampler iv.mp3", "7. mankeli - mod.necrosampler iv", false, 2022);
		
		//2021 players.
		generatePlayer("2021compo/13_4_Defilus_once you pop.mp3", "1. Defilus - Once you pop", false, 2021);
		generatePlayer("2021compo/13_2_Leposyke_Sulatettu Järjestelmä.mp3", "2. Leposyke - Sulautettu Järjestelmä", false, 2021);
		generatePlayer("2021compo/13_1_eimink_-_Mike_from_Deep_House.mp3", "3. eimink - Mike from Deep House", false, 2021);
		generatePlayer("2021compo/13_0_kvr-tieteista_ihmeellisin.mp3", "4. KVR - Tieteistä Ihmeellisin", false, 2021);
		generatePlayer("2021compo/13_3_dusthillresident_John Roddy was the best scanlator ever, better than Meiru.mp3", "5. dusthillresident - John Roddy was the best scanlator ever, better than Meiru", false, 2021);
		generatePlayer("2021compo/13-5_MagnetismOrkesteriKerho - Kebab(cauha)TuleeOletkoValmis.mp3", "6. MagnetismOrkesteriKerho - Kebab(cauha)TuleeOletkoValmis", false, 2021);
		
		//2020 players.
		generatePlayer("2020compo/15.8_Wrenchotron-Bone_Chips.mp3", "1. Wrenchotron - Bone Chips", false, 2020);
		generatePlayer("2020compo/15.4_Team_Roger-Firescape.mp3", "2. Team Roger - Firescape", false, 2020);
		generatePlayer("2020compo/15.7_defilus-waiting_in_your_brains_(compo_edit).mp3", "3. Defilus - Waiting in your brains", false, 2020);
		generatePlayer("2020compo/15.1_Jarsk1e-Return_to_the_Past.mp3", "4. Jarsk1e - Return to the Past", false, 2020);
		generatePlayer("2020compo/15.6_dusthillguy-Special_Friends_Finale.mp3", "5. dusthillguy - Special Friends Finale", false, 2020);
		generatePlayer("2020compo/15.5_KVR-Gimme_time.mp3", "6. KVR - Gimme Time", false, 2020);
		generatePlayer("2020compo/15.2_proton-galwaymulation.mp3", "7. proton - Galwaymulation", false, 2020);
		generatePlayer("2020compo/15.9_jvar-paper_panic.mp3", "8. jvar - paper panic", false, 2020);
		generatePlayer("2020compo/15.3_MEGA-Erkki-sekoukko.mp3", "9. MEGA-Erkki - sekoukko", false, 2020);
		generatePlayer("2020compo/15.99_Uniaika-Lageroosio.mp3", "Late entry: Uniaika - Lageroosio", true, 2020);
		//2018
		generatePlayer("2018compo/Panther - Keenin Humppa.mp3", "1. Panther - Keenin Humppa", false, 2018);
		generatePlayer("2018compo/cos_-_radio_of_love_and_wappu.mp3", "2. cos - Radio of love and wappu", false, 2018);
		generatePlayer("2018compo/pappatunkka-i_like_white_but_my_favourite_is_green.mp3", "3. Pappatunkka - I like white but my favourite is green", false, 2018);
		generatePlayer("2018compo/onneks satuin olemaan bändikämpällä kun kuulin tästä.mp3", "4. Mergente - onneks satuin olemaan bändikämpällä kun kuulin tästä", false, 2018);
		generatePlayer("2018compo/EpicAW_tupsulan_saunassa.mp3", "5. Epic AW - Tupsulan saunassa", false, 2018);
		//2016
		generatePlayer("2016compo/conffa_-_Ignis.mp3", "1. conffa - Ignis", false, 2016);
		generatePlayer("2016compo/minomus_legend_glxblt_-_Batwalk_Diva.mp3", "2. minomus, legend & glxblt;  - Batwalk Diva", false, 2016);
		generatePlayer("2016compo/Terwiz_-_WappuRide.mp3", "3. Terwiz - Wappuride", false, 2016);
		generatePlayer("2016compo/Oksaperseessa2000_-_Mayra_jatkaa_elamaansa_rumpuna.mp3", "4. Oksaperseessä2000 - Mäyrä jatkaa elämäänsä rumpuna", false, 2016);
		
		changeYear(2025);
		
		document.getElementById("c2025").addEventListener("click", e => changeYear(2025));
		document.getElementById("c2024").addEventListener("click", e => changeYear(2024));
		document.getElementById("c2023").addEventListener("click", e => changeYear(2023));
		document.getElementById("c2022").addEventListener("click", e => changeYear(2022));
		document.getElementById("c2021").addEventListener("click", e => changeYear(2021));
		document.getElementById("c2020").addEventListener("click", e => changeYear(2020));
		document.getElementById("c2018").addEventListener("click", e => changeYear(2018));
		document.getElementById("c2016").addEventListener("click", e => changeYear(2016));
		
		
		//Background effect
		var ok = true;
		try
		{
			var canvas = document.createElement("canvas");
			canvas.width = 1230;
			canvas.height = 300;
			canvas.style.backgroundColor = "#0f0";
			var gl = canvas.getContext("webgl");
			var program = gl.createProgram();
			
			var buildShader = function(code, type)
			{
				var shader = gl.createShader(type);
				gl.shaderSource(shader, code);
				gl.compileShader(shader);
								
				//var message = gl.getShaderInfoLog(shader);
				//if (message.length > 0) {
				  /* message may be an error or a warning */
//				  console.logic(message);
				//}
				gl.attachShader(program, shader);
			}
			
			
			buildShader("attribute vec2 e;void main(){gl_Position=vec4(e,0,1);}",gl.VERTEX_SHADER);
			buildShader(`precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform float size;
uniform float high;
float hash21(vec2 p)
{
 	return fract(sin(dot(p.xy ,vec2(1.9898,7.233))) * 4.5453);
}
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
void main( )
{
	float aspect = iResolution.y/iResolution.x;
    vec2 uv = gl_FragCoord.xy/iResolution.xy-0.5;
    uv.y *= aspect;
    
    float gsize = 1.9+ cos(iTime*0.1)*1.5;
	if(iResolution.x < 750.)
		gsize = 0.95+ cos(iTime*0.1)*0.50;
    uv*=gsize;
    
    float a = sin(iTime*0.15)*0.2;
    float dx = uv.x * cos(a) - sin(a)*uv.y;
    float dy = uv.x * sin(a) + cos(a)*uv.y;
    
    uv=vec2(dx,dy);
    uv+=iTime*0.1+vec2(sin(iTime*.2), cos(iTime*0.3))*0.005;
    
    vec2 gx = floor(uv);
    vec2 guv = fract(uv)-0.5;
    
    float n = hash21(gx);
    if(n<0.5) guv.x*=-1.;
    
    vec2 c1 =  guv -vec2(0.5)*sign(guv.x+guv.y+0.01);
    
    float a1 = length(c1) -0.5;
    float d =  abs(a1);
    float ang1 = atan( c1.y,c1.x)*2./3.14;
    float off = sin(ang1*3.14+iTime);
    float mp = 1.;
    if(mod(gx.x+gx.y,2.)>0.5)
    {
        if(n>=0.5)
        {
            a1=-a1;
        }
		mp=-1.;
      	off=sin(-ang1*3.14+iTime);   
    }
    else if(n<0.5)
    {
       a1=-a1;
	   
    }
    float mpc = smoothstep(0.1, 0.3-size*0.15, 0.02/d);
    vec3 c = palette(mp*ang1-iTime*1.20 , vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );
	c+= vec3(0.1+high*0.3);
	c*=mpc*(0.9+0.1*off);
    
    gl_FragColor = vec4(c,1.0);
}`
				, gl.FRAGMENT_SHADER) //FRAGMENT
			
			gl.linkProgram(program);
			gl.enableVertexAttribArray(0);
			gl.useProgram(program);
			
			gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
			gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([1,1,1,-3,-3,1]),gl.DYNAMIC_DRAW);
		}
		catch(e)
		{
			ok = false;
		}
		var dpr = window.devicePixelRatio;
		if(isNaN(dpr)) dpr = 1;
		if(ok)
		{
			//Raf
			var time = 0;
			var tot = 0;
			var raf=function(c) {
				var delta = c-time;
				time = c;
				tot += delta;
				//Audio sync
				for(let i = 0; i < players.length; i++)
				{
					players[i].jq.find(".head").css("left","0px");
				}
				if(active != null)
				{
					var pos = active.audio.currentTime / active.audio.duration;
					active.jq.find(".head").css("left" , Math.round(pos*200)+"px");
				}
				var all = 0;
				var high = 0;
				if(analyzer)
				{
					analyzer.getByteFrequencyData(dataArray);
					var sum = 0;
					
					for( let i = 0; i < 1024; i++)
					{
						if( i >= 70 && i < 150 && dataArray[i] > 110)
							tot+=dataArray[i]/255;
						all+=dataArray[i];
						if( i >700 && dataArray[i] > 20)
							high += dataArray[i]/25;
					}
					all/=(2048*128);
					high/=350;
					c+=sum;
				}
			  //Update uniforms, do logic etc. Default just updates r (time) in shader.
			  gl.uniform1f(gl.getUniformLocation(program, "iTime"), tot*.00015);
			  gl.uniform1f(gl.getUniformLocation(program, "size"), all);
			  gl.uniform1f(gl.getUniformLocation(program, "high"), high);
			  gl.uniform2f(gl.getUniformLocation(program, "iResolution"), canvas.width/dpr, canvas.height/dpr);
			  gl.vertexAttribPointer(0, 2, gl.FLOAT, 0,8,0);
			  gl.drawArrays(4,0,3);
			  self.requestAnimationFrame(raf);
			}
			raf(0);
			
			//Resize
			var resize = function(){
				var iw = window.innerWidth;
				var ih = window.innerHeight;
				canvas.width = iw;
				canvas.height = ih;
				gl.viewport(0,0,iw,ih);
			}
			$(window).resize(resize);
			resize();
			
			var demo = document.getElementById("demo");
			demo.appendChild( canvas);
		}
		
	});
	
})();