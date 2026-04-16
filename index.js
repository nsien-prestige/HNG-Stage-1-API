const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { connectDB } = require('./db')
const profileRoutes = require('./router')

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

// MongoDB Connection
connectDB()

app.use('/api', profileRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`)
})