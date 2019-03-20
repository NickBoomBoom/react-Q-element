import React, { Component } from "react";

/* 
    在 style 属性中传下 height 属性, 不传默认全屏高度
*/
class TabContainerItem extends Component {
  render() {
    const {children} = this.props
    return <li {...this.props}>{children}</li>;
  }
}
export default TabContainerItem;
