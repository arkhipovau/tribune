import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/bloomMerge.fragment.js
var t = "bloomMergePixelShader", n = "uniform sampler2D textureSampler;uniform sampler2D bloomBlur;varying vec2 vUV;uniform float bloomWeight;\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void)\n{gl_FragColor=texture2D(textureSampler,vUV);vec3 blurred=texture2D(bloomBlur,vUV).rgb;gl_FragColor.rgb=gl_FragColor.rgb+(blurred.rgb*bloomWeight); }\n";
e.ShadersStore[t] || (e.ShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as bloomMergePixelShader };
