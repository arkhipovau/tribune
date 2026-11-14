import { t as e } from "./shaderStore-BwDsKZsu.js";
import { t } from "./logDepthDeclaration-BBTfb-Zy.js";
import { n, t as r } from "./clipPlaneFragment-D81B6YpU.js";
import { t as i } from "./logDepthFragment-CY0niHzw.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/Shaders/outline.fragment.js
var a = "outlinePixelShader", o = "#ifdef LOGARITHMICDEPTH\n#extension GL_EXT_frag_depth : enable\n#endif\nuniform vec4 color;\n#ifdef ALPHATEST\nvarying vec2 vUV;uniform sampler2D diffuseSampler;\n#endif\n#include<clipPlaneFragmentDeclaration>\n#include<logDepthDeclaration>\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_FRAGMENT_MAIN_BEGIN\n#include<clipPlaneFragment>\n#ifdef ALPHATEST\nif (texture2D(diffuseSampler,vUV).a<0.4)\ndiscard;\n#endif\n#include<logDepthFragment>\ngl_FragColor=color;\n#define CUSTOM_FRAGMENT_MAIN_END\n}";
e.ShadersStore[a] || (e.ShadersStore[a] = o);
var s = [
	n,
	t,
	r,
	i
];
for (let t of s) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var c = {
	name: a,
	shader: o
};
//#endregion
export { c as outlinePixelShader };
