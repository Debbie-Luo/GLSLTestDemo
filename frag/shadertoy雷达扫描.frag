// #ifdef GL_ES

// precision mediump float;

// #endif



// uniform vec2 u_resolution;

// uniform float u_time;

// void main(){

//     vec2 st= gl_FragCoord.xy/u_resolution;

//     // float pct = abs(sin(u_time));

//     vec3 color = vec3(0.);

//     vec2 toCenter = vec2(0.5) -st;  

//     float angle = atan(toCenter.y, toCenter.x);



//     gl_FragColor = vec4(toCenter.x,toCenter.y,0.0,1.0);

// }



// #ifdef GL_ES

// precision mediump float;

// #endif



// #define PI 3.14159265359



// uniform vec2 u_resolution;

// uniform vec2 u_mouse;

// uniform float u_time;



// vec3 colorA = vec3(0.149,0.141,0.912);

// vec3 colorB = vec3(1.000,0.833,0.224);



// // float plot (vec2 st, float pct){

// //   return  smoothstep( pct-0.01, pct, st.y) -

// //           smoothstep( pct, pct+0.01, st.y);

// // }



// void main() {

//     vec2 st = gl_FragCoord.xy/u_resolution.xy;

//     vec3 color = vec3(0.0);



//     vec3 pct = vec3(st.x);



//     pct.r = smoothstep(0.0,1.0, st.x);

//     pct.g = sin(st.x*PI);

//     pct.b = pow(st.x,0.5);



//     color = mix(colorA, colorB, pct);



//     // Plot transition lines for each channel

//     // color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));

//     // color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));

//     // color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));



//     gl_FragColor = vec4(color,1.0);

// }



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

    // ??????????????????

    vec2 st = gl_FragCoord.xy;

    // vec2 st = gl_FragCoord.xy / u_resolution;

    // ????????????

    // vec2 toCenter = st-vec2(0.5);

    vec2 toCenter = u_resolution / 2.0;

    finalColor = vec3(0.3*_cross(st, toCenter, 240.0));

    finalColor += ( circle(st, toCenter, 100.0, 1.0)

                  + circle(st, toCenter, 165.0, 1.0) ) * blue1;

                  finalColor += (circle(st, toCenter, 240.0, 2.0) );//+ dots(uv,c,240.0)) * blue4;

    // finalColor += circle3(st, toCenter, 313.0, 4.0) * blue1;

    // finalColor += triangles(st, toCenter, 315.0 + 30.0*sin(u_time)) * blue2;

    finalColor += movingLine(st, toCenter, 240.0) * blue3;

    // finalColor += circle(st, toCenter, 10.0, 1.0) * blue3;

    // finalColor += 0.7 * circle2(st, toCenter, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;

     if( length(st-toCenter) < 240.0 )

    {

    //     //animate some bips with random movements

    	vec2 p = 130.0*MOV(1.3,1.0,1.0,1.4,3.0+0.1*u_time);

   	// 	finalColor += bip1(st, toCenter+p) * vec3(1,1,1);

    //     p = 130.0*MOV(0.9,-1.1,1.7,0.8,-2.0+sin(0.1*u_time)+0.15*u_time);

    //     finalColor += bip1(st, toCenter+p) * vec3(1,1,1);

    //     p = 50.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*u_time+7.0)+0.2*u_time);

        finalColor += bip2(st,toCenter+p) * red;

    }

   gl_FragColor = vec4(finalColor,1.0);

}




