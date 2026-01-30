import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserLayout from './pages/UserLayout.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RouteProtector from './config/RouteProtector.tsx'
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/user/HomePage.tsx'
import HistoryPage from './pages/user/HistoryPage.tsx'
import PricingPlansPage from './pages/user/PricingPlansPage.tsx'
import SignUpPage from './pages/SignupPage.tsx'
import { Toaster } from "@/components/ui/sonner"
import ChatInterfacePage from './pages/user/ChatInterfacePage.tsx'
import AdminHome from './pages/admin/AdminHome.tsx'
import AdminPricingPlan from './pages/admin/AdminPricingPlan.tsx'
import Landing from "@/pages/landingPage/landing.tsx";
import { TooltipProvider } from './components/ui/tooltip copy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      richColors
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
    <BrowserRouter  >
      <TooltipProvider>
        <Routes  >

          <Route path="/" element={
            <RouteProtector isAuthenticate={false}>
              <Landing />
            </RouteProtector>
          } />
          <Route
            path="/login"
            element={
              <RouteProtector isAuthenticate={false}>
                <LoginPage />
              </RouteProtector>
            }
          />
          <Route
            path="/sign-up"
            element={
              <RouteProtector isAuthenticate={false}>
                <SignUpPage />
              </RouteProtector>
            }
          />
          <Route
            path="/admin"
            element={
              <RouteProtector isAuthenticate={true} allowedRole="ADMIN">
                <UserLayout />
              </RouteProtector>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="pricing-plan" element={<AdminPricingPlan />} />

          </Route>
          <Route
            path="/user"
            element={
              <RouteProtector isAuthenticate={true} allowedRole="USER">
                <UserLayout />
              </RouteProtector>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="chat/:chatId" element={<ChatInterfacePage />} />
            <Route path="pricing-plan" element={<PricingPlansPage />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>

  </StrictMode>
)