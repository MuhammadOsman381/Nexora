import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx'
import { AppSidebar } from './components/app-sidebar.tsx'
import UserLayout from './screens/UserLayout.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RouteProtector from './config/RouteProtector.tsx'
import LoginPage from './screens/LoginPage.tsx'
// import { SideBar } from './screens/SideBar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <RouteProtector isAuthenticate={false} >
            <LoginPage />
          </RouteProtector>
        } />

        {/* <Route path="/sign-up" element={
          <RouteProtector isAuthenticate={false} >
            <SignUpPage />
          </RouteProtector  >
        } /> */}

        <Route path="/user" element={
          <RouteProtector isAuthenticate={true} >
            <UserLayout />
          </RouteProtector>
        }>
          {/* <Route path="home" element={<Home />} />
          <Route path="home/:blogId" element={<SingleBlog />} />
          <Route path="create-blogs" element={<CreateBlog />} />
          <Route path="profile" element={<Profile />} /> */}
        </Route>


      </Routes>
    </BrowserRouter>
  </StrictMode>
)
