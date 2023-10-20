self.onmessage = function(S) {
  var k, x, b, q, R, T, C;
  const { inError: w, messages: E, defaultGridDataTmp: v, indentiferColumn: r, propColumns: K, MessageBarType: l, DepColTypes: $ } = S.data;
  let u = w;
  const D = new Map(E), d = (n, i) => {
    D.set(n, i);
  };
  for (let n = 0; n < v.length; n++) {
    const i = v[n];
    var W = Object.keys(i);
    let p = [], y = [];
    for (let I = 0; I < W.length; I++) {
      const M = W[I];
      i[M];
      const V = K.filter((c) => c.key === M);
      for (let c = 0; c < V.length; c++) {
        const e = V[c], t = i[e.key];
        if (e.required && typeof e.required == "boolean" && (t == null || t == null || (t == null ? void 0 : t.toString().length) <= 0 || t == "" && e.dataType != "number"))
          p.includes(" " + e.name) || p.push(" " + e.name);
        else if (typeof e.required != "boolean" && !e.required.requiredOnlyIfTheseColumnsAreEmpty && e.required.errorMessage && (t == null || t == null || (t == null ? void 0 : t.toString().length) <= 0 || t == "" && e.dataType != "number")) {
          var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${e.required.errorMessage}'.`;
          d(e.key + n + "empty", {
            msg: a,
            type: l.error
          });
        } else if (typeof e.required != "boolean" && e.required.requiredOnlyIfTheseColumnsAreEmpty && (t == null || t == null || (t == null ? void 0 : t.toString().length) <= 0 || t == "" && e.dataType != "number")) {
          const o = e.required.requiredOnlyIfTheseColumnsAreEmpty.colKeys;
          let s = !1;
          for (let g = 0; g < o.length; g++) {
            const h = o[g], m = i[h];
            if (e.required.alwaysRequired) {
              if (m == null || m == null || (m == null ? void 0 : m.toString().length) <= 0 || m == "" && e.dataType != "number") {
                if (e.required.errorMessage) {
                  var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${e.required.errorMessage}'.`;
                  d(e.key + n + "empty", {
                    msg: a,
                    type: l.error
                  });
                } else if (!y.includes(" " + e.name)) {
                  y.push(" " + e.name);
                  break;
                }
              }
            } else if ((m || ((k = m == null ? void 0 : m.toString()) == null ? void 0 : k.trim()) == "0") && (m == null ? void 0 : m.toString().length) > 0) {
              s = !0;
              break;
            }
          }
          if (!y.includes(" " + e.name) && s == !1)
            if (!e.required.errorMessage)
              y.push(" " + e.name);
            else {
              var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${e.required.errorMessage}'.`;
              d(e.key + n + "empty", {
                msg: a,
                type: l.error
              });
            }
        }
        if (t !== null && (typeof t !== e.dataType || typeof t == "number")) {
          if (e.dataType === "number") {
            if (t && isNaN(parseInt(t)) && t !== "") {
              var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} Col: ${e.name} - Value is not a '${e.dataType}'.`;
              d(e.key + n, {
                msg: a,
                type: l.error
              }), u = !0;
            } else if (e.validations && e.validations.numberBoundaries) {
              const o = e.validations.numberBoundaries.minRange, s = e.validations.numberBoundaries.maxRange;
              if (o && s) {
                if (!(o <= parseInt(t) && s >= parseInt(t))) {
                  var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} Col: ${e.name} - Value outside of range '${o} - ${s}'. Entered value ${t}`;
                  d(e.key + n, {
                    msg: a,
                    type: l.error
                  }), u = !0;
                }
              } else if (o) {
                if (!(o <= parseInt(t))) {
                  var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} Col: ${e.name} - Value is lower than required range: '${o}'. Entered value ${t}`;
                  d(e.key + n, {
                    msg: a,
                    type: l.error
                  }), u = !0;
                }
              } else if (s && !(s >= parseInt(t))) {
                var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} Col: ${e.name} - Value is greater than required range: '${s}'. Entered value ${t}`;
                d(e.key + n, {
                  msg: a,
                  type: l.error
                }), u = !0;
              }
            }
          } else if (e.dataType === "boolean")
            try {
            } catch {
              var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} Col: ${e.name} - Value is not a '${e.dataType}'.`;
              d(e.key + n, {
                msg: a,
                type: l.error
              }), u = !0;
            }
          else if (e.dataType === "date")
            try {
              if (isValidDate(t))
                continue;
              throw {};
            } catch {
              var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} Col: ${e.name} - Value is not a '${e.dataType}'.`;
              d(e.key + n, {
                msg: a,
                type: l.error
              }), u = !0;
            }
        }
        if (e.validations && e.validations.columnDependent)
          for (let o = 0; o < e.validations.columnDependent.length; o++) {
            const s = e.validations.columnDependent[o];
            if (i[s.dependentColumnKey] || i[s.dependentColumnKey] !== void 0) {
              const g = i[s.dependentColumnKey];
              let h = !1;
              if (s.skipCheckIfTheseColumnsHaveData && s.skipCheckIfTheseColumnsHaveData.colKeys)
                for (const m of s.skipCheckIfTheseColumnsHaveData.colKeys)
                  if ((x = s.skipCheckIfTheseColumnsHaveData) != null && x.partial) {
                    const f = i[m];
                    if (f && f !== null && f !== void 0 && (f == null ? void 0 : f.toString().length) > 0) {
                      h = !0;
                      break;
                    }
                  } else {
                    const f = i[m];
                    if (f && f !== null && f !== void 0 && (f == null ? void 0 : f.toString().length) > 0)
                      h = !0;
                    else {
                      h = !1;
                      break;
                    }
                  }
              if (!h) {
                if (g != null && (g == null ? void 0 : g.toString().length) > 0 && s.type === $.MustBeEmpty && t !== null && (t == null ? void 0 : t.toString().length) > 0) {
                  var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ` + (s.errorMessage ?? `Data cannot be entered in ${e.name} and in ${s.dependentColumnName} Column. Remove data in ${s.dependentColumnName} Column to enter data here.`);
                  d(n + "ColDep", {
                    msg: a,
                    type: l.error
                  }), u = !0;
                }
                if ((g == null || g == null || g == "" && e.dataType != "number" || g && (g == null ? void 0 : g.toString().length) <= 0) && s.type === $.MustHaveData) {
                  var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ` + (s.errorMessage ?? ` Data needs to entered in ${s.dependentColumnName} and in ${e.name} Column.`);
                  d(n + "ColDep", {
                    msg: a,
                    type: l.error
                  }), u = !0;
                }
              }
            }
          }
        if (e.validations && e.validations.regexValidation)
          for (let o = 0; o < e.validations.regexValidation.length; o++) {
            const s = e.validations.regexValidation[o];
            if (!s.regex.test(t)) {
              var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${s.errorMessage}`;
              d(e.key + n, {
                msg: a,
                type: l.error
              }), u = !0;
            }
          }
        if (e.validations && e.validations.stringValidations && e.validations.stringValidations.caseInsensitive) {
          if (t !== null && ((q = (b = e.validations.stringValidations) == null ? void 0 : b.conditionCantEqual) == null ? void 0 : q.toLowerCase()) === (t == null ? void 0 : t.toString().toLowerCase())) {
            var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${(R = e.validations.stringValidations) == null ? void 0 : R.errMsg}`;
            d(e.key + n, {
              msg: a,
              type: l.error
            }), u = !0;
          } else if (t !== null && ((T = e.validations.stringValidations) == null ? void 0 : T.conditionCantEqual) === (t == null ? void 0 : t.toString())) {
            var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${(C = e.validations.stringValidations) == null ? void 0 : C.errMsg}`;
            d(e.key + n, {
              msg: a,
              type: l.error
            }), u = !0;
          }
        }
      }
    }
    if (y.length > 1) {
      var a = `Row ${r ? "With ID: " + i[r] : "With Index:" + n + 1} - ${y} cannot all be empty`;
      d(n + "erc", {
        msg: a,
        type: l.error
      }), u = !0;
    } else if (y.length == 1) {
      var a = `Row: ${r ? "With ID: " + i[r] : n + 1} - ${y} cannot be empty`;
      d(n + "erc", {
        msg: a,
        type: l.error
      }), u = !0;
    }
    if (p.length > 1) {
      var a = `Row ${r ? "With ID: " + i[r] : "With Index: " + n + 1} - ${p == null ? void 0 : p.toString()} cannot be empty at all`;
      d(n + "ec", {
        msg: a,
        type: l.error
      }), u = !0;
    } else if (p.length == 1) {
      var a = `Row ${r ? "With ID: " + i[r] : "With Index: " + n + 1} - ${p == null ? void 0 : p.toString()} cannot be empty`;
      d(n + "ec", {
        msg: a,
        type: l.error
      }), u = !0;
    }
  }
  self.postMessage({ isError: u, messages: D }), self.close();
};
//# sourceMappingURL=fluentui.editablegrid.lib2.js.map
