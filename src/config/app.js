// 应用配置文件
import loginBackgroundImg from '@/assets/images/login_index.jpg'

export const appConfig = {
  // 应用基本信息
  app: {
    name: 'ETF',
    fullName: 'ETF后台系统',
    title: 'ETF - 后台管理系统',
    description: 'ETF后台管理系统'
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
      title: 'ETF管理系统',
      subtitle: '欢迎使用'
    },
    main: {
      logoText: 'ETF'
    }
  },
  
  // Footer 配置
  footer: {
    appName: 'ETF',
    contactEmail: 'yhui998@163.com'
  }
}

// 默认导出配置
export default appConfig