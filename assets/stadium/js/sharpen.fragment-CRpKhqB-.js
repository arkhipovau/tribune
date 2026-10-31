import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/sharpen.fragment.js
var t = "sharpenPixelShader", n = "varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;uniform vec2 sharpnessAmounts;\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void)\n{vec2 onePixel=vec2(1.0,1.0)/screenSize;vec4 color=texture2D(textureSampler,vUV);vec4 edgeDetection=texture2D(textureSampler,vUV+onePixel*vec2(0,-1)) +\ntexture2D(textureSampler,vUV+onePixel*vec2(-1,0)) +\ntexture2D(textureSampler,vUV+onePixel*vec2(1,0)) +\ntexture2D(textureSampler,vUV+onePixel*vec2(0,1)) -\ncolor*4.0;gl_FragColor=max(vec4(color.rgb*sharpnessAmounts.y,color.a)-(sharpnessAmounts.x*vec4(edgeDetection.rgb,0)),0.);}";
e.ShadersStore[t] || (e.ShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as sharpenPixelShader };
