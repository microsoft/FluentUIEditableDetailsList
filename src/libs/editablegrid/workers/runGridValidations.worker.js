self.onmessage = function (event) {
  const { inError, messages, defaultGridDataTmp, indentiferColumn, propColumns, MessageBarType, DepColTypes  } = event.data;

  let localError = inError;
  const msgMap = new Map(messages);

  const tmpInsertToMessageMap = (key, value) => {
    msgMap.set(key, value);
  };

  for (let row = 0; row < defaultGridDataTmp.length; row++) {
    const gridData = defaultGridDataTmp[row];
    var elementColNames = Object.keys(gridData);
    let emptyCol = [];
    let emptyReqCol = [];
    for (
      let indexInner = 0;
      indexInner < elementColNames.length;
      indexInner++
    ) {
      const colNames = elementColNames[indexInner];
      const rowCol = gridData[colNames];
      const currentCol = propColumns.filter((x) => x.key === colNames);

      // ValidDataTypeCheck
      for (let j = 0; j < currentCol.length; j++) {
        const element = currentCol[j];
        const rowCol = gridData[element.key];

        if (
          element.required &&
          typeof element.required == "boolean" &&
          (rowCol == null ||
            rowCol == undefined ||
            rowCol?.toString().length <= 0 ||
            (rowCol == "" && element.dataType != "number"))
        ) {
          if (!emptyCol.includes(" " + element.name))
            emptyCol.push(" " + element.name);
        } else if (
          typeof element.required !== "boolean" &&
          !element.required.requiredOnlyIfTheseColumnsAreEmpty &&
          element.required.errorMessage &&
          (rowCol == null ||
            rowCol == undefined ||
            rowCol?.toString().length <= 0 ||
            (rowCol == "" && element.dataType != "number"))
        ) {
          var msg =
            `Row ${
              indentiferColumn
                ? "With ID: " + gridData[indentiferColumn]
                : "With Index:" + row + 1
            } - ` + `${element.required.errorMessage}'.`;
          tmpInsertToMessageMap(element.key + row + "empty", {
            msg: msg,
            type: MessageBarType.error,
          });
        } else if (
          typeof element.required !== "boolean" &&
          element.required.requiredOnlyIfTheseColumnsAreEmpty &&
          (rowCol == null ||
            rowCol == undefined ||
            rowCol?.toString().length <= 0 ||
            (rowCol == "" && element.dataType != "number"))
        ) {
          const checkKeys =
            element.required.requiredOnlyIfTheseColumnsAreEmpty.colKeys;
          let skippable = false;
          for (let index = 0; index < checkKeys.length; index++) {
            const columnKey = checkKeys[index];
            const str = gridData[columnKey];

            if (element.required.alwaysRequired) {
              if (
                str == null ||
                str == undefined ||
                str?.toString().length <= 0 ||
                (str == "" && element.dataType != "number")
              ) {
                if (element.required.errorMessage) {
                  var msg =
                    `Row ${
                      indentiferColumn
                        ? "With ID: " + gridData[indentiferColumn]
                        : "With Index:" + row + 1
                    } - ` + `${element.required.errorMessage}'.`;
                  tmpInsertToMessageMap(element.key + row + "empty", {
                    msg: msg,
                    type: MessageBarType.error,
                  });
                } else if (!emptyReqCol.includes(" " + element.name)) {
                  emptyReqCol.push(" " + element.name);
                  break;
                }
              }
            } else {
              if (
                (str || str?.toString()?.trim() == "0") &&
                str?.toString().length > 0
              ) {
                skippable = true;
                break;
              }
            }
          }
          if (!emptyReqCol.includes(" " + element.name) && skippable == false) {
            if (!element.required.errorMessage)
              emptyReqCol.push(" " + element.name);
            else {
              var msg =
                `Row ${
                  indentiferColumn
                    ? "With ID: " + gridData[indentiferColumn]
                    : "With Index:" + row + 1
                } - ` + `${element.required.errorMessage}'.`;
              tmpInsertToMessageMap(element.key + row + "empty", {
                msg: msg,
                type: MessageBarType.error,
              });
            }
          }
        }

        if (
          rowCol !== null &&
          (typeof rowCol !== element.dataType || typeof rowCol === "number")
        ) {
          if (element.dataType === "number") {
            if (rowCol && isNaN(parseInt(rowCol)) && rowCol !== "") {
              var msg =
                `Row ${
                  indentiferColumn
                    ? "With ID: " + gridData[indentiferColumn]
                    : "With Index:" + row + 1
                } Col: ${element.name} - ` +
                `Value is not a '${element.dataType}'.`;
              tmpInsertToMessageMap(element.key + row, {
                msg: msg,
                type: MessageBarType.error,
              });

              localError = true;
            } else if (
              element.validations &&
              element.validations.numberBoundaries
            ) {
              const min = element.validations.numberBoundaries.minRange;
              const max = element.validations.numberBoundaries.maxRange;

              if (min && max) {
                if (!(min <= parseInt(rowCol) && max >= parseInt(rowCol))) {
                  var msg =
                    `Row ${
                      indentiferColumn
                        ? "With ID: " + gridData[indentiferColumn]
                        : "With Index:" + row + 1
                    } Col: ${element.name} - ` +
                    `Value outside of range '${min} - ${max}'. Entered value ${rowCol}`;
                  tmpInsertToMessageMap(element.key + row, {
                    msg: msg,
                    type: MessageBarType.error,
                  });

                  localError = true;
                }
              } else if (min) {
                if (!(min <= parseInt(rowCol))) {
                  var msg =
                    `Row ${
                      indentiferColumn
                        ? "With ID: " + gridData[indentiferColumn]
                        : "With Index:" + row + 1
                    } Col: ${element.name} - ` +
                    `Value is lower than required range: '${min}'. Entered value ${rowCol}`;
                  tmpInsertToMessageMap(element.key + row, {
                    msg: msg,
                    type: MessageBarType.error,
                  });

                  localError = true;
                }
              } else if (max) {
                if (!(max >= parseInt(rowCol))) {
                  var msg =
                    `Row ${
                      indentiferColumn
                        ? "With ID: " + gridData[indentiferColumn]
                        : "With Index:" + row + 1
                    } Col: ${element.name} - ` +
                    `Value is greater than required range: '${max}'. Entered value ${rowCol}`;
                  tmpInsertToMessageMap(element.key + row, {
                    msg: msg,
                    type: MessageBarType.error,
                  });

                  localError = true;
                }
              }
            }
          } else if (element.dataType === "boolean") {
            try {
              Boolean(rowCol);
            } catch (error) {
              var msg =
                `Row ${
                  indentiferColumn
                    ? "With ID: " + gridData[indentiferColumn]
                    : "With Index:" + row + 1
                } Col: ${element.name} - ` +
                `Value is not a '${element.dataType}'.`;
              tmpInsertToMessageMap(element.key + row, {
                msg: msg,
                type: MessageBarType.error,
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
              var msg =
                `Row ${
                  indentiferColumn
                    ? "With ID: " + gridData[indentiferColumn]
                    : "With Index:" + row + 1
                } Col: ${element.name} - ` +
                `Value is not a '${element.dataType}'.`;
              tmpInsertToMessageMap(element.key + row, {
                msg: msg,
                type: MessageBarType.error,
              });

              localError = true;
            }
          }
        }

        if (element.validations && element.validations.columnDependent) {
          for (
            let index = 0;
            index < element.validations.columnDependent.length;
            index++
          ) {
            const colDep = element.validations.columnDependent[index];

            if (
              gridData[colDep.dependentColumnKey] ||
              gridData[colDep.dependentColumnKey] !== undefined
            ) {
              const str = gridData[colDep.dependentColumnKey];
              let skip = false;

              if (
                colDep.skipCheckIfTheseColumnsHaveData &&
                colDep.skipCheckIfTheseColumnsHaveData.colKeys
              ) {
                for (const skipForKey of colDep.skipCheckIfTheseColumnsHaveData
                  .colKeys) {
                  if (colDep.skipCheckIfTheseColumnsHaveData?.partial) {
                    const str = gridData[skipForKey];
                    if (
                      str &&
                      str !== null &&
                      str !== undefined &&
                      str?.toString().length > 0
                    ) {
                      skip = true;
                      break;
                    }
                  } else {
                    const str = gridData[skipForKey];
                    if (
                      str &&
                      str !== null &&
                      str !== undefined &&
                      str?.toString().length > 0
                    ) {
                      skip = true;
                    } else {
                      skip = false;
                      break;
                    }
                  }
                }
              }

              if (!skip) {
                if (str !== undefined && str !== null) {
                  if (
                    str?.toString().length > 0 &&
                    colDep.type === DepColTypes.MustBeEmpty
                  ) {
                    if (rowCol !== null && rowCol?.toString().length > 0) {
                      var msg =
                        `Row ${
                          indentiferColumn
                            ? "With ID: " + gridData[indentiferColumn]
                            : "With Index:" + row + 1
                        } - ` +
                        (colDep.errorMessage ??
                          `Data cannot be entered in ${element.name} and in ${colDep.dependentColumnName} Column. Remove data in ${colDep.dependentColumnName} Column to enter data here.`);

                      tmpInsertToMessageMap(row + "ColDep", {
                        msg: msg,
                        type: MessageBarType.error,
                      });

                      localError = true;
                    }
                  }
                }
                if (
                  (str == undefined ||
                    str == null ||
                    (str == "" && element.dataType != "number") ||
                    (str && str?.toString().length <= 0)) &&
                  colDep.type === DepColTypes.MustHaveData
                ) {
                  var msg =
                    `Row ${
                      indentiferColumn
                        ? "With ID: " + gridData[indentiferColumn]
                        : "With Index:" + row + 1
                    } - ` +
                    (colDep.errorMessage ??
                      ` Data needs to entered in ${colDep.dependentColumnName} and in ${element.name} Column.`);

                  tmpInsertToMessageMap(row + "ColDep", {
                    msg: msg,
                    type: MessageBarType.error,
                  });
                  localError = true;
                }
              }
            }
          }
        }

        if (element.validations && element.validations.regexValidation) {
          for (
            let index = 0;
            index < element.validations.regexValidation.length;
            index++
          ) {
            const data = element.validations.regexValidation[index];
            if (!data.regex.test(rowCol)) {
              var msg =
                `Row ${
                  indentiferColumn
                    ? "With ID: " + gridData[indentiferColumn]
                    : "With Index:" + row + 1
                } - ` + `${data.errorMessage}`;
              tmpInsertToMessageMap(element.key + row, {
                msg: msg,
                type: MessageBarType.error,
              });

              localError = true;
            }
          }
        }

        if (element.validations && element.validations.stringValidations) {
          const caseInsensitive =
            element.validations.stringValidations.caseInsensitive;
          if (caseInsensitive) {
            if (
              rowCol !== null &&
              element.validations.stringValidations?.conditionCantEqual?.toLowerCase() ===
                rowCol?.toString().toLowerCase()
            ) {
              var msg =
                `Row ${
                  indentiferColumn
                    ? "With ID: " + gridData[indentiferColumn]
                    : "With Index:" + row + 1
                } - ` + `${element.validations.stringValidations?.errMsg}`;
              tmpInsertToMessageMap(element.key + row, {
                msg: msg,
                type: MessageBarType.error,
              });

              localError = true;
            } else {
              if (
                rowCol !== null &&
                element.validations.stringValidations?.conditionCantEqual ===
                  rowCol?.toString()
              ) {
                var msg =
                  `Row ${
                    indentiferColumn
                      ? "With ID: " + gridData[indentiferColumn]
                      : "With Index:" + row + 1
                  } - ` + `${element.validations.stringValidations?.errMsg}`;
                tmpInsertToMessageMap(element.key + row, {
                  msg: msg,
                  type: MessageBarType.error,
                });

                localError = true;
              }
            }
          }
        }
      }
    }

    if (emptyReqCol.length > 1) {
      var msg = `Row ${
        indentiferColumn
          ? "With ID: " + gridData[indentiferColumn]
          : "With Index:" + row + 1
      } - ${emptyReqCol} cannot all be empty`;

      tmpInsertToMessageMap(row + "erc", {
        msg: msg,
        type: MessageBarType.error,
      });

      localError = true;
    } else if (emptyReqCol.length == 1) {
      var msg = `Row: ${
        indentiferColumn
          ? "With ID: " + gridData[indentiferColumn]
          : row + 1
      } - ${emptyReqCol} cannot be empty`;

      tmpInsertToMessageMap(row + "erc", {
        msg: msg,
        type: MessageBarType.error,
      });

      localError = true;
    }

    if (emptyCol.length > 1) {
      var msg = `Row ${
        indentiferColumn
          ? "With ID: " + gridData[indentiferColumn]
          : "With Index: " + row + 1
      } - ${emptyCol?.toString()} cannot be empty at all`;

      tmpInsertToMessageMap(row + "ec", {
        msg: msg,
        type: MessageBarType.error,
      });

      localError = true;
    } else if (emptyCol.length == 1) {
      var msg = `Row ${
        indentiferColumn
          ? "With ID: " + gridData[indentiferColumn]
          : "With Index: " + row + 1
      } - ${emptyCol?.toString()} cannot be empty`;

      tmpInsertToMessageMap(row + "ec", {
        msg: msg,
        type: MessageBarType.error,
      });

      localError = true;
    }
  }

  self.postMessage({isError: localError, messages: msgMap});
  self.close();
};
