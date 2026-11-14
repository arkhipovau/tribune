import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphInteger.pure-UOMJdnLo.js";
import { t as n } from "./flowGraphBlock-BYbFoCIo.js";
import { s as r } from "./utils-D5G5w6BH.js";
import { n as i } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Data/Utils/flowGraphArrayIndexBlock.pure.js
var a = class extends n {
	constructor(e) {
		super(e), this.config = e, this.array = this.registerDataInput("array", i), this.index = this.registerDataInput("index", i, new t(-1)), this.value = this.registerDataOutput("value", i);
	}
	_updateOutputs(e) {
		let t = this.array.getValue(e), n = this.index.getValue(e);
		if (n == null) {
			this.value.setValue(null, e);
			return;
		}
		let i;
		if (typeof n == "string") {
			let t = e.decodeIndexReference(n, this.config.referenceCollection);
			if (t === void 0) {
				this.value.setValue(null, e);
				return;
			}
			i = t;
		} else i = r(n);
		t && i >= 0 && i < t.length ? this.value.setValue(t[i], e) : this.value.setValue(null, e);
	}
	serialize(e) {
		super.serialize(e);
	}
	getClassName() {
		return "FlowGraphArrayIndexBlock";
	}
}, o = !1;
function s() {
	o || (o = !0, e("FlowGraphArrayIndexBlock", a));
}
//#endregion
export { a as FlowGraphArrayIndexBlock, s as RegisterFlowGraphArrayIndexBlock };
