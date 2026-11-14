import { t as e } from "./shaderStore-BwDsKZsu.js";
import { a as t, i as n, n as r, r as i, t as a } from "./bakedVertexAnimation-BNynRORa.js";
import { t as o } from "./instancesDeclaration-Bo3SvYDK.js";
import { n as s, t as c } from "./clipPlaneVertex-Dkg-dqO3.js";
import { n as l, t as u } from "./fogVertex-m86ESF_E.js";
import { t as d } from "./vertexColorMixing-B1MvS2pl.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/ShadersWGSL/color.vertex.js
var f = "colorVertexShader", p = "attribute position: vec3f;\n#ifdef VERTEXCOLOR\nattribute color: vec4f;\n#endif\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#ifdef FOG\nuniform view: mat4x4f;\n#endif\n#include<instancesDeclaration>\nuniform viewProjection: mat4x4f;\n#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)\nvarying vColor: vec4f;\n#endif\n#define CUSTOM_VERTEX_DEFINITIONS\n@vertex\nfn main(input : VertexInputs)->FragmentInputs {\n#define CUSTOM_VERTEX_MAIN_BEGIN\n#ifdef VERTEXCOLOR\nvar colorUpdated: vec4f=vertexInputs.color;\n#endif\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvar worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;\n#include<clipPlaneVertex>\n#include<fogVertex>\n#include<vertexColorMixing>\n#define CUSTOM_VERTEX_MAIN_END\n}";
e.ShadersStoreWGSL[f] || (e.ShadersStoreWGSL[f] = p);
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
for (let t of m) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var h = {
	name: f,
	shader: p
};
//#endregion
export { h as colorVertexShaderWGSL };
