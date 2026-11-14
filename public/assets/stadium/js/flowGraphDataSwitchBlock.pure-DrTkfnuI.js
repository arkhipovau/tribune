import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphBlock-BYbFoCIo.js";
import { c as n, s as r } from "./utils-D5G5w6BH.js";
import { n as i } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Data/flowGraphDataSwitchBlock.pure.js
var a = class extends t {
	constructor(e) {
		super(e), this.config = e, this._inputCases = /* @__PURE__ */ new Map(), this.case = this.registerDataInput("case", i, NaN), this.default = this.registerDataInput("default", i), this.value = this.registerDataOutput("value", i);
		let t = this.config.cases || [];
		for (let e of t) {
			if (e = r(e), this.config.treatCasesAsIntegers && (e |= 0, this._inputCases.has(e))) return;
			this._inputCases.set(e, this.registerDataInput(`in_${e}`, i));
		}
	}
	_updateOutputs(e) {
		let t = this.case.getValue(e), i;
		n(t) && (i = this._getOutputValueForCase(r(t), e)), i || (i = this.default.getValue(e)), this.value.setValue(i, e);
	}
	_getOutputValueForCase(e, t) {
		return this._inputCases.get(e)?.getValue(t);
	}
	getClassName() {
		return "FlowGraphDataSwitchBlock";
	}
}, o = !1;
function s() {
	o || (o = !0, e("FlowGraphDataSwitchBlock", a));
}
//#endregion
export { a as FlowGraphDataSwitchBlock, s as RegisterFlowGraphDataSwitchBlock };
