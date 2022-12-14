>雷达扫描

```glsl
// #ifdef GL_ES
// precision mediump float;
// #endif
// uniform vec2 u_resolution;

// void main(){
//     vec2 uv = gl_FragCoord .xy/u_resolution.xy;
//     vec3 color = vec3(0.);
//     vec2 st1 = step(vec2(0.1), 1.-uv);
//     vec2 st2 = step(vec2(0.1), uv);
//     color = vec3(st1.x * st1.y * st2.x * st2.y);

//     gl_FragColor = vec4(color,1.);

// }

// #ifdef GL_ES

// precision mediump float;

// #endif




#ifdef GL_ES

precision mediump float;

#endif

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))

#define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )

#define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )

#define M_PI 3.1415926535897932384626433832795



#define blue1 vec3(0.74,0.95,1.00)

#define blue2 vec3(0.87,0.98,1.00)

#define blue3 vec3(0.35,0.76,0.83)

#define blue4 vec3(0.953,0.969,0.89)

#define red   vec3(1.00,0.38,0.227)



#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))



uniform vec2 u_resolution;

uniform float u_time;

uniform vec2 u_mouse;



float _cross(vec2 uv, vec2 center, float radius)

{

    vec2 d = uv - center;

    int x = int(d.x);

    int y = int(d.y);

    float r = sqrt( dot( d, d ) );

    if( (r<radius) && ( (x==y) || (x==-y) ) )

        return 1.0;

    else return 0.0;

}

float circle(vec2 uv, vec2 center, float radius, float width)

{

    float r = length(uv - center);

    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);

}

float circle3(vec2 uv, vec2 center, float radius, float width)

{

    vec2 d = uv - center;

    float r = sqrt( dot( d, d ) );

    d = normalize(d);

    float theta = 180.0*(atan(d.y,d.x)/M_PI);

    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *

        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *

        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));

}

float triangles(vec2 uv, vec2 center, float radius)

{

    vec2 d = uv - center;

    return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))

         + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))

         + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))

         + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));

}

float movingLine(vec2 uv, vec2 center, float radius)

{

    //angle of the line

    float theta0 = 90.0 * u_time;

    vec2 d = uv - center;

    float r = sqrt( dot( d, d ) );

    if(r<radius)

    {

        //compute the distance to the line theta=theta0

        vec2 p = radius*vec2(cos(theta0*M_PI/180.0),

                            -sin(theta0*M_PI/180.0));

        float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );

    	d = normalize(d);

        //compute gradient based on angle difference to theta0

   	 	float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);

        float gradient = clamp(1.0-theta/90.0,0.0,1.0);

        return SMOOTH(l,1.0)+0.5*gradient;

    }

    else return 0.0;

}

float circle2(vec2 uv, vec2 center, float radius, float width, float opening)

{

    vec2 d = uv - center;

    float r = sqrt( dot( d, d ) );

    d = normalize(d);

    if( abs(d.y) > opening )

	    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);

    else

        return 0.0;

}

float bip1(vec2 uv, vec2 center)

{

    return SMOOTH(length(uv - center),3.0);

}

float bip2(vec2 uv, vec2 center)

{

    float r = length(uv - center);

    float R = 8.0+mod(87.0*u_time, 80.0);

    return (0.5-0.5*cos(30.0*u_time)) * SMOOTH(r,5.0)

        + SMOOTH(6.0,r)-SMOOTH(8.0,r)

        + smoothstep(max(8.0,R-20.0),R,r)-SMOOTH(R,r);

}

void main(){

    vec3 finalColor;

    // 将画布归一化

    vec2 st = gl_FragCoord.xy;

    // vec2 st = gl_FragCoord.xy / u_resolution;

    // 画布中心

    // vec2 toCenter = st-vec2(0.5);

    vec2 toCenter = u_resolution / 2.0;

    finalColor = vec3(0.3*_cross(st, toCenter, 240.0));

    finalColor += ( circle(st, toCenter, 100.0, 1.0)

                  + circle(st, toCenter, 165.0, 1.0) ) * blue1;

                  finalColor += (circle(st, toCenter, 240.0, 2.0) );// + dots(st, toCenter,240.0)) * blue4;

    finalColor += circle3(st, toCenter, 313.0, 4.0) * blue1;

    finalColor += triangles(st, toCenter, 315.0 + 30.0*sin(u_time)) * blue2;

    finalColor += movingLine(st, toCenter, 240.0) * blue3;

    finalColor += circle(st, toCenter, 10.0, 1.0) * blue3;

    finalColor += 0.7 * circle2(st, toCenter, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;

     if( length(st-toCenter) < 240.0 )

    {

        //animate some bips with random movements

    	vec2 p = 130.0*MOV(1.3,1.0,1.0,1.4,3.0+0.1*u_time);

   		finalColor += bip1(st, toCenter+p) * vec3(1,1,1);

        p = 130.0*MOV(0.9,-1.1,1.7,0.8,-2.0+sin(0.1*u_time)+0.15*u_time);

        finalColor += bip1(st, toCenter+p) * vec3(1,1,1);

        p = 50.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*u_time+7.0)+0.2*u_time);

        finalColor += bip2(st,toCenter+p) * red; //红色

    }

   gl_FragColor = vec4(finalColor,1.0);

}
```

![image-20220709105515545](C:\Users\12115\AppData\Roaming\Typora\typora-user-images\image-20220709105515545.png)



> 环形圆

```glsl
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
float plot(float c){
    return smoothstep(0.2,0.3,c )-smoothstep(0.3,0.4 ,c );//
    // return ;
}
void main(){
    vec2 uv = gl_FragCoord.xy/u_resolution;
    float c = length(uv - vec2(0.5));

    vec3 color =vec3(1.) ;
    color = color*plot(c);
    gl_FragColor = vec4(color,1.);
    
}
```



```glsl
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
// float plot(float c){
//     return smoothstep(0.2,0.3,c )-smoothstep(0.3,0.4 ,c );//
//     // return ;
// }
float plot(float c){
    return smoothstep(0.,0.1 , c) - smoothstep(0.4,0.5,c );
}
void main(){
    vec2 uv = gl_FragCoord.xy/u_resolution;
    vec2 c = uv - vec2(0.5);
    c*=5.0;
    c = fract(c);
    vec3 color = vec3(c,0.);
    gl_FragColor = vec4(color,1.);
    
}
```

![image-20220709143628701](C:\Users\12115\AppData\Roaming\Typora\typora-user-images\image-20220709143628701.png)

```glsl
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    float c = length(st-vec2(0.5)); 
    vec3 color = vec3(fract(c*10.));
    gl_FragColor = vec4(color,1.);
    //      st*= u_resolution.x / u_resolution.y;
    // // 映射空间-1到1之间
    // st = st * 2.-1.;
    // // 圆心位置 距离场
    // float d=length(abs(st)- .5);
    // gl_FragColor = vec4(vec3(fract(d*10.)),1.);
    
}
```

![image-20220709151653088](C:\Users\12115\AppData\Roaming\Typora\typora-user-images\image-20220709151653088.png)

```glsl
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
        st*= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    float d= 0.;
    st = st * 2.-1.;
    d=length(abs(st)- .3);
    gl_FragColor = vec4(vec3(fract(d*10.)),1.);
    
}
```

![image-20220709145159363](C:\Users\12115\AppData\Roaming\Typora\typora-user-images\image-20220709145159363.png)

```glsl
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);
    vec2 pos = st - vec2(0.5);
    float r = length(pos)*2.;
    float a = atan(pos.y,pos.x );
    // 三叶草
    float f = cos(a* 3.);
    // 六叶草
    f = abs(cos(a*3.));
    // 五个花瓣
    f = abs(cos(a*2.5))*.5+.3;
    // 火花
    f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // 齿轮
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    color = vec3(1.-smoothstep(f,f+0.02 ,r ));
    gl_FragColor = vec4(color,1.);
    
}
```

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
void main(){
    //取一个最大边去算
    vec2 uv = (2.*gl_FragCoord.xy-u_resolution)/min(u_resolution.x,u_resolution.y);
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 uv= st*2. - vec2(1.);
    vec3 color = vec3(0.);
    if(abs(uv.y)<0.001){
        color.r = 1.0;
    }
    if(abs(uv.x)< 0.001){
        color.g = 1.0;
    }
    gl_FragColor = vec4(color,1.0);
}
```

![image-20220712230732228](C:\Users\12115\AppData\Roaming\Typora\typora-user-images\image-20220712230732228.png)