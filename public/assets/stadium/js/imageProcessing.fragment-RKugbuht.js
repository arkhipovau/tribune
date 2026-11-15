import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctionsWGSL as t } from "./helperFunctions-YVxfMgkt.js";
import { n, t as r } from "./imageProcessingFunctions-DrKPSCw8.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/imageProcessing.fragment.js
var i = "imageProcessingPixelShader", a = "varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;\n#include<imageProcessingDeclaration>\n#include<helperFunctions>\n#include<imageProcessingFunctions>\n#define CUSTOM_FRAGMENT_DEFINITIONS\n@fragment\nfn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);\n#ifdef IMAGEPROCESSING\n#ifndef FROMLINEARSPACE\nresult=vec4f(toLinearSpaceVec3(result.rgb),result.a);\n#endif\nresult=applyImageProcessing(result);\n#else\n#ifdef FROMLINEARSPACE\nresult=applyImageProcessing(result);\n#endif\n#endif\nfragmentOutputs.color=result;}";
e.ShadersStoreWGSL[i] || (e.ShadersStoreWGSL[i] = a);
var o = [
	n,
	t,
	r
];
for (let t of o) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var s = {
	name: i,
	shader: a
};
//#endregion
export { s as imageProcessingPixelShaderWGSL };
