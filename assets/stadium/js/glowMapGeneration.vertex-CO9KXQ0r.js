import { t as e } from "./shaderStore-CXjvw9c2.js";
import { a as t, i as n, n as r, r as i, t as a } from "./bakedVertexAnimation-C84_EEyr.js";
import { t as o } from "./instancesDeclaration-CspCqzBt.js";
import { n as s, t as c } from "./clipPlaneVertex-CoylEQdx.js";
import { i as l, n as u, r as d, t as f } from "./morphTargetsVertex-BaK3QguC.js";
//#region node_modules/@babylonjs/core/Shaders/glowMapGeneration.vertex.js
var p = "glowMapGenerationVertexShader", m = "attribute vec3 position;\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#include<clipPlaneVertexDeclaration>\n#include<instancesDeclaration>\nuniform mat4 viewProjection;varying vec4 vPosition;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef DIFFUSE\nvarying vec2 vUVDiffuse;uniform mat4 diffuseMatrix;\n#endif\n#ifdef OPACITY\nvarying vec2 vUVOpacity;uniform mat4 opacityMatrix;\n#endif\n#ifdef EMISSIVE\nvarying vec2 vUVEmissive;uniform mat4 emissiveMatrix;\n#endif\n#ifdef VERTEXALPHA\nattribute vec4 color;varying vec4 vColor;\n#endif\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void)\n{vec3 positionUpdated=position;\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#ifdef UV2\nvec2 uv2Updated=uv2;\n#endif\n#include<morphTargetsVertexGlobal>\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvec4 worldPos=finalWorld*vec4(positionUpdated,1.0);\n#ifdef CUBEMAP\nvPosition=worldPos;gl_Position=viewProjection*finalWorld*vec4(position,1.0);\n#else\nvPosition=viewProjection*worldPos;gl_Position=vPosition;\n#endif\n#ifdef DIFFUSE\n#ifdef DIFFUSEUV1\nvUVDiffuse=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef DIFFUSEUV2\nvUVDiffuse=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));\n#endif\n#endif\n#ifdef OPACITY\n#ifdef OPACITYUV1\nvUVOpacity=vec2(opacityMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef OPACITYUV2\nvUVOpacity=vec2(opacityMatrix*vec4(uv2Updated,1.0,0.0));\n#endif\n#endif\n#ifdef EMISSIVE\n#ifdef EMISSIVEUV1\nvUVEmissive=vec2(emissiveMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef EMISSIVEUV2\nvUVEmissive=vec2(emissiveMatrix*vec4(uv2Updated,1.0,0.0));\n#endif\n#endif\n#ifdef VERTEXALPHA\nvColor=color;\n#endif\n#include<clipPlaneVertex>\n}";
e.ShadersStore[p] || (e.ShadersStore[p] = m);
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
for (let t of h) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var g = {
	name: p,
	shader: m
};
//#endregion
export { g as glowMapGenerationVertexShader };
