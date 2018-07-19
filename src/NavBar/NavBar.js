import React, { Component } from 'react'
import Common from '../utils/Common'
import './NavBar.css'


/* NavBar 有两种情况 
    1. bar 中无其他样式,bar 点击后 bar 的图标无变化,只是颜色字体变化
    2. children 形式  完成
*/
/* 定义: 
    data:  数组  
      eg: [{name: '首页', type: 1}, {name: '购物车', type: 2}]  类似于这样的

    onSel: 回调函数
      (item,index) => {console.log(item,index)} 

    index: 展示第几个 navbar, 默认第一个, 从零开始

    TODO: 完成!!!!!
       功能点==> 当 NavBar 与 TabContainer 搭配使用时, TabContainer 滑动, Nav的 Bar 也随着同步移动
    translate: 通过 TabContianer 回调传过来的 移动值
      实际的值应该根据 NavBar 的 length 来算, translate = translate / length, 应当为 1: length 
      
*/
class NavBar extends Component {
  constructor(props) {
    super(props)
    let { data, children } = props
    let length = data ? data.length : children.length
    this.state = {
      ind: props.index || 0,                      // 默认展示下标
      isAnimate: props.isAnimate || false,        // 是否开启点击移动动画
      onSel: props.onSel,                         // 回调函数, 返回 item ,index
      data: props.data,                           // 接受数组形式 [{name: String, type: Number}]  也可接受 children
      length,                                     // 数组 || children 个数
    }
  }


  componentDidMount() {
    let { length } = this.state
    this.setState({
      itemWidth: Common.attr(this.wrap, 'width') / length
    }, () => this.setBarWidth())
  }

  componentWillReceiveProps(nextProps) {
    let { index, translate } = nextProps
    let { ind } = this.state
    // console.log('Nav_nextProps', nextProps, this.props)
    translate && this.translateBar(translate)
    if (index >= 0 && ind !== index) this.setState({ ind: index }, () => this.setBarWidth())
  }

  translateBar = s => {
    let { length } = this.state
    let { distance, transition } = s
    // 不连写的原因是 防止以后添加其他属性 会覆盖
    transition ? this.bar.style.transition = 'all 200ms' : this.bar.style.transition = 'none'
    this.bar.style.transform = `translateX(${-distance / length}px)`

  }

  sel = (item, index) => {
    // TIP: 点击不做节流, 为了组件的开放性, 节流交给使用者来做
    let { isAnimate, onSel } = this.state
    isAnimate ? this.bar.style.transition = 'all 200ms' : this.bar.style.transition = 'none'
    this.setState({ ind: index }, () => {
      onSel && onSel(item, index)
      this.setBarWidth()
    })
  }

  // 设置下标的宽度
  setBarWidth = () => {
    let { ind } = this.state
    let els = this.container.children
    let el = els[ind].children.length >= 1 ? els[ind].children[0] : els[ind]
    let w = el.getBoundingClientRect().width
    this.flag.style.width = w + 'px'
  }

  render() {
    let { ind, data, itemWidth } = this.state
    let { children, style } = this.props

    return <div style={style} className='NavBar-root' ref={node => this.wrap = node}>
      <div className="container" ref={node => this.container = node}>
        {
          data ?
            data.map((item, index) => {
              return <span
                key={'Nav' + index}
                style={{ width: itemWidth + 'px' }}
                className={`Nav-item ${index === ind && 'active'}`}
                onClick={() => this.sel(item, index)}
              >
                <span>
                  {item.name}
                </span>
              </span>
            })
            :
            children.map((item, index) => {
              return <span
                key={'Nav' + index}
                style={{ width: itemWidth + 'px' }}
                className={`Nav-item ${index === ind && 'active'}`}
                onClick={() => this.sel(item, index)}>
                {item}
              </span>
            })
        }
      </div>

      <div className='Nav-active' style={{ width: itemWidth + 'px', transform: `translatex(${ind * itemWidth}px)` }} ref={node => this.bar = node} >
        <div className="Nav-active-bar" ref={node => this.flag = node} />
      </div>
    </div>
  }
}
export default NavBar
