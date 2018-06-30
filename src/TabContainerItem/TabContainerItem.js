import React, { Component } from 'react'
import './TabContainerItem.css'

/* 
    在 style 属性中传下 height 属性, 不传默认全屏高度
*/
class TabContainerItem extends Component {

  render() {
    // console.log(this.props)
    let props = Object.assign({}, this.props)
    let {style} = props

    // 默认高度为整屏高度
    if (!style) {
      style = { height: window.screen.height + 'px' }
    } else if (!style.height) {
      style.height = window.screen.height + 'px'
    }
    return <li className="TabContainerItem" {...props} ref={node => this.el = node}>
      {this.props.children}
    </li>
  }
}
export default TabContainerItem