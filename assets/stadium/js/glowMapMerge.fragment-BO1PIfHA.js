import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/glowMapMerge.fragment.js
var t = "glowMapMergePixelShader", n = "varying vec2 vUV;uniform sampler2D textureSampler;\n#ifdef EMISSIVE\nuniform sampler2D textureSampler2;\n#endif\nuniform float offset;\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_FRAGMENT_MAIN_BEGIN\nvec4 baseColor=texture2D(textureSampler,vUV);\n#ifdef EMISSIVE\nbaseColor+=texture2D(textureSampler2,vUV);baseColor*=offset;\n#else\nbaseColor.a=abs(offset-baseColor.a);\n#ifdef STROKE\nfloat alpha=smoothstep(.0,.1,baseColor.a);baseColor.a=alpha;baseColor.rgb=baseColor.rgb*alpha;\n#endif\n#endif\n#if LDR\nbaseColor=clamp(baseColor,0.,1.0);\n#endif\ngl_FragColor=baseColor;\n#define CUSTOM_FRAGMENT_MAIN_END\n}";
e.ShadersStore[t] || (e.ShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as glowMapMergePixelShader };
