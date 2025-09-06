import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'

export const AuthenticationMode = Object.freeze({
  SignIn: 'Login',
  SignUp: 'SignUp',
})

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (authenticationMode === AuthenticationMode.SignUp) {
        await signUp()
        navigate('/signin')
      } else {
        await signIn()
        navigate('/')
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Unexpected error'
      alert(msg)
    }
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <h3>{authenticationMode === AuthenticationMode.SignIn ? 'Sign in' : 'Sign up'}</h3>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          placeholder="Email"
          value={user.email || ''}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <label>Password</label>
        <input
          placeholder="Password"
          type="password"
          value={user.password || ''}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button type="submit">
          {authenticationMode === AuthenticationMode.SignIn ? 'Login' : 'Submit'}
        </button>
        <div style={{ marginTop: 8 }}>
          <Link to={authenticationMode === AuthenticationMode.SignIn ? '/signup' : '/signin'}>
            {authenticationMode === AuthenticationMode.SignIn
              ? 'No account? Sign up'
              : 'Already signed up? Sign in'}
          </Link>
        </div>
      </form>
    </div>
  )
}
