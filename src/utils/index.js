import { TOUCH_RIGHT, TOUCH_LEFT, TOUCH_UP, TOUCH_DOWN } from "../const/index";

function getAttr(dom, attr) {
  const styles =
    window.getComputedStyle(dom, null) || dom.getBoundingClientRect();
  const res = attr ? styles[attr] : styles;
  return res;
}
/**
 *
 * 返回触摸方向
 * @param {*} x  movex - startx
 * @param {*} y  movey - movey
 */
function getTouchDirection(x, y) {
  if (Math.abs(x) > Math.abs(y) && x > 0) {
    // right
    // return TOUCH_RIGHT
    return TOUCH_RIGHT;
  } else if (Math.abs(x) > Math.abs(y) && x < 0) {
    // left
    // return TOUCH_LEFT
    return TOUCH_LEFT;
  } else if (Math.abs(y) > Math.abs(x) && y > 0) {
    // console.log('向下')
    return TOUCH_DOWN;
  } else if (Math.abs(y) > Math.abs(x) && y < 0) {
    // console.log('向上')
    return TOUCH_UP;
  }
}

export { getAttr, getTouchDirection };
