function attr(dom, attr) {
  return parseFloat(window.getComputedStyle(dom, null)[attr]) || dom.getBoundingClientRect()[attr]
}
/**
 *
 * 返回触摸方向
 * @param {*} x  movex - startx
 * @param {*} y  movey - movey
 */
function touch(x, y) {
  if (Math.abs(x) > Math.abs(y) && x > 0) {
    // right
    // return TOUCH_RIGHT
  }
  else if (Math.abs(x) > Math.abs(y) && x < 0) {
    // left
    // return TOUCH_LEFT
  }
  else if (Math.abs(y) > Math.abs(x) && y > 0) {
    // console.log('向下')
    // return TOUCH_BOTTOM
  }
  else if (Math.abs(y) > Math.abs(x) && y < 0) {
    // console.log('向上')
    // return TOUCH_TOP
  }
}


export {
  attr

}