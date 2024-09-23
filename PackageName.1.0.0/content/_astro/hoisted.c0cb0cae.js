const Zt = 'modulepreload',
  te = function (t) {
    return '/' + t;
  },
  lt = {},
  $ = function (t, e, n) {
    if (!e || 0 === e.length) return t();
    const o = document.getElementsByTagName('link');
    return Promise.all(
      e.map((t) => {
        if ((t = te(t)) in lt) return;
        lt[t] = !0;
        const e = t.endsWith('.css'),
          i = e ? '[rel="stylesheet"]' : '';
        if (n)
          for (let n = o.length - 1; n >= 0; n--) {
            const i = o[n];
            if (i.href === t && (!e || 'stylesheet' === i.rel)) return;
          }
        else if (document.querySelector(`link[href="${t}"]${i}`)) return;
        const r = document.createElement('link');
        return (
          (r.rel = e ? 'stylesheet' : Zt),
          e || ((r.as = 'script'), (r.crossOrigin = '')),
          (r.href = t),
          document.head.appendChild(r),
          e
            ? new Promise((e, n) => {
                r.addEventListener('load', e),
                  r.addEventListener('error', () => n(new Error(`Unable to preload CSS for ${t}`)));
              })
            : void 0
        );
      })
    )
      .then(() => t())
      .catch((t) => {
        const e = new Event('vite:preloadError', { cancelable: !0 });
        if (((e.payload = t), window.dispatchEvent(e), !e.defaultPrevented)) throw t;
      });
  },
  ut = [...document.querySelectorAll('[data-tooltip]')];
ut.length > 0 &&
  Promise.all([
    $(() => import('./floating-ui.dom.browser.min.091e4558.js'), []),
    $(() => import('./index.browser.2a4e3170.js'), []),
  ]).then(([t, { nanoid: e }]) => {
    const { autoUpdate: n, computePosition: o, flip: i, offset: r, shift: s } = t;
    ((t) => {
      const n = document.createElement('div'),
        o = t.map((t) => {
          const o = ((t) => {
            const n = document.createElement('div');
            return (
              (n.innerText = t),
              n.setAttribute('id', `tooltip-${e(8)}`),
              n.setAttribute(
                'class',
                'absolute top-0 left-0 hidden max-w-sm animate-show rounded-lg bg-gray-700 px-3 py-1 text-white dark:bg-gray-100 dark:text-gray-800 sm:max-w-xs'
              ),
              n.setAttribute('role', 'tooltip'),
              n
            );
          })(t.dataset.tooltip ?? '');
          return n.appendChild(o), { tooltip: o, element: t };
        });
      return document.body.appendChild(n), o;
    })(ut).forEach(({ element: t, tooltip: e }) => {
      const c = (
        ({ element: t, tooltip: e, placement: n }) =>
        () => {
          o(t, e, { placement: n, middleware: [r(8), i(), s({ padding: 8 })] }).then(({ x: t, y: n }) => {
            Object.assign(e.style, { left: `${t}px`, top: `${n}px` });
          });
        }
      )({ element: t, tooltip: e, placement: t.dataset.tooltipPlacement ?? 'top' });
      t.setAttribute('aria-describedby', e.id),
        n(t, e, c),
        ((t, e, n) => {
          t.addEventListener('mouseenter', () => {
            (e.style.display = 'block'), n();
          }),
            t.addEventListener('mouseleave', () => {
              e.style.display = '';
            });
        })(t, e, c);
    });
  });
const ee = typeof window > 'u',
  ne = () =>
    ee
      ? ''
      : window.location.hash
      ? window.location.hash
      : window.firstVisibleSectionSlug
      ? `#${window.firstVisibleSectionSlug}`
      : '',
  oe = () => {
    let t = ne();
    const e = [];
    return {
      getHash: () => t,
      subscribe: (t) => {
        e.push(t);
      },
      updateHash: (n) => {
        const o = n.includes('#') ? n : `#${n}`;
        o !== t &&
          ((t = o.includes('#') ? o : `#${o}`),
          window.history.replaceState(null, '', `${window.location.pathname}${t}`),
          e.forEach((e) => e(t)));
      },
    };
  },
  ot = oe(),
  re = [...document.getElementById('sidebar').children],
  _t = (t) => {
    re.forEach((e) => {
      e.href.endsWith(t) ? e.setAttribute('aria-current', 'page') : e.removeAttribute('aria-current');
    });
  };
_t(ot.getHash()), ot.subscribe(_t);
const ie = document.getElementById('theme-toggle'),
  se = () => {
    const t = 'light' === (localStorage.getItem('theme') ?? 'light') ? 'dark' : 'light',
      e = document.getElementsByName('theme-color');
    e[0] && (e[0].content = 'dark' === t ? '#1a202c' : '#ffffff'),
      document.documentElement.classList['dark' === t ? 'add' : 'remove']('dark'),
      localStorage.setItem('theme', t);
  };
ie.addEventListener('click', se);
const Pt = Object.freeze({ left: 0, top: 0, width: 16, height: 16 }),
  D = Object.freeze({ rotate: 0, vFlip: !1, hFlip: !1 }),
  O = Object.freeze({ ...Pt, ...D }),
  J = Object.freeze({ ...O, body: '', hidden: !1 }),
  ce = Object.freeze({ width: null, height: null }),
  Ot = Object.freeze({ ...ce, ...D });
function ae(t, e = 0) {
  const n = t.replace(/^-?[0-9.]*/, '');
  function o(t) {
    for (; t < 0; ) t += 4;
    return t % 4;
  }
  if ('' === n) {
    const e = parseInt(t);
    return isNaN(e) ? 0 : o(e);
  }
  if (n !== t) {
    let e = 0;
    switch (n) {
      case '%':
        e = 25;
        break;
      case 'deg':
        e = 90;
    }
    if (e) {
      let i = parseFloat(t.slice(0, t.length - n.length));
      return isNaN(i) ? 0 : ((i /= e), i % 1 == 0 ? o(i) : 0);
    }
  }
  return e;
}
const le = /[\s,]+/;
function ue(t, e) {
  e.split(le).forEach((e) => {
    switch (e.trim()) {
      case 'horizontal':
        t.hFlip = !0;
        break;
      case 'vertical':
        t.vFlip = !0;
    }
  });
}
const jt = { ...Ot, preserveAspectRatio: '' };
function ft(t) {
  const e = { ...jt },
    n = (e, n) => t.getAttribute(e) || n;
  return (
    (e.width = n('width', null)),
    (e.height = n('height', null)),
    (e.rotate = ae(n('rotate', ''))),
    ue(e, n('flip', '')),
    (e.preserveAspectRatio = n('preserveAspectRatio', n('preserveaspectratio', ''))),
    e
  );
}
function fe(t, e) {
  for (const n in jt) if (t[n] !== e[n]) return !0;
  return !1;
}
const k = /^[a-z0-9]+(-[a-z0-9]+)*$/,
  j = (t, e, n, o = '') => {
    const i = t.split(':');
    if ('@' === t.slice(0, 1)) {
      if (i.length < 2 || i.length > 3) return null;
      o = i.shift().slice(1);
    }
    if (i.length > 3 || !i.length) return null;
    if (i.length > 1) {
      const t = i.pop(),
        n = i.pop(),
        r = { provider: i.length > 0 ? i[0] : o, prefix: n, name: t };
      return e && !N(r) ? null : r;
    }
    const r = i[0],
      s = r.split('-');
    if (s.length > 1) {
      const t = { provider: o, prefix: s.shift(), name: s.join('-') };
      return e && !N(t) ? null : t;
    }
    if (n && '' === o) {
      const t = { provider: o, prefix: '', name: r };
      return e && !N(t, n) ? null : t;
    }
    return null;
  },
  N = (t, e) =>
    !!t &&
    !(
      ('' !== t.provider && !t.provider.match(k)) ||
      !((e && '' === t.prefix) || t.prefix.match(k)) ||
      !t.name.match(k)
    );
function de(t, e) {
  const n = {};
  !t.hFlip != !e.hFlip && (n.hFlip = !0), !t.vFlip != !e.vFlip && (n.vFlip = !0);
  const o = ((t.rotate || 0) + (e.rotate || 0)) % 4;
  return o && (n.rotate = o), n;
}
function dt(t, e) {
  const n = de(t, e);
  for (const o in J) o in D ? o in t && !(o in n) && (n[o] = D[o]) : o in e ? (n[o] = e[o]) : o in t && (n[o] = t[o]);
  return n;
}
function he(t, e) {
  const n = t.icons,
    o = t.aliases || Object.create(null),
    i = Object.create(null);
  return (
    (e || Object.keys(n).concat(Object.keys(o))).forEach(function t(e) {
      if (n[e]) return (i[e] = []);
      if (!(e in i)) {
        i[e] = null;
        const n = o[e] && o[e].parent,
          r = n && t(n);
        r && (i[e] = [n].concat(r));
      }
      return i[e];
    }),
    i
  );
}
function pe(t, e, n) {
  const o = t.icons,
    i = t.aliases || Object.create(null);
  let r = {};
  function s(t) {
    r = dt(o[t] || i[t], r);
  }
  return s(e), n.forEach(s), dt(t, r);
}
function Lt(t, e) {
  const n = [];
  if ('object' != typeof t || 'object' != typeof t.icons) return n;
  t.not_found instanceof Array &&
    t.not_found.forEach((t) => {
      e(t, null), n.push(t);
    });
  const o = he(t);
  for (const i in o) {
    const r = o[i];
    r && (e(i, pe(t, i, r)), n.push(i));
  }
  return n;
}
const ge = { provider: '', aliases: {}, not_found: {}, ...Pt };
function U(t, e) {
  for (const n in e) if (n in t && typeof t[n] != typeof e[n]) return !1;
  return !0;
}
function Mt(t) {
  if ('object' != typeof t || null === t) return null;
  const e = t;
  if ('string' != typeof e.prefix || !t.icons || 'object' != typeof t.icons || !U(t, ge)) return null;
  const n = e.icons;
  for (const t in n) {
    const e = n[t];
    if (!t.match(k) || 'string' != typeof e.body || !U(e, J)) return null;
  }
  const o = e.aliases || Object.create(null);
  for (const t in o) {
    const e = o[t],
      i = e.parent;
    if (!t.match(k) || 'string' != typeof i || (!n[i] && !o[i]) || !U(e, J)) return null;
  }
  return e;
}
const H = Object.create(null);
function me(t, e) {
  return { provider: t, prefix: e, icons: Object.create(null), missing: new Set() };
}
function S(t, e) {
  const n = H[t] || (H[t] = Object.create(null));
  return n[e] || (n[e] = me(t, e));
}
function rt(t, e) {
  return Mt(e)
    ? Lt(e, (e, n) => {
        n ? (t.icons[e] = n) : t.missing.add(e);
      })
    : [];
}
function ye(t, e, n) {
  try {
    if ('string' == typeof n.body) return (t.icons[e] = { ...n }), !0;
  } catch {}
  return !1;
}
function be(t, e) {
  let n = [];
  return (
    ('string' == typeof t ? [t] : Object.keys(H)).forEach((t) => {
      ('string' == typeof t && 'string' == typeof e ? [e] : Object.keys(H[t] || {})).forEach((e) => {
        const o = S(t, e);
        n = n.concat(Object.keys(o.icons).map((n) => ('' !== t ? '@' + t + ':' : '') + e + ':' + n));
      });
    }),
    n
  );
}
let T = !1;
function Ft(t) {
  return 'boolean' == typeof t && (T = t), T;
}
function _(t) {
  const e = 'string' == typeof t ? j(t, !0, T) : t;
  if (e) {
    const t = S(e.provider, e.prefix),
      n = e.name;
    return t.icons[n] || (t.missing.has(n) ? null : void 0);
  }
}
function Nt(t, e) {
  const n = j(t, !0, T);
  if (!n) return !1;
  return ye(S(n.provider, n.prefix), n.name, e);
}
function ht(t, e) {
  if ('object' != typeof t) return !1;
  if (('string' != typeof e && (e = t.provider || ''), T && !e && !t.prefix)) {
    let e = !1;
    return (
      Mt(t) &&
        ((t.prefix = ''),
        Lt(t, (t, n) => {
          n && Nt(t, n) && (e = !0);
        })),
      e
    );
  }
  const n = t.prefix;
  if (!N({ provider: e, prefix: n, name: 'a' })) return !1;
  return !!rt(S(e, n), t);
}
function we(t) {
  return !!_(t);
}
function Ie(t) {
  const e = _(t);
  return e ? { ...O, ...e } : null;
}
function Se(t) {
  const e = { loaded: [], missing: [], pending: [] },
    n = Object.create(null);
  t.sort((t, e) =>
    t.provider !== e.provider
      ? t.provider.localeCompare(e.provider)
      : t.prefix !== e.prefix
      ? t.prefix.localeCompare(e.prefix)
      : t.name.localeCompare(e.name)
  );
  let o = { provider: '', prefix: '', name: '' };
  return (
    t.forEach((t) => {
      if (o.name === t.name && o.prefix === t.prefix && o.provider === t.provider) return;
      o = t;
      const i = t.provider,
        r = t.prefix,
        s = t.name,
        c = n[i] || (n[i] = Object.create(null)),
        a = c[r] || (c[r] = S(i, r));
      let l;
      l = s in a.icons ? e.loaded : '' === r || a.missing.has(s) ? e.missing : e.pending;
      const u = { provider: i, prefix: r, name: s };
      l.push(u);
    }),
    e
  );
}
function Rt(t, e) {
  t.forEach((t) => {
    const n = t.loaderCallbacks;
    n && (t.loaderCallbacks = n.filter((t) => t.id !== e));
  });
}
function xe(t) {
  t.pendingCallbacksFlag ||
    ((t.pendingCallbacksFlag = !0),
    setTimeout(() => {
      t.pendingCallbacksFlag = !1;
      const e = t.loaderCallbacks ? t.loaderCallbacks.slice(0) : [];
      if (!e.length) return;
      let n = !1;
      const o = t.provider,
        i = t.prefix;
      e.forEach((e) => {
        const r = e.icons,
          s = r.pending.length;
        (r.pending = r.pending.filter((e) => {
          if (e.prefix !== i) return !0;
          const s = e.name;
          if (t.icons[s]) r.loaded.push({ provider: o, prefix: i, name: s });
          else {
            if (!t.missing.has(s)) return (n = !0), !0;
            r.missing.push({ provider: o, prefix: i, name: s });
          }
          return !1;
        })),
          r.pending.length !== s &&
            (n || Rt([t], e.id), e.callback(r.loaded.slice(0), r.missing.slice(0), r.pending.slice(0), e.abort));
      });
    }));
}
let ve = 0;
function Ce(t, e, n) {
  const o = ve++,
    i = Rt.bind(null, n, o);
  if (!e.pending.length) return i;
  const r = { id: o, icons: e, callback: t, abort: i };
  return (
    n.forEach((t) => {
      (t.loaderCallbacks || (t.loaderCallbacks = [])).push(r);
    }),
    i
  );
}
const K = Object.create(null);
function pt(t, e) {
  K[t] = e;
}
function X(t) {
  return K[t] || K[''];
}
function Ee(t, e = !0, n = !1) {
  const o = [];
  return (
    t.forEach((t) => {
      const i = 'string' == typeof t ? j(t, e, n) : t;
      i && o.push(i);
    }),
    o
  );
}
var ke = { resources: [], index: 0, timeout: 2e3, rotate: 750, random: !1, dataAfterTimeout: !1 };
function Ae(t, e, n, o) {
  const i = t.resources.length,
    r = t.random ? Math.floor(Math.random() * i) : t.index;
  let s;
  if (t.random) {
    let e = t.resources.slice(0);
    for (s = []; e.length > 1; ) {
      const t = Math.floor(Math.random() * e.length);
      s.push(e[t]), (e = e.slice(0, t).concat(e.slice(t + 1)));
    }
    s = s.concat(e);
  } else s = t.resources.slice(r).concat(t.resources.slice(0, r));
  const c = Date.now();
  let a,
    l = 'pending',
    u = 0,
    d = null,
    f = [],
    h = [];
  function p() {
    d && (clearTimeout(d), (d = null));
  }
  function g() {
    'pending' === l && (l = 'aborted'),
      p(),
      f.forEach((t) => {
        'pending' === t.status && (t.status = 'aborted');
      }),
      (f = []);
  }
  function m(t, e) {
    e && (h = []), 'function' == typeof t && h.push(t);
  }
  function y() {
    (l = 'failed'),
      h.forEach((t) => {
        t(void 0, a);
      });
  }
  function b() {
    f.forEach((t) => {
      'pending' === t.status && (t.status = 'aborted');
    }),
      (f = []);
  }
  function v() {
    if ('pending' !== l) return;
    p();
    const o = s.shift();
    if (void 0 === o)
      return f.length
        ? void (d = setTimeout(() => {
            p(), 'pending' === l && (b(), y());
          }, t.timeout))
        : void y();
    const i = {
      status: 'pending',
      resource: o,
      callback: (e, n) => {
        !(function (e, n, o) {
          const i = 'success' !== n;
          switch (((f = f.filter((t) => t !== e)), l)) {
            case 'pending':
              break;
            case 'failed':
              if (i || !t.dataAfterTimeout) return;
              break;
            default:
              return;
          }
          if ('abort' === n) return (a = o), void y();
          if (i) return (a = o), void (f.length || (s.length ? v() : y()));
          if ((p(), b(), !t.random)) {
            const n = t.resources.indexOf(e.resource);
            -1 !== n && n !== t.index && (t.index = n);
          }
          (l = 'completed'),
            h.forEach((t) => {
              t(o);
            });
        })(i, e, n);
      },
    };
    f.push(i), u++, (d = setTimeout(v, t.rotate)), n(o, e, i.callback);
  }
  return (
    'function' == typeof o && h.push(o),
    setTimeout(v),
    function () {
      return { startTime: c, payload: e, status: l, queriesSent: u, queriesPending: f.length, subscribe: m, abort: g };
    }
  );
}
function $t(t) {
  const e = { ...ke, ...t };
  let n = [];
  function o() {
    n = n.filter((t) => 'pending' === t().status);
  }
  return {
    query: function (t, i, r) {
      const s = Ae(e, t, i, (t, e) => {
        o(), r && r(t, e);
      });
      return n.push(s), s;
    },
    find: function (t) {
      return n.find((e) => t(e)) || null;
    },
    setIndex: (t) => {
      e.index = t;
    },
    getIndex: () => e.index,
    cleanup: o,
  };
}
function it(t) {
  let e;
  if ('string' == typeof t.resources) e = [t.resources];
  else if (((e = t.resources), !(e instanceof Array && e.length))) return null;
  return {
    resources: e,
    path: t.path || '/',
    maxURL: t.maxURL || 500,
    rotate: t.rotate || 750,
    timeout: t.timeout || 5e3,
    random: !0 === t.random,
    index: t.index || 0,
    dataAfterTimeout: !1 !== t.dataAfterTimeout,
  };
}
const V = Object.create(null),
  E = ['https://api.simplesvg.com', 'https://api.unisvg.com'],
  R = [];
for (; E.length > 0; ) 1 === E.length || Math.random() > 0.5 ? R.push(E.shift()) : R.push(E.pop());
function gt(t, e) {
  const n = it(e);
  return null !== n && ((V[t] = n), !0);
}
function q(t) {
  return V[t];
}
function Te() {
  return Object.keys(V);
}
function mt() {}
V[''] = it({ resources: ['https://api.iconify.design'].concat(R) });
const z = Object.create(null);
function _e(t) {
  if (!z[t]) {
    const e = q(t);
    if (!e) return;
    const n = { config: e, redundancy: $t(e) };
    z[t] = n;
  }
  return z[t];
}
function Dt(t, e, n) {
  let o, i;
  if ('string' == typeof t) {
    const e = X(t);
    if (!e) return n(void 0, 424), mt;
    i = e.send;
    const r = _e(t);
    r && (o = r.redundancy);
  } else {
    const e = it(t);
    if (e) {
      o = $t(e);
      const n = X(t.resources ? t.resources[0] : '');
      n && (i = n.send);
    }
  }
  return o && i ? o.query(e, i, n)().abort : (n(void 0, 424), mt);
}
const yt = 'iconify2',
  P = 'iconify',
  Ht = P + '-count',
  bt = P + '-version',
  Bt = 36e5,
  Pe = 168;
function Y(t, e) {
  try {
    return t.getItem(e);
  } catch {}
}
function st(t, e, n) {
  try {
    return t.setItem(e, n), !0;
  } catch {}
}
function wt(t, e) {
  try {
    t.removeItem(e);
  } catch {}
}
function Z(t, e) {
  return st(t, Ht, e.toString());
}
function tt(t) {
  return parseInt(Y(t, Ht)) || 0;
}
const v = { local: !0, session: !0 },
  Vt = { local: new Set(), session: new Set() };
let ct = !1;
function Oe(t) {
  ct = t;
}
let F = typeof window > 'u' ? {} : window;
function qt(t) {
  const e = t + 'Storage';
  try {
    if (F && F[e] && 'number' == typeof F[e].length) return F[e];
  } catch {}
  v[t] = !1;
}
function Qt(t, e) {
  const n = qt(t);
  if (!n) return;
  const o = Y(n, bt);
  if (o !== yt) {
    if (o) {
      const t = tt(n);
      for (let e = 0; e < t; e++) wt(n, P + e.toString());
    }
    return st(n, bt, yt), void Z(n, 0);
  }
  const i = Math.floor(Date.now() / Bt) - Pe,
    r = (t) => {
      const o = P + t.toString(),
        r = Y(n, o);
      if ('string' == typeof r) {
        try {
          const n = JSON.parse(r);
          if (
            'object' == typeof n &&
            'number' == typeof n.cached &&
            n.cached > i &&
            'string' == typeof n.provider &&
            'object' == typeof n.data &&
            'string' == typeof n.data.prefix &&
            e(n, t)
          )
            return !0;
        } catch {}
        wt(n, o);
      }
    };
  let s = tt(n);
  for (let e = s - 1; e >= 0; e--) r(e) || (e === s - 1 ? (s--, Z(n, s)) : Vt[t].add(e));
}
function Ut() {
  if (!ct) {
    Oe(!0);
    for (const t in v)
      Qt(t, (t) => {
        const e = t.data,
          n = S(t.provider, e.prefix);
        if (!rt(n, e).length) return !1;
        const o = e.lastModified || -1;
        return (n.lastModifiedCached = n.lastModifiedCached ? Math.min(n.lastModifiedCached, o) : o), !0;
      });
  }
}
function je(t, e) {
  const n = t.lastModifiedCached;
  if (n && n >= e) return n === e;
  if (((t.lastModifiedCached = e), n))
    for (const n in v)
      Qt(n, (n) => {
        const o = n.data;
        return n.provider !== t.provider || o.prefix !== t.prefix || o.lastModified === e;
      });
  return !0;
}
function Le(t, e) {
  function n(n) {
    let o;
    if (!v[n] || !(o = qt(n))) return;
    const i = Vt[n];
    let r;
    if (i.size) i.delete((r = Array.from(i).shift()));
    else if (((r = tt(o)), !Z(o, r + 1))) return;
    const s = { cached: Math.floor(Date.now() / Bt), provider: t.provider, data: e };
    return st(o, P + r.toString(), JSON.stringify(s));
  }
  ct || Ut(),
    (e.lastModified && !je(t, e.lastModified)) ||
      (Object.keys(e.icons).length &&
        (e.not_found && delete (e = Object.assign({}, e)).not_found, n('local') || n('session')));
}
function It() {}
function Me(t) {
  t.iconsLoaderFlag ||
    ((t.iconsLoaderFlag = !0),
    setTimeout(() => {
      (t.iconsLoaderFlag = !1), xe(t);
    }));
}
function Fe(t, e) {
  t.iconsToLoad ? (t.iconsToLoad = t.iconsToLoad.concat(e).sort()) : (t.iconsToLoad = e),
    t.iconsQueueFlag ||
      ((t.iconsQueueFlag = !0),
      setTimeout(() => {
        t.iconsQueueFlag = !1;
        const { provider: e, prefix: n } = t,
          o = t.iconsToLoad;
        let i;
        delete t.iconsToLoad,
          o &&
            (i = X(e)) &&
            i.prepare(e, n, o).forEach((n) => {
              Dt(e, n, (e) => {
                if ('object' != typeof e)
                  n.icons.forEach((e) => {
                    t.missing.add(e);
                  });
                else
                  try {
                    const n = rt(t, e);
                    if (!n.length) return;
                    const o = t.pendingIcons;
                    o &&
                      n.forEach((t) => {
                        o.delete(t);
                      }),
                      Le(t, e);
                  } catch (t) {
                    console.error(t);
                  }
                Me(t);
              });
            });
      }));
}
const at = (t, e) => {
    const n = Se(Ee(t, !0, Ft()));
    if (!n.pending.length) {
      let t = !0;
      return (
        e &&
          setTimeout(() => {
            t && e(n.loaded, n.missing, n.pending, It);
          }),
        () => {
          t = !1;
        }
      );
    }
    const o = Object.create(null),
      i = [];
    let r, s;
    return (
      n.pending.forEach((t) => {
        const { provider: e, prefix: n } = t;
        if (n === s && e === r) return;
        (r = e), (s = n), i.push(S(e, n));
        const c = o[e] || (o[e] = Object.create(null));
        c[n] || (c[n] = []);
      }),
      n.pending.forEach((t) => {
        const { provider: e, prefix: n, name: i } = t,
          r = S(e, n),
          s = r.pendingIcons || (r.pendingIcons = new Set());
        s.has(i) || (s.add(i), o[e][n].push(i));
      }),
      i.forEach((t) => {
        const { provider: e, prefix: n } = t;
        o[e][n].length && Fe(t, o[e][n]);
      }),
      e ? Ce(e, n, i) : It
    );
  },
  Ne = (t) =>
    new Promise((e, n) => {
      const o = 'string' == typeof t ? j(t, !0) : t;
      o
        ? at([o || t], (i) => {
            if (i.length && o) {
              const t = _(o);
              if (t) return void e({ ...O, ...t });
            }
            n(t);
          })
        : n(t);
    });
function Re(t) {
  try {
    const e = 'string' == typeof t ? JSON.parse(t) : t;
    if ('string' == typeof e.body) return { ...e };
  } catch {}
}
function $e(t, e) {
  const n = 'string' == typeof t ? j(t, !0, !0) : null;
  if (!n) {
    const e = Re(t);
    return { value: t, data: e };
  }
  const o = _(n);
  if (void 0 !== o || !n.prefix) return { value: t, name: n, data: o };
  const i = at([n], () => e(t, n, _(n)));
  return { value: t, name: n, loading: i };
}
function W(t) {
  return t.hasAttribute('inline');
}
let zt = !1;
try {
  zt = 0 === navigator.vendor.indexOf('Apple');
} catch {}
function De(t, e) {
  switch (e) {
    case 'svg':
    case 'bg':
    case 'mask':
      return e;
  }
  return 'style' === e || (!zt && -1 !== t.indexOf('<a')) ? (-1 === t.indexOf('currentColor') ? 'bg' : 'mask') : 'svg';
}
const He = /(-?[0-9.]*[0-9]+[0-9.]*)/g,
  Be = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function et(t, e, n) {
  if (1 === e) return t;
  if (((n = n || 100), 'number' == typeof t)) return Math.ceil(t * e * n) / n;
  if ('string' != typeof t) return t;
  const o = t.split(He);
  if (null === o || !o.length) return t;
  const i = [];
  let r = o.shift(),
    s = Be.test(r);
  for (;;) {
    if (s) {
      const t = parseFloat(r);
      isNaN(t) ? i.push(r) : i.push(Math.ceil(t * e * n) / n);
    } else i.push(r);
    if (((r = o.shift()), void 0 === r)) return i.join('');
    s = !s;
  }
}
const Ve = (t) => 'unset' === t || 'undefined' === t || 'none' === t;
function Wt(t, e) {
  const n = { ...O, ...t },
    o = { ...Ot, ...e },
    i = { left: n.left, top: n.top, width: n.width, height: n.height };
  let r = n.body;
  [n, o].forEach((t) => {
    const e = [],
      n = t.hFlip,
      o = t.vFlip;
    let s,
      c = t.rotate;
    switch (
      (n
        ? o
          ? (c += 2)
          : (e.push('translate(' + (i.width + i.left).toString() + ' ' + (0 - i.top).toString() + ')'),
            e.push('scale(-1 1)'),
            (i.top = i.left = 0))
        : o &&
          (e.push('translate(' + (0 - i.left).toString() + ' ' + (i.height + i.top).toString() + ')'),
          e.push('scale(1 -1)'),
          (i.top = i.left = 0)),
      c < 0 && (c -= 4 * Math.floor(c / 4)),
      (c %= 4),
      c)
    ) {
      case 1:
        (s = i.height / 2 + i.top), e.unshift('rotate(90 ' + s.toString() + ' ' + s.toString() + ')');
        break;
      case 2:
        e.unshift('rotate(180 ' + (i.width / 2 + i.left).toString() + ' ' + (i.height / 2 + i.top).toString() + ')');
        break;
      case 3:
        (s = i.width / 2 + i.left), e.unshift('rotate(-90 ' + s.toString() + ' ' + s.toString() + ')');
    }
    c % 2 == 1 &&
      (i.left !== i.top && ((s = i.left), (i.left = i.top), (i.top = s)),
      i.width !== i.height && ((s = i.width), (i.width = i.height), (i.height = s))),
      e.length && (r = '<g transform="' + e.join(' ') + '">' + r + '</g>');
  });
  const s = o.width,
    c = o.height,
    a = i.width,
    l = i.height;
  let u, d;
  null === s
    ? ((d = null === c ? '1em' : 'auto' === c ? l : c), (u = et(d, a / l)))
    : ((u = 'auto' === s ? a : s), (d = null === c ? et(u, l / a) : 'auto' === c ? l : c));
  const f = {},
    h = (t, e) => {
      Ve(e) || (f[t] = e.toString());
    };
  return (
    h('width', u),
    h('height', d),
    (f.viewBox = i.left.toString() + ' ' + i.top.toString() + ' ' + a.toString() + ' ' + l.toString()),
    { attributes: f, body: r }
  );
}
const qe = () => {
  let t;
  try {
    if (((t = fetch), 'function' == typeof t)) return t;
  } catch {}
};
let B = qe();
function Qe(t) {
  B = t;
}
function Ue() {
  return B;
}
function ze(t, e) {
  const n = q(t);
  if (!n) return 0;
  let o;
  if (n.maxURL) {
    let t = 0;
    n.resources.forEach((e) => {
      t = Math.max(t, e.length);
    });
    const i = e + '.json?icons=';
    o = n.maxURL - t - n.path.length - i.length;
  } else o = 0;
  return o;
}
function We(t) {
  return 404 === t;
}
const Ge = (t, e, n) => {
  const o = [],
    i = ze(t, e),
    r = 'icons';
  let s = { type: r, provider: t, prefix: e, icons: [] },
    c = 0;
  return (
    n.forEach((n, a) => {
      (c += n.length + 1),
        c >= i && a > 0 && (o.push(s), (s = { type: r, provider: t, prefix: e, icons: [] }), (c = n.length)),
        s.icons.push(n);
    }),
    o.push(s),
    o
  );
};
function Je(t) {
  if ('string' == typeof t) {
    const e = q(t);
    if (e) return e.path;
  }
  return '/';
}
const Ke = (t, e, n) => {
    if (!B) return void n('abort', 424);
    let o = Je(e.provider);
    switch (e.type) {
      case 'icons': {
        const t = e.prefix,
          n = e.icons.join(',');
        o += t + '.json?' + new URLSearchParams({ icons: n }).toString();
        break;
      }
      case 'custom': {
        const t = e.uri;
        o += '/' === t.slice(0, 1) ? t.slice(1) : t;
        break;
      }
      default:
        return void n('abort', 400);
    }
    let i = 503;
    B(t + o)
      .then((t) => {
        const e = t.status;
        if (200 === e) return (i = 501), t.json();
        setTimeout(() => {
          n(We(e) ? 'abort' : 'next', e);
        });
      })
      .then((t) => {
        'object' == typeof t && null !== t
          ? setTimeout(() => {
              n('success', t);
            })
          : setTimeout(() => {
              404 === t ? n('abort', t) : n('next', i);
            });
      })
      .catch(() => {
        n('next', i);
      });
  },
  Xe = { prepare: Ge, send: Ke };
function St(t, e) {
  switch (t) {
    case 'local':
    case 'session':
      v[t] = e;
      break;
    case 'all':
      for (const t in v) v[t] = e;
  }
}
const G = 'data-style';
let Gt = '';
function Ye(t) {
  Gt = t;
}
function xt(t, e) {
  let n = Array.from(t.childNodes).find((t) => t.hasAttribute && t.hasAttribute(G));
  n || ((n = document.createElement('style')), n.setAttribute(G, G), t.appendChild(n)),
    (n.textContent =
      ':host{display:inline-block;vertical-align:' + (e ? '-0.125em' : '0') + '}span,svg{display:block}' + Gt);
}
function Jt() {
  let t;
  pt('', Xe), Ft(!0);
  try {
    t = window;
  } catch {}
  if (t) {
    if ((Ut(), void 0 !== t.IconifyPreload)) {
      const e = t.IconifyPreload,
        n = 'Invalid IconifyPreload syntax.';
      'object' == typeof e &&
        null !== e &&
        (e instanceof Array ? e : [e]).forEach((t) => {
          try {
            ('object' != typeof t ||
              null === t ||
              t instanceof Array ||
              'object' != typeof t.icons ||
              'string' != typeof t.prefix ||
              !ht(t)) &&
              console.error(n);
          } catch {
            console.error(n);
          }
        });
    }
    if (void 0 !== t.IconifyProviders) {
      const e = t.IconifyProviders;
      if ('object' == typeof e && null !== e)
        for (const t in e) {
          const n = 'IconifyProviders[' + t + '] is invalid.';
          try {
            const o = e[t];
            if ('object' != typeof o || !o || void 0 === o.resources) continue;
            gt(t, o) || console.error(n);
          } catch {
            console.error(n);
          }
        }
    }
  }
  return {
    enableCache: (t) => St(t, !0),
    disableCache: (t) => St(t, !1),
    iconExists: we,
    getIcon: Ie,
    listIcons: be,
    addIcon: Nt,
    addCollection: ht,
    calculateSize: et,
    buildIcon: Wt,
    loadIcons: at,
    loadIcon: Ne,
    addAPIProvider: gt,
    appendCustomStyle: Ye,
    _api: { getAPIConfig: q, setAPIModule: pt, sendAPIQuery: Dt, setFetch: Qe, getFetch: Ue, listAPIProviders: Te },
  };
}
function Kt(t, e) {
  let n = -1 === t.indexOf('xlink:') ? '' : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const t in e) n += ' ' + t + '="' + e[t] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + n + '>' + t + '</svg>';
}
function Ze(t) {
  return t
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ');
}
function tn(t) {
  return 'data:image/svg+xml,' + Ze(t);
}
function en(t) {
  return 'url("' + tn(t) + '")';
}
const nt = { 'background-color': 'currentColor' },
  Xt = { 'background-color': 'transparent' },
  vt = { image: 'var(--svg)', repeat: 'no-repeat', size: '100% 100%' },
  Ct = { '-webkit-mask': nt, mask: nt, background: Xt };
for (const t in Ct) {
  const e = Ct[t];
  for (const n in vt) e[t + '-' + n] = vt[n];
}
function Et(t) {
  return t ? t + (t.match(/^[-0-9.]+$/) ? 'px' : '') : 'inherit';
}
function nn(t, e, n) {
  const o = document.createElement('span');
  let i = t.body;
  -1 !== i.indexOf('<a') && (i += '\x3c!-- ' + Date.now() + ' --\x3e');
  const r = t.attributes,
    s = en(Kt(i, { ...r, width: e.width + '', height: e.height + '' })),
    c = o.style,
    a = { '--svg': s, width: Et(r.width), height: Et(r.height), ...(n ? nt : Xt) };
  for (const t in a) c.setProperty(t, a[t]);
  return o;
}
let A;
function on() {
  try {
    A = window.trustedTypes.createPolicy('iconify', { createHTML: (t) => t });
  } catch {
    A = null;
  }
}
function rn(t) {
  return void 0 === A && on(), A ? A.createHTML(t) : t;
}
function sn(t) {
  const e = document.createElement('span'),
    n = t.attributes;
  let o = '';
  n.width || (o = 'width: inherit;'), n.height || (o += 'height: inherit;'), o && (n.style = o);
  const i = Kt(t.body, n);
  return (e.innerHTML = rn(i)), e.firstChild;
}
function kt(t, e) {
  const n = e.icon.data,
    o = e.customisations,
    i = Wt(n, o);
  o.preserveAspectRatio && (i.attributes.preserveAspectRatio = o.preserveAspectRatio);
  const r = e.renderedMode;
  let s;
  if ('svg' === r) s = sn(i);
  else s = nn(i, { ...O, ...n }, 'mask' === r);
  const c = Array.from(t.childNodes).find((t) => {
    const e = t.tagName && t.tagName.toUpperCase();
    return 'SPAN' === e || 'SVG' === e;
  });
  c
    ? 'SPAN' === s.tagName && c.tagName === s.tagName
      ? c.setAttribute('style', s.getAttribute('style'))
      : t.replaceChild(s, c)
    : t.appendChild(s);
}
function At(t, e, n) {
  return { rendered: !1, inline: e, icon: t, lastRender: n && (n.rendered ? n : n.lastRender) };
}
function cn(t = 'iconify-icon') {
  let e, n;
  try {
    (e = window.customElements), (n = window.HTMLElement);
  } catch {
    return;
  }
  if (!e || !n) return;
  const o = e.get(t);
  if (o) return o;
  const i = ['icon', 'mode', 'inline', 'width', 'height', 'rotate', 'flip'],
    r = class extends n {
      _shadowRoot;
      _state;
      _checkQueued = !1;
      constructor() {
        super();
        const t = (this._shadowRoot = this.attachShadow({ mode: 'open' })),
          e = W(this);
        xt(t, e), (this._state = At({ value: '' }, e)), this._queueCheck();
      }
      static get observedAttributes() {
        return i.slice(0);
      }
      attributeChangedCallback(t) {
        if ('inline' === t) {
          const t = W(this),
            e = this._state;
          t !== e.inline && ((e.inline = t), xt(this._shadowRoot, t));
        } else this._queueCheck();
      }
      get icon() {
        const t = this.getAttribute('icon');
        if (t && '{' === t.slice(0, 1))
          try {
            return JSON.parse(t);
          } catch {}
        return t;
      }
      set icon(t) {
        'object' == typeof t && (t = JSON.stringify(t)), this.setAttribute('icon', t);
      }
      get inline() {
        return W(this);
      }
      set inline(t) {
        t ? this.setAttribute('inline', 'true') : this.removeAttribute('inline');
      }
      restartAnimation() {
        const t = this._state;
        if (t.rendered) {
          const e = this._shadowRoot;
          if ('svg' === t.renderedMode)
            try {
              return void e.lastChild.setCurrentTime(0);
            } catch {}
          kt(e, t);
        }
      }
      get status() {
        const t = this._state;
        return t.rendered ? 'rendered' : null === t.icon.data ? 'failed' : 'loading';
      }
      _queueCheck() {
        this._checkQueued ||
          ((this._checkQueued = !0),
          setTimeout(() => {
            this._check();
          }));
      }
      _check() {
        if (!this._checkQueued) return;
        this._checkQueued = !1;
        const t = this._state,
          e = this.getAttribute('icon');
        if (e !== t.icon.value) return void this._iconChanged(e);
        if (!t.rendered) return;
        const n = this.getAttribute('mode'),
          o = ft(this);
        (t.attrMode !== n || fe(t.customisations, o)) && this._renderIcon(t.icon, o, n);
      }
      _iconChanged(t) {
        const e = $e(t, (t, e, n) => {
          const o = this._state;
          if (o.rendered || this.getAttribute('icon') !== t) return;
          const i = { value: t, name: e, data: n };
          i.data ? this._gotIconData(i) : (o.icon = i);
        });
        e.data ? this._gotIconData(e) : (this._state = At(e, this._state.inline, this._state));
      }
      _gotIconData(t) {
        (this._checkQueued = !1), this._renderIcon(t, ft(this), this.getAttribute('mode'));
      }
      _renderIcon(t, e, n) {
        const o = De(t.data.body, n),
          i = this._state.inline;
        kt(
          this._shadowRoot,
          (this._state = { rendered: !0, icon: t, inline: i, customisations: e, attrMode: n, renderedMode: o })
        );
      }
    };
  i.forEach((t) => {
    t in r.prototype ||
      Object.defineProperty(r.prototype, t, {
        get: function () {
          return this.getAttribute(t);
        },
        set: function (e) {
          null !== e ? this.setAttribute(t, e) : this.removeAttribute(t);
        },
      });
  });
  const s = Jt();
  for (const t in s) r[t] = r.prototype[t] = s[t];
  return e.define(t, r), r;
}
cn() || Jt();
const Tt = [...document.querySelectorAll('[data-gallery]')];
if (Tt.length > 0) {
  $(() => Promise.resolve({}), ['_astro/photoswipe.534d0e90.css']);
  const t = (t) => {
    const e = String(t.dataset.gallery);
    return {
      dataSource: [...document.getElementById(e).children].map((t) => ({
        src: t.src,
        width: t.width,
        height: t.height,
        alt: t.alt,
      })),
      showHideAnimationType: 'none',
      index: 0,
    };
  };
  $(() => import('./photoswipe.esm.a76a00e0.js'), []).then(({ default: e }) => {
    Tt.forEach((n) =>
      n.addEventListener('click', () => {
        new e(t(n)).init();
      })
    );
  });
}
const an = (t, e) => {
    let n, o, i;
    const r = () => {
        t(), (n ??= !0), (i = Date.now());
      },
      s = () => {
        clearTimeout(o), (o = setTimeout(() => Date.now() - i >= e && r(), Math.max(e - (Date.now() - i), 0)));
      };
    return () => (n ? s() : r());
  },
  ln = [...document.querySelectorAll('[data-type="section"]')],
  un = (t) => t.getBoundingClientRect().bottom >= window.innerHeight / 3,
  fn = () => {
    const t = ln.find(un);
    t && ot.updateHash(t.id);
  };
document.addEventListener('scroll', an(fn, 200));
