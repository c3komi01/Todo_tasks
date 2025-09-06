import { useState, useEffect } from 'react'
import { UserContext } from './UserContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3002'
axios.defaults.baseURL = API

export default function UserProvider({ children }) {
  const userFromStorage = sessionStorage.getItem('user')
  const [user, setUser] = useState(
    userFromStorage ? JSON.parse(userFromStorage) : { email: '', password: '', token: '' }
  )

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [user?.token])

  
  const signUp = async () => {
    const headers = { headers: { 'Content-Type': 'application/json' } }
    await axios.post(
      '/user/register',
      { email: user.email, password: user.password },   
      headers
    )
    setUser({ email: '', password: '', token: '' })
  }

  
  const signIn = async () => {
    const headers = { headers: { 'Content-Type': 'application/json' } }
    const res = await axios.post(
      '/user/login',
      { email: user.email, password: user.password },   
      headers
    )

    
    const next = { email: user.email, token: res.data.token }
    setUser(next)
    sessionStorage.setItem('user', JSON.stringify(next))
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
  }

  const signOut = () => {
    sessionStorage.removeItem('user')
    setUser({ email: '', password: '', token: '' })
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  )
}
