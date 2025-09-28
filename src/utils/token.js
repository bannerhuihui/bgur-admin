const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_INFO_KEY = 'userInfo'

export function setToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function setUserInfo(user) {
  localStorage.setItem(USER_INFO_KEY,user)
}


export function getUserInfo() {
  return localStorage.getItem(USER_INFO_KEY)
}

export function removeUserInfo() {
  localStorage.removeItem(USER_INFO_KEY)
}

export function clearAllToken() {
  removeToken()
  removeRefreshToken()
} 