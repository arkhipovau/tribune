import { n as e } from "./typeStore-pENEWnX2.js";
import { n as t, u as n } from "./flowGraphRichTypes.pure-BUaIWo2u.js";
import { t as r } from "./flowGraphCachedOperationBlock-CSpwR9-F.js";
//#region node_modules/@babylonjs/core/FlowGraph/Blocks/Data/flowGraphGetPropertyBlock.pure.js
var i = class extends r {
	constructor(e) {
		super(t, e), this.config = e, this.object = this.registerDataInput("object", t, e.object), this.propertyName = this.registerDataInput("propertyName", n, e.propertyName), this.customGetFunction = this.registerDataInput("customGetFunction", t);
	}
	_doOperation(e) {
		let t = this.customGetFunction.getValue(e), n;
		if (t) n = t(this.object.getValue(e), this.propertyName.getValue(e), e);
		else {
			let t = this.object.getValue(e), r = this.propertyName.getValue(e);
			n = t && r ? this._getPropertyValue(t, r) : void 0;
		}
		return n;
	}
	_getPropertyValue(e, t) {
		let n = t.split("."), r = e;
		for (let e of n) if (r = r[e], r === void 0) return;
		return r;
	}
	getClassName() {
		return "FlowGraphGetPropertyBlock";
	}
}, a = !1;
function o() {
	a || (a = !0, e("FlowGraphGetPropertyBlock", i));
}
//#endregion
export { i as FlowGraphGetPropertyBlock, o as RegisterFlowGraphGetPropertyBlock };
