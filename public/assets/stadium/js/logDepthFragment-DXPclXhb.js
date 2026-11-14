import { t as e } from "./shaderStore-BwDsKZsu.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/logDepthFragment.js
var t = "logDepthFragment", n = "#ifdef LOGARITHMICDEPTH\nfragmentOutputs.fragDepth=log2(fragmentInputs.vFragmentDepth)*uniforms.logarithmicDepthConstant*0.5;\n#endif\n";
e.IncludesShadersStoreWGSL[t] || (e.IncludesShadersStoreWGSL[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
