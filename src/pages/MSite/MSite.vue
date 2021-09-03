<template>
  <div class="msite">
    <!--首页头部-->
      
      <HeaderTop :title="address.name">
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link> 
      <router-link class="header_login" slot="right" :to="userInfo._id ? '/userinfo' : '/login'">
        <span class="header_login_text"  v-if="!userInfo._id">登录|注册
          </span>
        <span class="header_login_text"  v-else>
          <i class="iconfont icon-person"></i>
          </span>
      </router-link>
      </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="foodtype.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(foodtypes,index) in foodtypeArr" :key='index'>
            <a href="javascript:" class="link_to_food" v-for="(foodtypes,index) in foodtypes" :key="index">
              <div class="food_container">
                <img :src="imgBaseUrl+foodtypes.image_url" />
              </div>
              <span>{{foodtypes.title}}</span>
            </a>
            
          </div>
          
        </div>
        
        <!-- Add Pagination -->
        <div class="swiper-pagination">

        </div>
      </div>
        <img v-else src="./images/msite_back.svg" alt="back">
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList/>
    </div>
  </div>
</template>

<script>
import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
import ShopList from '../../components/ShopList/ShopList.vue'
import Swiper from 'swiper'
import {mapState} from 'vuex'
import 'swiper/swiper.min.css'
export default {
  name: "MSite",
  data(){
    return{
      imgBaseUrl:'https://fuss10.elemecdn.com/'
    }
  },

  components:{HeaderTop,ShopList},
  computed:{
    //借助mapState生成计算属性，从state中读取数据（数组写法）,生成的计算属性名和想要读取的属性名要一致
    ...mapState(['address','foodtype','userInfo']),
    // 根据foodtype一维数组生成一个二维数组
    // 小数组中的元素个数最大是8
    foodtypeArr(){
      const {foodtype} = this
      console.log(this);
      //准备空的二维数组
      const arr = []
      // 准备一个小数组（最大长度为8）
      let minArr = []
      // 遍历foodtype
      foodtype.forEach(c => {
        //如果小数组长度达到8，则新增一个数组
        if(minArr.length === 8){
          minArr=[]
        }
        
        //如果小数组长度为0，则添加到大数组中
        // 先将空数组添加到大数组中，然后再添加数据
        if(minArr.length === 0){
          arr.push(minArr)
        }
        minArr.push(c)
      });
      return arr
    }
  },
  mounted(){
    //触发actions中对应的回调函数
    this.$store.dispatch('getFoodType')
    this.$store.dispatch('getShops')
    //创建一个Swiper实例对象，来实现轮播
    // new Swiper('.swiper-container',{
    //   loop:true,//可以循环轮播
    //   //如果需要分页器
    //   pagination:{
    //     el:'.swiper-pagination'
    //   }
    // })
  },
  watch:{
    foodtype(value){//foodtype数组中有数据， 在异步更新界面之前执行
    
    //界面更新就立即创建Swiper对象
    this.$nextTick(()=>{//一旦完成界面更新，立即调用（此条语句要写在数据更新之后）

      new Swiper('.swiper-container', {
            loop: true, // 可以循环轮播
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
    })
    })
    }

    
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
          width 100%
          .header
            background-color #02a774
            position fixed
            z-index 100
            left 0
            top 0
            width 100%
            height 45px
            .header_search
              position absolute
              left 15px
              top 50%
              transform translateY(-50%)
              width 10%
              height 50%
              .icon-sousuo
                font-size 25px
                color #fff
            .header_title
              position absolute
              top 50%
              left 50%
              transform translate(-50%, -50%)
              width 50%
              color #fff
              text-align center
              .header_title_text
                font-size 20px
                color #fff
                display block
            .header_login
              font-size 14px
              color #fff
              position absolute
              right 15px
              top 50%
              transform translateY(-50%)
              .header_login_text
                color #fff
          .msite_nav
            bottom-border-1px(#e4e4e4)
            margin-top 45px
            height 200px
            background #fff
            .swiper-container
              width 100%
              height 100%
              .swiper-wrapper
                width 100%
                height 100%
                .swiper-slide
                  display flex
                  justify-content center
                  align-items flex-start
                  flex-wrap wrap
                  .link_to_food
                    width 25%
                    .food_container
                      display block
                      width 100%
                      text-align center
                      padding-bottom 10px
                      font-size 0
                      img
                        display inline-block
                        width 50px
                        height 50px
                    span
                      display block
                      width 100%
                      text-align center
                      font-size 13px
                      color #666
              .swiper-pagination
                >span.swiper-pagination-bullet-active
                  background #02a774
          
</style>