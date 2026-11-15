import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctions as t } from "./helperFunctions-C_ZzvIUZ.js";
import { t as n } from "./sceneUboDeclaration-B1dWgwNU.js";
import { t as r } from "./backgroundUboDeclaration-BFnj5rrH.js";
import { t as i } from "./logDepthDeclaration-BVRSbJkA.js";
import { a, i as o, n as s, r as c, t as l } from "./bakedVertexAnimation-C84_EEyr.js";
import { t as u } from "./instancesDeclaration-CspCqzBt.js";
import { n as d, t as f } from "./clipPlaneVertex-CoylEQdx.js";
import { n as p, t as m } from "./fogVertex-CBEX5HhZ.js";
import { n as h, r as g, t as _ } from "./shadowsVertex-x70sub1B.js";
import { t as v } from "./logDepthVertex-DJ3X_H9h.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/backgroundVertexDeclaration.js
var y = "backgroundVertexDeclaration", b = "uniform mat4 view;uniform mat4 viewProjection;\n#ifdef MULTIVIEW\nuniform mat4 viewProjectionR;\n#endif\nuniform float shadowLevel;\n#ifdef DIFFUSE\nuniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;\n#endif\n#ifdef REFLECTION\nuniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;uniform float fFovMultiplier;\n#endif\n#ifdef POINTSIZE\nuniform float pointSize;\n#endif\n";
e.IncludesShadersStore[y] || (e.IncludesShadersStore[y] = b);
var x = {
	name: y,
	shader: b
}, S = "backgroundVertexShader", C = "precision highp float;\n#include<__decl__backgroundVertex>\n#include<helperFunctions>\nattribute vec3 position;\n#ifdef NORMAL\nattribute vec3 normal;\n#endif\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<instancesDeclaration>\nvarying vec3 vPositionW;\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#endif\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef MAINUV1\nvarying vec2 vMainUV1;\n#endif\n#ifdef MAINUV2\nvarying vec2 vMainUV2;\n#endif\n#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0\nvarying vec2 vDiffuseUV;\n#endif\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#include<__decl__lightVxFragment>[0..maxSimultaneousLights]\n#ifdef REFLECTIONMAP_SKYBOX\nvarying vec3 vPositionUVW;\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvarying vec3 vDirectionW;\n#endif\n#include<logDepthDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_VERTEX_MAIN_BEGIN\n#ifdef REFLECTIONMAP_SKYBOX\nvPositionUVW=position;\n#endif\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\n#ifdef MULTIVIEW\nif (gl_ViewID_OVR==0u) {gl_Position=viewProjection*finalWorld*vec4(position,1.0);} else {gl_Position=viewProjectionR*finalWorld*vec4(position,1.0);}\n#else\ngl_Position=viewProjection*finalWorld*vec4(position,1.0);\n#endif\nvec4 worldPos=finalWorld*vec4(position,1.0);vPositionW=vec3(worldPos);\n#ifdef NORMAL\nmat3 normalWorld=mat3(finalWorld);\n#ifdef NONUNIFORMSCALING\nnormalWorld=transposeMat3(inverseMat3(normalWorld));\n#endif\nvNormalW=normalize(normalWorld*normal);\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvDirectionW=normalize(vec3(finalWorld*vec4(position,0.0)));\n#ifdef EQUIRECTANGULAR_RELFECTION_FOV\nmat3 screenToWorld=inverseMat3(mat3(finalWorld*viewProjection));vec3 segment=mix(vDirectionW,screenToWorld*vec3(0.0,0.0,1.0),abs(fFovMultiplier-1.0));if (fFovMultiplier<=1.0) {vDirectionW=normalize(segment);} else {vDirectionW=normalize(vDirectionW+(vDirectionW-segment));}\n#endif\n#endif\n#ifndef UV1\nvec2 uv=vec2(0.,0.);\n#endif\n#ifndef UV2\nvec2 uv2=vec2(0.,0.);\n#endif\n#ifdef MAINUV1\nvMainUV1=uv;\n#endif\n#ifdef MAINUV2\nvMainUV2=uv2;\n#endif\n#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0\nif (vDiffuseInfos.x==0.)\n{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}\nelse\n{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}\n#endif\n#include<clipPlaneVertex>\n#include<fogVertex>\n#include<shadowsVertex>[0..maxSimultaneousLights]\n#ifdef VERTEXCOLOR\nvColor=colorUpdated;\n#endif\n#if defined(POINTSIZE) && !defined(WEBGPU)\ngl_PointSize=pointSize;\n#endif\n#include<logDepthVertex>\n#define CUSTOM_VERTEX_MAIN_END\n}\n";
e.ShadersStore[S] || (e.ShadersStore[S] = C);
var w = [
	x,
	n,
	r,
	t,
	a,
	o,
	u,
	d,
	p,
	g,
	h,
	i,
	c,
	s,
	l,
	f,
	m,
	_,
	v
];
for (let t of w) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var T = {
	name: S,
	shader: C
};
//#endregion
export { T as backgroundVertexShader };
