import React, { Component } from 'react'
import { attr } from '../utils'
import './AutoScrollTab.css'
const LEFT = 'left'
const CENTER = 'center'
class AutoScrollTab extends Component {
  constructor(props) {
    super(props)
    let direction = props.left ? LEFT : CENTER
    this.interval = props.interval || 18
    this.state = {
      index: props.index || 0,   // 默认开始的下标
      left: props.left,                       // 点击后默认跳向最左边
      fill: false,                            // 填充宽度
      child: null,                            // 子元素
      direction,                              // 点击后 item 是跳向中间 还是 最左边  默认中间
    }
  }



  componentDidMount() {
    let rootWidth = parseFloat(window.getComputedStyle(this.container, null).width)
    let centre = rootWidth / 2
    this.setState({
      rootWidth,   // 根元素的总宽度
      centre,  // 中心点
      child: this.container.children
    }, () => this.checkEl())
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  // 是否具备滚动条件
  checkEl = () => {
    let { rootWidth, child, index } = this.state
    let itemsWidth = 0
    for (let i = 0, len = child.length; i < len; i++) {
      itemsWidth += attr(child[i], 'width')
    }
    if (itemsWidth > rootWidth) {
      this.fill()
    } else {
      this.sel(index)
    }
  }

  // 填充
  fill = () => {
    let { rootWidth, direction, centre, child, index } = this.state
    let lastElWidth = attr(child[child.length - 1], 'width')
    let fill = direction === CENTER ? centre - lastElWidth / 2 : rootWidth - lastElWidth
    this.setState({
      fill
    }, () => this.sel(index))
  }

  //  目标
  target = index => {
    let { direction, child, centre } = this.state
    let item = child[index]
    let left = item.offsetLeft
    let target
    if (direction === CENTER) {
      target = left + attr(item, 'width') / 2 > centre ? left + attr(item, 'width') / 2 - centre : 0
    } else {
      target = left
    }
    return target
  }

  sel = (index, item) => {
    let target = this.target(index)
    console.log('target==>', target, index)
    target >= 0 && this.animate(target, this.container)
  }

  // 缓动动画
  /**
 *
 * @param {*} targe 需要滚动到的位置
 * @param {*} dom dom, 需要滚动的目标 
 * @param {*} direction  scrollTop || scrollLeft, 默认 scollTop
 */
  animate = (target, dom, direction = 'scrollLeft') => {

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      let step = (target - dom[direction]) / 5
      step = step > 0 ? Math.ceil(step) : Math.floor(step)
      dom[direction] += step
      if (Math.abs(target - dom[direction]) <= Math.abs(step) || dom.scrollWidth - dom[direction] === dom.clientWidth) {
        clearInterval(this.timer)
        dom[direction] = target
      }
    }, this.interval)

  }
  render() {
    let { fill } = this.state
    let { children } = this.props
    children = Array.isArray(children) ? children : [...children]
    return <ul className="AutoScrollTab-root" ref={node => this.container = node}>
      {
        children.map((item, index) => {
          return <li key={`children${index}`} className="item" onClick={() => this.sel(index, item)}>
            {item}
          </li>
        })
      }
      {
        fill && <li className="item" style={{ width: fill + 'px' }}></li>
      }
    </ul>
  }
}

export default AutoScrollTab