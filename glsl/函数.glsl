void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (2.*fragCoord - iResolution.xy)/min(iResolution.x,iResolution.y);
    fragColor = vec4(uv,0.,1.);
}