import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/decalFragment.js
var t = "decalFragment", n = "#ifdef DECAL\nvar decalTempColor=decalColor.rgb;var decalTempAlpha=decalColor.a;\n#ifdef GAMMADECAL\ndecalTempColor=toLinearSpaceVec3(decalColor.rgb);\n#endif\n#ifdef DECAL_SMOOTHALPHA\ndecalTempAlpha=decalColor.a*decalColor.a;\n#endif\nsurfaceAlbedo=mix(surfaceAlbedo.rgb,decalTempColor,decalTempAlpha);\n#endif\n";
e.IncludesShadersStoreWGSL[t] || (e.IncludesShadersStoreWGSL[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
