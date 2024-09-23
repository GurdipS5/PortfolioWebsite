const i = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
let g = (t) => crypto.getRandomValues(new Uint8Array(t)),
  h = (t, e, a) => {
    let r = (2 << (Math.log(t.length - 1) / Math.LN2)) - 1,
      n = -~((1.6 * r * e) / t.length);
    return (o = e) => {
      let l = '';
      for (;;) {
        let e = a(n),
          g = n;
        for (; g--; ) if (((l += t[e[g] & r] || ''), l.length === o)) return l;
      }
    };
  },
  m = (t, e = 21) => h(t, e, g),
  c = (t = 21) =>
    crypto
      .getRandomValues(new Uint8Array(t))
      .reduce(
        (t, e) =>
          (t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? '-' : '_'),
        ''
      );
export { m as customAlphabet, h as customRandom, c as nanoid, g as random, i as urlAlphabet };
