import { ICellStyleRulesType } from '../types/cellstyleruletype'
import { IColumnConfig } from '../types/columnconfigtype'
import { IGridColumnFilter } from '../types/columnfilterstype'
import {
  dateOperatorEval,
  IFilter,
  numberOperatorEval,
  stringOperatorEval
} from '../types/filterstype'

export const filterGridData = (data: any[], filters: IFilter[]): any[] => {
  var dataTmp: any[] = [...data]
  dataTmp.forEach(row => {
    var isRowIncluded: boolean = true
    filters.forEach(item => {
      if (isRowIncluded) {
        var columnType = item.column.dataType
        switch (columnType) {
          case 'number':
            isRowIncluded =
              isRowIncluded &&
              numberOperatorEval(
                row[item.column.key],
                item.value,
                item.operator
              )
            break
          case 'string':
            isRowIncluded =
              isRowIncluded &&
              stringOperatorEval(
                row[item.column.key],
                item.value,
                item.operator
              )
            break
        }
      }
    })

    if (isRowIncluded) {
      row._is_filtered_in_ = true
    } else {
      row._is_filtered_in_ = false
    }
  })

  return dataTmp
}

export const applyGridColumnFilter = (
  data: any[],
  gridColumnFilterArr: IGridColumnFilter[]
): any[] => {
  var dataTmp: any[] = [...data]

  if (gridColumnFilterArr.filter(item => item.isApplied == true).length > 0) {
    dataTmp.map(row => (row._is_filtered_in_column_filter_ = true))
  }

  gridColumnFilterArr
    .filter(gridColumnFilter => gridColumnFilter.isApplied == true)
    .forEach((gridColumnFilter, index) => {
      dataTmp
        .filter(row => row._is_filtered_in_column_filter_ == true)
        .forEach((row, i) => {
          row._is_filtered_in_column_filter_ = gridColumnFilter
            .filterCalloutProps!.filterList.filter(a => a.isChecked == true)
            .map(a => a.text)
            .includes(row[gridColumnFilter.column.key])
        })
    })

  return dataTmp
}

export const isColumnDataTypeSupportedForFilter = (
  datatype: string | undefined
): boolean => {
  switch (datatype) {
    case 'number':
      return true
    case 'string':
      return true
    default:
      return false
  }
}

export const IsValidDataType = (
  type: string | undefined,
  text: string
): boolean => {
  var isValid = true
  switch (type) {
    case 'number':
      isValid = !isNaN(Number(text))
      break
  }

  return isValid
}

export const EvaluateRule = (
  datatType: string,
  cellValue: string | number | undefined,
  styleRule: ICellStyleRulesType | undefined
): boolean => {
  if (!styleRule) {
    return false
  }

  switch (datatType) {
    case 'number':
      return numberOperatorEval(
        Number(cellValue),
        styleRule?.rule!.value as number,
        styleRule?.rule!.operator
      )
    case 'string':
      return stringOperatorEval(
        String(cellValue),
        styleRule?.rule!.value as string,
        styleRule?.rule!.operator
      )
    case 'date':
      return dateOperatorEval(
        new Date(String(cellValue)),
        new Date(styleRule?.rule!.value),
        styleRule?.rule!.operator
      )
    default:
      return false
  }
}

export const ConvertObjectToText = (
  obj: any,
  columns: IColumnConfig[]
): string => {
  var text: string = ''

  columns.forEach(col => {
    text += (obj[col.key] == null ? '' : obj[col.key]) + '\t'
  })

  return text.substring(0, text.lastIndexOf('\t'))
}

export const ParseType = (
  type: string | undefined,
  text: string,
  isTextModified?: boolean
): any => {
  if (text?.trim().length == 0) {
    return null
  }

  // switch (type) {
  //   case "number":
  //     return Number(text);
  //   case "date":
  //     return Date.parse(text);
  // }

  switch (type) {
    case 'number':
      console.log(text)
      if (!isNaN(parseFloat(text?.toString().replace(',', '')))) {
        const newNum = parseFloat(text?.toString().replace(',', ''))
        return newNum
      }
      return text
    case 'date':
      return Date.parse(text)
  }

  return isTextModified ? text?.trim() : text
}

export function isValidDate (value: any) {
  const date: any = new Date(value)
  return !isNaN(date)
}

export const GetDefault = (type: string | undefined): any => {
  switch (type) {
    case 'boolean':
      return false
    case 'date':
      return new Date()
    default:
      return null
  }
}

export const IsValidRegex = (
  regexExpression: RegExp,
  text: string
): boolean => {
  return regexExpression.test(text)
}

export const ConvertTextToObject = (
  text: string,
  columns: IColumnConfig[]
): any[] => {
  var objArr: any[] = []

  var rows: any[] = text?.split('\r\n')

  rows.forEach(rowText => {
    var textArr: string[] = rowText?.split('\t')
    var obj: any = {}
    columns.forEach((col, ind) => {
      obj[col.key] = ParseType(col.dataType as string, textArr[ind])
    })
    objArr.push(obj)
  })

  return objArr
}

export function isArrayOfStrings (variable: any) {
  if (!Array.isArray(variable)) {
    return false
  }
  return variable.every(function (element) {
    return typeof element === 'string'
  })
}

export function removeFunctionsFromArrayObjects (arr: any) {
  return arr.map((obj: any) => {
    if (typeof obj === 'object' && obj !== null) {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          // If the property type is a function, remove it from the object
          if (typeof obj[prop] === 'function') {
            delete obj[prop]
          }
          // If the property type is an object, recursively remove functions from it
          else if (typeof obj[prop] === 'object') {
            obj[prop] = removeFunctionsFromArrayObjects([obj[prop]])[0]
          }
        }
      }
    }
    return obj
  })
}

export const pasteMappingHelper = (
  allowPastingIntoNonEditableFields: boolean,
  pastedValue: any,
  columnValuesObj: any,
  colKeysVal: string,

  useForceKeyMappingOptimization: (
    key: string,
    valueToCompare: any,
    mapOn?: 'key' | 'text',
    looseMapping?: boolean
  ) => any
) => {
  const trimmedCurrentVal = pastedValue?.toString()?.toLowerCase()?.trim()

  if (
    columnValuesObj?.[colKeysVal]?.columnEditable ||
    allowPastingIntoNonEditableFields
  ) {
    if (trimmedCurrentVal === 'false') {
      return false
    } else if (trimmedCurrentVal === 'true') {
      return true
    } else if (columnValuesObj?.[colKeysVal]?.dataType == 'number') {
      const numberBoundaries =
        columnValuesObj?.[colKeysVal]?.validations?.numberBoundaries

      const modifiedValue = parseFloat(trimmedCurrentVal.replaceAll(',', ''))
      let value = Number(Number(modifiedValue)?.toFixed(4))

      if (numberBoundaries && isNaN(value) == false) {
        const minRange = numberBoundaries.minRange
        const maxRange = numberBoundaries.maxRange

        if (value < minRange) {
          value = minRange
        } else if (value > maxRange) {
          value = maxRange
        }
      }

      return isNaN(value)
        ? columnValuesObj?.[colKeysVal]?.props?.defaultNullOrNaNNumbersTo
        : value ?? columnValuesObj?.[colKeysVal]?.props?.defaultNullOrNaNNumbersTo
    } else {
      if (columnValuesObj?.[colKeysVal]?.dataType == 'boolean') {
        if (trimmedCurrentVal == '1' || trimmedCurrentVal == '0') {
          return trimmedCurrentVal == '1' ? true : false ?? false
        } else if (trimmedCurrentVal == 'y' || trimmedCurrentVal == 'n') {
          return trimmedCurrentVal == 'y' ? true : false ?? false
        }
      } else {
        return useForceKeyMappingOptimization(colKeysVal, trimmedCurrentVal, 'text', false) ?? trimmedCurrentVal ?? null
      }
    }
  } else {
    if (columnValuesObj?.[colKeysVal]?.dataType == 'boolean') {
      return columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow ?? false
    } else if (columnValuesObj?.[colKeysVal]?.dataType == 'number') {
      const modifiedValue = parseFloat(
        columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow
          ?.toString()
          ?.replaceAll(',', '')
      )
      const value = Number(Number(modifiedValue)?.toFixed(4))

      return isNaN(value)
      ? columnValuesObj?.[colKeysVal]?.props?.defaultNullOrNaNNumbersTo
      : value ?? columnValuesObj?.[colKeysVal]?.props?.defaultNullOrNaNNumbersTo
      
    } else if (columnValuesObj?.[colKeysVal]?.dataType == 'string') {
      return columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow ?? ''
    } else {
      return columnValuesObj?.[colKeysVal]?.defaultValueOnNewRow ?? null
    }
  }
}
