import { t as e } from "./shaderStore-BwDsKZsu.js";
import { a as t, i as n, n as r, r as i, t as a } from "./bakedVertexAnimation-W9kQV8Zq.js";
import { t as o } from "./instancesDeclaration-CoX7OvPn.js";
import { n as s, t as c } from "./clipPlaneVertex-Bj5zZ8Z_.js";
import { n as l, t as u } from "./fogVertex-C9yPq2it.js";
import { t as d } from "./vertexColorMixing-BubAno5N.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/Shaders/color.vertex.js
var f = "colorVertexShader", p = "attribute vec3 position;\n#ifdef VERTEXCOLOR\nattribute vec4 color;\n#endif\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#ifdef FOG\nuniform mat4 view;\n#endif\n#include<instancesDeclaration>\nuniform mat4 viewProjection;\n#ifdef MULTIVIEW\nuniform mat4 viewProjectionR;\n#endif\n#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)\nvarying vec4 vColor;\n#endif\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_VERTEX_MAIN_BEGIN\n#ifdef VERTEXCOLOR\nvec4 colorUpdated=color;\n#endif\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvec4 worldPos=finalWorld*vec4(position,1.0);\n#ifdef MULTIVIEW\nif (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}\n#else\ngl_Position=viewProjection*worldPos;\n#endif\n#include<clipPlaneVertex>\n#include<fogVertex>\n#include<vertexColorMixing>\n#define CUSTOM_VERTEX_MAIN_END\n}";
e.ShadersStore[f] || (e.ShadersStore[f] = p);
var m = [
	t,
	n,
	s,
	l,
	o,
	i,
	r,
	a,
	c,
	u,
	d
];
for (let t of m) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var h = {
	name: f,
	shader: p
};
//#endregion
export { h as colorVertexShader };
