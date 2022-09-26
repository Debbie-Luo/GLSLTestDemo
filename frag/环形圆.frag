#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform vec2 u_resolution;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    // st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    float d = 0.;
    st = st * 2.- 1.;
    int N= 3;
    float a = atan(st.x,st.y )+PI; // atan 已知xy坐标求角度
    float r = TWO_PI/float(N); //2Π/3
    d = cos(floor(0.5+a/r)*r-a)*length(st);
    color= vec3(d);
    color= vec3(1.0-smoothstep(.4,.5 ,d ));
    // color = vec3(d);
    gl_FragColor = vec4(color,1.);
    
    
}