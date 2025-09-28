import request from '@/utils/request'

/**
 * 登录接口
 * @param {Object} data { username, password }
 * @returns Promise
 */
export function loginApi(data) {
  return request.post('/login', data)
}

/**
 * 登出接口
 * @param {string|number|Object} data 标识或参数（可选）
 * @returns Promise
 */
export function logoutApi(data) {
  return request.get('/logout/' + (data ?? ''))
}

/**
 * 执行登出并清理本地凭据
 * - 调用后端登出接口（忽略错误）
 * - 清除 accessToken、refreshToken、token、userInfo
 */
export async function logoutAndClear(data) {
  try {
    await logoutApi(data)
  } catch (e) {
    // 后端登出失败不影响本地清理与跳转
  } finally {
    try { localStorage.removeItem('accessToken') } catch (e) {}
    try { localStorage.removeItem('refreshToken') } catch (e) {}
    try { localStorage.removeItem('token') } catch (e) {}
    try { localStorage.removeItem('userInfo') } catch (e) {}
  }
}
