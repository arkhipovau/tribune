import { t as e } from "./shaderStore-BwDsKZsu.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/Shaders/ShadersInclude/fogVertexDeclaration.js
var t = "fogVertexDeclaration", n = "#ifdef FOG\nvarying vec3 vFogDistance;\n#endif\n";
e.IncludesShadersStore[t] || (e.IncludesShadersStore[t] = n);
var r = {
	name: t,
	shader: n
}, i = "fogVertex", a = "#ifdef FOG\nvFogDistance=(view*worldPos).xyz;\n#endif\n";
e.IncludesShadersStore[i] || (e.IncludesShadersStore[i] = a);
var o = {
	name: i,
	shader: a
};
//#endregion
export { r as n, o as t };
