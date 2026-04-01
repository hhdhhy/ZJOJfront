import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const  USER_KEY = "OJ_USER_KEY"
const  TOKEN_KEY = "OJ_TOKEN_KEY"
export const useAuthrStore = defineStore('auth', () => {
    let _user =ref({})
    let _token =ref("")

    function setUserToken(user,token){
        //保存到对象上(内存)
        _user = user
        _token = token

        //存储到浏览器的localStorage
        localStorage.setItem(USER_KEY,JSON.stringify(user))
        localStorage.setItem(TOKEN_KEY,token)
    }

    //计算属性
    let user = computed(()=>{
        if(!_user.value)
            _user.value = localStorage.getItem(USER_KEY)
        return _user.value
    })

    let token = computed(()=>{
        if(!_token.value)
            _token.value = localStorage.getItem(TOKEN_KEY)
        return _token.value
    })

    //返回以让外界访问
  return { setUserToken ,user, token }
})
