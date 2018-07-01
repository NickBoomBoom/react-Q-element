import React, { Component } from 'react';
import Screen from "../../utils/Screen";
import './LazyLoadImg.css'

class LazyLoadImg extends Component {
  constructor(props) {
    super(props);
    this.lazyLoad = this.lazyLoad.bind(this, props.src);
    this.state = {
      isAnimate: false
    }
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
      !this.img.src && (this.img.src = src);
    }
  }

  render() {
    let { isAnimate } = this.state
    let props = Object.assign({}, this.props);
    return (
      <div className={`${isAnimate ? 'LazyLoadImg' : ''}`} style={{ opacity: isAnimate ? 1 : 0 }} >
        <img
          {...props}
          alt=""
          ref={node => {
            this.img = node
          }}
          onLoad={() => {
            this.setState({
              isAnimate: true
            })
          }}
        />
      </div>
    );
  }
}

export default LazyLoadImg; 