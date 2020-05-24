var app = (function () {
  'use strict';
  function t() {}
  function n(t, n) {
    for (const e in n) t[e] = n[e];
    return t;
  }
  function e(t) {
    return t();
  }
  function s() {
    return Object.create(null);
  }
  function o(t) {
    t.forEach(e);
  }
  function a(t) {
    return 'function' == typeof t;
  }
  function i(t, n) {
    return t != t
      ? n == n
      : t !== n || (t && 'object' == typeof t) || 'function' == typeof t;
  }
  function l(t, n, e) {
    t.$$.on_destroy.push(
      (function (t, n) {
        const e = t.subscribe(n);
        return e.unsubscribe ? () => e.unsubscribe() : e;
      })(n, e),
    );
  }
  function r(t) {
    const n = {};
    for (const e in t) '$' !== e[0] && (n[e] = t[e]);
    return n;
  }
  function c(t, n) {
    t.appendChild(n);
  }
  function u(t, n, e) {
    t.insertBefore(n, e || null);
  }
  function d(t) {
    t.parentNode.removeChild(t);
  }
  function f(t) {
    return document.createElement(t);
  }
  function p(t) {
    return document.createTextNode(t);
  }
  function m() {
    return p(' ');
  }
  function g() {
    return p('');
  }
  function $(t, n, e, s) {
    return t.addEventListener(n, e, s), () => t.removeEventListener(n, e, s);
  }
  function h(t, n, e) {
    null == e
      ? t.removeAttribute(n)
      : t.getAttribute(n) !== e && t.setAttribute(n, e);
  }
  function w(t, n) {
    (n = '' + n), t.data !== n && (t.data = n);
  }
  let v;
  function b(t) {
    v = t;
  }
  function y() {
    if (!v) throw new Error('Function called outside component initialization');
    return v;
  }
  function x(t) {
    y().$$.on_mount.push(t);
  }
  function C() {
    const t = y();
    return (n, e) => {
      const s = t.$$.callbacks[n];
      if (s) {
        const o = (function (t, n) {
          const e = document.createEvent('CustomEvent');
          return e.initCustomEvent(t, !1, !1, n), e;
        })(n, e);
        s.slice().forEach(n => {
          n.call(t, o);
        });
      }
    };
  }
  const O = [],
    D = [],
    N = [],
    S = [],
    _ = Promise.resolve();
  let E = !1;
  function k(t) {
    N.push(t);
  }
  function A() {
    const t = new Set();
    do {
      for (; O.length; ) {
        const t = O.shift();
        b(t), I(t.$$);
      }
      for (; D.length; ) D.pop()();
      for (let n = 0; n < N.length; n += 1) {
        const e = N[n];
        t.has(e) || (e(), t.add(e));
      }
      N.length = 0;
    } while (O.length);
    for (; S.length; ) S.pop()();
    E = !1;
  }
  function I(t) {
    if (null !== t.fragment) {
      t.update(), o(t.before_update);
      const n = t.dirty;
      (t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, n),
        t.after_update.forEach(k);
    }
  }
  const P = new Set();
  let T;
  function R() {
    T = { r: 0, c: [], p: T };
  }
  function M() {
    T.r || o(T.c), (T = T.p);
  }
  function j(t, n) {
    t && t.i && (P.delete(t), t.i(n));
  }
  function q(t, n, e, s) {
    if (t && t.o) {
      if (P.has(t)) return;
      P.add(t),
        T.c.push(() => {
          P.delete(t), s && (e && t.d(1), s());
        }),
        t.o(n);
    }
  }
  function F(t, n) {
    q(t, 1, 1, () => {
      n.delete(t.key);
    });
  }
  function L(t, n) {
    const e = {},
      s = {},
      o = { $$scope: 1 };
    let a = t.length;
    for (; a--; ) {
      const i = t[a],
        l = n[a];
      if (l) {
        for (const t in i) t in l || (s[t] = 1);
        for (const t in l) o[t] || ((e[t] = l[t]), (o[t] = 1));
        t[a] = l;
      } else for (const t in i) o[t] = 1;
    }
    for (const t in s) t in e || (e[t] = void 0);
    return e;
  }
  function H(t) {
    return 'object' == typeof t && null !== t ? t : {};
  }
  function B(t) {
    t && t.c();
  }
  function K(t, n, s) {
    const { fragment: i, on_mount: l, on_destroy: r, after_update: c } = t.$$;
    i && i.m(n, s),
      k(() => {
        const n = l.map(e).filter(a);
        r ? r.push(...n) : o(n), (t.$$.on_mount = []);
      }),
      c.forEach(k);
  }
  function z(t, n) {
    const e = t.$$;
    null !== e.fragment &&
      (o(e.on_destroy),
      e.fragment && e.fragment.d(n),
      (e.on_destroy = e.fragment = null),
      (e.ctx = []));
  }
  function V(t, n) {
    -1 === t.$$.dirty[0] &&
      (O.push(t), E || ((E = !0), _.then(A)), t.$$.dirty.fill(0)),
      (t.$$.dirty[(n / 31) | 0] |= 1 << n % 31);
  }
  function J(n, e, a, i, l, r, c = [-1]) {
    const u = v;
    b(n);
    const d = e.props || {},
      f = (n.$$ = {
        fragment: null,
        ctx: null,
        props: r,
        update: t,
        not_equal: l,
        bound: s(),
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(u ? u.$$.context : []),
        callbacks: s(),
        dirty: c,
      });
    let p = !1;
    (f.ctx = a
      ? a(
          n,
          d,
          (t, e, s = e) => (
            f.ctx &&
              l(f.ctx[t], (f.ctx[t] = s)) &&
              (f.bound[t] && f.bound[t](s), p && V(n, t)),
            e
          ),
        )
      : []),
      f.update(),
      (p = !0),
      o(f.before_update),
      (f.fragment = !!i && i(f.ctx)),
      e.target &&
        (e.hydrate
          ? f.fragment &&
            f.fragment.l(
              (function (t) {
                return Array.from(t.childNodes);
              })(e.target),
            )
          : f.fragment && f.fragment.c(),
        e.intro && j(n.$$.fragment),
        K(n, e.target, e.anchor),
        A()),
      b(u);
  }
  class Q {
    $destroy() {
      z(this, 1), (this.$destroy = t);
    }
    $on(t, n) {
      const e = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
      return (
        e.push(n),
        () => {
          const t = e.indexOf(n);
          -1 !== t && e.splice(t, 1);
        }
      );
    }
    $set() {}
  }
  const G = [];
  function W(t, n) {
    return { subscribe: X(t, n).subscribe };
  }
  function X(n, e = t) {
    let s;
    const o = [];
    function a(t) {
      if (i(n, t) && ((n = t), s)) {
        const t = !G.length;
        for (let t = 0; t < o.length; t += 1) {
          const e = o[t];
          e[1](), G.push(e, n);
        }
        if (t) {
          for (let t = 0; t < G.length; t += 2) G[t][0](G[t + 1]);
          G.length = 0;
        }
      }
    }
    return {
      set: a,
      update: function (t) {
        a(t(n));
      },
      subscribe: function (i, l = t) {
        const r = [i, l];
        return (
          o.push(r),
          1 === o.length && (s = e(a) || t),
          i(n),
          () => {
            const t = o.indexOf(r);
            -1 !== t && o.splice(t, 1), 0 === o.length && (s(), (s = null));
          }
        );
      },
    };
  }
  function Y(n, e, s) {
    const i = !Array.isArray(n),
      l = i ? [n] : n,
      r = e.length < 2;
    return W(s, n => {
      let s = !1;
      const c = [];
      let u = 0,
        d = t;
      const f = () => {
          if (u) return;
          d();
          const s = e(i ? c[0] : c, n);
          r ? n(s) : (d = a(s) ? s : t);
        },
        p = l.map((t, n) =>
          t.subscribe(
            t => {
              (c[n] = t), (u &= ~(1 << n)), s && f();
            },
            () => {
              u |= 1 << n;
            },
          ),
        );
      return (
        (s = !0),
        f(),
        function () {
          o(p), d();
        }
      );
    });
  }
  function U(t) {
    let n, e;
    var s = t[0];
    function o(t) {
      return { props: { params: t[1] } };
    }
    if (s) var a = new s(o(t));
    return {
      c() {
        a && B(a.$$.fragment), (n = g());
      },
      m(t, s) {
        a && K(a, t, s), u(t, n, s), (e = !0);
      },
      p(t, [e]) {
        const i = {};
        if ((2 & e && (i.params = t[1]), s !== (s = t[0]))) {
          if (a) {
            R();
            const t = a;
            q(t.$$.fragment, 1, 0, () => {
              z(t, 1);
            }),
              M();
          }
          s
            ? (B((a = new s(o(t))).$$.fragment),
              j(a.$$.fragment, 1),
              K(a, n.parentNode, n))
            : (a = null);
        } else s && a.$set(i);
      },
      i(t) {
        e || (a && j(a.$$.fragment, t), (e = !0));
      },
      o(t) {
        a && q(a.$$.fragment, t), (e = !1);
      },
      d(t) {
        t && d(n), a && z(a, t);
      },
    };
  }
  function Z() {
    const t = window.location.href.indexOf('#/');
    let n = t > -1 ? window.location.href.substr(t + 1) : '/';
    const e = n.indexOf('?');
    let s = '';
    return (
      e > -1 && ((s = n.substr(e + 1)), (n = n.substr(0, e))),
      { location: n, querystring: s }
    );
  }
  const tt = W(Z(), function (t) {
    const n = () => {
      t(Z());
    };
    return (
      window.addEventListener('hashchange', n, !1),
      function () {
        window.removeEventListener('hashchange', n, !1);
      }
    );
  });
  Y(tt, t => t.location), Y(tt, t => t.querystring);
  function nt(t) {
    if (!t || !t.tagName || 'a' != t.tagName.toLowerCase())
      throw Error('Action "link" can only be used with <a> tags');
    const n = t.getAttribute('href');
    if (!n || n.length < 1 || '/' != n.charAt(0))
      throw Error('Invalid value for "href" attribute');
    t.setAttribute('href', '#' + n);
  }
  function et(n, e, s) {
    let o,
      a = t;
    l(n, tt, t => s(4, (o = t))), n.$$.on_destroy.push(() => a());
    let { routes: i = {} } = e,
      { prefix: r = '' } = e;
    class c {
      constructor(t, n) {
        if (
          !n ||
          ('function' != typeof n &&
            ('object' != typeof n || !0 !== n._sveltesparouter))
        )
          throw Error('Invalid component object');
        if (
          !t ||
          ('string' == typeof t &&
            (t.length < 1 || ('/' != t.charAt(0) && '*' != t.charAt(0)))) ||
          ('object' == typeof t && !(t instanceof RegExp))
        )
          throw Error('Invalid value for "path" argument');
        const { pattern: e, keys: s } = (function (t, n) {
          if (t instanceof RegExp) return { keys: !1, pattern: t };
          var e,
            s,
            o,
            a,
            i = [],
            l = '',
            r = t.split('/');
          for (r[0] || r.shift(); (o = r.shift()); )
            '*' === (e = o[0])
              ? (i.push('wild'), (l += '/(.*)'))
              : ':' === e
              ? ((s = o.indexOf('?', 1)),
                (a = o.indexOf('.', 1)),
                i.push(o.substring(1, ~s ? s : ~a ? a : o.length)),
                (l += ~s && !~a ? '(?:/([^/]+?))?' : '/([^/]+?)'),
                ~a && (l += (~s ? '?' : '') + '\\' + o.substring(a)))
              : (l += '/' + o);
          return {
            keys: i,
            pattern: new RegExp('^' + l + (n ? '(?=$|/)' : '/?$'), 'i'),
          };
        })(t);
        (this.path = t),
          'object' == typeof n && !0 === n._sveltesparouter
            ? ((this.component = n.route),
              (this.conditions = n.conditions || []),
              (this.userData = n.userData))
            : ((this.component = n),
              (this.conditions = []),
              (this.userData = void 0)),
          (this._pattern = e),
          (this._keys = s);
      }
      match(t) {
        r && t.startsWith(r) && (t = t.substr(r.length) || '/');
        const n = this._pattern.exec(t);
        if (null === n) return null;
        if (!1 === this._keys) return n;
        const e = {};
        let s = 0;
        for (; s < this._keys.length; ) e[this._keys[s]] = n[++s] || null;
        return e;
      }
      checkConditions(t) {
        for (let n = 0; n < this.conditions.length; n++)
          if (!this.conditions[n](t)) return !1;
        return !0;
      }
    }
    const u = i instanceof Map ? i : Object.entries(i),
      d = [];
    for (const [t, n] of u) d.push(new c(t, n));
    let f = null,
      p = {};
    const m = C(),
      g = (t, n) => {
        setTimeout(() => {
          m(t, n);
        }, 0);
      };
    return (
      (n.$set = t => {
        'routes' in t && s(2, (i = t.routes)),
          'prefix' in t && s(3, (r = t.prefix));
      }),
      (n.$$.update = () => {
        if (17 & n.$$.dirty) {
          s(0, (f = null));
          let t = 0;
          for (; !f && t < d.length; ) {
            const n = d[t].match(o.location);
            if (n) {
              const e = {
                component: d[t].component,
                name: d[t].component.name,
                location: o.location,
                querystring: o.querystring,
                userData: d[t].userData,
              };
              if (!d[t].checkConditions(e)) {
                g('conditionsFailed', e);
                break;
              }
              s(0, (f = d[t].component)), s(1, (p = n)), g('routeLoaded', e);
            }
            t++;
          }
        }
      }),
      [f, p, i, r]
    );
  }
  class st extends Q {
    constructor(t) {
      super(), J(this, t, et, U, i, { routes: 2, prefix: 3 });
    }
  }
  function ot(n) {
    let e,
      s,
      o,
      i,
      l,
      r,
      p,
      g,
      $,
      w,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I,
      P,
      T,
      R,
      M,
      j,
      q,
      F,
      L,
      H,
      B,
      K,
      z,
      V,
      J,
      Q,
      G,
      W,
      X,
      Y,
      U,
      Z,
      tt,
      et,
      st,
      ot,
      at,
      it,
      lt,
      rt,
      ct,
      ut,
      dt,
      ft;
    return {
      c() {
        (e = f('div')),
          (s = f('ul')),
          (o = f('li')),
          (i = f('a')),
          (i.textContent = 'DialogClassName'),
          (r = m()),
          (p = f('li')),
          (g = f('a')),
          (g.textContent = 'DialogClassNameDelay'),
          (w = m()),
          (v = f('li')),
          (b = f('a')),
          (b.textContent = 'DialogStyles'),
          (x = m()),
          (C = f('li')),
          (O = f('a')),
          (O.textContent = 'DialogIds'),
          (N = m()),
          (S = f('li')),
          (_ = f('a')),
          (_.textContent = 'DialogCount'),
          (k = m()),
          (A = f('li')),
          (I = f('a')),
          (I.textContent = 'DialogHideAll'),
          (T = m()),
          (R = f('li')),
          (M = f('a')),
          (M.textContent = 'DialogResetAll'),
          (q = m()),
          (F = f('li')),
          (L = f('a')),
          (L.textContent = 'DialogTimeout'),
          (B = m()),
          (K = f('li')),
          (z = f('a')),
          (z.textContent = 'DialogQueued'),
          (J = m()),
          (Q = f('li')),
          (G = f('a')),
          (G.textContent = 'NotificationCount'),
          (X = m()),
          (Y = f('li')),
          (U = f('a')),
          (U.textContent = 'NotificationPause'),
          (tt = m()),
          (et = f('li')),
          (st = f('a')),
          (st.textContent = 'NotificationTimeout'),
          (at = m()),
          (it = f('li')),
          (lt = f('a')),
          (lt.textContent = 'LibBulmaDialog'),
          (ct = m()),
          (ut = f('li')),
          (dt = f('a')),
          (dt.textContent = 'LibMaterialIODialog'),
          h(i, 'href', '/DialogClassName'),
          h(g, 'href', '/DialogClassNameDelay'),
          h(b, 'href', '/DialogStyles'),
          h(O, 'href', '/DialogIds'),
          h(_, 'href', '/DialogCount'),
          h(I, 'href', '/DialogHideAll'),
          h(M, 'href', '/DialogResetAll'),
          h(L, 'href', '/DialogTimeout'),
          h(z, 'href', '/DialogQueued'),
          h(G, 'href', '/NotificationCount'),
          h(U, 'href', '/NotificationPause'),
          h(st, 'href', '/NotificationTimeout'),
          h(lt, 'href', '/LibBulmaDialog'),
          h(dt, 'href', '/LibMaterialIODialog'),
          h(e, 'class', 'menu');
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, o),
          c(o, i),
          (l = nt.call(null, i) || {}),
          c(s, r),
          c(s, p),
          c(p, g),
          ($ = nt.call(null, g) || {}),
          c(s, w),
          c(s, v),
          c(v, b),
          (y = nt.call(null, b) || {}),
          c(s, x),
          c(s, C),
          c(C, O),
          (D = nt.call(null, O) || {}),
          c(s, N),
          c(s, S),
          c(S, _),
          (E = nt.call(null, _) || {}),
          c(s, k),
          c(s, A),
          c(A, I),
          (P = nt.call(null, I) || {}),
          c(s, T),
          c(s, R),
          c(R, M),
          (j = nt.call(null, M) || {}),
          c(s, q),
          c(s, F),
          c(F, L),
          (H = nt.call(null, L) || {}),
          c(s, B),
          c(s, K),
          c(K, z),
          (V = nt.call(null, z) || {}),
          c(s, J),
          c(s, Q),
          c(Q, G),
          (W = nt.call(null, G) || {}),
          c(s, X),
          c(s, Y),
          c(Y, U),
          (Z = nt.call(null, U) || {}),
          c(s, tt),
          c(s, et),
          c(et, st),
          (ot = nt.call(null, st) || {}),
          c(s, at),
          c(s, it),
          c(it, lt),
          (rt = nt.call(null, lt) || {}),
          c(s, ct),
          c(s, ut),
          c(ut, dt),
          (ft = nt.call(null, dt) || {});
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && d(e),
          l && a(l.destroy) && l.destroy(),
          $ && a($.destroy) && $.destroy(),
          y && a(y.destroy) && y.destroy(),
          D && a(D.destroy) && D.destroy(),
          E && a(E.destroy) && E.destroy(),
          P && a(P.destroy) && P.destroy(),
          j && a(j.destroy) && j.destroy(),
          H && a(H.destroy) && H.destroy(),
          V && a(V.destroy) && V.destroy(),
          W && a(W.destroy) && W.destroy(),
          Z && a(Z.destroy) && Z.destroy(),
          ot && a(ot.destroy) && ot.destroy(),
          rt && a(rt.destroy) && rt.destroy(),
          ft && a(ft.destroy) && ft.destroy();
      },
    };
  }
  const at = (...t) => n => t.filter(Boolean).reduce((t, n) => n(t), n),
    it = ({ domElement: t, prop: n }) => {
      if (window.getComputedStyle) {
        const e = document.defaultView;
        if (e) {
          const s = e.getComputedStyle(t);
          if (s) return s.getPropertyValue(n);
        }
      }
    },
    lt = 'show',
    rt = 'hide',
    ct = (t, n, e) => {
      const s = e[n] || {};
      Object.keys(s).forEach(n => {
        const e = s[n].toString();
        t.style[n] = e;
      });
    },
    ut = (t, n) => t.split(/ /).map(t => `${t}-${n}`),
    dt = (t, n, e, s) => {
      if (n.styles) {
        const o = ((t, n) => ('function' == typeof n ? n(t) : n) || {})(
          t,
          n.styles,
        );
        ct(t, 'default', o),
          s && (t => (t.style.transitionDuration = '0ms'))(t),
          ct(t, e, o);
      }
      if (n.className) {
        const s = {
          showStart: ut(n.className, 'show-start'),
          showEnd: ut(n.className, 'show-end'),
          hideStart: ut(n.className, 'hide-start'),
          hideEnd: ut(n.className, 'hide-end'),
        };
        ((t, n) =>
          t.classList.remove(
            ...n.showStart,
            ...n.showEnd,
            ...n.hideStart,
            ...n.hideEnd,
          ))(t, s),
          s && t.classList.add(...s[e]);
      }
      t.scrollTop;
    },
    ft = {
      showStart: { nextStep: 'showEnd' },
      showEnd: { nextStep: void 0 },
      hideStart: { nextStep: 'hideEnd' },
      hideEnd: { nextStep: void 0 },
    },
    pt = (t, n) => {
      const e = t.domElement;
      if (!e) return Promise.resolve('no domElement');
      let s = n === lt ? 'showStart' : 'hideStart';
      return new Promise(n => {
        dt(e, t, s, 'showStart' === s),
          setTimeout(() => {
            const o = ft[s].nextStep;
            if (o) {
              (s = o), dt(e, t, s);
              const a = (t => {
                const n = it({ domElement: t, prop: 'transition-duration' }),
                  e = void 0 !== n ? mt(n) : 0,
                  s = it({ domElement: t, prop: 'transition-delay' });
                return e + (void 0 !== s ? mt(s) : 0);
              })(e);
              setTimeout(n, a);
            }
          }, 0);
      });
    },
    mt = t => {
      const n = parseFloat(t) * (-1 === t.indexOf('ms') ? 1e3 : 1);
      return isNaN(n) ? 0 : n;
    };
  var gt = (function (t, n) {
    return t((n = { exports: {} }), n.exports), n.exports;
  })(function (t) {
    !(function () {
      (e.SKIP = {}),
        (e.lift = function () {
          var t = arguments[0];
          return o(Array.prototype.slice.call(arguments, 1)).map(function (n) {
            return t.apply(void 0, n);
          });
        }),
        (e.scan = function (t, n, s) {
          var o = s.map(function (s) {
            var o = t(n, s);
            return o !== e.SKIP && (n = o), o;
          });
          return o(n), o;
        }),
        (e.merge = o),
        (e.combine = s),
        (e.scanMerge = function (t, n) {
          var e = t.map(function (t) {
              return t[0];
            }),
            o = s(function () {
              var s = arguments[arguments.length - 1];
              return (
                e.forEach(function (e, o) {
                  s.indexOf(e) > -1 && (n = t[o][1](n, e()));
                }),
                n
              );
            }, e);
          return o(n), o;
        }),
        (e['fantasy-land/of'] = e);
      var n = !1;
      function e(t) {
        var n,
          o = [],
          i = [];
        function l(n) {
          return (
            arguments.length &&
              n !== e.SKIP &&
              ((t = n),
              a(l) &&
                (l._changing(),
                (l._state = 'active'),
                o.forEach(function (n, e) {
                  n(i[e](t));
                }))),
            t
          );
        }
        return (
          (l.constructor = e),
          (l._state = arguments.length && t !== e.SKIP ? 'active' : 'pending'),
          (l._parents = []),
          (l._changing = function () {
            a(l) && (l._state = 'changing'),
              o.forEach(function (t) {
                t._changing();
              });
          }),
          (l._map = function (n, s) {
            var a = s ? e() : e(n(t));
            return a._parents.push(l), o.push(a), i.push(n), a;
          }),
          (l.map = function (t) {
            return l._map(t, 'active' !== l._state);
          }),
          (l.toJSON = function () {
            return null != t && 'function' == typeof t.toJSON ? t.toJSON() : t;
          }),
          (l['fantasy-land/map'] = l.map),
          (l['fantasy-land/ap'] = function (t) {
            return s(
              function (t, n) {
                return t()(n());
              },
              [t, l],
            );
          }),
          (l._unregisterChild = function (t) {
            var n = o.indexOf(t);
            -1 !== n && (o.splice(n, 1), i.splice(n, 1));
          }),
          Object.defineProperty(l, 'end', {
            get: function () {
              return (
                n ||
                ((n = e()).map(function (t) {
                  return (
                    !0 === t &&
                      (l._parents.forEach(function (t) {
                        t._unregisterChild(l);
                      }),
                      (l._state = 'ended'),
                      (l._parents.length = o.length = i.length = 0)),
                    t
                  );
                }),
                n)
              );
            },
          }),
          l
        );
      }
      function s(t, n) {
        var s = n.every(function (t) {
            if (t.constructor !== e)
              throw new Error(
                'Ensure that each item passed to stream.combine/stream.merge/lift is a stream',
              );
            return 'active' === t._state;
          }),
          o = s ? e(t.apply(null, n.concat([n]))) : e(),
          a = [],
          i = n.map(function (e) {
            return e._map(function (i) {
              return (
                a.push(e),
                (s ||
                  n.every(function (t) {
                    return 'pending' !== t._state;
                  })) &&
                  ((s = !0), o(t.apply(null, n.concat([a]))), (a = [])),
                i
              );
            }, !0);
          }),
          l = o.end.map(function (t) {
            !0 === t &&
              (i.forEach(function (t) {
                t.end(!0);
              }),
              l.end(!0));
          });
        return o;
      }
      function o(t) {
        return s(function () {
          return t.map(function (t) {
            return t();
          });
        }, t);
      }
      function a(t) {
        return (
          'pending' === t._state ||
          'active' === t._state ||
          'changing' === t._state
        );
      }
      Object.defineProperty(e, 'HALT', {
        get: function () {
          return (
            n || console.log('HALT is deprecated and has been renamed to SKIP'),
            (n = !0),
            e.SKIP
          );
        },
      }),
        (t.exports = e);
    })();
  });
  const $t = (t, n) => {
      const e = ((t, n) => n.find(n => n.id === t))(t, n);
      return n.indexOf(e);
    },
    ht = (t, n) => [n, t.id, t.spawn].filter(Boolean).join('-'),
    wt = {
      initialState: { store: {} },
      actions: t => ({
        add: (n, e) => {
          t(s => {
            const o = s.store[n] || [];
            return (
              (s.store[n] = [...o, e]),
              e.timer && e.timer.states.map(() => wt.actions(t).refresh()),
              s
            );
          });
        },
        remove: (n, e) => {
          t(t => {
            const s = t.store[n] || [],
              o = ((t, n) => {
                const e = $t(t, n);
                return -1 !== e && n.splice(e, 1), n;
              })(e, s);
            return (t.store[n] = o), t;
          });
        },
        replace: (n, e, s) => {
          t(t => {
            const o = t.store[n] || [];
            if (o) {
              const a = $t(e, o);
              -1 !== a && ((o[a] = s), (t.store[n] = [...o]));
            }
            return t;
          });
        },
        removeAll: n => {
          t(t => ((t.store[n] = []), t));
        },
        store: (n, e) => {
          t(t => ((t.store[n] = [...e]), t));
        },
        refresh: () => {
          t(t => ({ ...t }));
        },
      }),
      selectors: t => {
        const n = {
          getStore: () => {
            return t().store;
          },
          find: (n, e) => {
            const s = t().store[n] || [],
              o = ht(e, n),
              a = s.find(t => t.id === o);
            return a ? { just: a } : { nothing: void 0 };
          },
          getAll: (n, e) => {
            const s = t().store[n] || [],
              o = void 0 !== e ? e.spawn : void 0,
              a = void 0 !== e ? e.id : void 0,
              i =
                void 0 !== o ? s.filter(t => t.identityOptions.spawn === o) : s;
            return void 0 !== a ? i.filter(t => t.identityOptions.id === a) : i;
          },
          getCount: (t, e) => n.getAll(t, e).length,
        };
        return n;
      },
    },
    vt = gt(),
    bt = gt.scan((t, n) => n(t), { ...wt.initialState }, vt),
    yt = { ...wt.actions(vt) },
    xt = { ...wt.selectors(bt) },
    Ct = {
      callback: () => {},
      isPaused: !1,
      onAbort: () => {},
      onDone: () => {},
      promise: void 0,
      remaining: void 0,
      startTime: void 0,
      timeoutFn: () => {},
      timerId: void 0,
    },
    Ot = (t, n, e, s) => {
      const o = () => {
        n(), t.onDone(), s();
      };
      return {
        timeoutFn: o,
        promise: new Promise((n, e) => {
          (t.onDone = () => n()), (t.onAbort = () => n());
        }),
        ...(t.isPaused
          ? {}
          : {
              startTime: new Date().getTime(),
              timerId: window.setTimeout(o, e),
              remaining: e,
            }),
      };
    },
    Dt = t => (window.clearTimeout(t.timerId), { timerId: Ct.timerId }),
    Nt = t => ({ ...Dt(t) }),
    St = t => ({ ...Dt(t), isPaused: !0, remaining: Et(t) }),
    _t = (t, n) => {
      window.clearTimeout(t.timerId);
      const e = n ? Math.max(t.remaining || 0, n) : t.remaining;
      return {
        startTime: new Date().getTime(),
        isPaused: !1,
        remaining: e,
        timerId: window.setTimeout(t.timeoutFn, e),
      };
    },
    Et = t =>
      0 === t.remaining || void 0 === t.remaining
        ? t.remaining
        : t.remaining - (new Date().getTime() - (t.startTime || 0)),
    kt = () => {
      const t = {
          initialState: Ct,
          actions: n => ({
            start: (e, s) => {
              n(o => ({
                ...o,
                ...Dt(o),
                ...Ot(o, e, s, () => t.actions(n).done()),
                ...(o.isPaused && St(o)),
              }));
            },
            stop: () => {
              n(t => ({ ...t, ...Nt(t), ...Ct }));
            },
            pause: () => {
              n(t => ({ ...t, ...(!t.isPaused && St(t)) }));
            },
            resume: t => {
              n(n => ({ ...n, ...(n.isPaused && _t(n, t)) }));
            },
            abort: () => {
              n(t => (t.onAbort(), { ...t, ...Dt(t) }));
            },
            done: () => {
              n(t => Ct);
            },
            refresh: () => {
              n(t => ({ ...t }));
            },
          }),
          selectors: t => ({
            isPaused: () => {
              return t().isPaused;
            },
            getRemaining: () => {
              const n = t();
              return n.isPaused ? n.remaining : Et(n);
            },
            getResultPromise: () => {
              return t().promise;
            },
          }),
        },
        n = gt(),
        e = gt.scan((t, n) => n(t), { ...t.initialState }, n);
      return {
        states: e,
        actions: { ...t.actions(n) },
        selectors: { ...t.selectors(e) },
      };
    };
  let At = 0;
  const It = 0,
    Pt = 1,
    Tt = 2,
    Rt = t => n =>
      void 0 !== t.spawn
        ? n.filter(n => n.identityOptions.spawn === t.spawn)
        : n,
    Mt = t => {
      let n = 0;
      return t
        .map(t => ({ item: t, queueCount: t.dialogicOptions.queued ? n++ : 0 }))
        .filter(({ queueCount: t }) => 0 === t)
        .map(({ item: t }) => t);
    },
    jt = (t, n, e) => {
      const s = n[t] || [];
      return 0 == s.length ? [] : at(Rt(e), Mt)(s);
    },
    qt = (t, n = {}) => ({ id: n.id || t.id, spawn: n.spawn || t.spawn }),
    Ft = (t, n = {}) => {
      const e = {
        id: n.dialogic ? n.dialogic.id : void 0,
        spawn: n.dialogic ? n.dialogic.spawn : void 0,
      };
      return {
        identityOptions: qt(t || {}, e),
        dialogicOptions: { ...t, ...n.dialogic },
        passThroughOptions: (t => {
          const n = { ...t };
          return delete n.dialogic, n;
        })(n),
      };
    },
    Lt = t => n => (e = {}) => {
      const {
        identityOptions: s,
        dialogicOptions: o,
        passThroughOptions: a,
      } = Ft(n, e);
      return new Promise(i => {
        const l = {
            didShow: t => (o.didShow && o.didShow(t), i(t)),
            didHide: t => (o.didHide && o.didHide(t), i(t)),
          },
          r = {
            ns: t,
            identityOptions: s,
            dialogicOptions: o,
            callbacks: l,
            passThroughOptions: a,
            id: ht(s, t),
            timer: o.timeout ? kt() : void 0,
            key: (At === Number.MAX_SAFE_INTEGER ? 0 : At++).toString(),
            transitionState: It,
          },
          c = xt.find(t, s);
        if (c.just && o.toggle) {
          const s = Ht(t)(n)(e);
          return i(s);
        }
        if (c.just && !o.queued) {
          const n = c.just,
            e = n.dialogicOptions,
            s = {
              ...r,
              transitionState: n.transitionState,
              dialogicOptions: e,
            };
          yt.replace(t, n.id, s);
        } else yt.add(t, r);
        i(r);
      });
    },
    Ht = t => n => e => {
      const {
          identityOptions: s,
          dialogicOptions: o,
          passThroughOptions: a,
        } = Ft(n, e),
        i = xt.find(t, s);
      if (i.just) {
        const n = i.just,
          e = {
            ...n,
            dialogicOptions: { ...n.dialogicOptions, ...o },
            passThroughOptions: {
              ...n.passThroughOptions,
              passThroughOptions: a,
            },
          };
        return (
          yt.replace(t, n.id, e),
          e.transitionState !== Tt ? nn(e) : Promise.resolve(e)
        );
      }
      return Promise.resolve();
    },
    Bt = t => n => n => {
      const e = Gt(t, n).filter(t => !!t.timer);
      return e.forEach(t => t.timer && t.timer.actions.pause()), Promise.all(e);
    },
    Kt = t => n => n => {
      const e = n || {},
        s = { id: e.id, spawn: e.spawn },
        o = Gt(t, s).filter(t => !!t.timer);
      return (
        o.forEach(t => t.timer && t.timer.actions.resume(e.minimumDuration)),
        Promise.all(o)
      );
    },
    zt = (t, n) => e => s => o => {
      const a = (t => n => e => xt.find(t, qt(n, e)))(e)(s)(o);
      return a.just && a.just && a.just.timer ? a.just.timer.selectors[t]() : n;
    },
    Vt = zt('isPaused', !1),
    Jt = zt('getRemaining', void 0),
    Qt = t => n => n => !!Gt(t, n).length,
    Gt = (t, n) => {
      const e = xt.getAll(t);
      let s;
      return (
        (s = n
          ? at(
              Rt(n),
              (t => n =>
                void 0 !== t.id
                  ? n.filter(n => n.identityOptions.id === t.id)
                  : n)(n),
            )(e)
          : e),
        s
      );
    },
    Wt = t => n => n => {
      const e = Gt(t, n),
        s = [];
      return (
        e.forEach(t => {
          t.timer && t.timer.actions.abort(), s.push(t);
        }),
        n
          ? s.forEach(n => {
              yt.remove(t, n.id);
            })
          : yt.removeAll(t),
        Promise.resolve(s)
      );
    },
    Xt = (t, n) => ({ ...t, dialogicOptions: { ...t.dialogicOptions, ...n } }),
    Yt = t => n => n => {
      const e = n || {},
        s = { id: e.id, spawn: e.spawn },
        o = Gt(t, s),
        a = o.filter(t => !e.queued && !t.dialogicOptions.queued),
        i = o.filter(t => e.queued || t.dialogicOptions.queued),
        l = [];
      if ((a.forEach(t => l.push(nn(Xt(t, e)))), i.length > 0)) {
        const [n] = i;
        yt.store(t, [n]), l.push(nn(Xt(n, e)));
      }
      return Promise.all(l);
    },
    Ut = t => n => xt.getCount(t, n),
    Zt = (t, n) => pt(t.dialogicOptions, n),
    tn = async function (t) {
      return (
        t.transitionState !== Pt && ((t.transitionState = Pt), await Zt(t, lt)),
        t.callbacks.didShow && (await t.callbacks.didShow(t)),
        t.dialogicOptions.timeout &&
          t.timer &&
          (await (async function (t, n, e) {
            return (
              n.actions.start(() => nn(t), e), zt('getResultPromise', void 0)
            );
          })(t, t.timer, t.dialogicOptions.timeout)),
        Promise.resolve(t)
      );
    },
    nn = async function (t) {
      (t.transitionState = Tt),
        t.timer && t.timer.actions.stop(),
        await Zt(t, rt),
        t.callbacks.didHide && (await t.callbacks.didHide(t));
      const n = { ...t };
      return yt.remove(t.ns, t.id), Promise.resolve(n);
    },
    en = ({ ns: t, queued: n, timeout: e }) => {
      const s = `default_${t}`,
        o = `default_${t}`,
        a = {
          id: s,
          spawn: o,
          ...(n && { queued: n }),
          ...(void 0 !== e && { timeout: e }),
        };
      return {
        ns: t,
        defaultId: s,
        defaultSpawn: o,
        defaultDialogicOptions: a,
        show: Lt(t)(a),
        hide: Ht(t)(a),
        hideAll: Yt(t)(a),
        resetAll: Wt(t)(a),
        pause: Bt(t)(a),
        resume: Kt(t)(a),
        exists: Qt(t)(a),
        getCount: Ut(t),
        isPaused: Vt(t)(a),
        getRemaining: Jt(t)(a),
      };
    },
    sn = en({ ns: 'dialog' }),
    on = en({ ns: 'notification', queued: !0, timeout: 3e3 }),
    an = { ...X(bt), ...xt };
  bt.map(t => an.set({ ...t, ...xt }));
  const ln = t => n => Y(an, () => xt.getCount(t, n)),
    rn = t => n => e => Y(an, () => Vt(t)(n)(e)),
    cn = t => n => e => Y(an, () => Qt(t)(n)(e)),
    un = {
      ...sn,
      getCount: t => ln(sn.ns)(t),
      isPaused: t => rn(sn.ns)(sn.defaultDialogicOptions)(t),
      exists: t => cn(sn.ns)(sn.defaultDialogicOptions)(t),
    },
    dn = {
      ...on,
      getCount: t => ln(on.ns)(t),
      isPaused: t => rn(on.ns)(on.defaultDialogicOptions)(t),
      exists: t => cn(on.ns)(on.defaultDialogicOptions)(t),
    },
    fn = t => (n, e) => {
      const s = xt.find(t, n.detail.identityOptions);
      s.just &&
        ((t, n) => {
          n.dialogicOptions.domElement = t;
        })(n.detail.domElement, s.just);
      const o = xt.find(t, n.detail.identityOptions);
      o.just && e(o.just);
    },
    pn = t => n => fn(t)(n, tn),
    mn = t => n => fn(t)(n, tn),
    gn = t => n => fn(t)(n, nn);
  function $n(t) {
    let e, s;
    const o = [{ show: t[4] }, { hide: t[5] }, t[0]];
    var a = t[1].component;
    function i(t) {
      let e = {};
      for (let t = 0; t < o.length; t += 1) e = n(e, o[t]);
      return { props: e };
    }
    if (a) var l = new a(i());
    return {
      c() {
        (e = f('div')), l && B(l.$$.fragment), h(e, 'class', t[3]);
      },
      m(n, o) {
        u(n, e, o), l && K(l, e, null), t[9](e), (s = !0);
      },
      p(t, [n]) {
        const s =
          49 & n
            ? L(o, [
                16 & n && { show: t[4] },
                32 & n && { hide: t[5] },
                1 & n && H(t[0]),
              ])
            : {};
        if (a !== (a = t[1].component)) {
          if (l) {
            R();
            const t = l;
            q(t.$$.fragment, 1, 0, () => {
              z(t, 1);
            }),
              M();
          }
          a
            ? (B((l = new a(i())).$$.fragment),
              j(l.$$.fragment, 1),
              K(l, e, null))
            : (l = null);
        } else a && l.$set(s);
      },
      i(t) {
        s || (l && j(l.$$.fragment, t), (s = !0));
      },
      o(t) {
        l && q(l.$$.fragment, t), (s = !1);
      },
      d(n) {
        n && d(e), l && z(l), t[9](null);
      },
    };
  }
  function hn(t, n, e) {
    const s = C();
    let o,
      { identityOptions: a } = n,
      { passThroughOptions: i } = n,
      { dialogicOptions: l } = n;
    const r = l ? l.className : '',
      c = t => s(t, { identityOptions: a, domElement: o });
    return (
      x(() => {
        c('mount');
      }),
      (t.$set = t => {
        'identityOptions' in t && e(6, (a = t.identityOptions)),
          'passThroughOptions' in t && e(0, (i = t.passThroughOptions)),
          'dialogicOptions' in t && e(1, (l = t.dialogicOptions));
      }),
      [
        i,
        l,
        o,
        r,
        () => {
          c('show');
        },
        () => {
          c('hide');
        },
        a,
        s,
        c,
        function (t) {
          D[t ? 'unshift' : 'push'](() => {
            e(2, (o = t));
          });
        },
      ]
    );
  }
  class wn extends Q {
    constructor(t) {
      super(),
        J(this, t, hn, $n, i, {
          identityOptions: 6,
          passThroughOptions: 0,
          dialogicOptions: 1,
        });
    }
  }
  function vn(t, n, e) {
    const s = t.slice();
    return (
      (s[1] = n[e].identityOptions),
      (s[6] = n[e].dialogicOptions),
      (s[7] = n[e].passThroughOptions),
      (s[8] = n[e].key),
      (s[10] = e),
      s
    );
  }
  function bn(t, n) {
    let e, s;
    const o = new wn({
      props: {
        identityOptions: n[1],
        dialogicOptions: n[6],
        passThroughOptions: n[7],
      },
    });
    return (
      o.$on('mount', n[3]),
      o.$on('show', n[4]),
      o.$on('hide', n[5]),
      {
        key: t,
        first: null,
        c() {
          (e = g()), B(o.$$.fragment), (this.first = e);
        },
        m(t, n) {
          u(t, e, n), K(o, t, n), (s = !0);
        },
        p(t, n) {
          const e = {};
          7 & n && (e.identityOptions = t[1]),
            7 & n && (e.dialogicOptions = t[6]),
            7 & n && (e.passThroughOptions = t[7]),
            o.$set(e);
        },
        i(t) {
          s || (j(o.$$.fragment, t), (s = !0));
        },
        o(t) {
          q(o.$$.fragment, t), (s = !1);
        },
        d(t) {
          t && d(e), z(o, t);
        },
      }
    );
  }
  function yn(t) {
    let n,
      e,
      s = [],
      o = new Map(),
      a = jt(t[0], t[2].store, t[1]);
    const i = t => t[8];
    for (let n = 0; n < a.length; n += 1) {
      let e = vn(t, a, n),
        l = i(e);
      o.set(l, (s[n] = bn(l, e)));
    }
    return {
      c() {
        for (let t = 0; t < s.length; t += 1) s[t].c();
        n = g();
      },
      m(t, o) {
        for (let n = 0; n < s.length; n += 1) s[n].m(t, o);
        u(t, n, o), (e = !0);
      },
      p(t, [e]) {
        const a = jt(t[0], t[2].store, t[1]);
        R(),
          (s = (function (t, n, e, s, o, a, i, l, r, c, u, d) {
            let f = t.length,
              p = a.length,
              m = f;
            const g = {};
            for (; m--; ) g[t[m].key] = m;
            const $ = [],
              h = new Map(),
              w = new Map();
            for (m = p; m--; ) {
              const t = d(o, a, m),
                l = e(t);
              let r = i.get(l);
              r ? s && r.p(t, n) : ((r = c(l, t)), r.c()),
                h.set(l, ($[m] = r)),
                l in g && w.set(l, Math.abs(m - g[l]));
            }
            const v = new Set(),
              b = new Set();
            function y(t) {
              j(t, 1), t.m(l, u), i.set(t.key, t), (u = t.first), p--;
            }
            for (; f && p; ) {
              const n = $[p - 1],
                e = t[f - 1],
                s = n.key,
                o = e.key;
              n === e
                ? ((u = n.first), f--, p--)
                : h.has(o)
                ? !i.has(s) || v.has(s)
                  ? y(n)
                  : b.has(o)
                  ? f--
                  : w.get(s) > w.get(o)
                  ? (b.add(s), y(n))
                  : (v.add(o), f--)
                : (r(e, i), f--);
            }
            for (; f--; ) {
              const n = t[f];
              h.has(n.key) || r(n, i);
            }
            for (; p; ) y($[p - 1]);
            return $;
          })(s, e, i, 1, t, a, o, n.parentNode, F, bn, n, vn)),
          M();
      },
      i(t) {
        if (!e) {
          for (let t = 0; t < a.length; t += 1) j(s[t]);
          e = !0;
        }
      },
      o(t) {
        for (let t = 0; t < s.length; t += 1) q(s[t]);
        e = !1;
      },
      d(t) {
        for (let n = 0; n < s.length; n += 1) s[n].d(t);
        t && d(n);
      },
    };
  }
  function xn(t, n, e) {
    let s;
    l(t, an, t => e(2, (s = t)));
    let { identityOptions: o } = n,
      { ns: a } = n;
    const i = pn(a),
      r = mn(a),
      c = gn(a);
    return (
      (t.$set = t => {
        'identityOptions' in t && e(1, (o = t.identityOptions)),
          'ns' in t && e(0, (a = t.ns));
      }),
      [a, o, s, i, r, c]
    );
  }
  class Cn extends Q {
    constructor(t) {
      super(), J(this, t, xn, yn, i, { identityOptions: 1, ns: 0 });
    }
  }
  function On(t) {
    let n;
    const e = new Cn({ props: { identityOptions: t[1], ns: t[0] } });
    return {
      c() {
        B(e.$$.fragment);
      },
      m(t, s) {
        K(e, t, s), (n = !0);
      },
      p(t, [n]) {
        const s = {};
        1 & n && (s.ns = t[0]), e.$set(s);
      },
      i(t) {
        n || (j(e.$$.fragment, t), (n = !0));
      },
      o(t) {
        q(e.$$.fragment, t), (n = !1);
      },
      d(t) {
        z(e, t);
      },
    };
  }
  function Dn(t, n, e) {
    let { type: s } = n,
      { ns: o = s.ns } = n,
      { spawn: a } = n,
      { id: i } = n,
      { onMount: l } = n;
    const r = { id: i || s.defaultId, spawn: a || s.defaultSpawn };
    return (
      x(() => {
        'function' == typeof l && l();
      }),
      (t.$set = t => {
        'type' in t && e(2, (s = t.type)),
          'ns' in t && e(0, (o = t.ns)),
          'spawn' in t && e(3, (a = t.spawn)),
          'id' in t && e(4, (i = t.id)),
          'onMount' in t && e(5, (l = t.onMount));
      }),
      [o, r, s, a, i, l]
    );
  }
  class Nn extends Q {
    constructor(t) {
      super(),
        J(this, t, Dn, On, i, { type: 2, ns: 0, spawn: 3, id: 4, onMount: 5 });
    }
  }
  function Sn(t) {
    let e;
    const s = [t[0], { type: un }];
    let o = {};
    for (let t = 0; t < s.length; t += 1) o = n(o, s[t]);
    const a = new Nn({ props: o });
    return {
      c() {
        B(a.$$.fragment);
      },
      m(t, n) {
        K(a, t, n), (e = !0);
      },
      p(t, [n]) {
        const e = 1 & n ? L(s, [1 & n && H(t[0]), 0 & n && { type: un }]) : {};
        a.$set(e);
      },
      i(t) {
        e || (j(a.$$.fragment, t), (e = !0));
      },
      o(t) {
        q(a.$$.fragment, t), (e = !1);
      },
      d(t) {
        z(a, t);
      },
    };
  }
  function _n(t, e, s) {
    return (
      (t.$set = t => {
        s(0, (e = n(n({}, e), r(t))));
      }),
      [(e = r(e))]
    );
  }
  class En extends Q {
    constructor(t) {
      super(), J(this, t, _n, Sn, i, {});
    }
  }
  function kn(t) {
    let e;
    const s = [t[0], { type: dn }];
    let o = {};
    for (let t = 0; t < s.length; t += 1) o = n(o, s[t]);
    const a = new Nn({ props: o });
    return {
      c() {
        B(a.$$.fragment);
      },
      m(t, n) {
        K(a, t, n), (e = !0);
      },
      p(t, [n]) {
        const e = 1 & n ? L(s, [1 & n && H(t[0]), 0 & n && { type: dn }]) : {};
        a.$set(e);
      },
      i(t) {
        e || (j(a.$$.fragment, t), (e = !0));
      },
      o(t) {
        q(a.$$.fragment, t), (e = !1);
      },
      d(t) {
        z(a, t);
      },
    };
  }
  function An(t, e, s) {
    return (
      (t.$set = t => {
        s(0, (e = n(n({}, e), r(t))));
      }),
      [(e = r(e))]
    );
  }
  class In extends Q {
    constructor(t) {
      super(), J(this, t, An, kn, i, {});
    }
  }
  function Pn(n) {
    let e,
      s,
      o,
      a,
      i,
      l,
      r,
      g,
      v = n[0].title + '';
    return {
      c() {
        (e = f('div')),
          (s = f('h2')),
          (o = p(v)),
          (a = m()),
          (i = f('button')),
          (i.textContent = 'Hide from component'),
          h(i, 'class', 'button'),
          h(i, 'data-test-id', 'button-hide-content'),
          h(e, 'class', (l = n[0].className)),
          h(
            e,
            'data-test-id',
            (r = `content-default${
              n[0].contentId ? `-${n[0].contentId}` : ''
            }`),
          ),
          (g = $(i, 'click', function () {
            n[0].hide.apply(this, arguments);
          }));
      },
      m(t, n) {
        u(t, e, n), c(e, s), c(s, o), c(e, a), c(e, i);
      },
      p(t, [s]) {
        (n = t),
          1 & s && v !== (v = n[0].title + '') && w(o, v),
          1 & s && l !== (l = n[0].className) && h(e, 'class', l),
          1 & s &&
            r !==
              (r = `content-default${
                n[0].contentId ? `-${n[0].contentId}` : ''
              }`) &&
            h(e, 'data-test-id', r);
      },
      i: t,
      o: t,
      d(t) {
        t && d(e), g();
      },
    };
  }
  function Tn(t, e, s) {
    return (
      (t.$set = t => {
        s(0, (e = n(n({}, e), r(t))));
      }),
      [(e = r(e))]
    );
  }
  class Rn extends Q {
    constructor(t) {
      super(), J(this, t, Tn, Pn, i, {});
    }
  }
  function Mn(n) {
    let e,
      s,
      o,
      a,
      i = `Show ${n[2]}` + '';
    return {
      c() {
        (e = f('button')),
          (s = p(i)),
          h(e, 'class', 'button primary'),
          h(e, 'data-test-id', (o = `button-show-${n[2]}`)),
          (a = $(e, 'click', n[0]));
      },
      m(t, n) {
        u(t, e, n), c(e, s);
      },
      p: t,
      d(t) {
        t && d(e), a();
      },
    };
  }
  function jn(n) {
    let e,
      s,
      o,
      a,
      i = `Hide ${n[2]}` + '';
    return {
      c() {
        (e = f('button')),
          (s = p(i)),
          h(e, 'class', 'button'),
          h(e, 'data-test-id', (o = `button-hide-${n[2]}`)),
          (a = $(e, 'click', n[1]));
      },
      m(t, n) {
        u(t, e, n), c(e, s);
      },
      p: t,
      d(t) {
        t && d(e), a();
      },
    };
  }
  function qn(n) {
    let e,
      s,
      o = n[0] && Mn(n),
      a = n[1] && jn(n);
    return {
      c() {
        (e = f('div')),
          o && o.c(),
          (s = m()),
          a && a.c(),
          h(e, 'class', 'buttons');
      },
      m(t, n) {
        u(t, e, n), o && o.m(e, null), c(e, s), a && a.m(e, null);
      },
      p(t, [n]) {
        t[0]
          ? o
            ? o.p(t, n)
            : ((o = Mn(t)), o.c(), o.m(e, s))
          : o && (o.d(1), (o = null)),
          t[1]
            ? a
              ? a.p(t, n)
              : ((a = jn(t)), a.c(), a.m(e, null))
            : a && (a.d(1), (a = null));
      },
      i: t,
      o: t,
      d(t) {
        t && d(e), o && o.d(), a && a.d();
      },
    };
  }
  function Fn(t, n, e) {
    let { showFn: s } = n,
      { hideFn: o } = n,
      { id: a = '' } = n,
      { spawn: i = '' } = n,
      { name: l = '' } = n;
    const r = l || `${a ? `id${a}` : ''}${i ? `spawn${i}` : ''}` || 'default';
    return (
      (t.$set = t => {
        'showFn' in t && e(0, (s = t.showFn)),
          'hideFn' in t && e(1, (o = t.hideFn)),
          'id' in t && e(3, (a = t.id)),
          'spawn' in t && e(4, (i = t.spawn)),
          'name' in t && e(5, (l = t.name));
      }),
      [s, o, r, a, i, l]
    );
  }
  class Ln extends Q {
    constructor(t) {
      super(),
        J(this, t, Fn, qn, i, {
          showFn: 0,
          hideFn: 1,
          id: 3,
          spawn: 4,
          name: 5,
        });
    }
  }
  const Hn = () => Math.round(1e3 * Math.random()).toString(),
    Bn = ({
      instance: t,
      component: n,
      className: e,
      title: s,
      id: o,
      spawn: a,
      styles: i,
      timeout: l,
      queued: r,
    }) => {
      const c = `${o ? `id${o}` : ''}${a ? `spawn${a}` : ''}`,
        u = {
          dialogic: {
            component: n,
            className: e,
            styles: i,
            id: o,
            spawn: a,
            ...(void 0 !== a ? { spawn: a } : void 0),
            ...(void 0 !== l ? { timeout: l } : void 0),
            ...(void 0 !== r ? { queued: r } : void 0),
          },
          className: 'instance-content',
          id: Hn(),
          contentId: c,
        };
      return {
        showFn: () => t.show({ ...u, title: `${s} ${Hn()}` }),
        hideFn: () => t.hide({ ...u, title: `${s} ${Hn()} hiding` }),
      };
    };
  function Kn(t) {
    let e, s, o, a;
    const i = [t[0]];
    let l = {};
    for (let t = 0; t < i.length; t += 1) l = n(l, i[t]);
    const r = new Ln({ props: l }),
      p = new En({});
    return {
      c() {
        (e = f('div')),
          B(r.$$.fragment),
          (s = m()),
          (o = f('div')),
          B(p.$$.fragment),
          h(o, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n), K(r, e, null), c(e, s), c(e, o), K(p, o, null), (a = !0);
      },
      p(t, [n]) {
        const e = 1 & n ? L(i, [H(t[0])]) : {};
        r.$set(e);
      },
      i(t) {
        a || (j(r.$$.fragment, t), j(p.$$.fragment, t), (a = !0));
      },
      o(t) {
        q(r.$$.fragment, t), q(p.$$.fragment, t), (a = !1);
      },
      d(t) {
        t && d(e), z(r), z(p);
      },
    };
  }
  function zn(t) {
    return [
      Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'DialogClassName',
      }),
    ];
  }
  function Vn(t) {
    let e, s, o, a;
    const i = [t[0]];
    let l = {};
    for (let t = 0; t < i.length; t += 1) l = n(l, i[t]);
    const r = new Ln({ props: l }),
      p = new En({});
    return {
      c() {
        (e = f('div')),
          B(r.$$.fragment),
          (s = m()),
          (o = f('div')),
          B(p.$$.fragment),
          h(o, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n), K(r, e, null), c(e, s), c(e, o), K(p, o, null), (a = !0);
      },
      p(t, [n]) {
        const e = 1 & n ? L(i, [H(t[0])]) : {};
        r.$set(e);
      },
      i(t) {
        a || (j(r.$$.fragment, t), j(p.$$.fragment, t), (a = !0));
      },
      o(t) {
        q(r.$$.fragment, t), q(p.$$.fragment, t), (a = !1);
      },
      d(t) {
        t && d(e), z(r), z(p);
      },
    };
  }
  function Jn(t) {
    return [
      Bn({
        instance: un,
        component: Rn,
        className: 'dialog-delay',
        title: 'DialogClassDelay',
      }),
    ];
  }
  function Qn(t) {
    let e, s, o, a, i;
    const l = [t[0]];
    let r = {};
    for (let t = 0; t < l.length; t += 1) r = n(r, l[t]);
    const p = new Ln({ props: r }),
      g = [t[1], { name: 'combi' }];
    let $ = {};
    for (let t = 0; t < g.length; t += 1) $ = n($, g[t]);
    const w = new Ln({ props: $ }),
      v = new En({});
    return {
      c() {
        (e = f('div')),
          B(p.$$.fragment),
          (s = m()),
          B(w.$$.fragment),
          (o = m()),
          (a = f('div')),
          B(v.$$.fragment),
          h(a, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n),
          K(p, e, null),
          c(e, s),
          K(w, e, null),
          c(e, o),
          c(e, a),
          K(v, a, null),
          (i = !0);
      },
      p(t, [n]) {
        const e = 1 & n ? L(l, [H(t[0])]) : {};
        p.$set(e);
        const s = 2 & n ? L(g, [H(t[1]), g[1]]) : {};
        w.$set(s);
      },
      i(t) {
        i ||
          (j(p.$$.fragment, t),
          j(w.$$.fragment, t),
          j(v.$$.fragment, t),
          (i = !0));
      },
      o(t) {
        q(p.$$.fragment, t), q(w.$$.fragment, t), q(v.$$.fragment, t), (i = !1);
      },
      d(t) {
        t && d(e), z(p), z(w), z(v);
      },
    };
  }
  function Gn(t) {
    return [
      Bn({
        instance: un,
        component: Rn,
        title: 'DialogStyles',
        styles: t => {
          const n = t.getBoundingClientRect().height;
          return {
            default: { transition: 'all 350ms ease-in-out' },
            showStart: { opacity: '0', transform: `translate3d(0, ${n}px, 0)` },
            showEnd: { opacity: '1', transform: 'translate3d(0, 0px,  0)' },
            hideEnd: {
              transitionDuration: '450ms',
              transform: `translate3d(0, ${n}px, 0)`,
              opacity: '0',
            },
          };
        },
      }),
      Bn({
        instance: un,
        component: Rn,
        title: 'DialogStyles combi',
        className: 'dialog',
        styles: t => {
          return {
            default: { transition: 'all 350ms ease-in-out' },
            hideEnd: {
              transitionDuration: '450ms',
              transform: `translate3d(0, ${
                t.getBoundingClientRect().height
              }px, 0)`,
              opacity: '0',
            },
          };
        },
      }),
    ];
  }
  function Wn(t) {
    let e, s, o, a, i, l;
    const r = [t[0]];
    let p = {};
    for (let t = 0; t < r.length; t += 1) p = n(p, r[t]);
    const g = new Ln({ props: p }),
      $ = [t[1], { id: '1' }];
    let w = {};
    for (let t = 0; t < $.length; t += 1) w = n(w, $[t]);
    const v = new Ln({ props: w }),
      b = [t[2], { id: '2' }];
    let y = {};
    for (let t = 0; t < b.length; t += 1) y = n(y, b[t]);
    const x = new Ln({ props: y }),
      C = new En({});
    return {
      c() {
        (e = f('div')),
          B(g.$$.fragment),
          (s = m()),
          B(v.$$.fragment),
          (o = m()),
          B(x.$$.fragment),
          (a = m()),
          (i = f('div')),
          B(C.$$.fragment),
          h(i, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n),
          K(g, e, null),
          c(e, s),
          K(v, e, null),
          c(e, o),
          K(x, e, null),
          c(e, a),
          c(e, i),
          K(C, i, null),
          (l = !0);
      },
      p(t, [n]) {
        const e = 1 & n ? L(r, [H(t[0])]) : {};
        g.$set(e);
        const s = 2 & n ? L($, [H(t[1]), $[1]]) : {};
        v.$set(s);
        const o = 4 & n ? L(b, [H(t[2]), b[1]]) : {};
        x.$set(o);
      },
      i(t) {
        l ||
          (j(g.$$.fragment, t),
          j(v.$$.fragment, t),
          j(x.$$.fragment, t),
          j(C.$$.fragment, t),
          (l = !0));
      },
      o(t) {
        q(g.$$.fragment, t),
          q(v.$$.fragment, t),
          q(x.$$.fragment, t),
          q(C.$$.fragment, t),
          (l = !1);
      },
      d(t) {
        t && d(e), z(g), z(v), z(x), z(C);
      },
    };
  }
  function Xn(t) {
    return (
      un.resetAll(),
      [
        Bn({
          instance: un,
          component: Rn,
          className: 'dialog',
          title: 'DialogIds default',
        }),
        Bn({
          instance: un,
          component: Rn,
          className: 'dialog',
          id: '1',
          title: 'DialogIds 1',
        }),
        Bn({
          instance: un,
          component: Rn,
          className: 'dialog',
          id: '2',
          title: 'DialogIds 2',
        }),
      ]
    );
  }
  function Yn(t) {
    let e,
      s,
      o,
      a,
      i,
      l,
      r,
      g,
      $,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I = `Exists any: ${t[0]}` + '',
      P = `Exists id: ${t[1]}` + '',
      T = `Exists spawn: ${t[2]}` + '',
      R = `Exists spawn, id: ${t[3]}` + '';
    const M = [t[4]];
    let F = {};
    for (let t = 0; t < M.length; t += 1) F = n(F, M[t]);
    const V = new Ln({ props: F }),
      J = [t[5], { id: '1' }];
    let Q = {};
    for (let t = 0; t < J.length; t += 1) Q = n(Q, J[t]);
    const G = new Ln({ props: Q }),
      W = [t[6], { spawn: '1' }];
    let X = {};
    for (let t = 0; t < W.length; t += 1) X = n(X, W[t]);
    const Y = new Ln({ props: X }),
      U = [t[7], { spawn: '1' }, { id: '1' }];
    let Z = {};
    for (let t = 0; t < U.length; t += 1) Z = n(Z, U[t]);
    const tt = new Ln({ props: Z }),
      nt = new En({}),
      et = new En({ props: { spawn: '1' } });
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (o = p(I)),
          (a = m()),
          (i = f('div')),
          (l = p(P)),
          (r = m()),
          (g = f('div')),
          ($ = p(T)),
          (v = m()),
          (b = f('div')),
          (y = p(R)),
          (x = m()),
          (C = f('div')),
          B(V.$$.fragment),
          (O = m()),
          B(G.$$.fragment),
          (D = m()),
          B(Y.$$.fragment),
          (N = m()),
          B(tt.$$.fragment),
          (S = m()),
          (_ = f('div')),
          B(nt.$$.fragment),
          (E = m()),
          (k = f('div')),
          B(et.$$.fragment),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'count-all'),
          h(i, 'class', 'control'),
          h(i, 'data-test-id', 'count-id'),
          h(g, 'class', 'control'),
          h(g, 'data-test-id', 'count-spawn'),
          h(b, 'class', 'control'),
          h(b, 'data-test-id', 'count-spawn-id'),
          h(C, 'class', 'content'),
          h(_, 'class', 'spawn default-spawn'),
          h(k, 'class', 'spawn custom-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, o),
          c(e, a),
          c(e, i),
          c(i, l),
          c(e, r),
          c(e, g),
          c(g, $),
          c(e, v),
          c(e, b),
          c(b, y),
          c(e, x),
          c(e, C),
          K(V, C, null),
          c(C, O),
          K(G, C, null),
          c(C, D),
          K(Y, C, null),
          c(C, N),
          K(tt, C, null),
          c(e, S),
          c(e, _),
          K(nt, _, null),
          c(e, E),
          c(e, k),
          K(et, k, null),
          (A = !0);
      },
      p(t, [n]) {
        (!A || 1 & n) && I !== (I = `Exists any: ${t[0]}` + '') && w(o, I),
          (!A || 2 & n) && P !== (P = `Exists id: ${t[1]}` + '') && w(l, P),
          (!A || 4 & n) && T !== (T = `Exists spawn: ${t[2]}` + '') && w($, T),
          (!A || 8 & n) &&
            R !== (R = `Exists spawn, id: ${t[3]}` + '') &&
            w(y, R);
        const e = 16 & n ? L(M, [H(t[4])]) : {};
        V.$set(e);
        const s = 32 & n ? L(J, [H(t[5]), J[1]]) : {};
        G.$set(s);
        const a = 64 & n ? L(W, [H(t[6]), W[1]]) : {};
        Y.$set(a);
        const i = 128 & n ? L(U, [H(t[7]), U[1], U[2]]) : {};
        tt.$set(i);
      },
      i(t) {
        A ||
          (j(V.$$.fragment, t),
          j(G.$$.fragment, t),
          j(Y.$$.fragment, t),
          j(tt.$$.fragment, t),
          j(nt.$$.fragment, t),
          j(et.$$.fragment, t),
          (A = !0));
      },
      o(t) {
        q(V.$$.fragment, t),
          q(G.$$.fragment, t),
          q(Y.$$.fragment, t),
          q(tt.$$.fragment, t),
          q(nt.$$.fragment, t),
          q(et.$$.fragment, t),
          (A = !1);
      },
      d(t) {
        t && d(e), z(V), z(G), z(Y), z(tt), z(nt), z(et);
      },
    };
  }
  function Un(t, n, e) {
    let s, o, a, i;
    const r = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'Default',
      }),
      c = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        id: '1',
        title: 'ID',
      }),
      u = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        title: 'Spawn',
      }),
      d = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        id: '1',
        title: 'Spawn and ID',
      }),
      f = un.exists();
    l(t, f, t => e(0, (s = t)));
    const p = un.exists({ id: '1' });
    l(t, p, t => e(1, (o = t)));
    const m = un.exists({ spawn: '1' });
    l(t, m, t => e(2, (a = t)));
    const g = un.exists({ spawn: '1', id: '1' });
    return l(t, g, t => e(3, (i = t))), [s, o, a, i, r, c, u, d, f, p, m, g];
  }
  function Zn(t) {
    let e,
      s,
      o,
      a,
      i,
      l,
      r,
      g,
      $,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I,
      P,
      T,
      R,
      M,
      F,
      V = `Count all: ${t[0]}` + '',
      J = `Count id: ${t[1]}` + '',
      Q = `Count spawn: ${t[2]}` + '',
      G = `Count spawn, id: ${t[3]}` + '',
      W = `Count spawn, queued: ${t[4]}` + '';
    const X = [t[5]];
    let Y = {};
    for (let t = 0; t < X.length; t += 1) Y = n(Y, X[t]);
    const U = new Ln({ props: Y }),
      Z = [t[6], { id: '1' }];
    let tt = {};
    for (let t = 0; t < Z.length; t += 1) tt = n(tt, Z[t]);
    const nt = new Ln({ props: tt }),
      et = [t[7], { spawn: '1' }];
    let st = {};
    for (let t = 0; t < et.length; t += 1) st = n(st, et[t]);
    const ot = new Ln({ props: st }),
      at = [t[8], { spawn: '1' }, { id: '1' }];
    let it = {};
    for (let t = 0; t < at.length; t += 1) it = n(it, at[t]);
    const lt = new Ln({ props: it }),
      rt = [t[9], { spawn: '2' }, { name: 'queued' }];
    let ct = {};
    for (let t = 0; t < rt.length; t += 1) ct = n(ct, rt[t]);
    const ut = new Ln({ props: ct }),
      dt = new En({}),
      ft = new En({ props: { spawn: '1' } }),
      pt = new En({ props: { spawn: '2' } });
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (o = p(V)),
          (a = m()),
          (i = f('div')),
          (l = p(J)),
          (r = m()),
          (g = f('div')),
          ($ = p(Q)),
          (v = m()),
          (b = f('div')),
          (y = p(G)),
          (x = m()),
          (C = f('div')),
          (O = p(W)),
          (D = m()),
          (N = f('div')),
          B(U.$$.fragment),
          (S = m()),
          B(nt.$$.fragment),
          (_ = m()),
          B(ot.$$.fragment),
          (E = m()),
          B(lt.$$.fragment),
          (k = m()),
          B(ut.$$.fragment),
          (A = m()),
          (I = f('div')),
          B(dt.$$.fragment),
          (P = m()),
          (T = f('div')),
          B(ft.$$.fragment),
          (R = m()),
          (M = f('div')),
          B(pt.$$.fragment),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'count-all'),
          h(i, 'class', 'control'),
          h(i, 'data-test-id', 'count-id'),
          h(g, 'class', 'control'),
          h(g, 'data-test-id', 'count-spawn'),
          h(b, 'class', 'control'),
          h(b, 'data-test-id', 'count-spawn-id'),
          h(C, 'class', 'control'),
          h(C, 'data-test-id', 'count-spawn-queued'),
          h(N, 'class', 'content'),
          h(I, 'class', 'spawn default-spawn'),
          h(T, 'class', 'spawn custom-spawn'),
          h(M, 'class', 'spawn custom-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, o),
          c(e, a),
          c(e, i),
          c(i, l),
          c(e, r),
          c(e, g),
          c(g, $),
          c(e, v),
          c(e, b),
          c(b, y),
          c(e, x),
          c(e, C),
          c(C, O),
          c(e, D),
          c(e, N),
          K(U, N, null),
          c(N, S),
          K(nt, N, null),
          c(N, _),
          K(ot, N, null),
          c(N, E),
          K(lt, N, null),
          c(N, k),
          K(ut, N, null),
          c(e, A),
          c(e, I),
          K(dt, I, null),
          c(e, P),
          c(e, T),
          K(ft, T, null),
          c(e, R),
          c(e, M),
          K(pt, M, null),
          (F = !0);
      },
      p(t, [n]) {
        (!F || 1 & n) && V !== (V = `Count all: ${t[0]}` + '') && w(o, V),
          (!F || 2 & n) && J !== (J = `Count id: ${t[1]}` + '') && w(l, J),
          (!F || 4 & n) && Q !== (Q = `Count spawn: ${t[2]}` + '') && w($, Q),
          (!F || 8 & n) &&
            G !== (G = `Count spawn, id: ${t[3]}` + '') &&
            w(y, G),
          (!F || 16 & n) &&
            W !== (W = `Count spawn, queued: ${t[4]}` + '') &&
            w(O, W);
        const e = 32 & n ? L(X, [H(t[5])]) : {};
        U.$set(e);
        const s = 64 & n ? L(Z, [H(t[6]), Z[1]]) : {};
        nt.$set(s);
        const a = 128 & n ? L(et, [H(t[7]), et[1]]) : {};
        ot.$set(a);
        const i = 256 & n ? L(at, [H(t[8]), at[1], at[2]]) : {};
        lt.$set(i);
        const r = 512 & n ? L(rt, [H(t[9]), rt[1], rt[2]]) : {};
        ut.$set(r);
      },
      i(t) {
        F ||
          (j(U.$$.fragment, t),
          j(nt.$$.fragment, t),
          j(ot.$$.fragment, t),
          j(lt.$$.fragment, t),
          j(ut.$$.fragment, t),
          j(dt.$$.fragment, t),
          j(ft.$$.fragment, t),
          j(pt.$$.fragment, t),
          (F = !0));
      },
      o(t) {
        q(U.$$.fragment, t),
          q(nt.$$.fragment, t),
          q(ot.$$.fragment, t),
          q(lt.$$.fragment, t),
          q(ut.$$.fragment, t),
          q(dt.$$.fragment, t),
          q(ft.$$.fragment, t),
          q(pt.$$.fragment, t),
          (F = !1);
      },
      d(t) {
        t && d(e), z(U), z(nt), z(ot), z(lt), z(ut), z(dt), z(ft), z(pt);
      },
    };
  }
  function te(t, n, e) {
    let s, o, a, i, r;
    const c = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'Default',
      }),
      u = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        id: '1',
        title: 'ID',
      }),
      d = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        title: 'Spawn',
      }),
      f = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        id: '1',
        title: 'Spawn and ID',
      }),
      p = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '2',
        title: 'Spawn queued',
        queued: !0,
      }),
      m = un.getCount();
    l(t, m, t => e(0, (s = t)));
    const g = un.getCount({ id: '1' });
    l(t, g, t => e(1, (o = t)));
    const $ = un.getCount({ spawn: '1' });
    l(t, $, t => e(2, (a = t)));
    const h = un.getCount({ spawn: '1', id: '1' });
    l(t, h, t => e(3, (i = t)));
    const w = un.getCount({ spawn: '2' });
    return (
      l(t, w, t => e(4, (r = t))), [s, o, a, i, r, c, u, d, f, p, m, g, $, h, w]
    );
  }
  function ne(t) {
    let e,
      s,
      a,
      i,
      l,
      r,
      g,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I,
      P,
      T,
      R,
      M,
      F,
      V,
      J,
      Q,
      G,
      W,
      X,
      Y,
      U,
      Z,
      tt = `Count all: ${t[0]}` + '',
      nt = `Count id: ${t[1]}` + '',
      et = `Count spawn: ${t[2]}` + '',
      st = `Count spawn, id: ${t[3]}` + '';
    const ot = [t[4]];
    let at = {};
    for (let t = 0; t < ot.length; t += 1) at = n(at, ot[t]);
    const it = new Ln({ props: at }),
      lt = [t[5], { id: '1' }];
    let rt = {};
    for (let t = 0; t < lt.length; t += 1) rt = n(rt, lt[t]);
    const ct = new Ln({ props: rt }),
      ut = [t[6], { spawn: '1' }];
    let dt = {};
    for (let t = 0; t < ut.length; t += 1) dt = n(dt, ut[t]);
    const ft = new Ln({ props: dt }),
      pt = [t[7], { spawn: '1' }, { id: '1' }];
    let mt = {};
    for (let t = 0; t < pt.length; t += 1) mt = n(mt, pt[t]);
    const gt = new Ln({ props: mt }),
      $t = new En({}),
      ht = new En({ props: { spawn: '1' } });
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = p(tt)),
          (i = m()),
          (l = f('div')),
          (r = p(nt)),
          (g = m()),
          (v = f('div')),
          (b = p(et)),
          (y = m()),
          (x = f('div')),
          (C = p(st)),
          (O = m()),
          (D = f('div')),
          (N = f('div')),
          (S = f('button')),
          (S.textContent = 'Hide all'),
          (_ = m()),
          (E = f('button')),
          (E.textContent = 'Hide all simultaneously'),
          (k = m()),
          (A = f('button')),
          (A.textContent = 'Hide all with id'),
          (I = m()),
          (P = f('button')),
          (P.textContent = 'Hide all with spawn'),
          (T = m()),
          (R = f('button')),
          (R.textContent = 'Hide all with spawn and id'),
          (M = m()),
          (F = f('div')),
          B(it.$$.fragment),
          (V = m()),
          B(ct.$$.fragment),
          (J = m()),
          B(ft.$$.fragment),
          (Q = m()),
          B(gt.$$.fragment),
          (G = m()),
          (W = f('div')),
          B($t.$$.fragment),
          (X = m()),
          (Y = f('div')),
          B(ht.$$.fragment),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'count-all'),
          h(l, 'class', 'control'),
          h(l, 'data-test-id', 'count-id'),
          h(v, 'class', 'control'),
          h(v, 'data-test-id', 'count-spawn'),
          h(x, 'class', 'control'),
          h(x, 'data-test-id', 'count-spawn-id'),
          h(S, 'class', 'button'),
          h(S, 'data-test-id', 'button-hide-all'),
          h(E, 'class', 'button'),
          h(E, 'data-test-id', 'button-hide-all-simultaneously'),
          h(A, 'class', 'button'),
          h(A, 'data-test-id', 'button-hide-all-id'),
          h(P, 'class', 'button'),
          h(P, 'data-test-id', 'button-hide-all-spawn'),
          h(R, 'class', 'button'),
          h(R, 'data-test-id', 'button-hide-all-spawn-id'),
          h(N, 'class', 'buttons'),
          h(D, 'class', 'control'),
          h(D, 'data-test-id', 'hide-all'),
          h(F, 'class', 'content'),
          h(W, 'class', 'spawn default-spawn'),
          h(Y, 'class', 'spawn custom-spawn'),
          h(e, 'class', 'test'),
          (Z = [
            $(S, 'click', t[13]),
            $(E, 'click', t[14]),
            $(A, 'click', t[15]),
            $(P, 'click', t[16]),
            $(R, 'click', t[17]),
          ]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(e, i),
          c(e, l),
          c(l, r),
          c(e, g),
          c(e, v),
          c(v, b),
          c(e, y),
          c(e, x),
          c(x, C),
          c(e, O),
          c(e, D),
          c(D, N),
          c(N, S),
          c(N, _),
          c(N, E),
          c(N, k),
          c(N, A),
          c(N, I),
          c(N, P),
          c(N, T),
          c(N, R),
          c(e, M),
          c(e, F),
          K(it, F, null),
          c(F, V),
          K(ct, F, null),
          c(F, J),
          K(ft, F, null),
          c(F, Q),
          K(gt, F, null),
          c(e, G),
          c(e, W),
          K($t, W, null),
          c(e, X),
          c(e, Y),
          K(ht, Y, null),
          (U = !0);
      },
      p(t, [n]) {
        (!U || 1 & n) && tt !== (tt = `Count all: ${t[0]}` + '') && w(a, tt),
          (!U || 2 & n) && nt !== (nt = `Count id: ${t[1]}` + '') && w(r, nt),
          (!U || 4 & n) &&
            et !== (et = `Count spawn: ${t[2]}` + '') &&
            w(b, et),
          (!U || 8 & n) &&
            st !== (st = `Count spawn, id: ${t[3]}` + '') &&
            w(C, st);
        const e = 16 & n ? L(ot, [H(t[4])]) : {};
        it.$set(e);
        const s = 32 & n ? L(lt, [H(t[5]), lt[1]]) : {};
        ct.$set(s);
        const o = 64 & n ? L(ut, [H(t[6]), ut[1]]) : {};
        ft.$set(o);
        const i = 128 & n ? L(pt, [H(t[7]), pt[1], pt[2]]) : {};
        gt.$set(i);
      },
      i(t) {
        U ||
          (j(it.$$.fragment, t),
          j(ct.$$.fragment, t),
          j(ft.$$.fragment, t),
          j(gt.$$.fragment, t),
          j($t.$$.fragment, t),
          j(ht.$$.fragment, t),
          (U = !0));
      },
      o(t) {
        q(it.$$.fragment, t),
          q(ct.$$.fragment, t),
          q(ft.$$.fragment, t),
          q(gt.$$.fragment, t),
          q($t.$$.fragment, t),
          q(ht.$$.fragment, t),
          (U = !1);
      },
      d(t) {
        t && d(e), z(it), z(ct), z(ft), z(gt), z($t), z(ht), o(Z);
      },
    };
  }
  function ee(t, n, e) {
    let s, o, a, i;
    const r = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'Default',
      }),
      c = Bn({
        instance: un,
        component: Rn,
        className: 'dialog dialog-delay',
        id: '1',
        title: 'ID',
      }),
      u = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        title: 'Spawn',
      }),
      d = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        id: '1',
        title: 'Spawn and ID',
      }),
      f = un.getCount();
    l(t, f, t => e(0, (s = t)));
    const p = un.getCount({ id: '1' });
    l(t, p, t => e(1, (o = t)));
    const m = un.getCount({ spawn: '1' });
    l(t, m, t => e(2, (a = t)));
    const g = un.getCount({ spawn: '1', id: '1' });
    l(t, g, t => e(3, (i = t)));
    const $ = {
      showEnd: { opacity: '1' },
      hideEnd: { transition: 'all 450ms ease-in-out', opacity: '0' },
    };
    return [
      s,
      o,
      a,
      i,
      r,
      c,
      u,
      d,
      f,
      p,
      m,
      g,
      $,
      () => un.hideAll(),
      () => un.hideAll({ styles: $ }),
      () => un.hideAll({ id: '1' }),
      () => un.hideAll({ spawn: '1' }),
      () => un.hideAll({ id: '1', spawn: '1' }),
    ];
  }
  function se(t) {
    let e,
      s,
      a,
      i,
      l,
      r,
      g,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I,
      P,
      T,
      R,
      M,
      F,
      V,
      J,
      Q,
      G,
      W,
      X,
      Y,
      U = `Count all: ${t[0]}` + '',
      Z = `Count id: ${t[1]}` + '',
      tt = `Count spawn: ${t[2]}` + '',
      nt = `Count spawn, id: ${t[3]}` + '';
    const et = [t[4]];
    let st = {};
    for (let t = 0; t < et.length; t += 1) st = n(st, et[t]);
    const ot = new Ln({ props: st }),
      at = [t[5], { id: '1' }];
    let it = {};
    for (let t = 0; t < at.length; t += 1) it = n(it, at[t]);
    const lt = new Ln({ props: it }),
      rt = [t[6], { spawn: '1' }];
    let ct = {};
    for (let t = 0; t < rt.length; t += 1) ct = n(ct, rt[t]);
    const ut = new Ln({ props: ct }),
      dt = [t[7], { spawn: '1' }, { id: '1' }];
    let ft = {};
    for (let t = 0; t < dt.length; t += 1) ft = n(ft, dt[t]);
    const pt = new Ln({ props: ft }),
      mt = new En({}),
      gt = new En({ props: { spawn: '1' } });
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = p(U)),
          (i = m()),
          (l = f('div')),
          (r = p(Z)),
          (g = m()),
          (v = f('div')),
          (b = p(tt)),
          (y = m()),
          (x = f('div')),
          (C = p(nt)),
          (O = m()),
          (D = f('div')),
          (N = f('div')),
          (S = f('button')),
          (S.textContent = 'Reset all'),
          (_ = m()),
          (E = f('button')),
          (E.textContent = 'Reset all with id'),
          (k = m()),
          (A = f('button')),
          (A.textContent = 'Reset all with spawn'),
          (I = m()),
          (P = f('button')),
          (P.textContent = 'Reset all with spawn and id'),
          (T = m()),
          (R = f('div')),
          B(ot.$$.fragment),
          (M = m()),
          B(lt.$$.fragment),
          (F = m()),
          B(ut.$$.fragment),
          (V = m()),
          B(pt.$$.fragment),
          (J = m()),
          (Q = f('div')),
          B(mt.$$.fragment),
          (G = m()),
          (W = f('div')),
          B(gt.$$.fragment),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'count-all'),
          h(l, 'class', 'control'),
          h(l, 'data-test-id', 'count-id'),
          h(v, 'class', 'control'),
          h(v, 'data-test-id', 'count-spawn'),
          h(x, 'class', 'control'),
          h(x, 'data-test-id', 'count-spawn-id'),
          h(S, 'class', 'button'),
          h(S, 'data-test-id', 'button-reset-all'),
          h(E, 'class', 'button'),
          h(E, 'data-test-id', 'button-reset-all-id'),
          h(A, 'class', 'button'),
          h(A, 'data-test-id', 'button-reset-all-spawn'),
          h(P, 'class', 'button'),
          h(P, 'data-test-id', 'button-reset-all-spawn-id'),
          h(N, 'class', 'buttons'),
          h(D, 'class', 'control'),
          h(D, 'data-test-id', 'reset-all'),
          h(R, 'class', 'content'),
          h(Q, 'class', 'spawn default-spawn'),
          h(W, 'class', 'spawn custom-spawn'),
          h(e, 'class', 'test'),
          (Y = [
            $(S, 'click', t[12]),
            $(E, 'click', t[13]),
            $(A, 'click', t[14]),
            $(P, 'click', t[15]),
          ]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(e, i),
          c(e, l),
          c(l, r),
          c(e, g),
          c(e, v),
          c(v, b),
          c(e, y),
          c(e, x),
          c(x, C),
          c(e, O),
          c(e, D),
          c(D, N),
          c(N, S),
          c(N, _),
          c(N, E),
          c(N, k),
          c(N, A),
          c(N, I),
          c(N, P),
          c(e, T),
          c(e, R),
          K(ot, R, null),
          c(R, M),
          K(lt, R, null),
          c(R, F),
          K(ut, R, null),
          c(R, V),
          K(pt, R, null),
          c(e, J),
          c(e, Q),
          K(mt, Q, null),
          c(e, G),
          c(e, W),
          K(gt, W, null),
          (X = !0);
      },
      p(t, [n]) {
        (!X || 1 & n) && U !== (U = `Count all: ${t[0]}` + '') && w(a, U),
          (!X || 2 & n) && Z !== (Z = `Count id: ${t[1]}` + '') && w(r, Z),
          (!X || 4 & n) &&
            tt !== (tt = `Count spawn: ${t[2]}` + '') &&
            w(b, tt),
          (!X || 8 & n) &&
            nt !== (nt = `Count spawn, id: ${t[3]}` + '') &&
            w(C, nt);
        const e = 16 & n ? L(et, [H(t[4])]) : {};
        ot.$set(e);
        const s = 32 & n ? L(at, [H(t[5]), at[1]]) : {};
        lt.$set(s);
        const o = 64 & n ? L(rt, [H(t[6]), rt[1]]) : {};
        ut.$set(o);
        const i = 128 & n ? L(dt, [H(t[7]), dt[1], dt[2]]) : {};
        pt.$set(i);
      },
      i(t) {
        X ||
          (j(ot.$$.fragment, t),
          j(lt.$$.fragment, t),
          j(ut.$$.fragment, t),
          j(pt.$$.fragment, t),
          j(mt.$$.fragment, t),
          j(gt.$$.fragment, t),
          (X = !0));
      },
      o(t) {
        q(ot.$$.fragment, t),
          q(lt.$$.fragment, t),
          q(ut.$$.fragment, t),
          q(pt.$$.fragment, t),
          q(mt.$$.fragment, t),
          q(gt.$$.fragment, t),
          (X = !1);
      },
      d(t) {
        t && d(e), z(ot), z(lt), z(ut), z(pt), z(mt), z(gt), o(Y);
      },
    };
  }
  function oe(t, n, e) {
    let s, o, a, i;
    const r = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'Default',
      }),
      c = Bn({
        instance: un,
        component: Rn,
        className: 'dialog dialog-delay',
        id: '1',
        title: 'ID',
      }),
      u = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        title: 'Spawn',
      }),
      d = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        spawn: '1',
        id: '1',
        title: 'Spawn and ID',
      }),
      f = un.getCount();
    l(t, f, t => e(0, (s = t)));
    const p = un.getCount({ id: '1' });
    l(t, p, t => e(1, (o = t)));
    const m = un.getCount({ spawn: '1' });
    l(t, m, t => e(2, (a = t)));
    const g = un.getCount({ spawn: '1', id: '1' });
    l(t, g, t => e(3, (i = t)));
    return [
      s,
      o,
      a,
      i,
      r,
      c,
      u,
      d,
      f,
      p,
      m,
      g,
      () => un.resetAll(),
      () => un.resetAll({ id: '1' }),
      () => un.resetAll({ spawn: '1' }),
      () => un.resetAll({ id: '1', spawn: '1' }),
    ];
  }
  function ae(n) {
    let e,
      s,
      o,
      a,
      i,
      l = (void 0 === n[0] ? 'undefined' : n[0].toString()) + '';
    return {
      c() {
        (e = f('div')),
          (s = f('span')),
          (s.textContent = 'Remaining:'),
          (o = m()),
          (a = f('span')),
          (i = p(l)),
          h(a, 'data-test-id', 'remaining-value'),
          h(e, 'data-test-id', 'remaining');
      },
      m(t, n) {
        u(t, e, n), c(e, s), c(e, o), c(e, a), c(a, i);
      },
      p(t, [n]) {
        1 & n &&
          l !== (l = (void 0 === t[0] ? 'undefined' : t[0].toString()) + '') &&
          w(i, l);
      },
      i: t,
      o: t,
      d(t) {
        t && d(e);
      },
    };
  }
  function ie(t, n, e) {
    let s,
      { getRemainingFn: o } = n,
      a = 0;
    const i = () => {
      const t = o();
      e(0, (a = void 0 === t ? void 0 : Math.max(t, 0))),
        (s = window.requestAnimationFrame(i));
    };
    var l;
    return (
      (s = window.requestAnimationFrame(i)),
      (l = () => {
        window.cancelAnimationFrame(s);
      }),
      y().$$.on_destroy.push(l),
      (t.$set = t => {
        'getRemainingFn' in t && e(1, (o = t.getRemainingFn));
      }),
      [a, o]
    );
  }
  class le extends Q {
    constructor(t) {
      super(), J(this, t, ie, ae, i, { getRemainingFn: 1 });
    }
  }
  function re(t) {
    let e,
      s,
      a,
      i,
      l,
      r,
      g,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A = `Is paused: ${t[0]}` + '';
    const I = new le({ props: { getRemainingFn: un.getRemaining } }),
      P = [t[1]];
    let T = {};
    for (let t = 0; t < P.length; t += 1) T = n(T, P[t]);
    const R = new Ln({ props: T }),
      M = new En({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = f('div')),
          (i = f('button')),
          (i.textContent = 'Pause'),
          (l = m()),
          (r = f('button')),
          (r.textContent = 'Resume'),
          (g = m()),
          (v = f('button')),
          (v.textContent = 'Reset'),
          (b = m()),
          (y = f('div')),
          (x = p(A)),
          (C = m()),
          (O = f('div')),
          B(I.$$.fragment),
          (D = m()),
          (N = f('div')),
          B(R.$$.fragment),
          (S = m()),
          (_ = f('div')),
          B(M.$$.fragment),
          h(i, 'class', 'button'),
          h(i, 'data-test-id', 'button-pause'),
          h(r, 'class', 'button'),
          h(r, 'data-test-id', 'button-resume'),
          h(v, 'class', 'button'),
          h(v, 'data-test-id', 'button-reset'),
          h(a, 'class', 'buttons'),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'reset-all'),
          h(y, 'class', 'control'),
          h(y, 'data-test-id', 'is-paused'),
          h(O, 'class', 'control'),
          h(N, 'class', 'content'),
          h(_, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test'),
          (k = [$(i, 'click', t[3]), $(r, 'click', t[4]), $(v, 'click', t[5])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(a, i),
          c(a, l),
          c(a, r),
          c(a, g),
          c(a, v),
          c(e, b),
          c(e, y),
          c(y, x),
          c(e, C),
          c(e, O),
          K(I, O, null),
          c(e, D),
          c(e, N),
          K(R, N, null),
          c(e, S),
          c(e, _),
          K(M, _, null),
          (E = !0);
      },
      p(t, [n]) {
        (!E || 1 & n) && A !== (A = `Is paused: ${t[0]}` + '') && w(x, A);
        const e = 2 & n ? L(P, [H(t[1])]) : {};
        R.$set(e);
      },
      i(t) {
        E ||
          (j(I.$$.fragment, t),
          j(R.$$.fragment, t),
          j(M.$$.fragment, t),
          (E = !0));
      },
      o(t) {
        q(I.$$.fragment, t), q(R.$$.fragment, t), q(M.$$.fragment, t), (E = !1);
      },
      d(t) {
        t && d(e), z(I), z(R), z(M), o(k);
      },
    };
  }
  function ce(t, n, e) {
    let s;
    un.resetAll();
    const o = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'Default',
        timeout: 2e3,
      }),
      a = un.isPaused();
    l(t, a, t => e(0, (s = t)));
    return [s, o, a, () => un.pause(), () => un.resume(), () => un.resetAll()];
  }
  function ue(t) {
    let e,
      s,
      o,
      a,
      i,
      l,
      r,
      g,
      $ = `Count all: ${t[0]}` + '';
    const v = [t[1]];
    let b = {};
    for (let t = 0; t < v.length; t += 1) b = n(b, v[t]);
    const y = new Ln({ props: b }),
      x = new En({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (o = p($)),
          (a = m()),
          (i = f('div')),
          B(y.$$.fragment),
          (l = m()),
          (r = f('div')),
          B(x.$$.fragment),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'count-all'),
          h(i, 'class', 'content'),
          h(r, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test');
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, o),
          c(e, a),
          c(e, i),
          K(y, i, null),
          c(e, l),
          c(e, r),
          K(x, r, null),
          (g = !0);
      },
      p(t, [n]) {
        (!g || 1 & n) && $ !== ($ = `Count all: ${t[0]}` + '') && w(o, $);
        const e = 2 & n ? L(v, [H(t[1])]) : {};
        y.$set(e);
      },
      i(t) {
        g || (j(y.$$.fragment, t), j(x.$$.fragment, t), (g = !0));
      },
      o(t) {
        q(y.$$.fragment, t), q(x.$$.fragment, t), (g = !1);
      },
      d(t) {
        t && d(e), z(y), z(x);
      },
    };
  }
  function de(t, n, e) {
    let s;
    un.resetAll();
    const o = Bn({
        instance: un,
        component: Rn,
        className: 'dialog',
        title: 'Default',
        queued: !0,
      }),
      a = un.getCount();
    return l(t, a, t => e(0, (s = t))), [s, o, a];
  }
  function fe(t) {
    let e,
      s,
      o,
      a,
      i,
      l,
      r,
      g,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I,
      P,
      T,
      R,
      M,
      F,
      V = `Count all: ${t[0]}` + '',
      J = `Count id: ${t[1]}` + '',
      Q = `Count spawn: ${t[2]}` + '',
      G = `Count spawn, id: ${t[3]}` + '';
    const W = [t[4]];
    let X = {};
    for (let t = 0; t < W.length; t += 1) X = n(X, W[t]);
    const Y = new Ln({ props: X }),
      U = [t[5], { id: '1' }];
    let Z = {};
    for (let t = 0; t < U.length; t += 1) Z = n(Z, U[t]);
    const tt = new Ln({ props: Z }),
      nt = [t[6], { spawn: '1' }];
    let et = {};
    for (let t = 0; t < nt.length; t += 1) et = n(et, nt[t]);
    const st = new Ln({ props: et }),
      ot = [t[7], { spawn: '1' }, { id: '1' }];
    let at = {};
    for (let t = 0; t < ot.length; t += 1) at = n(at, ot[t]);
    const it = new Ln({ props: at }),
      lt = new In({}),
      rt = new In({ props: { spawn: '1' } });
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (o = p(V)),
          (a = m()),
          (i = f('div')),
          (l = p(J)),
          (r = m()),
          (g = f('div')),
          (v = p(Q)),
          (b = m()),
          (y = f('div')),
          (x = p(G)),
          (C = m()),
          (O = f('div')),
          (D = f('div')),
          (N = f('button')),
          (N.textContent = 'Reset'),
          (S = m()),
          (_ = f('div')),
          B(Y.$$.fragment),
          (E = m()),
          B(tt.$$.fragment),
          (k = m()),
          B(st.$$.fragment),
          (A = m()),
          B(it.$$.fragment),
          (I = m()),
          (P = f('div')),
          B(lt.$$.fragment),
          (T = m()),
          (R = f('div')),
          B(rt.$$.fragment),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'count-all'),
          h(i, 'class', 'control'),
          h(i, 'data-test-id', 'count-id'),
          h(g, 'class', 'control'),
          h(g, 'data-test-id', 'count-spawn'),
          h(y, 'class', 'control'),
          h(y, 'data-test-id', 'count-spawn-id'),
          h(N, 'class', 'button'),
          h(N, 'data-test-id', 'button-reset'),
          h(D, 'class', 'buttons'),
          h(O, 'class', 'control'),
          h(_, 'class', 'content'),
          h(P, 'class', 'spawn default-spawn'),
          h(R, 'class', 'spawn custom-spawn'),
          h(e, 'class', 'test'),
          (F = $(N, 'click', t[12]));
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, o),
          c(e, a),
          c(e, i),
          c(i, l),
          c(e, r),
          c(e, g),
          c(g, v),
          c(e, b),
          c(e, y),
          c(y, x),
          c(e, C),
          c(e, O),
          c(O, D),
          c(D, N),
          c(e, S),
          c(e, _),
          K(Y, _, null),
          c(_, E),
          K(tt, _, null),
          c(_, k),
          K(st, _, null),
          c(_, A),
          K(it, _, null),
          c(e, I),
          c(e, P),
          K(lt, P, null),
          c(e, T),
          c(e, R),
          K(rt, R, null),
          (M = !0);
      },
      p(t, [n]) {
        (!M || 1 & n) && V !== (V = `Count all: ${t[0]}` + '') && w(o, V),
          (!M || 2 & n) && J !== (J = `Count id: ${t[1]}` + '') && w(l, J),
          (!M || 4 & n) && Q !== (Q = `Count spawn: ${t[2]}` + '') && w(v, Q),
          (!M || 8 & n) &&
            G !== (G = `Count spawn, id: ${t[3]}` + '') &&
            w(x, G);
        const e = 16 & n ? L(W, [H(t[4])]) : {};
        Y.$set(e);
        const s = 32 & n ? L(U, [H(t[5]), U[1]]) : {};
        tt.$set(s);
        const a = 64 & n ? L(nt, [H(t[6]), nt[1]]) : {};
        st.$set(a);
        const i = 128 & n ? L(ot, [H(t[7]), ot[1], ot[2]]) : {};
        it.$set(i);
      },
      i(t) {
        M ||
          (j(Y.$$.fragment, t),
          j(tt.$$.fragment, t),
          j(st.$$.fragment, t),
          j(it.$$.fragment, t),
          j(lt.$$.fragment, t),
          j(rt.$$.fragment, t),
          (M = !0));
      },
      o(t) {
        q(Y.$$.fragment, t),
          q(tt.$$.fragment, t),
          q(st.$$.fragment, t),
          q(it.$$.fragment, t),
          q(lt.$$.fragment, t),
          q(rt.$$.fragment, t),
          (M = !1);
      },
      d(t) {
        t && d(e), z(Y), z(tt), z(st), z(it), z(lt), z(rt), F();
      },
    };
  }
  function pe(t, n, e) {
    let s, o, a, i;
    const r = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        title: 'Default',
      }),
      c = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        id: '1',
        title: 'ID',
      }),
      u = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        spawn: '1',
        title: 'Spawn',
      }),
      d = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        spawn: '1',
        id: '1',
        title: 'Spawn and ID',
      }),
      f = dn.getCount();
    l(t, f, t => e(0, (s = t)));
    const p = dn.getCount({ id: '1' });
    l(t, p, t => e(1, (o = t)));
    const m = dn.getCount({ spawn: '1' });
    l(t, m, t => e(2, (a = t)));
    const g = dn.getCount({ spawn: '1', id: '1' });
    l(t, g, t => e(3, (i = t)));
    return [s, o, a, i, r, c, u, d, f, p, m, g, () => dn.resetAll()];
  }
  function me(t) {
    let e,
      s,
      a,
      i,
      l,
      r,
      g,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I = `Is paused: ${t[0]}` + '';
    const P = new le({ props: { getRemainingFn: dn.getRemaining } }),
      T = [t[1]];
    let R = {};
    for (let t = 0; t < T.length; t += 1) R = n(R, T[t]);
    const M = new Ln({ props: R }),
      F = new In({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = f('div')),
          (i = f('div')),
          (l = f('button')),
          (l.textContent = 'Pause'),
          (r = m()),
          (g = f('button')),
          (g.textContent = 'Resume'),
          (v = m()),
          (b = f('button')),
          (b.textContent = 'Reset'),
          (y = m()),
          (x = f('div')),
          (C = p(I)),
          (O = m()),
          (D = f('div')),
          B(P.$$.fragment),
          (N = m()),
          (S = f('div')),
          B(M.$$.fragment),
          (_ = m()),
          (E = f('div')),
          B(F.$$.fragment),
          h(l, 'class', 'button'),
          h(l, 'data-test-id', 'button-pause'),
          h(g, 'class', 'button'),
          h(g, 'data-test-id', 'button-resume'),
          h(b, 'class', 'button'),
          h(b, 'data-test-id', 'button-reset'),
          h(i, 'class', 'buttons'),
          h(a, 'class', 'control'),
          h(a, 'data-test-id', 'reset-all'),
          h(x, 'class', 'control'),
          h(x, 'data-test-id', 'is-paused'),
          h(D, 'class', 'control'),
          h(S, 'class', 'content'),
          h(E, 'class', 'spawn default-spawn'),
          h(s, 'class', 'section'),
          h(s, 'data-test-id', 'pause-default'),
          h(e, 'class', 'test'),
          (A = [$(l, 'click', t[3]), $(g, 'click', t[4]), $(b, 'click', t[5])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(a, i),
          c(i, l),
          c(i, r),
          c(i, g),
          c(i, v),
          c(i, b),
          c(s, y),
          c(s, x),
          c(x, C),
          c(s, O),
          c(s, D),
          K(P, D, null),
          c(s, N),
          c(s, S),
          K(M, S, null),
          c(s, _),
          c(s, E),
          K(F, E, null),
          (k = !0);
      },
      p(t, [n]) {
        (!k || 1 & n) && I !== (I = `Is paused: ${t[0]}` + '') && w(C, I);
        const e = 2 & n ? L(T, [H(t[1])]) : {};
        M.$set(e);
      },
      i(t) {
        k ||
          (j(P.$$.fragment, t),
          j(M.$$.fragment, t),
          j(F.$$.fragment, t),
          (k = !0));
      },
      o(t) {
        q(P.$$.fragment, t), q(M.$$.fragment, t), q(F.$$.fragment, t), (k = !1);
      },
      d(t) {
        t && d(e), z(P), z(M), z(F), o(A);
      },
    };
  }
  function ge(t, n, e) {
    let s;
    dn.resetAll();
    const o = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        title: 'Default',
        timeout: 2e3,
      }),
      a = dn.isPaused();
    l(t, a, t => e(0, (s = t)));
    return [s, o, a, () => dn.pause(), () => dn.resume(), () => dn.resetAll()];
  }
  function $e(t) {
    let e,
      s,
      a,
      i,
      l,
      r,
      g,
      v,
      b,
      y,
      x,
      C,
      O,
      D,
      N,
      S,
      _,
      E,
      k,
      A,
      I = `Is paused: ${t[0]}` + '';
    const P = new le({ props: { getRemainingFn: dn.getRemaining } }),
      T = [t[1]];
    let R = {};
    for (let t = 0; t < T.length; t += 1) R = n(R, T[t]);
    const M = new Ln({ props: R }),
      F = [t[2], { id: '1' }, { name: 'zero-timeout' }];
    let V = {};
    for (let t = 0; t < F.length; t += 1) V = n(V, F[t]);
    const J = new Ln({ props: V }),
      Q = new In({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = f('div')),
          (i = f('button')),
          (i.textContent = 'Pause'),
          (l = m()),
          (r = f('button')),
          (r.textContent = 'Resume'),
          (g = m()),
          (v = f('button')),
          (v.textContent = 'Reset'),
          (b = m()),
          (y = f('div')),
          (x = p(I)),
          (C = m()),
          (O = f('div')),
          B(P.$$.fragment),
          (D = m()),
          (N = f('div')),
          B(M.$$.fragment),
          (S = m()),
          B(J.$$.fragment),
          (_ = m()),
          (E = f('div')),
          B(Q.$$.fragment),
          h(i, 'class', 'button'),
          h(i, 'data-test-id', 'button-pause'),
          h(r, 'class', 'button'),
          h(r, 'data-test-id', 'button-resume'),
          h(v, 'class', 'button'),
          h(v, 'data-test-id', 'button-reset'),
          h(a, 'class', 'buttons'),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'reset-all'),
          h(y, 'class', 'control'),
          h(y, 'data-test-id', 'is-paused'),
          h(O, 'class', 'control'),
          h(N, 'class', 'content'),
          h(E, 'class', 'spawn default-spawn'),
          h(e, 'class', 'test'),
          (A = [$(i, 'click', t[4]), $(r, 'click', t[5]), $(v, 'click', t[6])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(a, i),
          c(a, l),
          c(a, r),
          c(a, g),
          c(a, v),
          c(e, b),
          c(e, y),
          c(y, x),
          c(e, C),
          c(e, O),
          K(P, O, null),
          c(e, D),
          c(e, N),
          K(M, N, null),
          c(N, S),
          K(J, N, null),
          c(e, _),
          c(e, E),
          K(Q, E, null),
          (k = !0);
      },
      p(t, [n]) {
        (!k || 1 & n) && I !== (I = `Is paused: ${t[0]}` + '') && w(x, I);
        const e = 2 & n ? L(T, [H(t[1])]) : {};
        M.$set(e);
        const s = 4 & n ? L(F, [H(t[2]), F[1], F[2]]) : {};
        J.$set(s);
      },
      i(t) {
        k ||
          (j(P.$$.fragment, t),
          j(M.$$.fragment, t),
          j(J.$$.fragment, t),
          j(Q.$$.fragment, t),
          (k = !0));
      },
      o(t) {
        q(P.$$.fragment, t),
          q(M.$$.fragment, t),
          q(J.$$.fragment, t),
          q(Q.$$.fragment, t),
          (k = !1);
      },
      d(t) {
        t && d(e), z(P), z(M), z(J), z(Q), o(A);
      },
    };
  }
  function he(t, n, e) {
    let s;
    dn.resetAll();
    const o = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        title: 'Default',
        timeout: 2e3,
      }),
      a = Bn({
        instance: dn,
        component: Rn,
        className: 'notification',
        title: 'Timeout: 0',
        timeout: 0,
      }),
      i = dn.isPaused();
    l(t, i, t => e(0, (s = t)));
    return [
      s,
      o,
      a,
      i,
      () => dn.pause(),
      () => dn.resume(),
      () => dn.resetAll(),
    ];
  }
  function we(n) {
    let e;
    return {
      c() {
        (e = f('article')),
          (e.innerHTML =
            '<div class="media-left"><figure class="image is-64x64"><img src="https://bulma.io/images/placeholders/128x128.png" alt="Image"></figure></div> \n  <div class="media-content"><div class="content"><p><strong>John Smith</strong>  <small>@johnsmith</small>  <small>31m</small> \n        <br>\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.\n      </p></div> \n    <nav class="level is-mobile"><div class="level-left"><a class="level-item" aria-label="retweet" href="null"><span class="icon is-small"><svg class="svg-inline--fa fa-retweet fa-w-20" aria-hidden="true" data-prefix="fas" data-icon="retweet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z"></path></svg></span></a> \n        <a class="level-item" aria-label="like" href="null"><span class="icon is-small"><svg class="svg-inline--fa fa-heart fa-w-16" aria-hidden="true" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg></span></a></div></nav></div>'),
          h(e, 'class', 'media');
      },
      m(t, n) {
        u(t, e, n);
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && d(e);
      },
    };
  }
  class ve extends Q {
    constructor(t) {
      super(), J(this, t, null, we, i, {});
    }
  }
  function be(n) {
    let e, s, a, i, l, r, p, g, w;
    const v = new ve({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = m()),
          (i = f('div')),
          (l = f('div')),
          B(v.$$.fragment),
          (r = m()),
          (p = f('button')),
          h(s, 'class', 'modal-background'),
          h(l, 'class', 'bulma-dialog-content-box'),
          h(i, 'class', 'modal-content'),
          h(p, 'class', 'modal-close is-large'),
          h(p, 'aria-label', 'close'),
          h(e, 'class', 'modal is-active'),
          (w = [$(s, 'click', n[1]), $(p, 'click', n[2])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(e, a),
          c(e, i),
          c(i, l),
          K(v, l, null),
          c(e, r),
          c(e, p),
          (g = !0);
      },
      p: t,
      i(t) {
        g || (j(v.$$.fragment, t), (g = !0));
      },
      o(t) {
        q(v.$$.fragment, t), (g = !1);
      },
      d(t) {
        t && d(e), z(v), o(w);
      },
    };
  }
  function ye(t, n, e) {
    let { isModal: s = !1 } = n;
    return (
      (t.$set = t => {
        'isModal' in t && e(0, (s = t.isModal));
      }),
      [s, () => !s && un.hide(), () => un.hide()]
    );
  }
  class xe extends Q {
    constructor(t) {
      super(), J(this, t, ye, be, i, { isModal: 0 });
    }
  }
  function Ce(n) {
    let e, s, a, i, l, r, p, g, w, v;
    const b = new En({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = f('div')),
          (i = f('button')),
          (i.textContent = 'Show dialog'),
          (l = m()),
          (r = f('button')),
          (r.textContent = 'Show modal dialog'),
          (p = m()),
          (g = f('div')),
          B(b.$$.fragment),
          h(i, 'class', 'button'),
          h(r, 'class', 'button'),
          h(a, 'class', 'buttons'),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'hide-all'),
          h(g, 'class', 'bulma'),
          h(e, 'class', 'test'),
          (v = [$(i, 'click', n[0]), $(r, 'click', n[1])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(a, i),
          c(a, l),
          c(a, r),
          c(e, p),
          c(e, g),
          K(b, g, null),
          (w = !0);
      },
      p: t,
      i(t) {
        w || (j(b.$$.fragment, t), (w = !0));
      },
      o(t) {
        q(b.$$.fragment, t), (w = !1);
      },
      d(t) {
        t && d(e), z(b), o(v);
      },
    };
  }
  function Oe(t) {
    return [
      () => un.show({ dialogic: { component: xe, className: 'dialog' } }),
      () =>
        un.show({
          dialogic: { component: xe, className: 'dialog' },
          isModal: !0,
        }),
    ];
  }
  function De(n) {
    let e, s, a, i, l, r, p, g, w, v, b;
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = f('h2')),
          (a.textContent = 'Dialog Title'),
          (i = m()),
          (l = f('div')),
          (l.textContent = 'Dialog body text goes here.'),
          (r = m()),
          (p = f('footer')),
          (g = f('button')),
          (g.innerHTML = '<span class="mdc-button__label">No</span>'),
          (w = m()),
          (v = f('button')),
          (v.innerHTML = '<span class="mdc-button__label">Yes</span>'),
          h(a, 'class', 'mdc-dialog__title'),
          h(a, 'id', 'my-dialog-title'),
          h(l, 'class', 'mdc-dialog__content'),
          h(l, 'id', 'my-dialog-content'),
          h(g, 'type', 'button'),
          h(g, 'class', 'mdc-button mdc-dialog__button'),
          h(g, 'data-mdc-dialog-action', 'no'),
          h(v, 'type', 'button'),
          h(v, 'class', 'mdc-button mdc-dialog__button'),
          h(v, 'data-mdc-dialog-action', 'yes'),
          h(p, 'class', 'mdc-dialog__actions'),
          h(s, 'class', 'mdc-dialog__surface'),
          h(e, 'class', 'mdc-dialog__container'),
          (b = [$(g, 'click', n[0]), $(v, 'click', n[1])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(s, i),
          c(s, l),
          c(s, r),
          c(s, p),
          c(p, g),
          c(p, w),
          c(p, v);
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && d(e), o(b);
      },
    };
  }
  function Ne(t) {
    return [() => un.hide(), () => un.hide()];
  }
  class Se extends Q {
    constructor(t) {
      super(), J(this, t, Ne, De, i, {});
    }
  }
  function _e(n) {
    let e, s, o, a, i;
    const l = new Se({});
    return {
      c() {
        (e = f('div')),
          B(l.$$.fragment),
          (s = m()),
          (o = f('div')),
          h(o, 'class', 'mdc-dialog__scrim'),
          h(e, 'class', 'mdc-dialog mdc-dialog--open'),
          h(e, 'role', 'alertdialog'),
          h(e, 'aria-modal', 'true'),
          h(e, 'aria-labelledby', 'my-dialog-title'),
          h(e, 'aria-describedby', 'my-dialog-content'),
          (i = $(o, 'click', n[1]));
      },
      m(t, n) {
        u(t, e, n), K(l, e, null), c(e, s), c(e, o), (a = !0);
      },
      p: t,
      i(t) {
        a || (j(l.$$.fragment, t), (a = !0));
      },
      o(t) {
        q(l.$$.fragment, t), (a = !1);
      },
      d(t) {
        t && d(e), z(l), i();
      },
    };
  }
  function Ee(t, n, e) {
    let { isModal: s = !1 } = n;
    return (
      (t.$set = t => {
        'isModal' in t && e(0, (s = t.isModal));
      }),
      [s, () => !s && un.hide()]
    );
  }
  class ke extends Q {
    constructor(t) {
      super(), J(this, t, Ee, _e, i, { isModal: 0 });
    }
  }
  function Ae(n) {
    let e, s, a, i, l, r, p, g, w, v;
    const b = new En({});
    return {
      c() {
        (e = f('div')),
          (s = f('div')),
          (a = f('div')),
          (i = f('button')),
          (i.textContent = 'Show dialog'),
          (l = m()),
          (r = f('button')),
          (r.textContent = 'Show modal dialog'),
          (p = m()),
          (g = f('div')),
          B(b.$$.fragment),
          h(i, 'class', 'button'),
          h(r, 'class', 'button'),
          h(a, 'class', 'buttons'),
          h(s, 'class', 'control'),
          h(s, 'data-test-id', 'hide-all'),
          h(g, 'class', 'materialIO'),
          h(e, 'class', 'test'),
          (v = [$(i, 'click', n[0]), $(r, 'click', n[1])]);
      },
      m(t, n) {
        u(t, e, n),
          c(e, s),
          c(s, a),
          c(a, i),
          c(a, l),
          c(a, r),
          c(e, p),
          c(e, g),
          K(b, g, null),
          (w = !0);
      },
      p: t,
      i(t) {
        w || (j(b.$$.fragment, t), (w = !0));
      },
      o(t) {
        q(b.$$.fragment, t), (w = !1);
      },
      d(t) {
        t && d(e), z(b), o(v);
      },
    };
  }
  function Ie(t) {
    return [
      () => un.show({ dialogic: { component: ke, className: 'dialog' } }),
      () =>
        un.show({
          dialogic: { component: ke, className: 'dialog' },
          isModal: !0,
        }),
    ];
  }
  var Pe = {
    '/': class extends Q {
      constructor(t) {
        super(), J(this, t, null, ot, i, {});
      }
    },
    '/DialogClassName': class extends Q {
      constructor(t) {
        super(), J(this, t, zn, Kn, i, {});
      }
    },
    '/DialogClassNameDelay': class extends Q {
      constructor(t) {
        super(), J(this, t, Jn, Vn, i, {});
      }
    },
    '/DialogStyles': class extends Q {
      constructor(t) {
        super(), J(this, t, Gn, Qn, i, {});
      }
    },
    '/DialogIds': class extends Q {
      constructor(t) {
        super(), J(this, t, Xn, Wn, i, {});
      }
    },
    '/DialogExists': class extends Q {
      constructor(t) {
        super(), J(this, t, Un, Yn, i, {});
      }
    },
    '/DialogCount': class extends Q {
      constructor(t) {
        super(), J(this, t, te, Zn, i, {});
      }
    },
    '/DialogHideAll': class extends Q {
      constructor(t) {
        super(), J(this, t, ee, ne, i, {});
      }
    },
    '/DialogResetAll': class extends Q {
      constructor(t) {
        super(), J(this, t, oe, se, i, {});
      }
    },
    '/DialogTimeout': class extends Q {
      constructor(t) {
        super(), J(this, t, ce, re, i, {});
      }
    },
    '/DialogQueued': class extends Q {
      constructor(t) {
        super(), J(this, t, de, ue, i, {});
      }
    },
    '/NotificationCount': class extends Q {
      constructor(t) {
        super(), J(this, t, pe, fe, i, {});
      }
    },
    '/NotificationPause': class extends Q {
      constructor(t) {
        super(), J(this, t, ge, me, i, {});
      }
    },
    '/NotificationTimeout': class extends Q {
      constructor(t) {
        super(), J(this, t, he, $e, i, {});
      }
    },
    '/LibBulmaDialog': class extends Q {
      constructor(t) {
        super(), J(this, t, Oe, Ce, i, {});
      }
    },
    '/LibMaterialIODialog': class extends Q {
      constructor(t) {
        super(), J(this, t, Ie, Ae, i, {});
      }
    },
  };
  function Te(n) {
    let e;
    const s = new st({ props: { routes: Pe } });
    return {
      c() {
        B(s.$$.fragment);
      },
      m(t, n) {
        K(s, t, n), (e = !0);
      },
      p: t,
      i(t) {
        e || (j(s.$$.fragment, t), (e = !0));
      },
      o(t) {
        q(s.$$.fragment, t), (e = !1);
      },
      d(t) {
        z(s, t);
      },
    };
  }
  return new (class extends Q {
    constructor(t) {
      super(), J(this, t, null, Te, i, {});
    }
  })({ target: document.body });
})();
//# sourceMappingURL=bundle.js.map
