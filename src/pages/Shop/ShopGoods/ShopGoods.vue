<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <!--  current -->
          <li class="menu-item" v-for="(type, index) in goods.goods" :key="index" :class="{current:index === currentIndex}" @click="changeMenu(index)">
            <span class="text bottom-border-1px">
              <img
                class="icon"
                :src="type.icon"
                v-if="type.icon"/>
              {{type.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="scrollType">
          <li class="food-list-hook" v-for="(good, index) in goods.goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon"/>
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售 {{food.sellCount}} 份</span>
                    <span>好评率 {{food.rating}}%</span>
                  </div>
                  <div class="price"><span class="now">￥{{food.price}}</span>
                  <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span></div>

                  <div class="cartcontrol-wrapper"><CartControl :food = "food"/></div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart/>
    </div>
    <Food :food="food" ref="food"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import CartControl from '../../../components/CartControl/CartControl.vue'
import Food from '../../../components/Food/Food.vue'
import ShopCart from '../../../components/ShopCart/ShopCart.vue'
export default {
  data(){
    return{
      scrollY:0,//右侧滑动的y轴坐标
      tops:[],//所有右侧分类li的top组成的数组
      food:{}//需要显示的food
    }
  },
  components:{CartControl,Food,ShopCart},
  mounted() {
    //当页面加载完成时异步加载的数据还没有获取，导致无法计算坐标，所以要在数据更新后再创建BScroll
    this.$store.dispatch('getShopGoods',()=>{//数据更新后执行
    
      this.$nextTick(()=>{//列表数据更新显示后
      this.initScroll()
      this.initTops()
      
        })
    })
  },
  computed:{
    ...mapState(['goods']),

      // 类名: current标识当前分类
        // 设计一个计算属性: currentIndex限据哪些数据计算?
          // scrollY:右侧滑动的Y轴坐标(滑动过程时实时变化)
          // tops:所有右侧分类li的top组成的数组―(列表第一次显示后就不再变化)

        // 1.在滑动过程中，实时收集scrol1Y
        // 2.列表第一次显示后，收集tops
        // 3.实现currentIndex的计算逻辑

    currentIndex(){
      //得到条件数据
      const {scrollY,tops} = this
      //根据条件计算产生一个结果
      const index = tops.findIndex((top,index)=>{
        return scrollY>=top && scrollY<tops[index+1]
      })
      return index
    }
  },
  methods: {
    //初始化滚动
    initScroll(){
          //列表创建后执行
        new BScroll('.menu-wrapper',{
          click:true
        });
      this.foodsScroll=  new BScroll('.foods-wrapper',{
        probeType:3,
        click:true
      });
        //给右侧列表绑定scroll监听
        this.foodsScroll.on('scroll',({x,y})=>{
          this.scrollY = Math.abs(y)
        })
    },
    //收集top属性
    initTops(){
      //1.初始化Tops
      const tops = []
      let top = 0
      tops.push(top)
      //2.收集
      //找到所有分类的li
      const lis = document.getElementsByClassName("food-list-hook");
      Array.prototype.slice.call(lis).forEach(li => {
        top += li.clientHeight
        tops.push(top)
      });

      //3.更新数据
      this.tops = tops
      
    },
    changeMenu(index){
      //获取y轴坐标
      //得到目标位置的scrollY
      const y = this.tops[index]
      //立即更新scrollY(点击的分类项成为当前分类)
      this.scrollY = y
      //平滑滚动右侧列表
      this.foodsScroll.scrollTo(0,-y,200)
    },
    showFood(food){
      this.food = food
      //利用refs调用子组件方法
      //得到子组件对象后可以直接使用子组件的方法
      this.$refs.food.changeShow()
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
