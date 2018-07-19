class Common {
  /**
   * 获取 dom 的属性
   *
   * @static
   * @param {*} dom 
   * @param {*} attr
   * @returns 返回 Number
   * @memberof Common 
   */
  static attr(dom, attr) {
    return parseFloat(window.getComputedStyle(dom,null)[attr]) || dom.getBoundingClientRect()[attr]
  }

}

export default Common