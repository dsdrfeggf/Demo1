// 直接更新state的多个方法的对象
import Vue from 'vue'
//引入所有的mutation_type
import {
    RECEIVE_ADDRESS,
    RECEIVE_FOODTYPE,
    RECEIVE_SHOPS,
    RECEIVE_USERINFO,
    RESET_USERINFO,
    RECEIVE_INFO,
    RECEIVE_RATINGS,
    RECEIVE_GOODS,
    ADD_FOODCOUNT,
    JIAN_FOODCOUNT,
    CLEAR_CART,
    RECEIVE_SEARCH_SHOPS
    } from './mutation-type'

export default{
    [RECEIVE_ADDRESS] (state,{address}){
        state.address = address
    },
    [RECEIVE_FOODTYPE] (state,{foodtype}){
        state.foodtype = foodtype
    },
    [RECEIVE_SHOPS] (state,{shops}){
        state.shops = shops
    },
    [RECEIVE_USERINFO] (state,{userInfo}){
        state.userInfo = userInfo
    },
    [RESET_USERINFO] (state){
        state.userInfo = {}
    },
    [RECEIVE_INFO] (state,info){
        state.info = info
    },
    [RECEIVE_RATINGS] (state,{ratings}){
        state.ratings = ratings
    },
    [RECEIVE_GOODS] (state,goods){
        state.goods = goods
    },
    [ADD_FOODCOUNT] (state,{food}){
        if(!food.count){
            //只有当没有count属性时才为food添加count属性
            Vue.set(food,'count',1)

            //当当前food的count计数为0时，同时将该food对象添加到购物车的列表当中
            state.cartFoods.push(food)
        }else{
            //如果food有count属性则直接+1
            food.count++
        }
    },
    [JIAN_FOODCOUNT] (state,{food}){
        if(food.count){//只有有值时才-1
            food.count--
            //当当前food的count计数为0时，同时将该food对象从购物车列表中移除
            //indexOf() 获取当前对象的下标
            if(food.count===0){
                state.cartFoods.splice(state.cartFoods.indexOf(food),1)
            }
        }
    },
    [CLEAR_CART](state){
        //将购物车中food的count全部设为0
        state.cartFoods.forEach(food => food.count = 0);

        //将购物车重新定向到空数组
        state.cartFoods = []
    },
    [RECEIVE_SEARCH_SHOPS](state,{searchShops}){
        state.searchShops = searchShops
    }
}