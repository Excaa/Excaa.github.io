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
				title.text("Sceneradio @ Wappuradio - 25.4.2020 21:00-00:00");
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
				active.track.disconnect(analyzer);
				active.jq.find("img").attr("src","img/play.png");
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
		var generatePlayer = (url, name, hideNumber) => {
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
			
			players.push( media );
		};
		//2020 players.
		generatePlayer("2020compo/15.8_Wrenchotron-Bone_Chips.mp3", "1. Wrenchotron - Bone Chips");
		generatePlayer("2020compo/15.4_Team_Roger-Firescape.mp3", "2. Team Roger - Firescape");
		generatePlayer("2020compo/15.7_defilus-waiting_in_your_brains_(compo_edit).mp3", "3. Defilus - Waiting in your brains");
		generatePlayer("2020compo/15.1_Jarsk1e-Return_to_the_Past.mp3", "4. Jarsk1e - Return to the Past");
		generatePlayer("2020compo/15.6_dusthillguy-Special_Friends_Finale.mp3", "5. dusthillguy - Special Friends Finale");
		generatePlayer("2020compo/15.5_KVR-Gimme_time.mp3", "6. KVR - Gimme Time");
		generatePlayer("2020compo/15.2_proton-galwaymulation.mp3", "7. proton - Galwaymulation");
		generatePlayer("2020compo/15.9_jvar-paper_panic.mp3", "8. jvar - paper panic");
		generatePlayer("2020compo/15.3_MEGA-Erkki-sekoukko.mp3", "9. MEGA-Erkki - sekoukko");
		generatePlayer("2020compo/15.99_Uniaika-Lageroosio.mp3", "Late entry: Uniaika - Lageroosio", true);
		
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