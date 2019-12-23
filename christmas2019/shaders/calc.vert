#version 300 es

layout(location = 0) in vec4 a_position;
layout(location = 1) in vec2 a_velocity;
layout(location = 2) in float a_ind;
layout(location = 3) in vec2 a_position_msg1;
layout(location = 4) in vec2 a_position_msg2;

flat out vec2 v_position;
flat out vec2 v_velocity;

uniform vec2 u_mouse;
uniform float time;
float PARTICLE_MASS = 10.0;
float GRAVITY_CENTER_MASS = 100.0;
float DAMPING = 1e-5;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 gravityCenter = u_mouse;
	
	float r = distance(a_position.xy, gravityCenter);
	vec2 direction = gravityCenter - a_position.xy;
	float force =r*r*0.3;// PARTICLE_MASS * GRAVITY_CENTER_MASS / (r * r) * DAMPING;
//	float maxForce = min(force, DAMPING * 10.0);
	
	vec2 acceleration = force / PARTICLE_MASS * direction;
	//v_velocity =a_velocity*0.98 + acceleration+vec2(sin(a_ind*0.1+time*0.01+a_position.x*5.),cos(a_ind*0.05+time*0.07+a_position.y*3.))*(0.005 +0.001*sin(a_ind*0.2)) + rand(a_position.xy)*0.002*sin(time*0.2+a_ind*0.1);
	v_velocity = a_velocity*0.98 + vec2((sin(time*0.1 + a_ind)), (sin(time*0.156 + a_ind)))*max(0., 0.1-length( a_position.xy - a_position_msg1));
	
	//v_position = a_position.xy;
	//v_velocity=vec2(0.0);
	v_position = mix(a_position.xy, a_position_msg1, .1)+v_velocity*0.1;
}