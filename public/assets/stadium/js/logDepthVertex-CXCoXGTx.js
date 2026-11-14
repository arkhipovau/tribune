import { t as e } from "./shaderStore-BwDsKZsu.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthVertex.js
var t = "logDepthVertex", n = "#ifdef LOGARITHMICDEPTH\nvFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;\n#endif\n";
e.IncludesShadersStore[t] || (e.IncludesShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
