import express, { Request, Response, NextFunction } from "express"
import http from 'http'
import cors from 'cors'
import mongoose, { ConnectOptions } from 'mongoose'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
const server = http.createServer(app)

const users = require('../routes/users')
const posts = require('../routes/posts')

const swaggerOptions = {
  definition: {
    info: {
      title: 'INSTA API',
      description: 'This is the server of a clone of instagram.com',
      contact: {
        name: 'Yass Lipton'
      },
      version: '0.1'
    },
    host: 'http://192.168.1.32:5000',
    basePath: '/'
  },
  apis: ['./docs/**/*.yaml'],
}

const swaggetDocs = swaggerJsDoc(swaggerOptions)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggetDocs))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
})

app.use(cors({origin:true,credentials: true}))

const dbURI = process.env.DB_URI || '<mongodb connection uri>'

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => console.log('connected to db'))
  .catch((err: any) => console.log(err))

app.use(express.json())
app.use('/user', users)
app.use('/post', posts)

const PORT = process.env.PORT || 5000

server.listen(PORT, function(){
  console.log(`listening on *:${PORT}`)
})

module.exports = app