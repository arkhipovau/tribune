import { n as e } from "./typeStore-pENEWnX2.js";
import { t } from "./flowGraphExecutionBlockWithOutSignal-B8S90C-T.js";
import { c as n, n as r } from "./flowGraphRichTypes.pure-BUaIWo2u.js";
//#region node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/Audio/flowGraphSetSoundVolumeBlock.pure.js
var i = class extends t {
	constructor(e) {
		super(e), this.sound = this.registerDataInput("sound", r), this.volume = this.registerDataInput("volume", n, 1);
	}
	_execute(e, t) {
		let n = this.sound.getValue(e);
		if (!n) {
			this._reportError(e, "No sound provided"), this.out._activateSignal(e);
			return;
		}
		n.volume = this.volume.getValue(e), this.out._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphSetSoundVolumeBlock";
	}
}, a = !1;
function o() {
	a || (a = !0, e("FlowGraphSetSoundVolumeBlock", i));
}
//#endregion
export { i as FlowGraphSetSoundVolumeBlock, o as RegisterFlowGraphSetSoundVolumeBlock };
