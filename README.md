# react-Q-element

# React  私有组件库的搭建  推荐使用 nwb

[nwb git地址](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb)

[npm 地址](https://www.npmjs.com/package/react-q-element)

## npm start  运行 demo

## 注意点: 

1. 在打包过程中 css 样式文件没有打包的情况下, 请添加 npm run build -- --copy-files

2. 同时,如果你是编写一个组件库而不是单个组件的话, 在 index.js 文件中 export xxx from ‘xxx’ , 可能会有语法报错,直接忽略,打包即可,不要纠结

   

# 目录结构
```
├── CONTRIBUTING.md
├── README.md              // readme
├── demo                   // demo 存放地址
│   └── src
├── nwb.config.js          // nwb 基础配置
├── package.json          
├── src                   
│   ├── LazyLoad           // 懒加载
│   ├── NavBar             // 导航条
│   ├── ScrollView         // 上拉加载,下拉属性, scrollview
│   ├── TabContainer       // 左右拖拽,父级
│   ├── TabContainerItem   // 左右拖拽,子级
│   ├── index.js           // 插件 export 设置
│   └── utils             
├── tests
    └── index-test.js
```



# DEMO gif 图展示



![gif点击循环播放](http://os33agcwz.bkt.clouddn.com/demo.gif)

- LazyLoad

  懒加载

  ```jsx
   <LazyLoadImg src={图片地址} />
  ```

  

- NavBar

  导航条

  |           |          |                                                              |
  | --------- | -------- | ------------------------------------------------------------ |
  | navData   | Array    | 数组, bar 内容(当传递 children 的时候就无需传 navData), 固定格式为 [{ name: '标题1', type: 1 }, { name: '标题2', type: 2 }, { name: '标题3', type: 3 }] |
  | index     | Number   | 选择第 ind 个 bar, 默认第一个 bar(0)                         |
  | translate | Object   | 当与 TabContainer 组件联动的时候需要接受的 bar 移动距离值, 属性固定{ distance: , transition} |
  | onSel     | Function | 回调函数,用户点击第几个 bar                                  |

  

  ```jsx
  // navData       
  <NavBar
     translate={NavBarTranslate}
     onSel={(item, index) => {
       console.log('navitem', index)
     }}
     navData={data}
     index={TabContainerIndex}
   />
  
  // children
   <NavBar
      translate={NavBarTranslate}
      onSel={(item, index) => {
        console.log('navitem', index)
          this.setState({
              TabContainerIndex: index
           })
         }}
      index={TabContainerIndex}
        >
          <span>首页</span>
          <span>购物车</span>
          <span>我的</span>
   </NavBar>
  ```

  

- ScrollView

  上拉加载,下拉刷新,scrollview

  |                |                  |                                                              |
  | :------------- | :--------------- | ------------------------------------------------------------ |
  | isFetch        | Boolean          | 当页面没有数据的时候,开启 loading 效果,直接触发 topMethod 函数, 默认为 false |
  | isLoadOver     | Boolean          | 请求是否完成,可传字符串 \|\| Boolean, Boolean 为 true 时默认展示字段'全部加载完毕', 传字符串就展示字符串 |
  | requestState   | Boolean          | 请求是否完成,默认 false                                      |
  | isPullDown     | Boolean          | 是否开启下拉刷新, 默认为 false                               |
  | isPullUp       | Boolean          | 是否开启上拉加载, 默认为 false                               |
  | topDistance    | Number           | 下拉刷新 触发 阀值, 默认为 50px                              |
  | bottomDistance | Number           | 上拉加载 触发 阀值, 默认为 50px                              |
  | topMethod      | Function         | 下拉刷新执行函数                                             |
  | bottomMethod   | Function         | 上拉加载执行函数                                             |
  | wrapHeight     | Number           | (**必传**)用户自定义高度, 如果没有则自动获取 scorllview 父级的高度 |
  | pullThreshold  | Number           | 上拉和下拉 最高可拉的阀值, 默认200                           |
  | scrollX        | Boolean          | (**必传**) 横向滚动布局, 默认 false                          |
  | scrollY        | Boolean          | (**必传**)纵向滚动布局, 默认 false                           |
  | upperThreshold | Number           | 距离顶部/左边多远时, 触发 onUpper 事件, 默认为 50px          |
  | lowerThreshold | Number           | 距离底部/右边多远时, 触发 onLower 事件, 默认为 50px          |
  | onUpper        | Function         | 滚动到顶部/左边, 会触发 onUpper 事件                         |
  | onLower        | Function         | 滚动到底部/右边, 会触发 onLower 事件                         |
  | onScroll       | Function         | 滚动实时触发,传递实时scroll 的值                             |
  | itemIndex      | Number           | 展示第几个内容, 默认第一个,传下标,从0开始                    |
  | itemKey        | String\|\|Number | 展示第几个内容,与 itemIndex 只能存在一个                     |
  | animateTime    | Number           | 设置上拉下拉缓动动画完成时间                                 |
  | limit          | Number           | 下拉上拉移动速率调整, 默认为4                                |

  ```jsx
  <ScrollView
              isFetch={true}
              scrollY={true}
              isPullDown={true}
              isPullUp={true}
              topMethod={() => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    this.setState({ 
                        list: list.reverse(), 
                        requestState: true }, 
                      () => {
                      resolve()
                    })
                  }, 2000);
                })
              }}
              requestState={requestState}
              bottomMethod={() => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    this.setState({
                      list: [...list, '我是节点1', '我是节点2', ...list, '节点3', '节点4'],
                      requestState: true,
                      isLoadOver: '全部加载完毕'
                    }, () => {
                      resolve()
                    })
                  }, 1000);
                })
              }}
              onUpper={() => {
                console.warn('到顶了')
              }}
              onLower={() => {
                console.warn('到底了')
              }}
              onScroll={obj => {
                console.warn('无时无刻不在触发', obj)
              }}
              isLoadOver={isLoadOver}
            >
              {list.map((item, index) => {
                return <div style={{ height: '50px', lineHeight: '50px', backgroundColor: 'red', textAlign: 'center' }} key={'item' + index}>
                  {item}
                </div>
              })}
            </ScrollView>
  ```

  


- TabContainer

  左右拖拽(**必须与 TabContainerItem 搭配使用**)

  |             |          |                                                              |
  | :---------- | -------- | ------------------------------------------------------------ |
  | interval    | Number   | 触发自动滚动下一页阀值, 默认为屏幕的1/5                      |
  | index       | Number   | 展示第 index 页, 默认第一页,从0开始                          |
  | onSel       | Function | 回调函数,返回当前页数                                        |
  | onTranslate | Function | 回调函数 配合 Navbar 做 bar 联动, 返回一个对象 {distance:Number,//移动距离transition:Boolean// 是否开启动画效果} |

  ```jsx
  <TabContainer>
              <TabContainerItem style={{ fontSize: '20px', backgroundColor: 'red' ,height: '500px'}}>
              {arr.map(i => {
                  return <div key={i}>{i}</div>
              })}
              </TabContainerItem>
              <TabContainerItem style={{ backgroundColor: 'yellow' }}>
              {arr.map(i => {
                  return <div key={i}>{i}</div>
              })}
              </TabContainerItem>
              <TabContainerItem style={{ backgroundColor: 'skyblue' }}>
              {arr.map(i => {
                  return <div key={i}>{i}</div>
              })}
              </TabContainerItem>
            </TabContainer>
  ```

  

- TabContainerItem

  在 style 属性中传下 height 属性, 不传默认全屏高度

  **高度必传,但是,当与 ScrollView 连用时,ScrollVIew 高度可不传. 因为 ScrollView 在没有传递 wrapHeight 的时候,自动获取父级的高度**

  


