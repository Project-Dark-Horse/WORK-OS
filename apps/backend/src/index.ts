import express, { Request, Response } from 'express'

const app = express()

const PORT = 5000

app.get('/',(req: Request, res : Response) =>{
  res.json({
    "message" : "hello"
  })
})

app.get('/kl',(req : Request, res : Response) =>{
  res.json({
    "kl" : "sindsfs"
  })
})

app.listen(PORT,()=>console.log(`server started at ${PORT}`))
