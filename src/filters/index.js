import Vue from 'vue'
import moment from 'moment'

Vue.filter('data-format',function(value,formatStr='YY-MM-DD HH:mm:ss'){
    return moment(value).format(formatStr)
})