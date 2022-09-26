#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float d = length(u_resolution.x/u_resolution.y);
    vec3 color = vec3(d);

    gl_FragColor = vec4(color,1.0);
}