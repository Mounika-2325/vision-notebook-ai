import React, { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [documents, setDocuments] = useState([])
  const [images, setImages] = useState([])
  const [chatSessions, setChatSessions] = useState([])
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState({})

  const setLoading = useCallback((key, val) => {
    setIsLoading(prev => ({ ...prev, [key]: val }))
  }, [])

  const addDocument = useCallback(doc => {
    setDocuments(prev => [doc, ...prev])
  }, [])

  const removeDocument = useCallback(id => {
    setDocuments(prev => prev.filter(d => (d.id || d._id) !== id))
  }, [])

  const addImage = useCallback(img => {
    setImages(prev => [img, ...prev])
  }, [])

  const removeImage = useCallback(id => {
    setImages(prev => prev.filter(i => (i.id || i._id) !== id))
  }, [])

  return (
    <AppContext.Provider value={{
      documents, setDocuments, addDocument, removeDocument,
      images, setImages, addImage, removeImage,
      chatSessions, setChatSessions,
      notes, setNotes,
      isLoading, setLoading
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
