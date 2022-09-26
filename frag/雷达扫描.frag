#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define SMOOTH(r,R) (1.0-smoothstep(R-0.01,R+0.01, r))
#define blue1 vec3(0.74,0.95,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define red   vec3(1.00,0.38,0.227)
uniform vec2 u_resolution;
uniform float u_time;
#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))
float circle(vec2 uv, vec2 center, float radius, float width)

{
    float r = length(uv - center);
    return SMOOTH(r-width/2.,radius)-SMOOTH(r+width/2.,radius);
}
float movingLine(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 90.0 * u_time;
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) ); // 0-1之间
    if(r<radius)
    {
        //compute the distance to the line theta=theta0
        vec2 p = radius*vec2(cos(theta0*PI/180.0),-sin(theta0*PI/180.0));// 角度换算成弧度
        float l = length(d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
    	d = normalize(d);
        //compute gradient based on angle difference to theta0
   	 	float theta = mod(180.0*atan(d.y,d.x)/PI+theta0,360.0);
        float gradient = clamp(1.0-theta/90.0,0.0,1.0);
        return 0.5*gradient;
    }
    else return 0.0;

}

float bip2(vec2 uv, vec2 center)

{
    float r = length(uv - center);
    float R = 0.08+mod(87.0*u_time, 0.08);
    return (0.005-0.005*cos(30.0*u_time)) * SMOOTH(r,0.5)
        + SMOOTH(0.06,r)-SMOOTH(0.08,r)
        + smoothstep(max(0.08,R-.2),R,r)-SMOOTH(R,r);
}
void main(){
    vec3 finalColor;
    vec3 white = vec3(1.);
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 toCenter = vec2(0.5);
    finalColor += ( circle(st, toCenter, 0.1, 0.005)
                  + circle(st, toCenter, 0.165, 0.005) ) * white;
    finalColor += (circle(st, toCenter, 0.28, 0.01) );//+ dots(uv,c,240.0)) * blue4;
   finalColor += movingLine(st, toCenter, 0.28) * blue3;
   if( length(st-toCenter) < 0.24 ){
    vec2 p = MOV(1.3,1.0,1.0,1.4,.003+0.1*u_time);
    finalColor += bip2(st,toCenter+p) * red;

   }
    gl_FragColor = vec4(finalColor,1.);
    
    
}