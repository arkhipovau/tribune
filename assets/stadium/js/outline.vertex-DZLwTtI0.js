import { t as e } from "./shaderStore-CXjvw9c2.js";
import { t } from "./logDepthDeclaration-BVRSbJkA.js";
import { a as n, i as r, n as i, r as a, t as o } from "./bakedVertexAnimation-C84_EEyr.js";
import { t as s } from "./instancesDeclaration-CspCqzBt.js";
import { n as c, t as l } from "./clipPlaneVertex-CoylEQdx.js";
import { t as u } from "./logDepthVertex-DJ3X_H9h.js";
import { i as d, n as f, r as p, t as m } from "./morphTargetsVertex-BaK3QguC.js";
//#region node_modules/@babylonjs/core/Shaders/outline.vertex.js
var h = "outlineVertexShader", g = "attribute vec3 position;attribute vec3 normal;\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#include<clipPlaneVertexDeclaration>\nuniform float offset;\n#include<instancesDeclaration>\nuniform mat4 viewProjection;\n#ifdef ALPHATEST\nvarying vec2 vUV;uniform mat4 diffuseMatrix;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#endif\n#include<logDepthDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void)\n{vec3 positionUpdated=position;vec3 normalUpdated=normal;\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#ifdef UV2\nvec2 uv2Updated=uv2;\n#endif\n#include<morphTargetsVertexGlobal>\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\nvec3 offsetPosition=positionUpdated+(normalUpdated*offset);\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvec4 worldPos=finalWorld*vec4(offsetPosition,1.0);gl_Position=viewProjection*worldPos;\n#ifdef ALPHATEST\n#ifdef UV1\nvUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef UV2\nvUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));\n#endif\n#endif\n#include<clipPlaneVertex>\n#include<logDepthVertex>\n}\n";
e.ShadersStore[h] || (e.ShadersStore[h] = g);
var _ = [
	n,
	r,
	d,
	p,
	c,
	s,
	t,
	f,
	m,
	a,
	i,
	o,
	l,
	u
];
for (let t of _) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var v = {
	name: h,
	shader: g
};
//#endregion
export { v as outlineVertexShader };
