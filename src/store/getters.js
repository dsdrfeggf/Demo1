// 包含多个基于state的getter计算属性的对象
export default {
    totalCount(state){
        return state.cartFoods.reduce((preTotal,food)=> preTotal = preTotal + food.count ,0)
    },
    totalPrice(state){
        
        return state.cartFoods.reduce((preTotal,food)=> preTotal = preTotal + food.count * food.price ,0)
    },
    //计算满意评价的数量 如果评价类型为满意，则满意的count+1,否则不加
    // positiveSize(state){
    //     // return state.ratings.reduce((preTotal,ratings)=> preTotal = preTotal + (ratings.selectType==1 ? 1 : 0) ,0)
    //     return state.ratings.reduce((preTotal, rating) => preTotal + (rating.rateType===0?1:0) , 0)
    // },
    positiveSize (state) {
        return state.ratings.reduce((preTotal, rating) => preTotal + (rating.rateType===0?1:0) , 0)
      }
}