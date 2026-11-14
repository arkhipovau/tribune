import { t as e } from "./shaderStore-BwDsKZsu.js";
import { helperFunctionsWGSL as t } from "./helperFunctions-BLgM1UTs.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/ShadersWGSL/extractHighlights.fragment.js
var n = "extractHighlightsPixelShader", r = "#include<helperFunctions>\nvarying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform threshold: f32;uniform exposure: f32;\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);var luma: f32=dot(LuminanceEncodeApprox,fragmentOutputs.color.rgb*uniforms.exposure);fragmentOutputs.color=vec4f(step(uniforms.threshold,luma)*fragmentOutputs.color.rgb,fragmentOutputs.color.a);}";
e.ShadersStoreWGSL[n] || (e.ShadersStoreWGSL[n] = r);
var i = [t];
for (let t of i) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var a = {
	name: n,
	shader: r
};
//#endregion
export { a as extractHighlightsPixelShaderWGSL };
