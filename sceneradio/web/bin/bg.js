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
				title.text("Sceneradio @ Wappuradio - 25.4.2020 21:00-00:00");
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
				'float sind(vec2 p, float ph, float rad, float off, float tmp){',
				'return smoothstep(0.,8.,1./abs(p.y*ph-sin(off+p.x+r*tmp*0.24)*rad))*8.;',
				'}',
				"void main(){",
				'	vec2 uv = gl_FragCoord.xy/resolution-vec2(0.5);',
				'	vec3 col = vec3(0.);',
				'	vec3 b = 0.5 + 0.5*cos(r+uv.xyx+vec3(0,2,4));',
				'	col+=sind(uv, 20., 5.,0.0,0.2)*b;',
				'	col+=sind(uv, 40., 10.,1.0,0.4)*b;',
				'	col+=sind(uv, 60., 20.,2.0,0.6)*b;',
				'	col+=sind(uv, 80., 30.,3.0,0.8)*b;',
				'	col+=sind(uv, 100., 40.,4.0,1.0)*b;',
				'	col=clamp(vec3(0.), vec3(1.), col);',
				'	col*=mod(gl_FragCoord.x*0.5, 1.5);',
				'	col*=mod(gl_FragCoord.y*0.5, 1.5);',
				"	gl_FragColor=vec4(col*.25,1.);",
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