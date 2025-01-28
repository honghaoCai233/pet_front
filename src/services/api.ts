import Taro from '@tarojs/taro'

const BASE_URL = 'https://your-api-domain.com/api'

export const API_BASE_URL = 'http://localhost:8081/api/v1';

export const API = {
  // 用户相关接口
  USER: {
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
  }
};

export const request = <T = any>(options: Taro.request.Option): Promise<T> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...options,
      url: `${BASE_URL}${options.url}`,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const api = {
  // 获取宠物列表
  getPetList: () => {
    return request({
      url: '/pets',
      method: 'GET'
    })
  },
  // 获取宠物详情
  getPetDetail: (id: string) => {
    return request({
      url: `/pets/${id}`,
      method: 'GET'
    })
  }
} 