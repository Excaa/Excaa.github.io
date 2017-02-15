#version 300 es

precision lowp float;
out vec4 color;

in float vSpeed;

void main() 
{	
	color = vec4(vSpeed*3., 0.1, 0.1, vSpeed);
}