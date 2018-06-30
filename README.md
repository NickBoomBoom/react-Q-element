#react-Q-element

React  私有组件库的搭建  推荐使用 nwb
链接: https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb

注意点: 
	1.在打包过程中 css 样式文件没有打包的情况下, 请添加  npm build — —copu-files
	2. 同时,如果你是编写一个组件库而不是单个组件的话, 在 index.js 文件中 export xxx from ‘xxx’ , 可能会有语法报错,直接忽略,打包即可,不要纠结
          