import { n as e } from "./typeStore-pENEWnX2.js";
import { t } from "./flowGraphExecutionBlockWithOutSignal-B8S90C-T.js";
import { f as n, n as r } from "./flowGraphRichTypes.pure-BUaIWo2u.js";
//#region node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/Physics/flowGraphSetAngularVelocityBlock.pure.js
var i = class extends t {
	constructor(e) {
		super(e), this.body = this.registerDataInput("body", r), this.velocity = this.registerDataInput("velocity", n);
	}
	_execute(e, t) {
		let n = this.body.getValue(e);
		if (!n) {
			this._reportError(e, "No physics body provided"), this.out._activateSignal(e);
			return;
		}
		n.setAngularVelocity(this.velocity.getValue(e)), this.out._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphSetAngularVelocityBlock";
	}
}, a = !1;
function o() {
	a || (a = !0, e("FlowGraphSetAngularVelocityBlock", i));
}
//#endregion
export { i as FlowGraphSetAngularVelocityBlock, o as RegisterFlowGraphSetAngularVelocityBlock };
