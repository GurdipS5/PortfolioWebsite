function H(t) {
  return t.split('-')[1];
}
function ut(t) {
  return t === 'y' ? 'height' : 'width';
}
function F(t) {
  return t.split('-')[0];
}
function _(t) {
  return ['top', 'bottom'].includes(F(t)) ? 'x' : 'y';
}
function yt(t, e, o) {
  let { reference: n, floating: r } = t;
  const i = n.x + n.width / 2 - r.width / 2,
    s = n.y + n.height / 2 - r.height / 2,
    c = _(e),
    l = ut(c),
    u = n[l] / 2 - r[l] / 2,
    g = c === 'x';
  let a;
  switch (F(e)) {
    case 'top':
      a = { x: i, y: n.y - r.height };
      break;
    case 'bottom':
      a = { x: i, y: n.y + n.height };
      break;
    case 'right':
      a = { x: n.x + n.width, y: s };
      break;
    case 'left':
      a = { x: n.x - r.width, y: s };
      break;
    default:
      a = { x: n.x, y: n.y };
  }
  switch (H(e)) {
    case 'start':
      a[c] -= u * (o && g ? -1 : 1);
      break;
    case 'end':
      a[c] += u * (o && g ? -1 : 1);
  }
  return a;
}
const Mt = async (t, e, o) => {
  const { placement: n = 'bottom', strategy: r = 'absolute', middleware: i = [], platform: s } = o,
    c = i.filter(Boolean),
    l = await (s.isRTL == null ? void 0 : s.isRTL(e));
  let u = await s.getElementRects({ reference: t, floating: e, strategy: r }),
    { x: g, y: a } = yt(u, n, l),
    m = n,
    h = {},
    f = 0;
  for (let d = 0; d < c.length; d++) {
    const { name: p, fn: y } = c[d],
      {
        x,
        y: w,
        data: b,
        reset: v,
      } = await y({
        x: g,
        y: a,
        initialPlacement: n,
        placement: m,
        strategy: r,
        middlewareData: h,
        rects: u,
        platform: s,
        elements: { reference: t, floating: e },
      });
    (g = x ?? g),
      (a = w ?? a),
      (h = { ...h, [p]: { ...h[p], ...b } }),
      v &&
        f <= 50 &&
        (f++,
        typeof v == 'object' &&
          (v.placement && (m = v.placement),
          v.rects &&
            (u = v.rects === !0 ? await s.getElementRects({ reference: t, floating: e, strategy: r }) : v.rects),
          ({ x: g, y: a } = yt(u, m, l))),
        (d = -1));
  }
  return { x: g, y: a, placement: m, strategy: r, middlewareData: h };
};
function B(t, e) {
  return typeof t == 'function' ? t(e) : t;
}
function dt(t) {
  return typeof t != 'number'
    ? (function (e) {
        return { top: 0, right: 0, bottom: 0, left: 0, ...e };
      })(t)
    : { top: t, right: t, bottom: t, left: t };
}
function J(t) {
  return { ...t, top: t.y, left: t.x, right: t.x + t.width, bottom: t.y + t.height };
}
async function K(t, e) {
  var o;
  e === void 0 && (e = {});
  const { x: n, y: r, platform: i, rects: s, elements: c, strategy: l } = t,
    {
      boundary: u = 'clippingAncestors',
      rootBoundary: g = 'viewport',
      elementContext: a = 'floating',
      altBoundary: m = !1,
      padding: h = 0,
    } = B(e, t),
    f = dt(h),
    d = c[m ? (a === 'floating' ? 'reference' : 'floating') : a],
    p = J(
      await i.getClippingRect({
        element:
          (o = await (i.isElement == null ? void 0 : i.isElement(d))) == null || o
            ? d
            : d.contextElement || (await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(c.floating))),
        boundary: u,
        rootBoundary: g,
        strategy: l,
      })
    ),
    y = a === 'floating' ? { ...s.floating, x: n, y: r } : s.reference,
    x = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(c.floating)),
    w = ((await (i.isElement == null ? void 0 : i.isElement(x))) &&
      (await (i.getScale == null ? void 0 : i.getScale(x)))) || { x: 1, y: 1 },
    b = J(
      i.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({ rect: y, offsetParent: x, strategy: l })
        : y
    );
  return {
    top: (p.top - b.top + f.top) / w.y,
    bottom: (b.bottom - p.bottom + f.bottom) / w.y,
    left: (p.left - b.left + f.left) / w.x,
    right: (b.right - p.right + f.right) / w.x,
  };
}
const q = Math.min,
  M = Math.max;
function ct(t, e, o) {
  return M(t, q(e, o));
}
const Yt = (t) => ({
    name: 'arrow',
    options: t,
    async fn(e) {
      const { x: o, y: n, placement: r, rects: i, platform: s, elements: c } = e,
        { element: l, padding: u = 0 } = B(t, e) || {};
      if (l == null) return {};
      const g = dt(u),
        a = { x: o, y: n },
        m = _(r),
        h = ut(m),
        f = await s.getDimensions(l),
        d = m === 'y',
        p = d ? 'top' : 'left',
        y = d ? 'bottom' : 'right',
        x = d ? 'clientHeight' : 'clientWidth',
        w = i.reference[h] + i.reference[m] - a[m] - i.floating[h],
        b = a[m] - i.reference[m],
        v = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(l));
      let R = v ? v[x] : 0;
      (R && (await (s.isElement == null ? void 0 : s.isElement(v)))) || (R = c.floating[x] || i.floating[h]);
      const $ = w / 2 - b / 2,
        P = R / 2 - f[h] / 2 - 1,
        D = q(g[p], P),
        L = q(g[y], P),
        A = D,
        E = R - f[h] - L,
        T = R / 2 - f[h] / 2 + $,
        O = ct(A, T, E),
        C = H(r) != null && T != O && i.reference[h] / 2 - (T < A ? D : L) - f[h] / 2 < 0 ? (T < A ? A - T : E - T) : 0;
      return { [m]: a[m] - C, data: { [m]: O, centerOffset: T - O + C } };
    },
  }),
  Et = ['top', 'right', 'bottom', 'left'],
  wt = Et.reduce((t, e) => t.concat(e, e + '-start', e + '-end'), []),
  Vt = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
function nt(t) {
  return t.replace(/left|right|bottom|top/g, (e) => Vt[e]);
}
function $t(t, e, o) {
  o === void 0 && (o = !1);
  const n = H(t),
    r = _(t),
    i = ut(r);
  let s = r === 'x' ? (n === (o ? 'end' : 'start') ? 'right' : 'left') : n === 'start' ? 'bottom' : 'top';
  return e.reference[i] > e.floating[i] && (s = nt(s)), { main: s, cross: nt(s) };
}
const zt = { start: 'end', end: 'start' };
function et(t) {
  return t.replace(/start|end/g, (e) => zt[e]);
}
const _t = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'autoPlacement',
        options: t,
        async fn(e) {
          var o, n, r;
          const { rects: i, middlewareData: s, placement: c, platform: l, elements: u } = e,
            { crossAxis: g = !1, alignment: a, allowedPlacements: m = wt, autoAlignment: h = !0, ...f } = B(t, e),
            d =
              a !== void 0 || m === wt
                ? (function (L, A, E) {
                    return (
                      L ? [...E.filter((T) => H(T) === L), ...E.filter((T) => H(T) !== L)] : E.filter((T) => F(T) === T)
                    ).filter((T) => !L || H(T) === L || (!!A && et(T) !== T));
                  })(a || null, h, m)
                : m,
            p = await K(e, f),
            y = ((o = s.autoPlacement) == null ? void 0 : o.index) || 0,
            x = d[y];
          if (x == null) return {};
          const { main: w, cross: b } = $t(x, i, await (l.isRTL == null ? void 0 : l.isRTL(u.floating)));
          if (c !== x) return { reset: { placement: d[0] } };
          const v = [p[F(x)], p[w], p[b]],
            R = [...(((n = s.autoPlacement) == null ? void 0 : n.overflows) || []), { placement: x, overflows: v }],
            $ = d[y + 1];
          if ($) return { data: { index: y + 1, overflows: R }, reset: { placement: $ } };
          const P = R.map((L) => {
              const A = H(L.placement);
              return [
                L.placement,
                A && g ? L.overflows.slice(0, 2).reduce((E, T) => E + T, 0) : L.overflows[0],
                L.overflows,
              ];
            }).sort((L, A) => L[1] - A[1]),
            D =
              ((r = P.filter((L) => L[2].slice(0, H(L[0]) ? 2 : 3).every((A) => A <= 0))[0]) == null ? void 0 : r[0]) ||
              P[0][0];
          return D !== c ? { data: { index: y + 1, overflows: R }, reset: { placement: D } } : {};
        },
      }
    );
  },
  jt = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'flip',
        options: t,
        async fn(e) {
          var o;
          const { placement: n, middlewareData: r, rects: i, initialPlacement: s, platform: c, elements: l } = e,
            {
              mainAxis: u = !0,
              crossAxis: g = !0,
              fallbackPlacements: a,
              fallbackStrategy: m = 'bestFit',
              fallbackAxisSideDirection: h = 'none',
              flipAlignment: f = !0,
              ...d
            } = B(t, e),
            p = F(n),
            y = F(s) === s,
            x = await (c.isRTL == null ? void 0 : c.isRTL(l.floating)),
            w =
              a ||
              (y || !f
                ? [nt(s)]
                : (function (A) {
                    const E = nt(A);
                    return [et(A), E, et(E)];
                  })(s));
          a ||
            h === 'none' ||
            w.push(
              ...(function (A, E, T, O) {
                const C = H(A);
                let S = (function (z, st, Ht) {
                  const pt = ['left', 'right'],
                    gt = ['right', 'left'],
                    Bt = ['top', 'bottom'],
                    Wt = ['bottom', 'top'];
                  switch (z) {
                    case 'top':
                    case 'bottom':
                      return Ht ? (st ? gt : pt) : st ? pt : gt;
                    case 'left':
                    case 'right':
                      return st ? Bt : Wt;
                    default:
                      return [];
                  }
                })(F(A), T === 'start', O);
                return C && ((S = S.map((z) => z + '-' + C)), E && (S = S.concat(S.map(et)))), S;
              })(s, f, h, x)
            );
          const b = [s, ...w],
            v = await K(e, d),
            R = [];
          let $ = ((o = r.flip) == null ? void 0 : o.overflows) || [];
          if ((u && R.push(v[p]), g)) {
            const { main: A, cross: E } = $t(n, i, x);
            R.push(v[A], v[E]);
          }
          if ((($ = [...$, { placement: n, overflows: R }]), !R.every((A) => A <= 0))) {
            var P, D;
            const A = (((P = r.flip) == null ? void 0 : P.index) || 0) + 1,
              E = b[A];
            if (E) return { data: { index: A, overflows: $ }, reset: { placement: E } };
            let T =
              (D = $.filter((O) => O.overflows[0] <= 0).sort((O, C) => O.overflows[1] - C.overflows[1])[0]) == null
                ? void 0
                : D.placement;
            if (!T)
              switch (m) {
                case 'bestFit': {
                  var L;
                  const O =
                    (L = $.map((C) => [C.placement, C.overflows.filter((S) => S > 0).reduce((S, z) => S + z, 0)]).sort(
                      (C, S) => C[1] - S[1]
                    )[0]) == null
                      ? void 0
                      : L[0];
                  O && (T = O);
                  break;
                }
                case 'initialPlacement':
                  T = s;
              }
            if (n !== T) return { reset: { placement: T } };
          }
          return {};
        },
      }
    );
  };
function xt(t, e) {
  return { top: t.top - e.height, right: t.right - e.width, bottom: t.bottom - e.height, left: t.left - e.width };
}
function vt(t) {
  return Et.some((e) => t[e] >= 0);
}
const Ut = function (t) {
  return (
    t === void 0 && (t = {}),
    {
      name: 'hide',
      options: t,
      async fn(e) {
        const { rects: o } = e,
          { strategy: n = 'referenceHidden', ...r } = B(t, e);
        switch (n) {
          case 'referenceHidden': {
            const i = xt(await K(e, { ...r, elementContext: 'reference' }), o.reference);
            return { data: { referenceHiddenOffsets: i, referenceHidden: vt(i) } };
          }
          case 'escaped': {
            const i = xt(await K(e, { ...r, altBoundary: !0 }), o.floating);
            return { data: { escapedOffsets: i, escaped: vt(i) } };
          }
          default:
            return {};
        }
      },
    }
  );
};
function bt(t) {
  const e = q(...t.map((n) => n.left)),
    o = q(...t.map((n) => n.top));
  return { x: e, y: o, width: M(...t.map((n) => n.right)) - e, height: M(...t.map((n) => n.bottom)) - o };
}
const Gt = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'inline',
        options: t,
        async fn(e) {
          const { placement: o, elements: n, rects: r, platform: i, strategy: s } = e,
            { padding: c = 2, x: l, y: u } = B(t, e),
            g = Array.from((await (i.getClientRects == null ? void 0 : i.getClientRects(n.reference))) || []),
            a = (function (d) {
              const p = d.slice().sort((w, b) => w.y - b.y),
                y = [];
              let x = null;
              for (let w = 0; w < p.length; w++) {
                const b = p[w];
                !x || b.y - x.y > x.height / 2 ? y.push([b]) : y[y.length - 1].push(b), (x = b);
              }
              return y.map((w) => J(bt(w)));
            })(g),
            m = J(bt(g)),
            h = dt(c),
            f = await i.getElementRects({
              reference: {
                getBoundingClientRect: function () {
                  if (a.length === 2 && a[0].left > a[1].right && l != null && u != null)
                    return (
                      a.find(
                        (d) =>
                          l > d.left - h.left && l < d.right + h.right && u > d.top - h.top && u < d.bottom + h.bottom
                      ) || m
                    );
                  if (a.length >= 2) {
                    if (_(o) === 'x') {
                      const v = a[0],
                        R = a[a.length - 1],
                        $ = F(o) === 'top',
                        P = v.top,
                        D = R.bottom,
                        L = $ ? v.left : R.left,
                        A = $ ? v.right : R.right;
                      return { top: P, bottom: D, left: L, right: A, width: A - L, height: D - P, x: L, y: P };
                    }
                    const d = F(o) === 'left',
                      p = M(...a.map((v) => v.right)),
                      y = q(...a.map((v) => v.left)),
                      x = a.filter((v) => (d ? v.left === y : v.right === p)),
                      w = x[0].top,
                      b = x[x.length - 1].bottom;
                    return { top: w, bottom: b, left: y, right: p, width: p - y, height: b - w, x: y, y: w };
                  }
                  return m;
                },
              },
              floating: n.floating,
              strategy: s,
            });
          return r.reference.x !== f.reference.x ||
            r.reference.y !== f.reference.y ||
            r.reference.width !== f.reference.width ||
            r.reference.height !== f.reference.height
            ? { reset: { rects: f } }
            : {};
        },
      }
    );
  },
  Jt = function (t) {
    return (
      t === void 0 && (t = 0),
      {
        name: 'offset',
        options: t,
        async fn(e) {
          const { x: o, y: n } = e,
            r = await (async function (i, s) {
              const { placement: c, platform: l, elements: u } = i,
                g = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)),
                a = F(c),
                m = H(c),
                h = _(c) === 'x',
                f = ['left', 'top'].includes(a) ? -1 : 1,
                d = g && h ? -1 : 1,
                p = B(s, i);
              let {
                mainAxis: y,
                crossAxis: x,
                alignmentAxis: w,
              } = typeof p == 'number'
                ? { mainAxis: p, crossAxis: 0, alignmentAxis: null }
                : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...p };
              return (
                m && typeof w == 'number' && (x = m === 'end' ? -1 * w : w),
                h ? { x: x * d, y: y * f } : { x: y * f, y: x * d }
              );
            })(e, t);
          return { x: o + r.x, y: n + r.y, data: r };
        },
      }
    );
  };
function Pt(t) {
  return t === 'x' ? 'y' : 'x';
}
const Kt = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'shift',
        options: t,
        async fn(e) {
          const { x: o, y: n, placement: r } = e,
            {
              mainAxis: i = !0,
              crossAxis: s = !1,
              limiter: c = {
                fn: (p) => {
                  let { x: y, y: x } = p;
                  return { x: y, y: x };
                },
              },
              ...l
            } = B(t, e),
            u = { x: o, y: n },
            g = await K(e, l),
            a = _(F(r)),
            m = Pt(a);
          let h = u[a],
            f = u[m];
          if (i) {
            const p = a === 'y' ? 'bottom' : 'right';
            h = ct(h + g[a === 'y' ? 'top' : 'left'], h, h - g[p]);
          }
          if (s) {
            const p = m === 'y' ? 'bottom' : 'right';
            f = ct(f + g[m === 'y' ? 'top' : 'left'], f, f - g[p]);
          }
          const d = c.fn({ ...e, [a]: h, [m]: f });
          return { ...d, data: { x: d.x - o, y: d.y - n } };
        },
      }
    );
  },
  Qt = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        options: t,
        fn(e) {
          const { x: o, y: n, placement: r, rects: i, middlewareData: s } = e,
            { offset: c = 0, mainAxis: l = !0, crossAxis: u = !0 } = B(t, e),
            g = { x: o, y: n },
            a = _(r),
            m = Pt(a);
          let h = g[a],
            f = g[m];
          const d = B(c, e),
            p = typeof d == 'number' ? { mainAxis: d, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...d };
          if (l) {
            const w = a === 'y' ? 'height' : 'width',
              b = i.reference[a] - i.floating[w] + p.mainAxis,
              v = i.reference[a] + i.reference[w] - p.mainAxis;
            h < b ? (h = b) : h > v && (h = v);
          }
          if (u) {
            var y, x;
            const w = a === 'y' ? 'width' : 'height',
              b = ['top', 'left'].includes(F(r)),
              v =
                i.reference[m] -
                i.floating[w] +
                ((b && ((y = s.offset) == null ? void 0 : y[m])) || 0) +
                (b ? 0 : p.crossAxis),
              R =
                i.reference[m] +
                i.reference[w] +
                (b ? 0 : ((x = s.offset) == null ? void 0 : x[m]) || 0) -
                (b ? p.crossAxis : 0);
            f < v ? (f = v) : f > R && (f = R);
          }
          return { [a]: h, [m]: f };
        },
      }
    );
  },
  Zt = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'size',
        options: t,
        async fn(e) {
          const { placement: o, rects: n, platform: r, elements: i } = e,
            { apply: s = () => {}, ...c } = B(t, e),
            l = await K(e, c),
            u = F(o),
            g = H(o),
            a = _(o) === 'x',
            { width: m, height: h } = n.floating;
          let f, d;
          u === 'top' || u === 'bottom'
            ? ((f = u),
              (d =
                g === ((await (r.isRTL == null ? void 0 : r.isRTL(i.floating))) ? 'start' : 'end') ? 'left' : 'right'))
            : ((d = u), (f = g === 'end' ? 'top' : 'bottom'));
          const p = h - l[f],
            y = m - l[d],
            x = !e.middlewareData.shift;
          let w = p,
            b = y;
          if (a) {
            const R = m - l.left - l.right;
            b = g || x ? q(y, R) : R;
          } else {
            const R = h - l.top - l.bottom;
            w = g || x ? q(p, R) : R;
          }
          if (x && !g) {
            const R = M(l.left, 0),
              $ = M(l.right, 0),
              P = M(l.top, 0),
              D = M(l.bottom, 0);
            a
              ? (b = m - 2 * (R !== 0 || $ !== 0 ? R + $ : M(l.left, l.right)))
              : (w = h - 2 * (P !== 0 || D !== 0 ? P + D : M(l.top, l.bottom)));
          }
          await s({ ...e, availableWidth: b, availableHeight: w });
          const v = await r.getDimensions(i.floating);
          return m !== v.width || h !== v.height ? { reset: { rects: !0 } } : {};
        },
      }
    );
  };
function k(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function V(t) {
  return k(t).getComputedStyle(t);
}
function Dt(t) {
  return t instanceof k(t).Node;
}
function X(t) {
  return Dt(t) ? (t.nodeName || '').toLowerCase() : '#document';
}
function W(t) {
  return t instanceof k(t).HTMLElement;
}
function Rt(t) {
  return typeof ShadowRoot < 'u' && (t instanceof k(t).ShadowRoot || t instanceof ShadowRoot);
}
function Z(t) {
  const { overflow: e, overflowX: o, overflowY: n, display: r } = V(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + n + o) && !['inline', 'contents'].includes(r);
}
function Nt(t) {
  return ['table', 'td', 'th'].includes(X(t));
}
function at(t) {
  const e = mt(),
    o = V(t);
  return (
    o.transform !== 'none' ||
    o.perspective !== 'none' ||
    (!!o.containerType && o.containerType !== 'normal') ||
    (!e && !!o.backdropFilter && o.backdropFilter !== 'none') ||
    (!e && !!o.filter && o.filter !== 'none') ||
    ['transform', 'perspective', 'filter'].some((n) => (o.willChange || '').includes(n)) ||
    ['paint', 'layout', 'strict', 'content'].some((n) => (o.contain || '').includes(n))
  );
}
function mt() {
  return !(typeof CSS > 'u' || !CSS.supports) && CSS.supports('-webkit-backdrop-filter', 'none');
}
function rt(t) {
  return ['html', 'body', '#document'].includes(X(t));
}
const ft = Math.min,
  U = Math.max,
  ot = Math.round,
  tt = Math.floor,
  Y = (t) => ({ x: t, y: t });
function Ot(t) {
  const e = V(t);
  let o = parseFloat(e.width) || 0,
    n = parseFloat(e.height) || 0;
  const r = W(t),
    i = r ? t.offsetWidth : o,
    s = r ? t.offsetHeight : n,
    c = ot(o) !== i || ot(n) !== s;
  return c && ((o = i), (n = s)), { width: o, height: n, $: c };
}
function N(t) {
  return t instanceof k(t).Element;
}
function ht(t) {
  return N(t) ? t : t.contextElement;
}
function G(t) {
  const e = ht(t);
  if (!W(e)) return Y(1);
  const o = e.getBoundingClientRect(),
    { width: n, height: r, $: i } = Ot(e);
  let s = (i ? ot(o.width) : o.width) / n,
    c = (i ? ot(o.height) : o.height) / r;
  return (s && Number.isFinite(s)) || (s = 1), (c && Number.isFinite(c)) || (c = 1), { x: s, y: c };
}
const It = Y(0);
function Ct(t) {
  const e = k(t);
  return mt() && e.visualViewport ? { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop } : It;
}
function j(t, e, o, n) {
  e === void 0 && (e = !1), o === void 0 && (o = !1);
  const r = t.getBoundingClientRect(),
    i = ht(t);
  let s = Y(1);
  e && (n ? N(n) && (s = G(n)) : (s = G(t)));
  const c = (function (m, h, f) {
    return h === void 0 && (h = !1), !(!f || (h && f !== k(m))) && h;
  })(i, o, n)
    ? Ct(i)
    : Y(0);
  let l = (r.left + c.x) / s.x,
    u = (r.top + c.y) / s.y,
    g = r.width / s.x,
    a = r.height / s.y;
  if (i) {
    const m = k(i),
      h = n && N(n) ? k(n) : n;
    let f = m.frameElement;
    for (; f && n && h !== m; ) {
      const d = G(f),
        p = f.getBoundingClientRect(),
        y = getComputedStyle(f),
        x = p.left + (f.clientLeft + parseFloat(y.paddingLeft)) * d.x,
        w = p.top + (f.clientTop + parseFloat(y.paddingTop)) * d.y;
      (l *= d.x), (u *= d.y), (g *= d.x), (a *= d.y), (l += x), (u += w), (f = k(f).frameElement);
    }
  }
  return J({ width: g, height: a, x: l, y: u });
}
function lt(t) {
  return N(t)
    ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
    : { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
}
function I(t) {
  return ((Dt(t) ? t.ownerDocument : t.document) || window.document).documentElement;
}
function St(t) {
  return j(I(t)).left + lt(t).scrollLeft;
}
function Q(t) {
  if (X(t) === 'html') return t;
  const e = t.assignedSlot || t.parentNode || (Rt(t) && t.host) || I(t);
  return Rt(e) ? e.host : e;
}
function kt(t) {
  const e = Q(t);
  return rt(e) ? (t.ownerDocument ? t.ownerDocument.body : t.body) : W(e) && Z(e) ? e : kt(e);
}
function it(t, e) {
  var o;
  e === void 0 && (e = []);
  const n = kt(t),
    r = n === ((o = t.ownerDocument) == null ? void 0 : o.body),
    i = k(n);
  return r ? e.concat(i, i.visualViewport || [], Z(n) ? n : []) : e.concat(n, it(n));
}
function At(t, e, o) {
  let n;
  if (e === 'viewport')
    n = (function (r, i) {
      const s = k(r),
        c = I(r),
        l = s.visualViewport;
      let u = c.clientWidth,
        g = c.clientHeight,
        a = 0,
        m = 0;
      if (l) {
        (u = l.width), (g = l.height);
        const h = mt();
        (!h || (h && i === 'fixed')) && ((a = l.offsetLeft), (m = l.offsetTop));
      }
      return { width: u, height: g, x: a, y: m };
    })(t, o);
  else if (e === 'document')
    n = (function (r) {
      const i = I(r),
        s = lt(r),
        c = r.ownerDocument.body,
        l = U(i.scrollWidth, i.clientWidth, c.scrollWidth, c.clientWidth),
        u = U(i.scrollHeight, i.clientHeight, c.scrollHeight, c.clientHeight);
      let g = -s.scrollLeft + St(r);
      const a = -s.scrollTop;
      return (
        V(c).direction === 'rtl' && (g += U(i.clientWidth, c.clientWidth) - l), { width: l, height: u, x: g, y: a }
      );
    })(I(t));
  else if (N(e))
    n = (function (r, i) {
      const s = j(r, !0, i === 'fixed'),
        c = s.top + r.clientTop,
        l = s.left + r.clientLeft,
        u = W(r) ? G(r) : Y(1);
      return { width: r.clientWidth * u.x, height: r.clientHeight * u.y, x: l * u.x, y: c * u.y };
    })(e, o);
  else {
    const r = Ct(t);
    n = { ...e, x: e.x - r.x, y: e.y - r.y };
  }
  return J(n);
}
function Ft(t, e) {
  const o = Q(t);
  return !(o === e || !N(o) || rt(o)) && (V(o).position === 'fixed' || Ft(o, e));
}
function qt(t, e, o) {
  const n = W(e),
    r = I(e),
    i = o === 'fixed',
    s = j(t, !0, i, e);
  let c = { scrollLeft: 0, scrollTop: 0 };
  const l = Y(0);
  if (n || (!n && !i))
    if (((X(e) !== 'body' || Z(r)) && (c = lt(e)), W(e))) {
      const u = j(e, !0, i, e);
      (l.x = u.x + e.clientLeft), (l.y = u.y + e.clientTop);
    } else r && (l.x = St(r));
  return { x: s.left + c.scrollLeft - l.x, y: s.top + c.scrollTop - l.y, width: s.width, height: s.height };
}
function Tt(t, e) {
  return W(t) && V(t).position !== 'fixed' ? (e ? e(t) : t.offsetParent) : null;
}
function Lt(t, e) {
  const o = k(t);
  if (!W(t)) return o;
  let n = Tt(t, e);
  for (; n && Nt(n) && V(n).position === 'static'; ) n = Tt(n, e);
  return n && (X(n) === 'html' || (X(n) === 'body' && V(n).position === 'static' && !at(n)))
    ? o
    : n ||
        (function (r) {
          let i = Q(r);
          for (; W(i) && !rt(i); ) {
            if (at(i)) return i;
            i = Q(i);
          }
          return null;
        })(t) ||
        o;
}
const Xt = {
  convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
    let { rect: e, offsetParent: o, strategy: n } = t;
    const r = W(o),
      i = I(o);
    if (o === i) return e;
    let s = { scrollLeft: 0, scrollTop: 0 },
      c = Y(1);
    const l = Y(0);
    if ((r || (!r && n !== 'fixed')) && ((X(o) !== 'body' || Z(i)) && (s = lt(o)), W(o))) {
      const u = j(o);
      (c = G(o)), (l.x = u.x + o.clientLeft), (l.y = u.y + o.clientTop);
    }
    return {
      width: e.width * c.x,
      height: e.height * c.y,
      x: e.x * c.x - s.scrollLeft * c.x + l.x,
      y: e.y * c.y - s.scrollTop * c.y + l.y,
    };
  },
  getDocumentElement: I,
  getClippingRect: function (t) {
    let { element: e, boundary: o, rootBoundary: n, strategy: r } = t;
    const i = [
        ...(o === 'clippingAncestors'
          ? (function (l, u) {
              const g = u.get(l);
              if (g) return g;
              let a = it(l).filter((d) => N(d) && X(d) !== 'body'),
                m = null;
              const h = V(l).position === 'fixed';
              let f = h ? Q(l) : l;
              for (; N(f) && !rt(f); ) {
                const d = V(f),
                  p = at(f);
                p || d.position !== 'fixed' || (m = null),
                  (
                    h
                      ? !p && !m
                      : (!p && d.position === 'static' && m && ['absolute', 'fixed'].includes(m.position)) ||
                        (Z(f) && !p && Ft(l, f))
                  )
                    ? (a = a.filter((y) => y !== f))
                    : (m = d),
                  (f = Q(f));
              }
              return u.set(l, a), a;
            })(e, this._c)
          : [].concat(o)),
        n,
      ],
      s = i[0],
      c = i.reduce((l, u) => {
        const g = At(e, u, r);
        return (
          (l.top = U(g.top, l.top)),
          (l.right = ft(g.right, l.right)),
          (l.bottom = ft(g.bottom, l.bottom)),
          (l.left = U(g.left, l.left)),
          l
        );
      }, At(e, s, r));
    return { width: c.right - c.left, height: c.bottom - c.top, x: c.left, y: c.top };
  },
  getOffsetParent: Lt,
  getElementRects: async function (t) {
    let { reference: e, floating: o, strategy: n } = t;
    const r = this.getOffsetParent || Lt,
      i = this.getDimensions;
    return { reference: qt(e, await r(o), n), floating: { x: 0, y: 0, ...(await i(o)) } };
  },
  getClientRects: function (t) {
    return Array.from(t.getClientRects());
  },
  getDimensions: function (t) {
    return Ot(t);
  },
  getScale: G,
  isElement: N,
  isRTL: function (t) {
    return getComputedStyle(t).direction === 'rtl';
  },
};
function te(t, e, o, n) {
  n === void 0 && (n = {});
  const {
      ancestorScroll: r = !0,
      ancestorResize: i = !0,
      elementResize: s = typeof ResizeObserver == 'function',
      layoutShift: c = typeof IntersectionObserver == 'function',
      animationFrame: l = !1,
    } = n,
    u = ht(t),
    g = r || i ? [...(u ? it(u) : []), ...it(e)] : [];
  g.forEach((p) => {
    r && p.addEventListener('scroll', o, { passive: !0 }), i && p.addEventListener('resize', o);
  });
  const a =
    u && c
      ? (function (p, y) {
          let x,
            w = null;
          const b = I(p);
          function v() {
            clearTimeout(x), w && w.disconnect(), (w = null);
          }
          return (
            (function R($, P) {
              $ === void 0 && ($ = !1), P === void 0 && (P = 1), v();
              const { left: D, top: L, width: A, height: E } = p.getBoundingClientRect();
              if (($ || y(), !A || !E)) return;
              const T = {
                rootMargin:
                  -tt(L) +
                  'px ' +
                  -tt(b.clientWidth - (D + A)) +
                  'px ' +
                  -tt(b.clientHeight - (L + E)) +
                  'px ' +
                  -tt(D) +
                  'px',
                threshold: U(0, ft(1, P)) || 1,
              };
              let O = !0;
              function C(S) {
                const z = S[0].intersectionRatio;
                if (z !== P) {
                  if (!O) return R();
                  z
                    ? R(!1, z)
                    : (x = setTimeout(() => {
                        R(!1, 1e-7);
                      }, 100));
                }
                O = !1;
              }
              try {
                w = new IntersectionObserver(C, { ...T, root: b.ownerDocument });
              } catch {
                w = new IntersectionObserver(C, T);
              }
              w.observe(p);
            })(!0),
            v
          );
        })(u, o)
      : null;
  let m,
    h = -1,
    f = null;
  s &&
    ((f = new ResizeObserver((p) => {
      let [y] = p;
      y &&
        y.target === u &&
        f &&
        (f.unobserve(e),
        cancelAnimationFrame(h),
        (h = requestAnimationFrame(() => {
          f && f.observe(e);
        }))),
        o();
    })),
    u && !l && f.observe(u),
    f.observe(e));
  let d = l ? j(t) : null;
  return (
    l &&
      (function p() {
        const y = j(t);
        !d || (y.x === d.x && y.y === d.y && y.width === d.width && y.height === d.height) || o(),
          (d = y),
          (m = requestAnimationFrame(p));
      })(),
    o(),
    () => {
      g.forEach((p) => {
        r && p.removeEventListener('scroll', o), i && p.removeEventListener('resize', o);
      }),
        a && a(),
        f && f.disconnect(),
        (f = null),
        l && cancelAnimationFrame(m);
    }
  );
}
const ee = (t, e, o) => {
  const n = new Map(),
    r = { platform: Xt, ...o },
    i = { ...r.platform, _c: n };
  return Mt(t, e, { ...r, platform: i });
};
export {
  Yt as arrow,
  _t as autoPlacement,
  te as autoUpdate,
  ee as computePosition,
  K as detectOverflow,
  jt as flip,
  it as getOverflowAncestors,
  Ut as hide,
  Gt as inline,
  Qt as limitShift,
  Jt as offset,
  Xt as platform,
  Kt as shift,
  Zt as size,
};
