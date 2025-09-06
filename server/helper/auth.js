import jwt from 'jsonwebtoken'

/** Извлекаем токен: поддерживаем и "Bearer xxx", и просто "xxx" */
const getTokenFromHeader = (req) => {
  const auth = req.headers['authorization']
  if (!auth) return null
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice(7)
  }
  return auth
}

export const auth = (req, res, next) => {
  const token = getTokenFromHeader(req)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' })
    }
    
    req.user = decoded  
    next()
  })
}
