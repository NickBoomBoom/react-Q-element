class Screen {
  // 最大宽度
  static maxWidth() {
    return Math.min(640, this.clientWidth());
  }


  static documentElement() {
    return (document.body.clientWidth + document.body.clientHeight + document.body.scrollWidth + document.body.scrollHeight + document.body.scrollTop > document.documentElement.clientWidth + document.documentElement.clientHeight + document.documentElement.scrollWidth + document.documentElement.scrollHeight + document.documentElement.scrollTop) ? document.body : document.documentElement;
  }

  // 获取根元素
  static rootElement() {
    return document.getElementById('root');
  }

  // 可用宽度
  static availWidth() {
    return window.screen.availWidth;
  }
  // 可用高度
  static availHeight() {
    return window.screen.availHeight;
  }
  // 页面滚动高度
  static scrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }
  // 页面滚动宽度
  static scrollWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
  }
  // 页面距离顶端的距离
  static scrollTop() {
    return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
  }
  // 回归顶端
  static scrollToTop() {
    window.scrollTo(0, 0);
  }
  // 设置顶端距离
  static setScrollTop(scrollTop) {
    document.body.scrollTop = scrollTop;
    document.documentElement.scrollTop = scrollTop;
  }
  // 设备高度
  static clientHeight() {
    return Math.max(document.body.clientHeight, document.documentElement.clientHeight);
  }
  // 设备宽度
  static clientWidth() {
    return Math.max(document.body.clientWidth, document.documentElement.clientWidth);
  }

  static resetFontSize() {
    let size = Screen.maxWidth() / 7.5;
    Screen.fontSize = size;
    document.documentElement.style.fontSize = size + 'px';
    document.body.style.maxWidth = Screen.maxWidth() + 'px';
    // document.body.style.height = window.screen.height+'px'
  }

  static setInstance(app) {
    Screen.app = app;
  }

  static removeInstance() {
    Screen.app = undefined;
  }

  static alert(message, onClose) {
    Screen.app.setState({
      alert: {
        message: message,
        onClose: () => {
          Screen.app.setState({ alert: undefined }, () => {
            onClose && onClose();
          })
        }
      }
    });
  }

  static confirm(title, message, onConfirm, onCancel) {
    Screen.app.setState({
      confirm: {
        title: title,
        message: message,
        onConfirm: () => {
          Screen.app.setState({ confirm: undefined }, () => {
            onConfirm && onConfirm();
          });
        },
        onCancel: () => {
          Screen.app.setState({ confirm: undefined }, () => {
            onCancel && onCancel();
          });
        }
      }
    });
  }

  static loading(enabled, onComplete) {
    Screen.app.setState({ loading: enabled }, () => {
      onComplete && onComplete();
    });
  }

  static isHorizontal() {
    return Screen.clientWidth() > Screen.clientHeight();
  }

}

export default Screen;