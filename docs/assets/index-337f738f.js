import {
	u as a,
	n as f,
	d as g,
	_ as h,
	w as L,
	e as M,
	b as m,
	o as P,
	c as p,
	g as R,
	r as u,
	a as w,
	f as x,
} from "./index-5fe9b34d.js";

const V = (n, o) => {
		const e = n.__vccOpts || n;
		for (const [c, v] of o) e[c] = v;
		return e;
	},
	A = { key: 0, class: "vue-splitter-container-mask" },
	D = {
		__name: "index",
		props: {
			minPercent: { type: Number, default: 10 },
			defaultPercent: { type: Number, default: 50 },
			split: {
				validator(n) {
					return ["vertical", "horizontal"].indexOf(n) >= 0;
				},
				required: !0,
			},
			className: { type: String },
		},
		setup(n, { emit: o }) {
			const e = n,
				c = g(() =>
					h(
						() => import("./pane-0067275b.js"),
						[
							"assets/pane-0067275b.js",
							"assets/index-5fe9b34d.js",
							"assets/index-7c269999.css",
							"assets/pane-71938aef.css",
						],
					),
				),
				v = g(() =>
					h(
						() => import("./resizer-e50d404e.js"),
						[
							"assets/resizer-e50d404e.js",
							"assets/index-5fe9b34d.js",
							"assets/index-7c269999.css",
							"assets/resizer-4b643ee5.css",
						],
					),
				),
				r = u(!1),
				d = u(!1);
			u(null);
			const s = u(e.defaultPercent);
			L(() => {
				s.value = e.defaultPercent;
			});
			const y = p(() => (e.split === "vertical" ? "width" : "height")),
				z = p(() => (e.split === "vertical" ? "left" : "top")),
				N = p(() => (r.value ? "none" : "")),
				T = p(() =>
					r.value ? (e.split === "vertical" ? "col-resize" : "row-resize") : "",
				),
				b = () => {
					r.value = !0;
				},
				k = (t) => {
					if (((t.buttons === 0 || t.which === 0) && (r.value = !1), r.value)) {
						let i = 0,
							l = t.currentTarget;
						if (e.split === "vertical")
							for (; l; ) (i += l.offsetLeft), (l = l.offsetParent);
						else for (; l; ) (i += l.offsetTop), (l = l.offsetParent);
						const E = e.split === "vertical" ? t.pageX : t.pageY,
							C =
								e.split === "vertical"
									? t.currentTarget.offsetWidth
									: t.currentTarget.offsetHeight,
							_ = Math.floor(((E - i) / C) * 1e4) / 100;
						_ > e.minPercent && _ < 100 - e.minPercent && (s.value = _),
							o("resize", s.value),
							(d.value = !0);
					}
				},
				O = () => {
					(r.value = !0), (d.value = !1);
				},
				S = () => {
					console.log("点击"),
						d.value || ((s.value = 50), o("resize", s.value));
				};
			return (t, i) => (
				P(),
				w(
					"div",
					{
						style: f({ cursor: a(T), userSelect: a(N) }),
						class: "vue-splitter-container clearfix",
						onMousemove: k,
					},
					[
						m(
							a(c),
							{
								class: "splitter-pane splitter-paneL",
								split: e.split,
								style: f({ [a(y)]: s.value + "%" }),
							},
							{
								default: M(() => [x(t.$slots, "paneL", {}, void 0, !0)]),
								_: 3,
							},
							8,
							["split", "style"],
						),
						m(
							a(v),
							{
								className: n.className,
								style: f({ [a(z)]: s.value + "%" }),
								split: e.split,
								onMousedown: O,
								onMouseup: b,
								onClick: S,
							},
							null,
							8,
							["className", "style", "split"],
						),
						m(
							a(c),
							{
								class: "splitter-pane splitter-paneR",
								split: e.split,
								style: f({ [a(y)]: 100 - s.value + "%" }),
							},
							{
								default: M(() => [x(t.$slots, "paneR", {}, void 0, !0)]),
								_: 3,
							},
							8,
							["split", "style"],
						),
						r.value ? (P(), w("div", A)) : R("", !0),
					],
					36,
				)
			);
		},
	},
	I = V(D, [["__scopeId", "data-v-7eeff765"]]),
	j = Object.freeze(
		Object.defineProperty({ __proto__: null, default: I }, Symbol.toStringTag, {
			value: "Module",
		}),
	);
export { V as _, j as i };
