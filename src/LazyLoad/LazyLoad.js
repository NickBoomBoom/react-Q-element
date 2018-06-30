import React, { Component } from 'react'
import Screen from '../utils/Screen'
import './LazyLoad.css'
import DefaultImg from './whitebg.png'

class LazyLoad extends Component {
  constructor(props) {
    super(props);
    this.lazyLoad = this.lazyLoad.bind(this, props.src);
  }

  componentDidMount() {
    this.isScroll()
    window.addEventListener("scroll", this.lazyLoad);
    window.addEventListener("resize", this.lazyLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.lazyLoad);
    window.removeEventListener("resize", this.lazyLoad);
  }

  // 判断页面是否可滚动, 若不可滚动, 即刻显示图片
  isScroll() {
    if (document.body.clientHeight <= Screen.clientHeight()) { this.lazyLoad() }
  }

  lazyLoad(src) {
    if (Screen.availHeight() + Screen.scrollTop() > this.img.offsetTop - 100) {
      this.img.src = src;
    }
  }

  render() {
    let props = Object.assign({}, this.props);
    props.src = DefaultImg
    return (
      <div className='LazyLoadImg'>
        <img {...props} alt="" ref={input => {
          this.img = input
        }} />
      </div>
    );
  }
}
export default LazyLoad