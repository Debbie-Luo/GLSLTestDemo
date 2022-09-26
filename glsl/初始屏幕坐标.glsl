void mainImage(out vec4 fragColor, in vec2 fragCoord){

    vec2 uv = (2.*fragCoord-iResolution.xy)/min(iResolution.x,iResolution.y);
    float c = 0.;
    float r = 0.3;
    if(length(uv)< r){
        c = 1.;
    };

    fragColor = vec4(vec3(c),1.); 
}