import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import passport from 'passport'
import mongooseService from './services/mongoose'
import passportJWT from './services/passport'
import auth from './middleware/auth'
import jwt from 'jsonwebtoken'
import User from './model/User.model'
import Channel from './model/Channel.model'
import Message from './model/Channel.model'
import config from './config'
import Html from '../client/html'

const Root = () => ''
mongooseService.connect()

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  passport.initialize(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

passport.use('jwt', passportJWT)

middleware.forEach((it) => server.use(it))

server.get('/api/v1/user-info', auth(['admin']), (req, res) => {
  res.json({ status: '200' })
})

server.get('/api/v1/auth', async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret)
    const user = await User.findById(jwtUser.uid)

    const payload = { uid: user.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    delete user.password
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    console.log(err)
    res.json({ status: 'error', err })
  }
})

server.post('/api/v1/auth', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findAndValidateUser(req.body)

    const payload = { uid: user.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    delete user.password
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    console.log(err)
    res.json({ status: 'error', err })
  }
})

server.post('/api/v1/reg', async (req, res) => {
  try {
    const user = await User.createAccount(req.body)
    const payload = { uid: user.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    delete user.password
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    console.log(err)
    res.status(400).json('Error')
  }
})

server.post('/api/v1/add_channel', async (req, res) => {
  console.log('Request',req.body)
  const channel = new Channel({
    channelName: req.body.channelName,
    usersId: req.body.userId
  })
  console.log('server')
  channel.save((err) => {
    if (!err) {
      Channel.findOne({ channelName: req.body.channelName }, (err, channel) => {
        if (!err) {
          res.send(channel)
        } else {
          res.send(err)
        }
        res.end()
      })
    }
  })
})

server.post('/api/v1/add_user_in_channel', async (req, res) => {
  // const channelName = req.body.channelName,
  const usersId = req.body.userId

  console.log('server 4')
  await Channel.findByIdAndUpdate(
    { _id: req.body.channelId },
    { $addToSet: { usersId: usersId } },
    { upsert: false, new: true },
    (err, channel) => {
      if (!err) {
        res.send(channel)
      } else {
        res.send(err)
      }
      res.end()
    }
  )


})

server.delete('/api/v1/delete_user_in_channel', async (req, res) => {
  // const channelName = req.body.channelName,
  const userId = req.body.userId

  console.log('server 5')
  await Channel.findByIdAndUpdate(
    { _id: req.body.channelId },
    { $pull: {usersId : userId}},
    { upsert: false, new: true },
    (err, channel) => {
      if (!err) {
        res.send(channel)
      } else {
        res.send(err)
      }
      res.end()
    }
  )

})


server.get('/api/v1/channel/:name', async (req, res) => {
  const name = req.params.name
  Channel.findOne({ channelName: name }, (err, channel) => {
    if (!err) {
      res.send(channel)
    } else {
      res.send(err)
    }
    res.end()
  })
})



server.get('/api/v1/userchannels/:userid', async (req, res) => {
  const userid = req.params.userid
  await Channel.find({ usersId: userid }, 'channelName', (err, channels) => {
    if (!err) {
      res.send(channels)
    } else {
      res.send(err)
    }
    res.end()
  })
})

server.get('/api/v1/other_channels/:userid', async (req, res) => {
  const userid = req.params.userid
  await Channel.find({ usersId: { $nin: [userid] } }, 'channelName', (err, channels) => {
    if (!err) {
      res.send(channels)
    } else {
      res.send(err)
    }
    res.end()
  })
})

server.post('/api/v1/users-in-channel', async (req, res) => {
  const userIds = req.body.arrUsers
  await User.find(
    {
      _id: { $in: userIds }
    },
    (err, users) => {
      if (!err) {
        res.send(users)
      } else {
        res.send(err)
      }
      res.end()
    }
  )
})

server.post('/api/v1/add_message', async (req, res) => {
  await Channel.findByIdAndUpdate(
    { _id: req.body._id },
    { $addToSet: { messages: { userId: req.body.userId, text: req.body.text } } },
    { upsert: false, new: true },
    (err, channel) => {
      if (!err) {
        res.send(channel)
      } else {
        res.send(err)
      }
      res.end()
    }
  )

})

server.get('/api/v1/username/:id', async (req, res) => {
  const userid = req.params.id
  await User.findOne({ _id: userid }, 'username', (err, user) => {
    if (!err) {
      res.send(user)
    } else {
      res.send(err)
    }
    res.end()
  })
})


server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
