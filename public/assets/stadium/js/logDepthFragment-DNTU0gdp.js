import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthFragment.js
var t = "logDepthFragment", n = "#ifdef LOGARITHMICDEPTH\ngl_FragDepthEXT=log2(vFragmentDepth)*logarithmicDepthConstant*0.5;\n#endif\n";
e.IncludesShadersStore[t] || (e.IncludesShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
