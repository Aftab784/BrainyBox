import api from './api'

export interface Content {
  id: string
  title: string
  link: string
  type: string
  tags?: string[]
  createdAt: string
}

export const contentService = {
  async createContent(content: { title: string; type: string; link: string; tags: string[] }) {
    const response = await api.post('/api/v1/content', content, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    return response.data
  },

  async getMyContent() {
    const response = await api.get('/api/v1/content', {
      headers: {
        token: localStorage.getItem('token')
      }
    });
    return response.data;
  },

  async deleteContent(id: string) {
    return api.delete(`/api/v1/content/${id}`, {
      headers: {
        token: localStorage.getItem('token')
      }
    });
  },

  async shareContent(contentId: string, share: boolean) {
    const response = await api.post('/api/v1/brainybox/share', 
      { contentId, share },
      {
        headers: {
          token: localStorage.getItem('token')
        }
      }
    );
    return response.data;
  },

  async getSharedContent(hash: string) {
    const response = await api.get(`/api/v1/brainybox/~${hash}`);
    return response.data;
  }
};

export default contentService;