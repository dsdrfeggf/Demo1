<template>
  <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginShow}" @click="loginShow=true">短信登录</a>
            <a href="javascript:;" :class="{on:!loginShow}" @click="loginShow=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login" >
            <!-- 短信登陆框 -->
            <div :class="{on:loginShow}" @click="loginShow=true" >
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button 
                :disabled="!checkPhone" 
                class="get_verification" 
                :class="{right_phone:checkPhone}"
                @click.prevent="getCode">
                  {{computeTime>0 ? `已发送(${this.computeTime})` : '获取验证码'}}
                  </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <!-- 密码登陆框 -->
            <div :class="{on:!loginShow}" @click="loginShow=false">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="password" maxlength="8" placeholder="密码" v-if="pwdShow" v-model="pwd">
                  <input type="text" maxlength="8" placeholder="密码" v-else  v-model="pwd">
                  <!-- click事件点击改变密码的显示隐藏状态 :class控制开关样式，隐藏密码时显示关闭状态按钮-->
                  <div class="switch_button" :class="pwdShow ? 'off' : 'on'" @click="pwdShow = !pwdShow">
                    <!-- :class控制开关位置，显示密码时在左侧，隐藏时在右侧 -->
                    <div class="switch_circle" :class="{right:!pwdShow}"></div>
                    <span class="switch_text">{{pwdShow ? '':'abc'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="changeCaptcha" ref="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <AlertTip :alertText=this.alertText v-show="showAlert" @closeTip="closeTip"/>
    </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip.vue'
import {reqSendCode,reqSmsLogin,reqPwdLogin} from '../../api'
export default {
  components:{AlertTip},
  data(){
    return{
      loginShow:true, //true为短信登陆，false为密码登录
      phone:'',//手机号
      computeTime:0,//倒计时
      pwdShow:true,//true为隐藏密码，false为显示密码
      pwd:'',//密码
      code:'',//短信验证码
      name:'',//用户名
      captcha:'',//一次性验证码
      alertText:'',//提示文本
      showAlert:false,//是否显示提示框
    }
  },
  computed:{
    checkPhone(){
      return /^1\d{10}$/.test(this.phone)
    }
  },
  methods:{
    //异步获取短信验证码
    async getCode(){
      //如果当前没有计时，则启动定时器以及其他功能
      if(!this.computeTime){
        this.computeTime=30
        const intervalID = setInterval(() => {
          this.computeTime--
          if(this.computeTime<=0){
            clearInterval(intervalID)
          }
        }, 1000);
        
        //发送ajax请求(向指定手机号发送验证码短信)
        console.log(this.phone);
        const result = await reqSendCode(this.phone)
        //如果返回的响应码为1，则表示请求发送失败，停止计时器
        console.log(result.code == 1);
        if(result.code == 1 ){
          //显示提示
          this.showAlert(result.msg)
          //停止计时
          if(this.computeTime){
            this.computeTime = 0
            clearInterval(this.intervalID)
            this.intervalID = undefined
          }
        }
      }
      
    },
    alertShow(text){
          this.showAlert=true
          this.alertText=text
    },
    //登录前台验证
    async login(){
      //前台表单验证
      let result
      if(this.loginShow){//短信登录
        const {checkPhone,phone,code} = this
        if(!this.checkPhone){//!this.checkPhone 等同于 this.checkPhone == false(输出为true)
          //手机号不正确
          this.alertShow("请输入正确的手机号")
          return
        }else if(!/^\d{6}$/.test(code)){//!/^\d{6}$/.test(code) 等同于 /^\d{6}$/.test(code) == false
          //短信验证码必须为6位数字
          this.alertShow("请输入正确的验证码")
          return
        }
        //发送ajax请求短信登录
        result = await reqSmsLogin({phone,code})
        
      }else{//密码登录
        const {name,pwd,captcha} = this
        if(!this.name){
          //用户名必须指定
          this.alertShow("用户名为空或不存在")
          return
        }else if(!this.pwd){
          //密码必须指定
          this.alertShow("请输入正确的密码")
          return
        }else if(!this.captcha){
          //验证码必须指定
          console.log(this);
          this.alertShow("请输入正确的验证码")
          return
        }
        //发送ajax请求密码登录
        result = await reqPwdLogin({name,pwd,captcha})
      }
      if(this.computeTime){
            this.computeTime = 0
            clearInterval(this.intervalID)
            this.intervalID = undefined
          }

      if(result.code === 0){
          const user = result.data
          console.log(result);
          //将user保存到vuex的state中
          this.$store.dispatch('recordUser',user)
          //去个人中心界面
          this.$router.replace('/profile')
        }else{
          const msg = result.msg
          this.changeCaptcha()
          this.alertShow(msg)
        }
    },
    //关闭提示框
    closeTip(){
      
          this.showAlert=false
    },
    //生成一个新的验证码图片
    changeCaptcha(){
      //由于路径不发生变化时不会重新载入，所以添加时间戳保证每次点击路径能发生变化
      this.$refs.captcha.src = "http://localhost:4000/captcha?time="+Date.now()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins.styl"
.loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform translateX(27px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>