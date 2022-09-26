// 颜色随时间的变化
// #ifdef GL_ES
// precision mediump float;
// #endif
// uniform float u_time;

// void main(){

//     gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
// }

// // 创建一个圆
// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform float u_time;
// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
 

// void main(){
//     //varying vec4 gl_FragCoord
//     vec2 uv = (2. * gl_FragCoord.xy -u_resolution) / min(u_resolution.x,u_resolution.y);
//     float u_abc;
//     if(length(uv) < 0.3){
//         u_abc = 1.;
//     }
    
//     gl_FragColor = vec4(vec3(u_abc), 1.0);
// }

// 线性回归函数
// #ifdef GL_ES
// precision mediump float;
// #endif


// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;

// float plot(vec2 st){
//     // 平滑过渡的阈值函数 两个值的样条插值
//     // 小于0.01==1，大于0则==0；
//     return smoothstep(0.01, 0. ,abs(st.x-st.y));
// }

// void main(){
//     vec2 uv = gl_FragCoord.xy / u_resolution;
//     // 
//     float y = uv.x;
//     // 绘制绿色的线
//     vec3 color = vec3(y);

//     float pct = plot(uv);

//     color =(1.0-pct)*color + pct*vec3(0.0,1.0,0.0);  
//     gl_FragColor = vec4(color, 1.0);
// }

// // 二次方程
// #ifdef GL_ES
// precision mediump float;
// #endif
// #define PI 3.14159265359;

// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;

// float plot(vec2 st,float y){
//     // 平滑过渡的阈值函数 两个值的样条插值
//     // 小于0.01==0，大于0则==1；
//     return smoothstep(y-0.02, y, st.y)-smoothstep(y, y+0.02, st.y);
// }
// void main(){
//     vec2 uv = gl_FragCoord.xy / u_resolution;
//     float y = pow(uv.x,2.);
//     // 绘制绿色的线
//     vec3 color = vec3(y);

//     float pct = plot(uv,y);

//     color =(1.0-pct)*color + pct*vec3(0.0,1.0,0.0);  
//     gl_FragColor = vec4(color, 1.0);

// }
// // 根据中心距离生成的
// #ifdef GL_ES
// precision mediump float;
// #endif
// uniform vec2 u_resolution;

// void main(){
//     vec2 uv = gl_FragCoord.xy/u_resolution;
//     // 第一种方式
//     // 求距离
//     // float color= distance(uv,vec2(0.5) );
//     //  gl_FragColor = vec4(vec3(color), 1.0);
//     // 第二种方式
//     // 取向量长度
//     // vec2 toCenter = uv -vec2(0.5) ;
//     // float pct = length(toCenter);
//     // vec3 color = vec3(pct);
//     // gl_FragColor = vec4(color, 1.0);
//     // 第三种方式
//     // 求平方根
//     vec2 tC = vec2(0.5)-uv;
//     float pct = sqrt(tC.x*tC.x + tC.y*tC.y); //
//     vec3 color = vec3(pct);
//     gl_FragColor = vec4(color, 1.0);
// }

// 二次方程
#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 这个函数到底是干啥的
float plot(vec2 st,float y){
    // 平滑过渡的阈值函数 两个值的样条插值
    // 小于0.01==0，大于0则==1；
    return smoothstep(y-0.02, y, st.x) - smoothstep(y, y+0.02, st.x);
}
void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // 背景 大于第一个参数=1.0，小于第一个参数=0.0
    float y=pow(uv.y,2.0);
    // float y = step(0.3, uv.y);
    // float y = sqrt(uv.y);
    // float y = exp(uv.x);
    // float y = log(uv.y);
    vec3 color = vec3(y);

    float pct = plot(uv,y);

    color =(1.0-pct)*color + pct*vec3(0.0,1.0,0.0);  
    gl_FragColor = vec4(vec3(color), 1.0);

}
