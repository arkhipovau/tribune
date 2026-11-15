import { t as e } from "./shaderStore-CXjvw9c2.js";
import { n as t, t as n } from "./clipPlaneFragment-CA1pANeG.js";
import { t as r } from "./packingFunctions-CJVrf8Av.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/depth.fragment.js
var i = "depthPixelShader", a = "#ifdef ALPHATEST\nvarying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;\n#endif\n#include<clipPlaneFragmentDeclaration>\nvarying vDepthMetric: f32;\n#ifdef PACKED\n#include<packingFunctions>\n#endif\n#ifdef STORE_CAMERASPACE_Z\nvarying vViewPos: vec4f;\n#endif\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {\n#include<clipPlaneFragment>\n#ifdef ALPHATEST\nif (textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV).a<0.4) {discard;}\n#endif\n#ifdef STORE_CAMERASPACE_Z\n#ifdef PACKED\nfragmentOutputs.color=pack(input.vViewPos.z);\n#else\nfragmentOutputs.color= vec4f(input.vViewPos.z,0.0,0.0,1.0);\n#endif\n#else\n#ifdef NONLINEARDEPTH\n#ifdef PACKED\nfragmentOutputs.color=pack(input.position.z);\n#else\nfragmentOutputs.color= vec4f(input.position.z,0.0,0.0,0.0);\n#endif\n#else\n#ifdef PACKED\nfragmentOutputs.color=pack(input.vDepthMetric);\n#else\nfragmentOutputs.color= vec4f(input.vDepthMetric,0.0,0.0,1.0);\n#endif\n#endif\n#endif\n}";
e.ShadersStoreWGSL[i] || (e.ShadersStoreWGSL[i] = a);
var o = [
	t,
	r,
	n
];
for (let t of o) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var s = {
	name: i,
	shader: a
};
//#endregion
export { s as depthPixelShaderWGSL };
