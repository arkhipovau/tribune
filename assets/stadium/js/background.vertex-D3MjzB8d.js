import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctionsWGSL as t } from "./helperFunctions-YVxfMgkt.js";
import { t as n } from "./sceneUboDeclaration-B3MfOmqR.js";
import { t as r } from "./backgroundUboDeclaration-BHm92NTl.js";
import { t as i } from "./logDepthDeclaration-pFd8QGRi.js";
import { a, i as o, n as s, r as c, t as l } from "./bakedVertexAnimation-BXhMDN_6.js";
import { t as u } from "./instancesDeclaration-epO_glY9.js";
import { n as d, t as f } from "./clipPlaneVertex-CAu7ufCg.js";
import { n as p, t as m } from "./fogVertex-DOhtQxgb.js";
import { n as h, t as g } from "./shadowsVertex-DVHv7Yvl.js";
import { t as _ } from "./logDepthVertex-CtaqHGmJ.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/background.vertex.js
var v = "backgroundVertexShader", y = "#include<backgroundUboDeclaration>\n#include<helperFunctions>\nattribute position: vec3f;\n#ifdef NORMAL\nattribute normal: vec3f;\n#endif\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<instancesDeclaration>\nvarying vPositionW: vec3f;\n#ifdef NORMAL\nvarying vNormalW: vec3f;\n#endif\n#ifdef UV1\nattribute uv: vec2f;\n#endif\n#ifdef UV2\nattribute uv2: vec2f;\n#endif\n#ifdef MAINUV1\nvarying vMainUV1: vec2f;\n#endif\n#ifdef MAINUV2\nvarying vMainUV2: vec2f;\n#endif\n#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0\nvarying vDiffuseUV: vec2f;\n#endif\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#include<lightVxUboDeclaration>[0..maxSimultaneousLights]\n#ifdef REFLECTIONMAP_SKYBOX\nvarying vPositionUVW: vec3f;\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvarying vDirectionW: vec3f;\n#endif\n#include<logDepthDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\n@vertex\nfn main(input : VertexInputs)->FragmentInputs {\n#define CUSTOM_VERTEX_MAIN_BEGIN\n#ifdef REFLECTIONMAP_SKYBOX\nvertexOutputs.vPositionUVW=vertexInputs.position;\n#endif\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\n#ifdef MULTIVIEW\nif (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*finalWorld* vec4f(vertexInputs.position,1.0);} else {vertexOutputs.position=scene.viewProjectionR*finalWorld* vec4f(vertexInputs.position,1.0);}\n#else\nvertexOutputs.position=scene.viewProjection*finalWorld* vec4f(vertexInputs.position,1.0);\n#endif\nvar worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.vPositionW= worldPos.xyz;\n#ifdef NORMAL\nvar normalWorld: mat3x3f=mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);\n#ifdef NONUNIFORMSCALING\nnormalWorld=transposeMat3(inverseMat3(normalWorld));\n#endif\nvertexOutputs.vNormalW=normalize(normalWorld*vertexInputs.normal);\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvertexOutputs.vDirectionW=normalize((finalWorld*vec4f(vertexInputs.position,0.0)).xyz);\n#ifdef EQUIRECTANGULAR_RELFECTION_FOV\nvar screenToWorld: mat3x3f=inverseMat3( mat3x3f(finalWorld*scene.viewProjection));var segment: vec3f=mix(vertexOutputs.vDirectionW,screenToWorld* vec3f(0.0,0.0,1.0),abs(fFovMultiplier-1.0));if (fFovMultiplier<=1.0) {vertexOutputs.vDirectionW=normalize(segment);} else {vertexOutputs.vDirectionW=normalize(vertexOutputs.vDirectionW+(vertexOutputs.vDirectionW-segment));}\n#endif\n#endif\n#ifndef UV1\nvar uv: vec2f=vec2f(0.,0.);\n#else\nvar uv=vertexInputs.uv;\n#endif\n#ifndef UV2\nvar uv2: vec2f=vec2f(0.,0.);\n#else\nvar uv2=vertexInputs.uv2;\n#endif\n#ifdef MAINUV1\nvertexOutputs.vMainUV1=uv;\n#endif\n#ifdef MAINUV2\nvertexOutputs.vMainUV2=uv2;\n#endif\n#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0\nif (uniforms.vDiffuseInfos.x==0.)\n{vertexOutputs.vDiffuseUV= (uniforms.diffuseMatrix* vec4f(uv,1.0,0.0)).xy;}\nelse\n{vertexOutputs.vDiffuseUV= (uniforms.diffuseMatrix* vec4f(uv2,1.0,0.0)).xy;}\n#endif\n#include<clipPlaneVertex>\n#include<fogVertex>\n#include<shadowsVertex>[0..maxSimultaneousLights]\n#ifdef VERTEXCOLOR\nvertexOutputs.vColor=vertexInputs.color;\n#endif\n#include<logDepthVertex>\n#define CUSTOM_VERTEX_MAIN_END\n}\n";
e.ShadersStoreWGSL[v] || (e.ShadersStoreWGSL[v] = y);
var b = [
	n,
	r,
	t,
	a,
	o,
	u,
	d,
	p,
	h,
	i,
	c,
	s,
	l,
	f,
	m,
	g,
	_
];
for (let t of b) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var x = {
	name: v,
	shader: y
};
//#endregion
export { x as backgroundVertexShaderWGSL };
