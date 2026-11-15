import { t as e } from "./shaderStore-CXjvw9c2.js";
import { t } from "./logDepthDeclaration-pFd8QGRi.js";
import { n, t as r } from "./clipPlaneFragment-CA1pANeG.js";
import { t as i } from "./logDepthFragment-CJjgUKRG.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/outline.fragment.js
var a = "outlinePixelShader", o = "uniform color: vec4f;\n#ifdef ALPHATEST\nvarying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;\n#endif\n#include<clipPlaneFragmentDeclaration>\n#include<logDepthDeclaration>\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {\n#define CUSTOM_FRAGMENT_MAIN_BEGIN\n#include<clipPlaneFragment>\n#ifdef ALPHATEST\nif (textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV).a<0.4) {discard;}\n#endif\n#include<logDepthFragment>\nfragmentOutputs.color=uniforms.color;\n#define CUSTOM_FRAGMENT_MAIN_END\n}";
e.ShadersStoreWGSL[a] || (e.ShadersStoreWGSL[a] = o);
var s = [
	n,
	t,
	r,
	i
];
for (let t of s) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var c = {
	name: a,
	shader: o
};
//#endregion
export { c as outlinePixelShaderWGSL };
