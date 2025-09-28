import request from '@/utils/request'

/**
 * 获取菜单树形结构
 */
export async function getMenuTree() {
  try {
    const data = await request.get('/tree')
    const menuTree = Array.isArray(data?.menuTree) ? data.menuTree : []
    if (menuTree.length > 0) return data
  } catch (err) {
    console.log(err)
  }
}