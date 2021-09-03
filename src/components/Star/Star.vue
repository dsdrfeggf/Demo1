<template>
    <div class="star" :class=" 'star-'+size">
        <!-- 根据数组将对应的样式添加进去 -->
        <span class="star-item" v-for="(sc,index) in starClass" :class="sc" :key="index"></span>
    </div>
</template>

<script>
//定义常量，符合规则时将class添加进数组
const CLASS_ON = 'on'
const CLASS_HALF = 'half'
const CLASS_OFF = 'off'
export default {
    name:"Star",
    props:{
        score:Number,
        size:Number
    },
    computed:{
        starClass(){
            const scs = []
            const {score} = this
            
            const score_inter = Math.floor(score);
            //根据分数整数数量增加全星
            for(let i = 0;i<score_inter;i++){
                scs.push(CLASS_ON)
            }
            //当分数去除整数后，小数点大于5添加一颗半星
            if(score*10-score_inter*10>=5){
                scs.push(CLASS_HALF)
            }
            //当全星和半星判断完时星星不足五个由灰星补齐
            while(scs.length<5){
                scs.push(CLASS_OFF)
            }
            return scs
        }
    }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins.styl"
.star //2x图 3x图
                            float left
                            font-size 0
                            .star-item
                              display inline-block
                              background-repeat no-repeat
                            &.star-48
                              .star-item
                                width 20px
                                height 20px
                                margin-right 22px
                                background-size 20px 20px
                                &:last-child
                                  margin-right: 0
                                &.on
                                  bg-image('./images/star48_on')
                                &.half
                                  bg-image('./images/star48_half')
                                &.off
                                  bg-image('./images/star48_off')
                            &.star-36
                              .star-item
                                width 15px
                                height 15px
                                margin-right 6px
                                background-size 15px 15px
                                &:last-child
                                  margin-right 0
                                &.on
                                  bg-image('./images/star36_on')
                                &.half
                                  bg-image('./images/star36_half')
                                &.off
                                  bg-image('./images/star36_off')
                            &.star-24
                              .star-item
                                width 10px
                                height 10px
                                margin-right 3px
                                background-size 10px 10px
                                &:last-child
                                  margin-right 0
                                &.on
                                  bg-image('./images/star24_on')
                                &.half
                                  bg-image('./images/star24_half')
                                &.off
                                  bg-image('./images/star24_off')
</style>