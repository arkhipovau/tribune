import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/samplerFragmentDeclaration.js
var t = "samplerFragmentDeclaration", n = "#ifdef _DEFINENAME_\n#if _DEFINENAME_DIRECTUV==1\n#define v_VARYINGNAME_UV vMainUV1\n#elif _DEFINENAME_DIRECTUV==2\n#define v_VARYINGNAME_UV vMainUV2\n#elif _DEFINENAME_DIRECTUV==3\n#define v_VARYINGNAME_UV vMainUV3\n#elif _DEFINENAME_DIRECTUV==4\n#define v_VARYINGNAME_UV vMainUV4\n#elif _DEFINENAME_DIRECTUV==5\n#define v_VARYINGNAME_UV vMainUV5\n#elif _DEFINENAME_DIRECTUV==6\n#define v_VARYINGNAME_UV vMainUV6\n#else\nvarying v_VARYINGNAME_UV: vec2f;\n#endif\nvar _SAMPLERNAME_SamplerSampler: sampler;var _SAMPLERNAME_Sampler: texture_2d<f32>;\n#endif\n";
e.IncludesShadersStoreWGSL[t] || (e.IncludesShadersStoreWGSL[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
