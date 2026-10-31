import { n as e } from "./typeStore-pENEWnX2.js";
import { t } from "./logger-DQIzSR_y.js";
import { t as n } from "./timer-BQvpnS4m.js";
import { t as r } from "./flowGraphInteger.pure-C2wx5rjC.js";
import { t as i } from "./flowGraphAsyncExecutionBlock-CkM7i_2v.js";
import { c as a, i as o } from "./flowGraphRichTypes.pure-BUaIWo2u.js";
import { n as s, r as c, t as l } from "./flowGraphDelayRegistry-DO7wtljZ.js";
//#region node_modules/@babylonjs/core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphSetDelayBlock.pure.js
var u = class e extends i {
	constructor(e) {
		super(e), this.cancel = this._registerSignalInput("cancel"), this.duration = this.registerDataInput("duration", a), this.lastDelayIndex = this.registerDataOutput("lastDelayIndex", o, new r(-1));
	}
	_preparePendingTasks(t) {
		let i = this.duration.getValue(t);
		if (i < 0 || isNaN(i) || !isFinite(i)) return this._reportError(t, "Invalid duration in SetDelay block");
		if (t._getGlobalContextVariable("activeDelays", 0) >= e.MaxParallelDelayCount) return this._reportError(t, "Max parallel delays reached");
		let a = t._getGlobalContextVariable("lastDelayIndex", -1), o = t._getExecutionVariable(this, "pendingDelays", []), c = t.configuration.scene, l = new n({
			timeout: i * 1e3,
			contextObservable: c.onBeforeRenderObservable,
			onEnded: () => this._onEnded(l, t)
		});
		l.start();
		let u = a + 1;
		this.lastDelayIndex.setValue(new r(u), t), t._setGlobalContextVariable("lastDelayIndex", u), s(t, u), o[u] = l, t._setExecutionVariable(this, "pendingDelays", o), this._updateGlobalTimers(t);
	}
	_cancelPendingTasks(e) {
		let t = e._getExecutionVariable(this, "pendingDelays", []), n = e._getGlobalContextVariable("pendingDelays", []);
		for (let r = 0; r < t.length; r++) {
			let i = t[r];
			i && (i.dispose(), c(e, r), delete n[r]);
		}
		e._setGlobalContextVariable("pendingDelays", n), e._deleteExecutionVariable(this, "pendingDelays"), this.lastDelayIndex.setValue(new r(-1), e), this._updateGlobalTimers(e);
	}
	_execute(e, t) {
		if (t === this.cancel) {
			this._cancelPendingTasks(e);
			return;
		}
		this._preparePendingTasks(e), this.out._activateSignal(e);
	}
	getClassName() {
		return "FlowGraphSetDelayBlock";
	}
	_onEnded(e, n) {
		let r = n._getExecutionVariable(this, "pendingDelays", []), i = r.indexOf(e);
		if (i !== -1) {
			delete r[i];
			let e = n._getGlobalContextVariable("pendingDelays", []);
			delete e[i], n._setGlobalContextVariable("pendingDelays", e), c(n, i);
		} else t.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list");
		n._removePendingBlock(this), this.done._activateSignal(n), this._updateGlobalTimers(n);
	}
	_updateGlobalTimers(e) {
		let n = e._getExecutionVariable(this, "pendingDelays", []), r = e._getGlobalContextVariable("pendingDelays", []);
		for (let i = 0; i < n.length; i++) {
			if (!n[i] || !l(e, i)) continue;
			let a = n[i];
			r[i] && r[i] !== a ? t.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list") : r[i] = a;
		}
		e._setGlobalContextVariable("pendingDelays", r);
	}
};
u.MaxParallelDelayCount = 100;
var d = !1;
function f() {
	d || (d = !0, e("FlowGraphSetDelayBlock", u));
}
//#endregion
export { u as FlowGraphSetDelayBlock, f as RegisterFlowGraphSetDelayBlock };
