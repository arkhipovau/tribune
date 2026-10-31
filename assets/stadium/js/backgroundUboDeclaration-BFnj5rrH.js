import { t as e } from "./shaderStore-CXjvw9c2.js";
import "./sceneUboDeclaration-B1dWgwNU.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/backgroundUboDeclaration.js
var t = "backgroundUboDeclaration", n = "layout(std140,column_major) uniform;uniform Material\n{uniform vec4 vPrimaryColor;uniform vec4 vPrimaryColorShadow;uniform vec2 vDiffuseInfos;uniform mat4 diffuseMatrix;uniform float fFovMultiplier;uniform float pointSize;uniform float shadowLevel;uniform float alpha;uniform vec3 vBackgroundCenter;uniform vec4 vReflectionControl;uniform vec2 projectedGroundInfos;uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;};\n#include<sceneUboDeclaration>\n";
e.IncludesShadersStore[t] || (e.IncludesShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as t };
