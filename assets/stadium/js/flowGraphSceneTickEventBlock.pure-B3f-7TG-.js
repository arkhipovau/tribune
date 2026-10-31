import { n as e } from "./typeStore-pENEWnX2.js";
import { t } from "./flowGraphEventBlock-Bs0sWol2.js";
import { c as n, u as r } from "./flowGraphRichTypes.pure-BUaIWo2u.js";
//#region node_modules/@babylonjs/core/FlowGraph/Blocks/Event/flowGraphSceneTickEventBlock.pure.js
var i = "sceneTick", a = class extends t {
	get eventKey() {
		return i;
	}
	constructor() {
		super(), this.type = "SceneBeforeRender", this.timeSinceStart = this.registerDataOutput("timeSinceStart", n), this.deltaTime = this.registerDataOutput("deltaTime", n), this.eventRef = this.registerDataOutput("event", r);
	}
	_updateOutputs(e) {
		this.eventRef.setValue(e.getEventReference(i), e);
	}
	_preparePendingTasks(e) {}
	_executeEvent(e, t) {
		return this.timeSinceStart.setValue(t.timeSinceStart, e), this.deltaTime.setValue(t.deltaTime, e), this.eventRef.setValue(e.getEventReference(i), e), this._execute(e), !0;
	}
	_cancelPendingTasks(e) {}
	getClassName() {
		return "FlowGraphSceneTickEventBlock";
	}
}, o = !1;
function s() {
	o || (o = !0, e("FlowGraphSceneTickEventBlock", a));
}
//#endregion
export { a as FlowGraphSceneTickEventBlock, s as RegisterFlowGraphSceneTickEventBlock };
