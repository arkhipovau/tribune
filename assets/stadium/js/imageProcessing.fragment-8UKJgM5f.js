import { t as e } from "./shaderStore-BwDsKZsu.js";
import { helperFunctions as t } from "./helperFunctions-BempXiLI.js";
import { n, t as r } from "./imageProcessingFunctions-Nsrv1F6x.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/Shaders/imageProcessing.fragment.js
var i = "imageProcessingPixelShader", a = "varying vec2 vUV;uniform sampler2D textureSampler;\n#include<imageProcessingDeclaration>\n#include<helperFunctions>\n#include<imageProcessingFunctions>\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void)\n{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));\n#ifdef IMAGEPROCESSING\n#ifndef FROMLINEARSPACE\nresult.rgb=toLinearSpace(result.rgb);\n#endif\nresult=applyImageProcessing(result);\n#else\n#ifdef FROMLINEARSPACE\nresult=applyImageProcessing(result);\n#endif\n#endif\ngl_FragColor=result;}";
e.ShadersStore[i] || (e.ShadersStore[i] = a);
var o = [
	n,
	t,
	r
];
for (let t of o) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var s = {
	name: i,
	shader: a
};
//#endregion
export { s as imageProcessingPixelShader };
