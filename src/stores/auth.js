import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const USER_KEY = "OJ_USER_KEY"
const TOKEN_KEY = "OJ_TOKEN_KEY"

export const useAuthStore = defineStore('auth', () => {
    let _user = ref({})
    let _token = ref("")

    function setUserToken(user, token) {
        // 保存到对象上(内存)
        _user.value = user
        _token.value = token

        // 存储到浏览器的localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        localStorage.setItem(TOKEN_KEY, token)
    }

    // 计算属性
    let user = computed(() => {
        if (!_user.value.username) {
            const storedUser = localStorage.getItem(USER_KEY)
            if (storedUser) {
                try {
                    _user.value = JSON.parse(storedUser)
                } catch (e) {
                    console.error('Failed to parse user from localStorage', e)
                    _user.value = {}
                }
            }
        }
        return _user.value
    })

    let token = computed(() => {
        if (!_token.value) {
            _token.value = localStorage.getItem(TOKEN_KEY) || ""
        }
        return _token.value
    })

    let is_login = computed(() => {
        if(Object.keys(user.value).length > 0&& token.value)
            return true
        else
            return false
    })
    // 清除用户信息
    function clearUserToken() {
        _user.value = {}
        _token.value = ""
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
    }

    // 返回以让外界访问
    return { setUserToken, clearUserToken, user, token, is_login }
})