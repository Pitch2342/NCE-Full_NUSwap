import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppContainer from "./components/navigation/AppContainer/AppContainer";
import { AUTH_TOKEN } from "./constants/authToken";
import AssetsPage from "./pages/AssetsPage/AssetsPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import SymbolPage from "./pages/SymbolPage/SymbolPage";
import TradesPage from "./pages/TradesPage/TradesPage";
import { CURRENT_USER } from "./queries/auth";

export default function App() {

  const { loading, error, data } = useQuery(CURRENT_USER)
  const [user, setUser] = useState(undefined)

  const logout = () => {
    setUser(undefined)
    localStorage.removeItem(AUTH_TOKEN)
    window.location.reload()
  }

  const props = {
    user: user,
    logout: logout
  }

  useEffect(() => {
    if (loading) console.log('Loading user...')
    else if (error) setUser(null)
    else setUser(data.currentUser)
  }, [loading, error, data])

  if (user === undefined) return <></>
  if (!user) return <AuthPage/>

  return (
    <AppContainer {...props}>
      <Routes>
        <Route path="/" element={<TradesPage {...props}/>}/>
        <Route path="/trade/:code" element={<SymbolPage {...props}/>}/>
        <Route path="/assets" element={<AssetsPage props={props}/>}/>
        <Route path="/blog" element={<BlogPage {...props}/>}/>
      </Routes>
    </AppContainer>
  );
}