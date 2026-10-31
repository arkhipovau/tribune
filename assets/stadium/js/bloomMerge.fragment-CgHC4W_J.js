import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/bloomMerge.fragment.js
var t = "bloomMergePixelShader", n = "varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var bloomBlurSampler: sampler;var bloomBlur: texture_2d<f32>;uniform bloomWeight: f32;\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);var blurred: vec3f=textureSample(bloomBlur,bloomBlurSampler,input.vUV).rgb;fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb+(blurred.rgb*uniforms.bloomWeight),fragmentOutputs.color.a);}\n";
e.ShadersStoreWGSL[t] || (e.ShadersStoreWGSL[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as bloomMergePixelShaderWGSL };
