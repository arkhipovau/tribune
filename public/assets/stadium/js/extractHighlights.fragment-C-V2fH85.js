import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctions as t } from "./helperFunctions-C_ZzvIUZ.js";
//#region node_modules/@babylonjs/core/Shaders/extractHighlights.fragment.js
var n = "extractHighlightsPixelShader", r = "#include<helperFunctions>\nvarying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void) \n{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}";
e.ShadersStore[n] || (e.ShadersStore[n] = r);
var i = [t];
for (let t of i) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var a = {
	name: n,
	shader: r
};
//#endregion
export { a as extractHighlightsPixelShader };
