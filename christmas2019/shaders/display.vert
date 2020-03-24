#version 300 es

layout(location = 0) in vec4 a_position;
layout(location = 1) in vec2 a_velocity;
layout(location = 2) in vec2 a_msg_pos1;
layout(location = 3) in vec2 a_msg_pos2;

out float vSpeed;
out float inplace;

uniform float msgpos;

void main() 
{
	gl_Position = a_position;
	gl_PointSize = 0.5;
	vSpeed = length(a_velocity);
	inplace = .2-length( a_position.xy - mix(a_msg_pos1, a_msg_pos2, msgpos));
}