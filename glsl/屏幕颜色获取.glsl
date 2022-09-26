#iChannel0 "file://apic16010.jpg" //引用本地资源的图片
#iChannel1 "https://www.haoy99.com/FileUpload/2019-02/Shui1Zhu11i1Pao1pptB-173234_109.jpg"

#iChannel3 "file://Journey.map3"

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution.xy;
    
    //fragColor = vec4(uv, 0.5 + 0.5 *sin(iTime) ,0.5 );
    // fragColor = texture(iChannel0, uv);
    fragColor = texture(iChannel1, uv);
    fragColor.r = abs(sin(iTime));
}
