/* 
1 发送请求获取数据
2 点击轮播图预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的 api previewImage
3 点击加入购物车
  0 回到了商品详情页面 第一次添加商品的时候，手动添加了属性
    1 num = 1
    2 checked = true
  1 先绑定点击事件
  2 获取缓存中的购物车数据数组格式
  3 先判断当前的商品是否已经存在于购物车
  4 已经存在修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上购买数量属性 num
  6 弹出提示
4 商品收藏
  1 页面 onShow的时候加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏
    1 是改变页面的图标
    2 不是 不用动
  3 点击商品收藏按钮
    1 判断该商品是否存在于缓存数组
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中存入到缓存中即可
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  GoodsInfo: {},
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url: "/goods/detail", data: {goods_id}});
    this.GoodsInfo = goodsObj;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // 部分iphone手机不识别webp图片格式
        // 临时修改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid); 
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    });
  },
  handleCartAdd() {
    // 1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    // 2 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1) {
      // 3 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else {
      // 4 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });  
  },
  // 收藏按钮点击事件
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏
    let collect = wx.getStorageSync("collect")||[];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index！=-1 表示已经收藏过了
    if(index !== -1) {
      // 能找到已经收藏过了 在数组种删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
        
    }else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }
})