import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphInteger.pure-UOMJdnLo.js";
import { t as n } from "./flowGraphBlock-BYbFoCIo.js";
import { t as r } from "./flowGraphAssetsContext-R2BnZY4D.js";
import { s as i } from "./utils-D5G5w6BH.js";
import { n as a } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Data/flowGraphGetAssetBlock.pure.js
var o = class extends n {
	constructor(e) {
		super(e), this.config = e, this.type = this.registerDataInput("type", a, e.type), this.value = this.registerDataOutput("value", a), this.index = this.registerDataInput("index", a, new t(i(e.index ?? -1)));
	}
	_updateOutputs(e) {
		let t = this.type.getValue(e), n = this.index.getValue(e), a = r(e.assetsContext, t, i(n), this.config.useIndexAsUniqueId);
		this.value.setValue(a, e);
	}
	getClassName() {
		return "FlowGraphGetAssetBlock";
	}
}, s = !1;
function c() {
	s || (s = !0, e("FlowGraphGetAssetBlock", o));
}
//#endregion
export { o as FlowGraphGetAssetBlock, c as RegisterFlowGraphGetAssetBlock };
