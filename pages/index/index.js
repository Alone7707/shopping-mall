// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    floorList: []
  },
  // 页面开始加载就会触发
  onLoad: function(options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({url: "/home/swiperdata"})
    .then(result => {
        this.setData({
          swiperList: result
        })
    })
  },
  // 获取分类导航数据
  getCateList() {
    request({url: "/home/catitems"})
    .then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({url: "/home/floordata"})
    .then(result => {
      this.setData({
        floorList: result
      })
    })
  },
});
  