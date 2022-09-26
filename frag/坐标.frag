#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
void main(){
    vec2 uv = (2.*gl_FragCoord.xy-u_resolution)/min(u_resolution.x,u_resolution.y);
    // vec2 st = gl_FragCoord.xy/u_resolution;
    // vec2 uv= st*2. - vec2(1.);
    
    vec3 color = vec3(0.);
    if(abs(uv.y)<0.001)
    {
        color.r = 1.0;
    }
    if(abs(uv.x)< 0.001)
    {
        color.g = 1.0;
    }
    vec2 cell = fract(uv);
    if(cell.x<0.01){
        color+=vec3(1.);
    }
    gl_FragColor = vec4(color,1.0);
}