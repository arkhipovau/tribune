import { t as e } from "./shaderStore-BwDsKZsu.js";
import { n as t, t as n } from "./clipPlaneFragment-D81B6YpU.js";
import { n as r, t as i } from "./fogFragment-C0R5MoXO.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/Shaders/color.fragment.js
var a = "colorPixelShader", o = "#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)\n#define VERTEXCOLOR\nvarying vec4 vColor;\n#else\nuniform vec4 color;\n#endif\n#include<clipPlaneFragmentDeclaration>\n#include<fogFragmentDeclaration>\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_FRAGMENT_MAIN_BEGIN\n#include<clipPlaneFragment>\n#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)\ngl_FragColor=vColor;\n#else\ngl_FragColor=color;\n#endif\n#include<fogFragment>(color,gl_FragColor)\n#define CUSTOM_FRAGMENT_MAIN_END\n}";
e.ShadersStore[a] || (e.ShadersStore[a] = o);
var s = [
	t,
	r,
	n,
	i
];
for (let t of s) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var c = {
	name: a,
	shader: o
};
//#endregion
export { c as colorPixelShader };
