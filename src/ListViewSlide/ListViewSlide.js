

import React, { Component } from 'react'
import { getAttr } from '../utils/index'
import './ListViewSlide.css'

const TOUCH_TOP = 'up'
const TOUCH_BOTTOM = 'down'
const TOUCH_LEFT = 'left'
const TOUCH_RIGHT = 'right'
class ListViewSlide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReset: props.isReset,
      translateX: props.translateX,   // 移动距离
    }
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props, state)
    return props
  }
  componentDidMount() {
    this.setContent()
  }


  // 判断开启滑动方向,然后寻找到主展示内容
  setContent = () => {
    let els = this.content.children
    let canMoveX = 0
    for (let i = 0, len = els.length; i < len; i++) {
      canMoveX += getAttr(els[i], 'width')
    }
    let mainWidth = getAttr(els[0], 'width')
    canMoveX = canMoveX - mainWidth
    this.container.style.width = mainWidth + 'px'
    this.canMoveX = canMoveX
  }
  slideStart = e => {
    this.startX = e.changedTouches[0].pageX
    this.startY = e.changedTouches[0].pageY
  }

  slideMove = e => {
    // event.preventDefault();
    // 判断方向
    let moveEndX = e.changedTouches[0].pageX
    let moveEndY = e.changedTouches[0].pageY
    let X = moveEndX - this.startX
    let Y = moveEndY - this.startY

    this.direction = this.setDirection(X, Y)
    this.direction && this.translate(X)
  }

  slideEnd = e => {
    this.direction = null
    if (!this.moveX) return
    if (this.moveX > 0) return this.reset()
    let moveX = Math.abs(this.moveX)
    let limit = this.canMoveX / 5
    moveX >= limit ? this.animate() : this.reset()
    this.moveX = null
  }

  translate = x => {
    if (Math.abs(~~x) >= ~~this.canMoveX) return
    this.moveX = x
    if (x > 0 && this.translateX < 0) x = this.translateX + x
    if (x > 0) x = 0
    this.content.style.transition = 'none'
    this.content.style.transform = `translateX(${x}px)`

  }

  animate = () => {
    let { isSel } = this.props
    this.content.style.transition = 'all 200ms'
    this.content.style.transform = `translateX(${-this.canMoveX}px)`
    this.translateX = -this.canMoveX
    isSel && isSel()
  }
  reset = () => {
    if (!this.content) return
    this.content.style.transition = 'all 200ms'
    this.content.style.transform = `translateX(0px)`
    this.translateX = 0
    let {unSel} = this.props
    unSel && unSel()
  }

  setDirection = (x, y) => {
    if (Math.abs(x) > Math.abs(y) && x > 0) {
      // right
      return TOUCH_RIGHT
    }
    else if (Math.abs(x) > Math.abs(y) && x < 0) {
      // left
      return TOUCH_LEFT
    }
    else if (Math.abs(y) > Math.abs(x) && y > 0) {
      // return TOUCH_BOTTOM
      // console.log('向下')
      return false
    }
    else if (Math.abs(y) > Math.abs(x) && y < 0) {
      // return TOUCH_TOP
      // console.log('向上')
      return false
    }
  }



  render() {
    let { children } = this.props
    let { isReset } = this.state
    isReset && this.reset()
    return <div className="list_view_slide_root"
      ref={node => this.container = node}
      onTouchStart={e => this.slideStart(e)}
      onTouchMove={e => this.slideMove(e)}
      onTouchEnd={e => this.slideEnd(e)}
    >
      <div className="slide_content" ref={node => this.content = node} >
        {children.map((item, index) => {
          return <div className="slide_item" key={index}>
            {item}
          </div>
        })}
      </div>
    </div>
  }


}

export default ListViewSlide