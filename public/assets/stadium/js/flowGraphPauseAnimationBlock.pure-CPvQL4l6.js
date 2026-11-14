import { n as e } from "./typeStore-CdTKSRrI.js";
import { t } from "./flowGraphExecutionBlockWithOutSignal-2n5XPxT1.js";
import { n } from "./flowGraphRichTypes.pure-DNAa84YP.js";
//#region ../../tribune/stadium-src/node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/Animation/flowGraphPauseAnimationBlock.pure.js
var r = class extends t {
	constructor(e) {
		super(e), this.animationToPause = this.registerDataInput("animationToPause", n);
	}
	_execute(e) {
		this.animationToPause.getValue(e).pause(), this.out._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphPauseAnimationBlock";
	}
}, i = !1;
function a() {
	i || (i = !0, e("FlowGraphPauseAnimationBlock", r));
}
//#endregion
export { r as FlowGraphPauseAnimationBlock, a as RegisterFlowGraphPauseAnimationBlock };
