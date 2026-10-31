import { t as e } from "./shaderStore-CXjvw9c2.js";
import { a as t, i as n, n as r, r as i, t as a } from "./bakedVertexAnimation-BXhMDN_6.js";
import { t as o } from "./instancesDeclaration-epO_glY9.js";
import { n as s, t as c } from "./clipPlaneVertex-CAu7ufCg.js";
import { i as l, n as u, r as d, t as f } from "./morphTargetsVertex-B7hQjaB6.js";
//#region node_modules/@babylonjs/core/ShadersWGSL/glowMapGeneration.vertex.js
var p = "glowMapGenerationVertexShader", m = "attribute position: vec3f;\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#include<clipPlaneVertexDeclaration>\n#include<instancesDeclaration>\nuniform viewProjection: mat4x4f;varying vPosition: vec4f;\n#ifdef UV1\nattribute uv: vec2f;\n#endif\n#ifdef UV2\nattribute uv2: vec2f;\n#endif\n#ifdef DIFFUSE\nvarying vUVDiffuse: vec2f;uniform diffuseMatrix: mat4x4f;\n#endif\n#ifdef OPACITY\nvarying vUVOpacity: vec2f;uniform opacityMatrix: mat4x4f;\n#endif\n#ifdef EMISSIVE\nvarying vUVEmissive: vec2f;uniform emissiveMatrix: mat4x4f;\n#endif\n#ifdef VERTEXALPHA\nattribute color: vec4f;varying vColor: vec4f;\n#endif\n#define CUSTOM_VERTEX_DEFINITIONS\n@vertex\nfn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;\n#ifdef UV1\nvar uvUpdated: vec2f=vertexInputs.uv;\n#endif\n#ifdef UV2\nvar uv2Updated: vec2f=vertexInputs.uv2;\n#endif\n#include<morphTargetsVertexGlobal>\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvar worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);\n#ifdef CUBEMAP\nvertexOutputs.vPosition=worldPos;vertexOutputs.position=uniforms.viewProjection*finalWorld* vec4f(vertexInputs.position,1.0);\n#else\nvertexOutputs.vPosition=uniforms.viewProjection*worldPos;vertexOutputs.position=vertexOutputs.vPosition;\n#endif\n#ifdef DIFFUSE\n#ifdef DIFFUSEUV1\nvertexOutputs.vUVDiffuse= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;\n#endif\n#ifdef DIFFUSEUV2\nvertexOutputs.vUVDiffuse= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;\n#endif\n#endif\n#ifdef OPACITY\n#ifdef OPACITYUV1\nvertexOutputs.vUVOpacity= (uniforms.opacityMatrix* vec4f(uvUpdated,1.0,0.0)).xy;\n#endif\n#ifdef OPACITYUV2\nvertexOutputs.vUVOpacity= (uniforms.opacityMatrix* vec4f(uv2Updated,1.0,0.0)).xy;\n#endif\n#endif\n#ifdef EMISSIVE\n#ifdef EMISSIVEUV1\nvertexOutputs.vUVEmissive= (uniforms.emissiveMatrix* vec4f(uvUpdated,1.0,0.0)).xy;\n#endif\n#ifdef EMISSIVEUV2\nvertexOutputs.vUVEmissive= (uniforms.emissiveMatrix* vec4f(uv2Updated,1.0,0.0)).xy;\n#endif\n#endif\n#ifdef VERTEXALPHA\nvertexOutputs.vColor=vertexInputs.color;\n#endif\n#include<clipPlaneVertex>\n}";
e.ShadersStoreWGSL[p] || (e.ShadersStoreWGSL[p] = m);
var h = [
	t,
	n,
	l,
	d,
	s,
	o,
	u,
	f,
	i,
	r,
	a,
	c
];
for (let t of h) e.IncludesShadersStoreWGSL[t.name] || (e.IncludesShadersStoreWGSL[t.name] = t.shader);
var g = {
	name: p,
	shader: m
};
//#endregion
export { g as glowMapGenerationVertexShaderWGSL };
