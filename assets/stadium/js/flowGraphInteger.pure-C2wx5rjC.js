import { n as e } from "./typeStore-pENEWnX2.js";
//#region node_modules/@babylonjs/core/FlowGraph/CustomTypes/flowGraphInteger.pure.js
var t = class e {
	constructor(e) {
		this.value = this._toInt(e);
	}
	_toInt(e) {
		return e | 0;
	}
	add(t) {
		return new e(this.value + t.value);
	}
	subtract(t) {
		return new e(this.value - t.value);
	}
	multiply(t) {
		return new e(Math.imul(this.value, t.value));
	}
	divide(t) {
		return new e(this.value / t.value);
	}
	getClassName() {
		return e.ClassName;
	}
	equals(e) {
		return this.value === e.value;
	}
	static FromValue(t) {
		return new e(t);
	}
	toString() {
		return this.value.toString();
	}
};
t.ClassName = "FlowGraphInteger";
var n = !1;
function r() {
	n || (n = !0, e("FlowGraphInteger", t));
}
//#endregion
export { r as n, t };
