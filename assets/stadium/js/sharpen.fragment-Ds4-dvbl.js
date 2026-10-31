import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/sharpen.fragment.js
var t = "sharpenPixelShader", n = "varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;uniform sharpnessAmounts: vec2f;\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {var onePixel: vec2f= vec2f(1.0,1.0)/uniforms.screenSize;var color: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);var edgeDetection: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(0,-1)) +\ntextureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(-1,0)) +\ntextureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(1,0)) +\ntextureSample(textureSampler,textureSamplerSampler,input.vUV+onePixel*vec2f(0,1)) -\ncolor*4.0;fragmentOutputs.color=max(vec4f(color.rgb*uniforms.sharpnessAmounts.y,color.a)-(uniforms.sharpnessAmounts.x* vec4f(edgeDetection.rgb,0)),vec4f(0.));}";
e.ShadersStoreWGSL[t] || (e.ShadersStoreWGSL[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as sharpenPixelShaderWGSL };
