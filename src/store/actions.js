// 通过mutation间接更新state的多个方法的对象

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

import {reqAddress,reqFoods,reqSearchShops,reqLogOut,reqShops, reqUserInfo ,reqShopInfo,reqShopRatings,reqShopGoods} from '../api'
export default{
    //异步获取地址
    async getAddress({commit,state}){

        //发送异步请求
        const geohash = state.latitude +',' +state.longitude

        const result = await reqAddress(geohash)

        if(result.code === 0){
            const address = result.data
            commit(RECEIVE_ADDRESS,{address})
            console.log(result);
        }
    },

    //异步获取食物类型
    async getFoodType({commit}){

        //发送异步请求

        const result = await reqFoods()

        if(result.code === 0){
            const foodtype = result.data
            commit(RECEIVE_FOODTYPE,{foodtype})
        }
    },

    //异步获取商家列表
    async getShops({commit,state}){

        //发送异步请求
        const {longitude,latitude} = state

        const result = await reqShops(longitude,latitude)

        if(result.code === 0){
            const shops = result.data
            commit(RECEIVE_SHOPS,{shops})
        }
    },

    //同步获取用户信息
    recordUser({commit},userInfo){
        commit(RECEIVE_USERINFO,{userInfo})
    },

    //实现自动登录
    async getUserInfo({commit}){
        //获取用户信息
        const result = await reqUserInfo()
        
        if(result.code === 0){
            //提取用户信息
            const userInfo = result.data
            //将方法提交给mutations
            commit(RECEIVE_USERINFO,{userInfo})
        }
    },

    //登出
    async logout({commit}){
        //获取用户信息
        const result = await reqLogOut()
                
        if(result.code === 0){
            //将方法提交给mutations
            commit(RESET_USERINFO)
        }
    },

    //异步获取商家信息
    async getShopInfo({commit}){
        //获取用户信息
        const result = await reqShopInfo()
        
        if(result.code === 0){
            //提取用户信息
            const info = result.data
            //将方法提交给mutations
            commit(RECEIVE_INFO,{info})
        }
    },

    //异步获取商家商品信息
    async getShopGoods({commit},callback){
        //获取用户信息
        const result = await reqShopGoods()
        
        if(result.code === 0){
            //提取用户信息
            const goods = result.data
            //将方法提交给mutations
            commit(RECEIVE_GOODS,{goods})

            //数据更新了，通知一下组件
            callback && callback()
        }

    },
    async getShopRatings({commit},callback){
        //获取用户信息
        const result = await reqShopRatings()
        
        if(result.code === 0){
            //提取用户信息
            const ratings = result.data
            //将方法提交给mutations
            commit(RECEIVE_RATINGS,{ratings})
        }

        callback && callback()
    },

    updateCount({commit},{isAdd,food}){
        if(isAdd){
            commit(ADD_FOODCOUNT,{food})
        }else{
            commit(JIAN_FOODCOUNT,{food})
        }
    },

    clearCart({commit}){
        commit(CLEAR_CART)
    },

    //异步获取商家商品列表
    async searchShops({commit,state},keyword){
        const geohash = state.latitude +',' +state.longitude
        const result = await reqSearchShops(geohash,keyword)
        if(result.code == 0){
            const searchShops = result.data
            commit(RECEIVE_SEARCH_SHOPS,{searchShops})
        }
    }
}