import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctions as t } from "./helperFunctions-C_ZzvIUZ.js";
import { n, t as r } from "./clipPlaneFragment-CttnRwsP.js";
//#region node_modules/@babylonjs/core/Shaders/glowMapGeneration.fragment.js
var i = "glowMapGenerationPixelShader", a = "#if defined(DIFFUSE_ISLINEAR) || defined(EMISSIVE_ISLINEAR)\n#include<helperFunctions>\n#endif\n#ifdef DIFFUSE\nvarying vec2 vUVDiffuse;uniform sampler2D diffuseSampler;\n#endif\n#ifdef OPACITY\nvarying vec2 vUVOpacity;uniform sampler2D opacitySampler;uniform float opacityIntensity;\n#endif\n#ifdef EMISSIVE\nvarying vec2 vUVEmissive;uniform sampler2D emissiveSampler;\n#endif\n#ifdef VERTEXALPHA\nvarying vec4 vColor;\n#endif\nuniform vec4 glowColor;uniform float glowIntensity;\n#include<clipPlaneFragmentDeclaration>\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void)\n{\n#include<clipPlaneFragment>\nvec4 finalColor=glowColor;\n#ifdef DIFFUSE\nvec4 albedoTexture=texture2D(diffuseSampler,vUVDiffuse);\n#ifdef DIFFUSE_ISLINEAR\nalbedoTexture=toGammaSpace(albedoTexture);\n#endif\n#ifdef GLOW\nfinalColor.a*=albedoTexture.a;\n#endif\n#ifdef HIGHLIGHT\nfinalColor.a=albedoTexture.a;\n#endif\n#endif\n#ifdef OPACITY\nvec4 opacityMap=texture2D(opacitySampler,vUVOpacity);\n#ifdef OPACITYRGB\nfinalColor.a*=getLuminance(opacityMap.rgb);\n#else\nfinalColor.a*=opacityMap.a;\n#endif\nfinalColor.a*=opacityIntensity;\n#endif\n#ifdef VERTEXALPHA\nfinalColor.a*=vColor.a;\n#endif\n#ifdef ALPHATEST\nif (finalColor.a<ALPHATESTVALUE)\ndiscard;\n#endif\n#ifdef EMISSIVE\nvec4 emissive=texture2D(emissiveSampler,vUVEmissive);\n#ifdef EMISSIVE_ISLINEAR\nemissive=toGammaSpace(emissive);\n#endif\ngl_FragColor=emissive*finalColor*glowIntensity;\n#else\ngl_FragColor=finalColor*glowIntensity;\n#endif\n#ifdef HIGHLIGHT\ngl_FragColor.a=glowColor.a;\n#endif\n}";
e.ShadersStore[i] || (e.ShadersStore[i] = a);
var o = [
	t,
	n,
	r
];
for (let t of o) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var s = {
	name: i,
	shader: a
};
//#endregion
export { s as glowMapGenerationPixelShader };
