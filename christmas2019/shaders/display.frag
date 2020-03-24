#version 300 es

precision lowp float;
out vec4 color;

in float vSpeed;
in float inplace;

uniform float msgamount;

void main() 
{
	color = vec4(0.2-vSpeed*0.5, 0.1-vSpeed*1.5, -0.0+vSpeed, 0.15);
	color = mix(vec4( 0.5, 0.05, 0.0, 0.15), mix(vec4(0.05, 0.25, 0.00, 0.15), vec4(0.15,0.15,0.05,0.15), msgamount), mix(vSpeed*1.5,inplace, msgamount)*10.);
	
	color *= (1.-msgamount + msgamount*inplace);
	
	//color = vec4(inplace);
}