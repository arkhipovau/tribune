import { n as e } from "./typeStore-CdTKSRrI.js";
import { a as t, t as n } from "./flowGraphBlock-BYbFoCIo.js";
import { _ as r } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Data/flowGraphConstantBlock.pure.js
var i = class extends n {
	constructor(e) {
		super(e), this.config = e, this.output = this.registerDataOutput("output", r(e.value));
	}
	_updateOutputs(e) {
		this.output.setValue(this.config.value, e);
	}
	getClassName() {
		return "FlowGraphConstantBlock";
	}
	serialize(e = {}, n = t) {
		super.serialize(e), n("value", this.config.value, e.config);
	}
}, a = !1;
function o() {
	a || (a = !0, e("FlowGraphConstantBlock", i));
}
//#endregion
export { i as FlowGraphConstantBlock, o as RegisterFlowGraphConstantBlock };
