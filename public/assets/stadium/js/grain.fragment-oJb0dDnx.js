import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctions as t } from "./helperFunctions-C_ZzvIUZ.js";
//#region node_modules/@babylonjs/core/Shaders/grain.fragment.js
var n = "grainPixelShader", r = "#include<helperFunctions>\nuniform sampler2D textureSampler; \nuniform float intensity;uniform float animatedSeed;varying vec2 vUV;\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void)\n{gl_FragColor=texture2D(textureSampler,vUV);vec2 seed=vUV*(animatedSeed);float grain=dither(seed,intensity);float lum=getLuminance(gl_FragColor.rgb);float grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;gl_FragColor.rgb+=grain*grainAmount;gl_FragColor.rgb=max(gl_FragColor.rgb,0.0);}";
e.ShadersStore[n] || (e.ShadersStore[n] = r);
var i = [t];
for (let t of i) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var a = {
	name: n,
	shader: r
};
//#endregion
export { a as grainPixelShader };
