##### 如何运行frag的代码？

> 第一种方式  VS_Code中

- 安装环境， 扩展中搜索

1. Shader languages support for VS Code -->安装；
2. glsl-canvas  -->安装；

安装成功后，用以下代码测试一下(ctrl+shift+p-->show glslCanvas)：

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float d = length(u_resolution.x/u_resolution.y);
    //vec3 color = vec3(d);
	vec3 color = vec3(1.0);
    gl_FragColor = vec4(color,1.0);
}
```

- 安装判断语法是否错误的扩展插件：

  GLSL-Linter--> 安装；

  到 

  [这里]: https://github.com/KhronosGroup/glslang/releases	"glsllang"

  

  

  