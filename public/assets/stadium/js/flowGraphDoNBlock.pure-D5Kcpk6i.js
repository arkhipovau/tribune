import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphInteger.pure-UOMJdnLo.js";
import { t as n } from "./flowGraphExecutionBlockWithOutSignal-2n5XPxT1.js";
import { i as r } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphDoNBlock.pure.js
var i = class extends n {
	constructor(e = {}) {
		super(e), this.config = e, this.config.startIndex = e.startIndex ?? new t(0), this.reset = this._registerSignalInput("reset"), this.maxExecutions = this.registerDataInput("maxExecutions", r), this.executionCount = this.registerDataOutput("executionCount", r, new t(0));
	}
	_execute(e, n) {
		if (n === this.reset) this.executionCount.setValue(this.config.startIndex, e);
		else {
			let n = this.executionCount.getValue(e);
			n.value < this.maxExecutions.getValue(e).value && (this.executionCount.setValue(new t(n.value + 1), e), this.out._activateSignal(e));
		}
	}
	getClassName() {
		return "FlowGraphDoNBlock";
	}
}, a = !1;
function o() {
	a || (a = !0, e("FlowGraphDoNBlock", i));
}
//#endregion
export { i as FlowGraphDoNBlock, o as RegisterFlowGraphDoNBlock };
