import { n as e } from "./typeStore-CdTKSRrI.js";
import { c as t, n } from "./flowGraphRichTypes.pure-DNAa84YP.js";
import { t as r } from "./flowGraphCachedOperationBlock-DLdsXHqp.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Data/Audio/flowGraphGetSoundVolumeBlock.pure.js
var i = class extends r {
	constructor(e) {
		super(t, e), this.sound = this.registerDataInput("sound", n);
	}
	_doOperation(e) {
		let t = this.sound.getValue(e);
		if (t) return t.volume;
	}
	getClassName() {
		return "FlowGraphGetSoundVolumeBlock";
	}
}, a = !1;
function o() {
	a || (a = !0, e("FlowGraphGetSoundVolumeBlock", i));
}
//#endregion
export { i as FlowGraphGetSoundVolumeBlock, o as RegisterFlowGraphGetSoundVolumeBlock };
