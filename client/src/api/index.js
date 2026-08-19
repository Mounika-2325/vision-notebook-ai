import axios from 'axios'

const api = axios.create({
  baseURL: 'https://vision-notebook-ai-1.onrender.com/api',
  timeout: 120000
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(new Error(err.response?.data?.message || err.message || 'Request failed'))
)

// ─── Documents ──────────────────────────────────────────────────
export const uploadDocument = (formData, onProgress) =>
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? e => onProgress(Math.round((e.loaded * 100) / e.total))
      : undefined
  })

export const getDocuments = () => api.get('/documents')
export const getDocument = id => api.get(`/documents/${id}`)
export const deleteDocument = id => api.delete(`/documents/${id}`)

// ─── Images ─────────────────────────────────────────────────────
export const uploadImage = (formData, onProgress) =>
  api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? e => onProgress(Math.round((e.loaded * 100) / e.total))
      : undefined
  })

export const getImages = () => api.get('/images')
export const askImageQuestion = (imageId, question) => api.post('/images/ask', { imageId, question })
export const deleteImage = id => api.delete(`/images/${id}`)

// ─── Chat ────────────────────────────────────────────────────────
export const sendChatMessage = (documentId, message, sessionId) =>
  api.post('/chat', { documentId, message, sessionId })
export const getChatSessions = () => api.get('/chat/sessions')
export const getChatSession = id => api.get(`/chat/sessions/${id}`)
export const getChatHistory = () => api.get('/chat/history')

// ─── Notes ───────────────────────────────────────────────────────
export const generateNotes = (documentId, type) =>
  api.post('/notes/generate', { documentId, type })
export const getNotes = params => api.get('/notes', { params })
export const deleteNote = id => api.delete(`/notes/${id}`)

export default api
