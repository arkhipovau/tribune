import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./logger-EXzqzgex.js";
import { t as n } from "./flowGraphExecutionBlockWithOutSignal-2n5XPxT1.js";
import { r } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphWhileLoopBlock.pure.js
var i = class e extends n {
	constructor(e) {
		super(e), this.config = e, this.condition = this.registerDataInput("condition", r), this.executionFlow = this._registerSignalOutput("executionFlow"), this.completed = this._registerSignalOutput("completed"), this._unregisterSignalOutput("out");
	}
	_execute(n, r) {
		let i = this.condition.getValue(n);
		this.config?.doWhile && !i && this.executionFlow._activateSignal(n);
		let a = 0;
		for (; i;) {
			if (this.executionFlow._activateSignal(n), ++a, a >= e.MaxLoopCount) {
				t.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");
				break;
			}
			i = this.condition.getValue(n);
		}
		this.completed._activateSignal(n);
	}
	getClassName() {
		return "FlowGraphWhileLoopBlock";
	}
};
i.MaxLoopCount = 1e3;
var a = !1;
function o() {
	a || (a = !0, e("FlowGraphWhileLoopBlock", i));
}
//#endregion
export { i as FlowGraphWhileLoopBlock, o as RegisterFlowGraphWhileLoopBlock };
