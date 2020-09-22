/* 
  1 输入框绑定值改变事件 input事件
    1 获取到输入框的值
    2 合法性判断
    3 检验通过把输入框的值发送到后台
    4 返回的数据打印到页面
  2 防抖(防止抖动) 定时器
    1 定义全局的定时器id
*/
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    goods: [],
    isFocus: false,
    inputValue: ""
  },
  TimeId: -1,
  // 输入框的值改变就会触发的事件
  handleInput(e) {
    // 获取输入框的值
    const {value} = e.detail;
    // 检测合法性
    if(!value.trim()) {
      this.setData({
        goods: [],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  handleCancel() {
    this.setData({
      goods: [],
      isFocus: false,
      inputValue: ""
    })
  },
  async qsearch(query) {
    const res = await request({url:"/goods/qsearch", data: {query}})
    this.setData({
      goods: res
    })
  }
})