/**
 * ...
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
				title.text("Sceneradio @ Wappuradio 101,6 MHz - 20.4. 21-24");
			}
		}
		$(window).resize(titleResize);
		titleResize();
		
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
				gl.attachShader(program, shader);
			}
			
			buildShader("attribute vec2 e;void main(){gl_Position=vec4(e,0,1);}",gl.VERTEX_SHADER);
			buildShader([
				"precision mediump float;",
				"uniform float r;",
				"uniform vec2 resolution;",
				'vec3 pal( float t, vec3 a, vec3 b, vec3 c, vec3 d )',
				'{',
				'	return a + b*cos( 6.28318*(c*t+d) );',
				'}',
				"void main(){",
				'	vec2 uv = gl_FragCoord.xy/resolution;',
				'	uv.y*=resolution.y/resolution.x;',
				'	uv*=sin(r/5.)*1. + 1.5;',
				'	float t = r*0.7;',
				'	float p = sin(uv.y*0.5-uv.x*0.5 + cos(uv.x+uv.y+t*.1)*1.)*.5+',
				'	cos(uv.y*0.9-uv.x*0.7 + cos(uv.x+uv.y+t*.2)*2.)*.5;',
				'	vec3 col = pal( p, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );',
				'	col = col+vec3(0.15,0.0,0.2);',
				'	col*=col*col;',
				'	float s = 10.;',
				'	col*=abs(0.5-mod(gl_FragCoord.x,s)/s)*2.;',
				'	col*=abs(0.5-mod(gl_FragCoord.y,s)/s)*2.;',
				"	gl_FragColor=vec4(col,1.);",
				"}"
				].join("\n"), gl.FRAGMENT_SHADER) //FRAGMENT
			
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
		
		if(ok)
		{
			var raf=function(c) {
			  //Update uniforms, do logic etc. Default just updates r (time) in shader.
			  gl.uniform1f(gl.getUniformLocation(program, "r"), c*.001);
			  gl.uniform2f(gl.getUniformLocation(program, "resolution"), canvas.width, canvas.height);
			  gl.vertexAttribPointer(0, 2, gl.FLOAT, 0,8,0);
			  gl.drawArrays(4,0,3);
			  self.requestAnimationFrame(raf);
			}
			raf(0);
			
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