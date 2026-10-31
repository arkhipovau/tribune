import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctionsWGSL as t } from "./helperFunctions-YVxfMgkt.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/grain.fragment.js
var n = "grainPixelShader", r = "#include<helperFunctions>\nvarying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform intensity: f32;uniform animatedSeed: f32;\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);var seed: vec2f=input.vUV*uniforms.animatedSeed;var grain: f32=dither(seed,uniforms.intensity);var lum: f32=getLuminance(fragmentOutputs.color.rgb);var grainAmount: f32=(cos(-PI+(lum*PI*2.))+1.)/2.;fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb+grain*grainAmount,fragmentOutputs.color.a);fragmentOutputs.color=vec4f(max(fragmentOutputs.color.rgb,vec3f(0.0)),fragmentOutputs.color.a);}";
e.ShadersStoreWGSL[n] || (e.ShadersStoreWGSL[n] = r);
var i = [t];
for (let t of i) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var a = {
	name: n,
	shader: r
};
//#endregion
export { a as grainPixelShaderWGSL };
