/**
 * Custom middleware for json-server
 * Handles authentication, custom routes, and response formatting
 */

export default function (req, res, next) {
  // CORS headers (json-server handles this, but adding for completeness)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  // Custom route: Login
  if (req.path === '/auth/login' && req.method === 'POST') {
    const { email, password } = req.body

    // Simple mock authentication
    const users = res.locals.data.users
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      return res.status(200).json({
        accessToken: `mock-token-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
        expiresIn: 86400,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      })
    } else {
      return res.status(401).json({
        error: 'Invalid credentials'
      })
    }
  }

  // Custom route: Register
  if (req.path === '/auth/register' && req.method === 'POST') {
    const { email, password, firstName, lastName } = req.body

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      firstName,
      lastName,
      role: 'Athlete',
      phoneNumber: '',
      createdAt: new Date().toISOString()
    }

    return res.status(201).json({
      accessToken: `mock-token-${newUser.id}`,
      refreshToken: `mock-refresh-${newUser.id}`,
      expiresIn: 86400,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    })
  }

  // Custom route: Refresh token
  if (req.path === '/auth/refresh' && req.method === 'POST') {
    const { refreshToken } = req.body

    if (refreshToken && refreshToken.startsWith('mock-refresh-')) {
      const userId = refreshToken.replace('mock-refresh-', '')
      return res.status(200).json({
        accessToken: `mock-token-${userId}`,
        expiresIn: 86400
      })
    }

    return res.status(401).json({ error: 'Invalid refresh token' })
  }

  // Custom route: Logout
  if (req.path === '/auth/logout' && req.method === 'POST') {
    return res.status(200).json({ message: 'Logged out successfully' })
  }

  // Custom route: Submit score
  if (req.path === '/scores' && req.method === 'POST') {
    const { competitionId, endNumber, arrowScores } = req.body
    const authHeader = req.headers.authorization

    // Extract user ID from mock token
    let athleteId = 'user-002' // Default
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
      athleteId = authHeader.replace('Bearer mock-token-', '')
    }

    const endScore = arrowScores.reduce((sum, score) => sum + score, 0)

    // Get previous total score
    const scores = res.locals.data.scores
    const athleteScores = scores.filter(s =>
      s.athleteId === athleteId && s.competitionId === competitionId
    )
    const previousTotal = athleteScores.reduce((sum, s) => sum + s.endScore, 0)

    const newScore = {
      id: `score-${Date.now()}`,
      athleteId,
      competitionId,
      endNumber,
      arrowScores,
      endScore,
      totalScore: previousTotal + endScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return res.status(201).json(newScore)
  }

  // Add delay to simulate network latency (optional)
  setTimeout(() => {
    next()
  }, 100)
}
