import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserLayout from './pages/UserLayout.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RouteProtector from './config/RouteProtector.tsx'
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import HistoryPage from './pages/HistoryPage.tsx'
import PricingPlansPage from './pages/PricingPlansPage.tsx'
import SignUpPage from './pages/SignupPage.tsx'
import { Toaster } from "@/components/ui/sonner"
import ChatInterfacePage from './pages/ChatInterfacePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      richColor
      duration={4000}
      closeButton
      visibleToasts={5}
      toastOptions={{
        className: 'bg-zinc-900 text-white border border-gray-700 shadow-lg rounded-lg px-4 py-2',
        style: {
          fontSize: '0.95rem',
        },
      }}
    />
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <RouteProtector isAuthenticate={false} >
            <LoginPage />
          </RouteProtector>
        } />

        <Route path="/sign-up" element={
          <RouteProtector isAuthenticate={false} >
            <SignUpPage />
          </RouteProtector  >
        } />

        <Route path="/user" element={
          <RouteProtector isAuthenticate={true}>
            <UserLayout />
          </RouteProtector>
        }>
          <Route index element={<HomePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="chat/:chatId"  element={<ChatInterfacePage />} />
          <Route path="pricing-plan" element={<PricingPlansPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>
)
