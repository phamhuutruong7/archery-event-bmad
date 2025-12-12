import app from './app.js'

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🎯 Mock Server is running!`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log(`\n📚 Resources:`)
  console.log(`   GET  /api/v1/events`)
  console.log(`   GET  /api/v1/competitions`)
  console.log(`   GET  /api/v1/scores`)
  console.log(`   POST /auth/login`)
  console.log(`\n✨ Ready for frontend development!\n`)
})
