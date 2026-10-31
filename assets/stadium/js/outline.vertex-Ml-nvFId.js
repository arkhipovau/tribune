import { t as e } from "./shaderStore-CXjvw9c2.js";
import { t } from "./logDepthDeclaration-pFd8QGRi.js";
import { a as n, i as r, n as i, r as a, t as o } from "./bakedVertexAnimation-BXhMDN_6.js";
import { t as s } from "./instancesDeclaration-epO_glY9.js";
import { n as c, t as l } from "./clipPlaneVertex-CAu7ufCg.js";
import { t as u } from "./logDepthVertex-CtaqHGmJ.js";
import { i as d, n as f, r as p, t as m } from "./morphTargetsVertex-B7hQjaB6.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/outline.vertex.js
var h = "outlineVertexShader", g = "attribute position: vec3f;attribute normal: vec3f;\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#include<clipPlaneVertexDeclaration>\nuniform offset: f32;\n#include<instancesDeclaration>\nuniform viewProjection: mat4x4f;\n#ifdef ALPHATEST\nvarying vUV: vec2f;uniform diffuseMatrix: mat4x4f; \n#ifdef UV1\nattribute uv: vec2f;\n#endif\n#ifdef UV2\nattribute uv2: vec2f;\n#endif\n#endif\n#include<logDepthDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\n@vertex\nfn main(input: VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;var normalUpdated: vec3f=vertexInputs.normal;\n#ifdef UV1\nvar uvUpdated: vec2f=vertexInputs.uv;\n#endif\n#ifdef UV2\nvar uv2Updated: vec2f=vertexInputs.uv2;\n#endif\n#include<morphTargetsVertexGlobal>\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\nvar offsetPosition: vec3f=positionUpdated+(normalUpdated*uniforms.offset);\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvar worldPos: vec4f=finalWorld*vec4f(offsetPosition,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;\n#ifdef ALPHATEST\n#ifdef UV1\nvertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;\n#endif\n#ifdef UV2\nvertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;\n#endif\n#endif\n#include<clipPlaneVertex>\n#include<logDepthVertex>\n}\n";
e.ShadersStoreWGSL[h] || (e.ShadersStoreWGSL[h] = g);
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
for (let t of _) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var v = {
	name: h,
	shader: g
};
//#endregion
export { v as outlineVertexShaderWGSL };
