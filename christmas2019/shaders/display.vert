#version 300 es

layout(location = 0) in vec4 a_position;
layout(location = 1) in vec2 a_velocity;

out float vSpeed;

void main() 
{
	gl_Position = a_position;
	gl_PointSize = 0.05;
	vSpeed = length(a_velocity);
}