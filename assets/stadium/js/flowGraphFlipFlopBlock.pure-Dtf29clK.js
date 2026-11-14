import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphExecutionBlock-DoA7XtCo.js";
import { r as n } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphFlipFlopBlock.pure.js
var r = class extends t {
	constructor(e) {
		super(e), this.onOn = this._registerSignalOutput("onOn"), this.onOff = this._registerSignalOutput("onOff"), this.value = this.registerDataOutput("value", n);
	}
	_execute(e, t) {
		let n = e._getExecutionVariable(this, "value", typeof this.config?.startValue == "boolean" && !this.config.startValue);
		n = !n, e._setExecutionVariable(this, "value", n), this.value.setValue(n, e), n ? this.onOn._activateSignal(e) : this.onOff._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphFlipFlopBlock";
	}
}, i = !1;
function a() {
	i || (i = !0, e("FlowGraphFlipFlopBlock", r));
}
//#endregion
export { r as FlowGraphFlipFlopBlock, a as RegisterFlowGraphFlipFlopBlock };
