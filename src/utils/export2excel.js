import { saveAs } from 'file-saver'
import XLSX from 'xlsx'

/**
 * 生成数组.
 * @param {Element} table Dom 元素.
 * @return {Array}
 */
function generateArray(table) {
  const out = []
  const rows = table.querySelectorAll('tr')
  const ranges = []
  for (let R = 0; R < rows.length; ++R) {
    const outRow = []
    const row = rows[R]
    const columns = row.querySelectorAll('td')
    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C]
      const colspan = cell.getAttribute('colspan')
      const rowspan = cell.getAttribute('rowspan')
      let cellValue = cell.innerText
      if (cellValue !== '' && cellValue == +cellValue) cellValue = +cellValue

      //Skip ranges
      ranges.forEach(range => {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
        }
      })

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        })
      }

      //Handle Value
      outRow.push(cellValue !== '' ? cellValue : null)

      //Handle Colspan
      if (colspan) {
        for (let k = 0; i < colspan - 1; ++k) outRow.push(null)
      }
    }
    out.push(outRow)
  }
  return [out, ranges]
}

function sheet_from_array_of_arrays(data, opts = {}) {
  const ws = {}
  const range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  }
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      // 超过边界处理
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C

      const cell = {
        v: data[R][C]
      }

      // 终止本次循环
      if (cell.v == null) continue

      // Tips: c: 列(colum ); r: 行(row)
      const cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      })

      if (typeof cell.v === 'number') cell.t = 'n'
      else if (typeof cell.v === 'boolean') cell.t = 'b'
      else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF._table[14]
        cell.v = datanum(cell.v)
      } else cell.t = 's'

      ws[cell_ref] = cell
    }
  }

  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)

  return ws
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

/**
 * 字符串转 ArrayBuffer.
 * 
 * @param {} s 
 */
function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

/**
 * Todo
 */
function datanum(v, date1904) {
  if (data1904) v += 1462
  const epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30)) / (24 * 60 * 60 * 1000))
}

/**
 * 格式化数据.
 * 
 * @param {Array<string>} filterVal
 * @param {Array<any>} jsonData
 * @return 
 * 
 * @example
 * arr1 = [{x: 1, y: 2, z: 1}, {x: 2, y: 2, z: 2}], filter = ['y', 'z']
 * formatJson(filter, arr1) 
 * => [[2, 1], [2, 2]]
 */
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timestamp') {
      return utils.parseTime(v[j])
    } else {
      return v[j]
    }
  }))
}

/**
 * 筛选数据.
 * (未使用)
 * 
 * @param {Array<string>} filterVal
 * @param {Array<any>} jsonData
 * 
 * @example
 * arr1 = [{x: 1, y: 2, z: 1}, {x: 2, y: 2, z: 2}], filter = ['y', 'z']
 * filterJson(filter, arr1) 
 * => [{y: 2, z: 1}, {y: 2, z: 2}]
 */
function filterJson(filterVal, jsonData) {
  let resArr = []
  if (filterVal.length === 0) return []
  jsonData.map(i => {
    const item = {}
    filterVal.map(j => {
      item[j] = i[j]
    })
    resArr.push(item)
  })
  return resArr
}

/**
 * 解析时间并转为指定格式的字符串
 * @param {(Object|string|number)} time 需要转换的时间
 * @param {string} cFormat 格式模板.
 * @returns {string | null} 格式化后的字符串
 * @see https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/index.js#L11
 */
function parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 从 Table 中导出为 Excel.
 * 
 * @param {String} id Dom 元素的 Id
 */
export function export_table_to_excel(id) {
  const theTable = document.getElementById(id)
  const oo = generateArray(theTable)
  const ranges = oo[1]

  /* original data */
  const data = oo[0]
  const ws_name = 'SheetJS'

  const wb = new Workbook()
  const ws = sheet_from_array_of_arrays(data)
  
  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges
  wb.Sheets[ws_name] = ws

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })

  saveAs(new Blob([s2ab(wbout)]), {
    type: 'application/octet-stream'
  }, 'test.xlsx')
}

/**
 * 从 Json 中导出为 Excel
 */
export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  /* original data */
  data = [...data]
  // Tips: 不使用参数默认值方式 filename = 'excel-list'
  // 这种方式时，只有不传递参数时才有效，如果传递了 filename = '', 会出现 '' 被使用的情况
  filename = filename || 'excel-list'
  data.unshift(header)

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  const ws_name = 'SheetJS'
  const wb = new Workbook()
  const ws = sheet_from_array_of_arrays(data)

  // 参数 merges 为空时处理
  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = []
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /* 设置 worksheet 每列的最大宽度 */
    const colWidth = data.map(row => {
      return row.map(val => {
        /* 先判断是否为null/undefined */
        if (val === null) {
          return {
            'wch': 10
          }
        } 
        /* 再判断是否为中文 */
        else if (val.toString().charCodeAt(0) > 255) {
          console.log('zh', val)
          return {
            'wch': val.toString().length * 2
          }
        } else {
          return {
            'wch': val.toString().length
          }
        }
      })
    })
    /* 以第一行为初始值 */
    let result = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch']
        }
      }
    }
    ws['!cols'] = result
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws
  console.log('wb', wb);
  // return;
  const wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  })
  
  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), `${filename}.${bookType}`)
}

export const utils = {
  /**
   * 解析时间并转为指定格式的字符串
   * @param {(Object|string|number)} time 需要转换的时间
   * @param {string} cFormat 格式模板.
   * @returns {string | null} 格式化后的字符串
   * @see https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/index.js#L11
   */
  parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
    return parseTime(time, cFormat)
  },

  /**
   * 格式化数据.
   */
  formatJson(filterVal, jsonData) {
    return formatJson(filterVal, jsonData)
  },
  
  /**
   * 筛选数据.
   * (未使用)
   */
  filterJson(filterVal, jsonData) {
    return filterJson(filterVal, jsonData)
  }
}