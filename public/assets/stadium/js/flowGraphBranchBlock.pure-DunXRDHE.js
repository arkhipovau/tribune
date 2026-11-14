import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphExecutionBlock-DoA7XtCo.js";
import { r as n } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphBranchBlock.pure.js
var r = class extends t {
	constructor(e) {
		super(e), this.condition = this.registerDataInput("condition", n), this.onTrue = this._registerSignalOutput("onTrue"), this.onFalse = this._registerSignalOutput("onFalse");
	}
	_execute(e) {
		this.condition.getValue(e) ? this.onTrue._activateSignal(e) : this.onFalse._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphBranchBlock";
	}
}, i = !1;
function a() {
	i || (i = !0, e("FlowGraphBranchBlock", r));
}
//#endregion
export { r as FlowGraphBranchBlock, a as RegisterFlowGraphBranchBlock };
