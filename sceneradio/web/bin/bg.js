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
    vec2 uv = gl_FragCoord.xy/iResolution.xy-0.5;
    uv.y *= iResolution.y/iResolution.x;
    
    float gsize = 2.5+ cos(iTime*0.1)*1.5;
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
    float mpc = smoothstep(0., 0.9, 0.02/d);
    vec3 c = palette(mp*ang1-iTime*1.20 , vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );
	c+= vec3(0.2);
	c*=mpc*(0.75+0.0*off);
    
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
		
		if(ok)
		{
			var raf=function(c) {
			  //Update uniforms, do logic etc. Default just updates r (time) in shader.
			  gl.uniform1f(gl.getUniformLocation(program, "iTime"), c*.00015);
			  gl.uniform2f(gl.getUniformLocation(program, "iResolution"), canvas.width, canvas.height);
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