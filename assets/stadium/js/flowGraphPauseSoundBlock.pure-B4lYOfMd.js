import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphExecutionBlockWithOutSignal-2n5XPxT1.js";
import { n } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/Audio/flowGraphPauseSoundBlock.pure.js
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
		n.state === 5 ? n.resume() : (n.state === 2 || n.state === 3) && n.pause(), this.out._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphPauseSoundBlock";
	}
}, i = !1;
function a() {
	i || (i = !0, e("FlowGraphPauseSoundBlock", r));
}
//#endregion
export { r as FlowGraphPauseSoundBlock, a as RegisterFlowGraphPauseSoundBlock };
