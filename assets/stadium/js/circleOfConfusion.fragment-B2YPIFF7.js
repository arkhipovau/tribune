import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/circleOfConfusion.fragment.js
var t = "circleOfConfusionPixelShader", n = "uniform sampler2D depthSampler;varying vec2 vUV;\n#ifndef COC_DEPTH_NOT_NORMALIZED\nuniform vec2 cameraMinMaxZ;\n#endif\nuniform float focusDistance;uniform float cocPrecalculation;\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void)\n{float depth=texture2D(depthSampler,vUV).r;\n#define CUSTOM_COC_DEPTH\n#ifdef COC_DEPTH_NOT_NORMALIZED\nfloat pixelDistance=depth*1000.0;\n#else\nfloat pixelDistance=(cameraMinMaxZ.x+cameraMinMaxZ.y*depth)*1000.0; \n#endif\n#define CUSTOM_COC_PIXELDISTANCE\nfloat coc=abs(cocPrecalculation*((focusDistance-pixelDistance)/pixelDistance));coc=clamp(coc,0.0,1.0);gl_FragColor=vec4(coc,coc,coc,1.0);}\n";
e.ShadersStore[t] || (e.ShadersStore[t] = n);
var r = {
	name: t,
	shader: n
};
//#endregion
export { r as circleOfConfusionPixelShader };
