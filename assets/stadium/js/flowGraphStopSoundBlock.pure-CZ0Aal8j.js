import { n as e } from "./typeStore-pENEWnX2.js";
import { t } from "./flowGraphExecutionBlockWithOutSignal-B8S90C-T.js";
import { n } from "./flowGraphRichTypes.pure-BUaIWo2u.js";
//#region node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/Audio/flowGraphStopSoundBlock.pure.js
var r = class extends t {
	constructor(e) {
		super(e), this.sound = this.registerDataInput("sound", n);
	}
	_execute(e, t) {
		let n = this.sound.getValue(e);
		if (!n) {
			this._reportError(e, "No sound provided"), this.out._activateSignal(e);
			return;
		}
		n.stop(), this.out._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphStopSoundBlock";
	}
}, i = !1;
function a() {
	i || (i = !0, e("FlowGraphStopSoundBlock", r));
}
//#endregion
export { r as FlowGraphStopSoundBlock, a as RegisterFlowGraphStopSoundBlock };
