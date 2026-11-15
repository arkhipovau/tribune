import { t as e } from "./shaderStore-CXjvw9c2.js";
import "./sceneUboDeclaration-B3MfOmqR.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/backgroundUboDeclaration.js
var t = "backgroundUboDeclaration", n = "uniform vPrimaryColor: vec4f;uniform vPrimaryColorShadow: vec4f;uniform vDiffuseInfos : vec2f;uniform diffuseMatrix : mat4x4f;uniform fFovMultiplier: f32;uniform pointSize: f32;uniform shadowLevel: f32;uniform alpha: f32;uniform vBackgroundCenter: vec3f;uniform vReflectionControl: vec4f;uniform projectedGroundInfos: vec2f;uniform vReflectionInfos : vec2f;uniform reflectionMatrix : mat4x4f;uniform vReflectionMicrosurfaceInfos : vec3f;\n#include<sceneUboDeclaration>\n";
e.IncludesShadersStoreWGSL[t] || (e.IncludesShadersStoreWGSL[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
