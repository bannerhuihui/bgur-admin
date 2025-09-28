// 应用配置文件
import loginBackgroundImg from '@/assets/images/login_index.jpg'

export const appConfig = {
  // 应用基本信息
  app: {
    name: 'BGUR',
    fullName: 'BGUR管理系统',
    title: 'BGUR Admin - 管理系统',
    description: 'BGUR后台管理系统'
  },
  
  // 图片资源配置
  images: {
    // Logo 相关
    logo: '/vite.svg',
    
    // 登录页面图片
    loginBackground: loginBackgroundImg
  },
  
  // 页面标题配置
  pages: {
    login: {
      title: 'BGUR管理系统',
      subtitle: '欢迎使用'
    },
    main: {
      logoText: 'BGUR'
    }
  },
  
  // Footer 配置
  footer: {
    appName: 'BGUR',
    contactEmail: 'yhui998@163.com'
  }
}

// 默认导出配置
export default appConfig