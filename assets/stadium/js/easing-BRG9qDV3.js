import { u as e } from "./math.color.pure-Da-OlKtz.js";
//#region node_modules/@babylonjs/core/Maths/math.path.js
var t;
(function(e) {
	e[e.CW = 0] = "CW", e[e.CCW = 1] = "CCW";
})(t || (t = {}));
var n = class {
	static Interpolate(e, t, n, r, i) {
		if (e === 0) return 0;
		let a = 1 - 3 * r + 3 * t, o = 3 * r - 6 * t, s = 3 * t, c = e;
		for (let t = 0; t < 5; t++) {
			let t = c * c, n = t * c * a + o * t + s * c, r = 1 / (3 * a * t + 2 * o * c + s);
			c -= (n - e) * r, c = Math.min(1, Math.max(0, c));
		}
		return 3 * (1 - c) ** 2 * c * n + 3 * (1 - c) * c ** 2 * i + c ** 3;
	}
}, r = class t {
	static CreateQuadraticBezier(n, r, i, a) {
		a = a > 2 ? a : 3;
		let o = [], s = (e, t, n, r) => (1 - e) * (1 - e) * t + 2 * e * (1 - e) * n + e * e * r;
		for (let t = 0; t <= a; t++) o.push(new e(s(t / a, n.x, r.x, i.x), s(t / a, n.y, r.y, i.y), s(t / a, n.z, r.z, i.z)));
		return new t(o);
	}
	static CreateCubicBezier(n, r, i, a, o) {
		o = o > 3 ? o : 4;
		let s = [], c = (e, t, n, r, i) => (1 - e) * (1 - e) * (1 - e) * t + 3 * e * (1 - e) * (1 - e) * n + 3 * e * e * (1 - e) * r + e * e * e * i;
		for (let t = 0; t <= o; t++) s.push(new e(c(t / o, n.x, r.x, i.x, a.x), c(t / o, n.y, r.y, i.y, a.y), c(t / o, n.z, r.z, i.z, a.z)));
		return new t(s);
	}
	static CreateHermiteSpline(n, r, i, a, o) {
		let s = [], c = 1 / o;
		for (let t = 0; t <= o; t++) s.push(e.Hermite(n, r, i, a, t * c));
		return new t(s);
	}
	static CreateCatmullRomSpline(n, r, i) {
		let a = [], o = 1 / r, s = 0;
		if (i) {
			let t = n.length;
			for (let i = 0; i < t; i++) {
				s = 0;
				for (let c = 0; c < r; c++) a.push(e.CatmullRom(n[i % t], n[(i + 1) % t], n[(i + 2) % t], n[(i + 3) % t], s)), s += o;
			}
			a.push(a[0]);
		} else {
			let t = [];
			t.push(n[0].clone()), t.push(...n), t.push(n[n.length - 1].clone());
			let i = 0;
			for (; i < t.length - 3; i++) {
				s = 0;
				for (let n = 0; n < r; n++) a.push(e.CatmullRom(t[i], t[i + 1], t[i + 2], t[i + 3], s)), s += o;
			}
			i--, a.push(e.CatmullRom(t[i], t[i + 1], t[i + 2], t[i + 3], s));
		}
		return new t(a);
	}
	static ArcThru3Points(n, r, i, a = 32, o = !1, s = !1) {
		let c = [], l = r.subtract(n), u = i.subtract(r), d = n.subtract(i), f = e.Cross(l, u), p = f.length();
		if (p < 10 ** -8) return new t(c);
		let m = l.lengthSquared(), h = u.lengthSquared(), g = d.lengthSquared(), _ = f.lengthSquared(), v = l.length(), y = u.length(), b = d.length(), x = .5 * v * y * b / p, S = e.Dot(l, d), C = e.Dot(l, u), w = e.Dot(u, d), T = -.5 * h * S / _, E = -.5 * g * C / _, D = -.5 * m * w / _, O = n.scale(T).add(r.scale(E)).add(i.scale(D)), k = n.subtract(O).normalize(), A = e.Cross(f, k).normalize();
		if (s) {
			let e = 2 * Math.PI / a;
			for (let t = 0; t <= 2 * Math.PI; t += e) c.push(O.add(k.scale(x * Math.cos(t)).add(A.scale(x * Math.sin(t)))));
			c.push(n);
		} else {
			let e = 1 / a, t = 0, r;
			do
				r = O.add(k.scale(x * Math.cos(t)).add(A.scale(x * Math.sin(t)))), c.push(r), t += e;
			while (!r.equalsWithEpsilon(i, x * e * 1.1));
			c.push(i), o && c.push(n);
		}
		return new t(c);
	}
	constructor(e) {
		this._length = 0, this._points = e, this._length = this._computeLength(e);
	}
	getPoints() {
		return this._points;
	}
	length() {
		return this._length;
	}
	continue(e) {
		let n = this._points[this._points.length - 1], r = this._points.slice(), i = e.getPoints();
		for (let e = 1; e < i.length; e++) r.push(i[e].subtract(i[0]).add(n));
		return new t(r);
	}
	_computeLength(e) {
		let t = 0;
		for (let n = 1; n < e.length; n++) t += e[n].subtract(e[n - 1]).length();
		return t;
	}
}, i = class e {
	constructor() {
		this._easingMode = e.EASINGMODE_EASEIN;
	}
	setEasingMode(e) {
		let t = Math.min(Math.max(e, 0), 2);
		this._easingMode = t;
	}
	getEasingMode() {
		return this._easingMode;
	}
	easeInCore(e) {
		throw Error("You must implement this method");
	}
	ease(t) {
		switch (this._easingMode) {
			case e.EASINGMODE_EASEIN: return this.easeInCore(t);
			case e.EASINGMODE_EASEOUT: return 1 - this.easeInCore(1 - t);
		}
		return t >= .5 ? (1 - this.easeInCore((1 - t) * 2)) * .5 + .5 : this.easeInCore(t * 2) * .5;
	}
};
i.EASINGMODE_EASEIN = 0, i.EASINGMODE_EASEOUT = 1, i.EASINGMODE_EASEINOUT = 2;
var a = class extends i {
	easeInCore(e) {
		return e = Math.max(0, Math.min(1, e)), 1 - Math.sqrt(1 - e * e);
	}
}, o = class extends i {
	constructor(e = 1) {
		super(), this.amplitude = e;
	}
	easeInCore(e) {
		let t = Math.max(0, this.amplitude);
		return e ** 3 - e * t * Math.sin(3.141592653589793 * e);
	}
}, s = class extends i {
	constructor(e = 3, t = 2) {
		super(), this.bounces = e, this.bounciness = t;
	}
	easeInCore(e) {
		let t = Math.max(0, this.bounces), n = this.bounciness;
		n <= 1 && (n = 1.001);
		let r = n ** +t, i = 1 - n, a = (1 - r) / i + r * .5, o = e * a, s = Math.log(-o * (1 - n) + 1) / Math.log(n), c = Math.floor(s), l = c + 1, u = (1 - n ** +c) / (i * a), d = (u + (1 - n ** +l) / (i * a)) * .5, f = e - d, p = d - u;
		return -((1 / n) ** (t - c)) / (p * p) * (f - p) * (f + p);
	}
}, c = class extends i {
	easeInCore(e) {
		return e * e * e;
	}
}, l = class extends i {
	constructor(e = 3, t = 3) {
		super(), this.oscillations = e, this.springiness = t;
	}
	easeInCore(e) {
		let t, n = Math.max(0, this.oscillations), r = Math.max(0, this.springiness);
		return t = r === 0 ? e : (Math.exp(r * e) - 1) / (Math.exp(r) - 1), t * Math.sin((6.283185307179586 * n + 1.5707963267948966) * e);
	}
}, u = class extends i {
	constructor(e = 2) {
		super(), this.exponent = e;
	}
	easeInCore(e) {
		return this.exponent <= 0 ? e : (Math.exp(this.exponent * e) - 1) / (Math.exp(this.exponent) - 1);
	}
}, d = class extends i {
	easeInCore(e) {
		return e * e;
	}
}, f = class extends i {
	easeInCore(e) {
		return 1 - Math.sin(1.5707963267948966 * (1 - e));
	}
}, p = class extends i {
	constructor(e = 0, t = 0, n = 1, r = 1) {
		super(), this.x1 = e, this.y1 = t, this.x2 = n, this.y2 = r;
	}
	easeInCore(e) {
		return n.Interpolate(e, this.x1, this.y1, this.x2, this.y2);
	}
};
//#endregion
export { c as a, u as c, r as d, a as i, d as l, p as n, i as o, s as r, l as s, o as t, f as u };
