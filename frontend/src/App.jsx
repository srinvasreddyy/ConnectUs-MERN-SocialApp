import "./index.css"
import { Routes, Route, Navigate,useLocation } from "react-router"
import Home from "./Pages/Home.jsx"
import Login from "./Pages/Login.jsx"
import Signup from "./Pages/Signup.jsx"
import Onboarding from "./Pages/Onboarding.jsx"
import Chat from "./Pages/Chat.jsx"
import Call from "./Pages/Call.jsx"
import Notifications from "./Pages/Notifications.jsx"
import { Toaster } from "react-hot-toast"
import Pageloader from "./components/Pageloader.jsx"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios"
import Layout from "./components/Layout.jsx"
import { useThemeSelector } from "./store/useThemeSelector.js"
import ChatbotWidget from "./components/ChatbotWidget.jsx"
import Footer from "./components/Footer.jsx"

const pathname =location.pathname
function App() {

  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/me")
        return res.data
      } catch (error) {
        console.log(error)
        return null
      }
    },
    retry: false
  })

  const { theme } = useThemeSelector()

  const isAuthenticated = authUser.data?.user
  const isOnboarded = authUser.data?.user?.isOnboarded
  if(authUser.isLoading) return <Pageloader/>
  
  return (
    <div data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
            <Layout sidebar={true}>
                <Home />
            </Layout>
              
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <Signup /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout sidebar={true}>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Call />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout sidebar={true}>
                <Chat/>
              </Layout> 
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <Onboarding />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
      </Routes>

      <Toaster />
      {
        isAuthenticated && isOnboarded && pathname !== "/chat/:id"&& pathname !== "/call/:id"&& pathname !== "/chat/:id" &&
        pathname !== "/notifications" && <ChatbotWidget/>
      }
      {
        isAuthenticated && isOnboarded && pathname !== "/chat/:id"&& pathname !== "/call/:id"&& pathname !== "/chat/:id" &&
        pathname !== "/notifications" &&  <Footer/>
      }
    </div>
  )
}

export default App
