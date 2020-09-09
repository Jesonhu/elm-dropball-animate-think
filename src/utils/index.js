export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

export const setRem = () => {
  // @see https://github.com/amfe/lib-flexible
  const flexible = function (window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1

    // adjust body font size
    function setBodyFontSize() {
      if (document.body) {
        document.body.style.fontSize = (12 * dpr) + 'px'
      } else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize)
      }
    }
    setBodyFontSize();

    // set 1rem = viewWidth / 10
    function setRemUnit() {
      var rem = docEl.clientWidth / 10
      docEl.style.fontSize = rem + 'px'
    }

    setRemUnit()

    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })

    // detect 0.5px supports
    if (dpr >= 2) {
      var fakeBody = document.createElement('body')
      var testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines')
      }
      docEl.removeChild(fakeBody)
    }
  }
  flexible(window, document);
}

/**
 * 设置 document title 内容
 * @param {String} title 需要设置的字符串
 */
export const setDocumentTitle = (title) => {
  if (document) document.title = title
}

/**
 * is Undefined
 * @params [any] checkObj 判断的对象.
 */
export function isUndefined(checkObj) {
  return checkObj === undefined ? true : false
}