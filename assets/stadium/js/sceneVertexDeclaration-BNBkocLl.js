import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/sceneVertexDeclaration.js
var t = "sceneVertexDeclaration", n = "uniform mat4 viewProjection;\n#ifdef MULTIVIEW\nuniform mat4 viewProjectionR;\n#endif\nuniform mat4 view;uniform mat4 projection;uniform vec4 vEyePosition;\n";
e.IncludesShadersStore[t] || (e.IncludesShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
