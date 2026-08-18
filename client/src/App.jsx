import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import DocumentUpload from './pages/DocumentUpload'
import ImageAnalysis from './pages/ImageAnalysis'
import Chat from './pages/Chat'
import NotesGenerator from './pages/NotesGenerator'
import Settings from './pages/Settings'

function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#09090f]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-hero dark:bg-hero">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px'
              }
            }}
          />
          <Layout>
            <Routes>
              <Route path="/"          element={<Dashboard />} />
              <Route path="/documents" element={<DocumentUpload />} />
              <Route path="/images"    element={<ImageAnalysis />} />
              <Route path="/chat"      element={<Chat />} />
              <Route path="/notes"     element={<NotesGenerator />} />
              <Route path="/settings"  element={<Settings />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
