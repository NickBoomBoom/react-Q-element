import React, { Component } from 'react'
import './NavBar.css'


/* NavBar 有两种情况 
    1. bar 中无其他样式,bar 点击后 bar 的图标无变化,只是颜色字体变化

   TODO: 2. bar 中有其他样式, bar点击后 bar 的图标和颜色发生变化,所以需要有个 NavItem来配合
*/
/* 定义: 
    navData:  数组  
      eg: [{name: '首页', type: 1}, {name: '购物车', type: 2}]  类似于这样的

    onSel: 回调函数
      (item,index) => {console.log(item,index)} 

    ind: 展示第几个 navbar, 默认第一个, 从零开始

    TODO: 完成!!!!!
       功能点==> 当 NavBar 与 TabContainer 搭配使用时, TabContainer 滑动, Nav的 Bar 也随着同步移动
    translate: 通过 TabContianer 回调传过来的 移动值
      实际的值应该根据 NavBar 的 length 来算, translate = translate / length, 应当为 1: length 
      
*/
class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ind: props.index || 0
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Nav_nextProps', nextProps)
    let { index, translate } = nextProps
    let { ind } = this.state
    if (index >= 0 && index !== ind) {
      this.setState({ ind: index })
    } else {
      translate && this.translateBar(translate)
    }
  }

  translateBar = s => {
    let { navData, children } = this.props
    let length = navData ? navData.length : children.length
    let { distance, transition } = s
    if (this.bar) {
      // 不连写的原因是 防止以后添加其他属性 会覆盖
      transition ? this.bar.style.transition = 'all 200ms' : this.bar.style.transition = 'none'
      this.bar.style.transform = `translateX(${-distance / length}px)`
    }
  }

  sel = (item, index) => {
    // 防止出现不需要 bar 的情况
    this.bar && (this.bar.style.transition = 'all 200ms')
    let { ind } = this.state
    // 函数节流
    if (ind === index) return console.warn('函数节流,不可重复点击')
    let { onSel } = this.props
    onSel && onSel(item, index)
    this.setState({ ind: index })
  }

  render() {
    let { ind, translate, newInd } = this.state
    let { navData, children, style } = this.props
    let itemWidth = navData ? window.screen.width / navData.length : window.screen.width / children.length
    // console.log('ind', ind)
    return <div style={style} className='NavBar-root' ref={node => {
      this.container = node
    }}>
      {
        navData ?
          navData.map((item, index) => {
            return <span
              key={'Nav' + index}
              style={{ width: itemWidth + 'px' }}
              className='Nav-item'
              onClick={() => this.sel(item, index)}
            >
              {item.name}
            </span>
          })
          :
          children.map((item, index) => {
            return <span
              key={'Nav' + index}
              style={{ width: itemWidth + 'px' }}
              className='Nav-item'
              onClick={() => this.sel(item, index)}>
              {item}
            </span>
          })
      }
      <div className='Nav-active' style={{ width: itemWidth + 'px', transform: `translatex(${ind * itemWidth}px)` }} ref={node => this.bar = node} />
    </div>
  }
}
export default NavBar
