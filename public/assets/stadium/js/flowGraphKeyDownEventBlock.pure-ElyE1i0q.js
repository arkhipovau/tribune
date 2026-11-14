import { n as e } from "./typeStore-CdTKSRrI.js";
import { r as t } from "./flowGraphRichTypes.pure-DNAa84YP.js";
import { t as n } from "./flowGraphKeyboardEventBlock-CLpeeVqy.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Event/flowGraphKeyDownEventBlock.pure.js
var r = class extends n {
	constructor(e) {
		super(e), this.type = "KeyDown", this.isRepeat = this.registerDataOutput("isRepeat", t);
	}
	_executeEvent(e, t) {
		let n = t.event.repeat ?? !1;
		return n && this.config?.ignoreRepeat ? !0 : (this.isRepeat.setValue(n, e), super._executeEvent(e, t));
	}
	getClassName() {
		return "FlowGraphKeyDownEventBlock";
	}
}, i = !1;
function a() {
	i || (i = !0, e("FlowGraphKeyDownEventBlock", r));
}
//#endregion
export { r as FlowGraphKeyDownEventBlock, a as RegisterFlowGraphKeyDownEventBlock };
