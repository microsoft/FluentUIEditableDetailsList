(function() {
  "use strict";
  self.onmessage = function(event) {
    var _a, _b, _c, _d, _e, _f, _g;
    const {
      inError,
      messages,
      defaultGridDataTmp,
      indentiferColumn,
      props,
      ignoredColProperties,
      MessageBarType,
      DepColTypes
    } = event.data;
    let localError = inError;
    const msgMap = new Map(messages);
    const ignoredProperties = this.structuredClone(ignoredColProperties);
    const tmpInsertToMessageMap = (key, value) => {
      msgMap.set(key, value);
    };
    function findDuplicates(array) {
      const duplicates2 = [];
      const seen = {};
      const makeEverythingAString = array.map((obj) => {
        const convertedObj = {};
        for (const key2 in obj) {
          if (obj[key2] == null || obj[key2] == void 0)
            convertedObj[key2] = "";
          else {
            convertedObj[key2] = String(obj[key2]).toLowerCase();
          }
        }
        return convertedObj;
      });
      if (indentiferColumn !== null && indentiferColumn !== void 0) {
        ignoredProperties.push(indentiferColumn);
      }
      if (props.customOperationsKey) {
        ignoredProperties.push(props.customOperationsKey.colKey);
      }
      if (props.customKeysToAddOnNewRow) {
        for (let index = 0; index < props.customKeysToAddOnNewRow.length; index++) {
          const element = props.customKeysToAddOnNewRow[index];
          if ((element.useKeyWhenDeterminingDuplicatedRows ?? false) == true)
            ignoredProperties.push(element.key);
        }
      }
      let key = "";
      makeEverythingAString.forEach((row, index) => {
        if (defaultGridDataTmp == null ? void 0 : defaultGridDataTmp[0]) {
          key = JSON.stringify(
            Object.entries(row).filter(([prop]) => Object.keys(defaultGridDataTmp[0]).includes(prop)).filter(
              ([prop]) => props.columns.map((obj) => obj.key).includes(prop)
            ).filter(([prop]) => !ignoredProperties.includes(prop)).sort()
          );
          if (seen[key]) {
            indentiferColumn !== null && indentiferColumn !== void 0 ? seen[key].ids.push(row[indentiferColumn]) : seen[key].ids.push(index);
          } else {
            if (indentiferColumn !== null && indentiferColumn !== void 0) {
              seen[key] = {
                index: duplicates2.length,
                ids: [row[indentiferColumn]]
              };
              duplicates2.push(seen[key].ids);
            } else {
              seen[key] = { index: duplicates2.length, ids: [index] };
              duplicates2.push(seen[key].ids);
            }
          }
        }
      });
      return duplicates2.filter((ids) => ids.length > 1).map((ids) => ids.sort((a, b) => a - b));
    }
    const duplicates = findDuplicates(defaultGridDataTmp);
    if (duplicates.length > 0) {
      duplicates.forEach((dups, index) => {
        var msg2 = indentiferColumn !== null && indentiferColumn !== void 0 ? `Rows Located At IDs: ${dups} are duplicated` : `Rows Located At Indexes ${dups} are duplicated`;
        tmpInsertToMessageMap("dups" + index, {
          msg: msg2,
          type: MessageBarType.error
        });
      });
      localError = true;
    }
    for (let row = 0; row < defaultGridDataTmp.length; row++) {
      const gridData = defaultGridDataTmp[row];
      var elementColNames = Object.keys(gridData);
      let emptyCol = [];
      let emptyReqCol = [];
      for (let indexInner = 0; indexInner < elementColNames.length; indexInner++) {
        const colNames = elementColNames[indexInner];
        gridData[colNames];
        const currentCol = props.columns.filter((x) => x.key === colNames);
        for (let j = 0; j < currentCol.length; j++) {
          const element = currentCol[j];
          const rowCol = gridData[element.key];
          if (element.required && typeof element.required == "boolean" && (rowCol == null || rowCol == void 0 || (rowCol == null ? void 0 : rowCol.toString().length) <= 0 || rowCol == "" && element.dataType != "number")) {
            if (!emptyCol.includes(" " + element.name))
              emptyCol.push(" " + element.name);
          } else if (typeof element.required !== "boolean" && !element.required.requiredOnlyIfTheseColumnsAreEmpty && element.required.errorMessage && (rowCol == null || rowCol == void 0 || (rowCol == null ? void 0 : rowCol.toString().length) <= 0 || rowCol == "" && element.dataType != "number")) {
            var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${element.required.errorMessage}'.`;
            tmpInsertToMessageMap(element.key + row + "empty", {
              msg,
              type: MessageBarType.error
            });
          } else if (typeof element.required !== "boolean" && element.required.requiredOnlyIfTheseColumnsAreEmpty && (rowCol == null || rowCol == void 0 || (rowCol == null ? void 0 : rowCol.toString().length) <= 0 || rowCol == "" && element.dataType != "number")) {
            const checkKeys = element.required.requiredOnlyIfTheseColumnsAreEmpty.colKeys;
            let skippable = false;
            for (let index = 0; index < checkKeys.length; index++) {
              const columnKey = checkKeys[index];
              const str = gridData[columnKey];
              if (element.required.alwaysRequired) {
                if (str == null || str == void 0 || (str == null ? void 0 : str.toString().length) <= 0 || str == "" && element.dataType != "number") {
                  if (element.required.errorMessage) {
                    var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${element.required.errorMessage}'.`;
                    tmpInsertToMessageMap(element.key + row + "empty", {
                      msg,
                      type: MessageBarType.error
                    });
                  } else if (!emptyReqCol.includes(" " + element.name)) {
                    emptyReqCol.push(" " + element.name);
                    break;
                  }
                }
              } else {
                if ((str || ((_a = str == null ? void 0 : str.toString()) == null ? void 0 : _a.trim()) == "0") && (str == null ? void 0 : str.toString().length) > 0) {
                  skippable = true;
                  break;
                }
              }
            }
            if (!emptyReqCol.includes(" " + element.name) && skippable == false) {
              if (!element.required.errorMessage)
                emptyReqCol.push(" " + element.name);
              else {
                var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${element.required.errorMessage}'.`;
                tmpInsertToMessageMap(element.key + row + "empty", {
                  msg,
                  type: MessageBarType.error
                });
              }
            }
          }
          if (rowCol !== null && (typeof rowCol !== element.dataType || typeof rowCol === "number")) {
            if (element.dataType === "number") {
              if (rowCol && isNaN(parseInt(rowCol)) && rowCol !== "") {
                var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} Col: ${element.name} - Value is not a '${element.dataType}'.`;
                tmpInsertToMessageMap(element.key + row, {
                  msg,
                  type: MessageBarType.error
                });
                localError = true;
              } else if (element.validations && element.validations.numberBoundaries) {
                const min = element.validations.numberBoundaries.minRange;
                const max = element.validations.numberBoundaries.maxRange;
                if (min && max) {
                  if (!(min <= parseInt(rowCol) && max >= parseInt(rowCol))) {
                    var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} Col: ${element.name} - Value outside of range '${min} - ${max}'. Entered value ${rowCol}`;
                    tmpInsertToMessageMap(element.key + row, {
                      msg,
                      type: MessageBarType.error
                    });
                    localError = true;
                  }
                } else if (min) {
                  if (!(min <= parseInt(rowCol))) {
                    var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} Col: ${element.name} - Value is lower than required range: '${min}'. Entered value ${rowCol}`;
                    tmpInsertToMessageMap(element.key + row, {
                      msg,
                      type: MessageBarType.error
                    });
                    localError = true;
                  }
                } else if (max) {
                  if (!(max >= parseInt(rowCol))) {
                    var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} Col: ${element.name} - Value is greater than required range: '${max}'. Entered value ${rowCol}`;
                    tmpInsertToMessageMap(element.key + row, {
                      msg,
                      type: MessageBarType.error
                    });
                    localError = true;
                  }
                }
              }
            } else if (element.dataType === "boolean") {
              try {
                Boolean(rowCol);
              } catch (error) {
                var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} Col: ${element.name} - Value is not a '${element.dataType}'.`;
                tmpInsertToMessageMap(element.key + row, {
                  msg,
                  type: MessageBarType.error
                });
                localError = true;
              }
            } else if (element.dataType === "date") {
              try {
                if (!isValidDate(rowCol)) {
                  throw {};
                } else {
                  continue;
                }
              } catch (error) {
                var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} Col: ${element.name} - Value is not a '${element.dataType}'.`;
                tmpInsertToMessageMap(element.key + row, {
                  msg,
                  type: MessageBarType.error
                });
                localError = true;
              }
            }
          }
          if (element.validations && element.validations.columnDependent) {
            for (let index = 0; index < element.validations.columnDependent.length; index++) {
              const colDep = element.validations.columnDependent[index];
              if (gridData[colDep.dependentColumnKey] || gridData[colDep.dependentColumnKey] !== void 0) {
                const str = gridData[colDep.dependentColumnKey];
                let skip = false;
                if (colDep.skipCheckIfTheseColumnsHaveData && colDep.skipCheckIfTheseColumnsHaveData.colKeys) {
                  for (const skipForKey of colDep.skipCheckIfTheseColumnsHaveData.colKeys) {
                    if ((_b = colDep.skipCheckIfTheseColumnsHaveData) == null ? void 0 : _b.partial) {
                      const str2 = gridData[skipForKey];
                      if (str2 && str2 !== null && str2 !== void 0 && (str2 == null ? void 0 : str2.toString().length) > 0) {
                        skip = true;
                        break;
                      }
                    } else {
                      const str2 = gridData[skipForKey];
                      if (str2 && str2 !== null && str2 !== void 0 && (str2 == null ? void 0 : str2.toString().length) > 0) {
                        skip = true;
                      } else {
                        skip = false;
                        break;
                      }
                    }
                  }
                }
                if (!skip) {
                  if (str !== void 0 && str !== null) {
                    if ((str == null ? void 0 : str.toString().length) > 0 && colDep.type === DepColTypes.MustBeEmpty) {
                      if (rowCol !== null && (rowCol == null ? void 0 : rowCol.toString().length) > 0) {
                        var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ` + (colDep.errorMessage ?? `Data cannot be entered in ${element.name} and in ${colDep.dependentColumnName} Column. Remove data in ${colDep.dependentColumnName} Column to enter data here.`);
                        tmpInsertToMessageMap(row + "ColDep", {
                          msg,
                          type: MessageBarType.error
                        });
                        localError = true;
                      }
                    }
                  }
                  if ((str == void 0 || str == null || str == "" && element.dataType != "number" || str && (str == null ? void 0 : str.toString().length) <= 0) && colDep.type === DepColTypes.MustHaveData) {
                    var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ` + (colDep.errorMessage ?? ` Data needs to entered in ${colDep.dependentColumnName} and in ${element.name} Column.`);
                    tmpInsertToMessageMap(row + "ColDep", {
                      msg,
                      type: MessageBarType.error
                    });
                    localError = true;
                  }
                }
              }
            }
          }
          if (element.validations && element.validations.regexValidation) {
            for (let index = 0; index < element.validations.regexValidation.length; index++) {
              const data = element.validations.regexValidation[index];
              if (!data.regex.test(rowCol)) {
                var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${data.errorMessage}`;
                tmpInsertToMessageMap(element.key + row, {
                  msg,
                  type: MessageBarType.error
                });
                localError = true;
              }
            }
          }
          if (element.validations && element.validations.stringValidations) {
            const caseInsensitive = element.validations.stringValidations.caseInsensitive;
            if (caseInsensitive) {
              if (rowCol !== null && ((_d = (_c = element.validations.stringValidations) == null ? void 0 : _c.conditionCantEqual) == null ? void 0 : _d.toLowerCase()) === (rowCol == null ? void 0 : rowCol.toString().toLowerCase())) {
                var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${(_e = element.validations.stringValidations) == null ? void 0 : _e.errMsg}`;
                tmpInsertToMessageMap(element.key + row, {
                  msg,
                  type: MessageBarType.error
                });
                localError = true;
              } else {
                if (rowCol !== null && ((_f = element.validations.stringValidations) == null ? void 0 : _f.conditionCantEqual) === (rowCol == null ? void 0 : rowCol.toString())) {
                  var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${(_g = element.validations.stringValidations) == null ? void 0 : _g.errMsg}`;
                  tmpInsertToMessageMap(element.key + row, {
                    msg,
                    type: MessageBarType.error
                  });
                  localError = true;
                }
              }
            }
          }
        }
      }
      if (emptyReqCol.length > 1) {
        var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index:" + row + 1} - ${emptyReqCol} cannot all be empty`;
        tmpInsertToMessageMap(row + "erc", {
          msg,
          type: MessageBarType.error
        });
        localError = true;
      } else if (emptyReqCol.length == 1) {
        var msg = `Row: ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : row + 1} - ${emptyReqCol} cannot be empty`;
        tmpInsertToMessageMap(row + "erc", {
          msg,
          type: MessageBarType.error
        });
        localError = true;
      }
      if (emptyCol.length > 1) {
        var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index: " + row + 1} - ${emptyCol == null ? void 0 : emptyCol.toString()} cannot be empty at all`;
        tmpInsertToMessageMap(row + "ec", {
          msg,
          type: MessageBarType.error
        });
        localError = true;
      } else if (emptyCol.length == 1) {
        var msg = `Row ${indentiferColumn ? "With ID: " + gridData[indentiferColumn] : "With Index: " + row + 1} - ${emptyCol == null ? void 0 : emptyCol.toString()} cannot be empty`;
        tmpInsertToMessageMap(row + "ec", {
          msg,
          type: MessageBarType.error
        });
        localError = true;
      }
    }
    self.postMessage({ isError: localError, messages: msgMap });
    self.close();
  };
})();
//# sourceMappingURL=runGridValidations.worker-e1fe0257.js.map
