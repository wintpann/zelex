# ZELEX - requirements
    NodeJs Express middleware smart logger
    
## Part 1 - COLLECT LOGS

### 1.1 Collect info about
* request:
    * traffic (incoming, outgoing, total)
    * body
    * raw headers
    * location (latitude, longitude)
    * city
    * region
    * country
    * ip
    * path
    * method
    * timing (started, finished, duration)
* response
    * status code
    * raw headers
    * sent data

### 1.2 Collect data logs associated with request log
* level (debug, fatal, info, warn, error)
* step (e.g. `getting info from database`, `checking token`)
* name (e.g. `JS_ERROR` for aggregating by the criteria later)
* description (what goes wrong or right, e.g. `DB crashed`)
* data (custom event data)
* time

### 1.3 Collect separate data logs
* level (debug, fatal, info, warn, error)
* step (e.g. `getting info from database`, `checking token`)
* name (e.g. `JS_ERROR` for aggregating by the criteria later)
* description (what goes wrong or right, e.g. `DB crashed`)
* data (custom event data)
* time

### 1.4 Save logs in
* MongoDB instance (to serve and aggregate data later)
* Any other databases
* Json files

### 1.5 Additional abilities
* Log event subscribing (for custom log handling)
* Save custom fields
* Clear logs after some time

> Example of how it should work
```js
const { Transport, Logger, LEVEL } = require('zelex')
const app = require('express')()

const auth = (req) => ({ denied: true, message: 'Access was denied' })

const mongoTransport = new Transport.mongo({
  path: 'mongodb://localhost:27017/logs', // default = mongodb://localhost:27017/logs
  saveInterval: 1000 * 60 * 15, // default = 1000 * 60 * 15
  clearAfter: 1000 * 60 * 15, // default = 1000 * 60 * 15
  checkToClearInterval: 1000 * 60 * 60 * 24 * 7, // default = 1000 * 60 * 60 * 24 * 7
  saveDataLogLevels: [ level.info, level.warn, level.error, level.debug, level.fatal ], // default = level.all
  saveRequestLogs: true, // default = true
  serveURL: 'mongo',
  auth, // default = () => ({ denied: false, message: '' })
});

const jsonTransport = new Transport.json({
  path: 'logs', // default = logs
  saveInterval: 1000 * 60 * 15, // default = 1000 * 60 * 15
  clearAfter: 1000 * 60 * 15, // default = 1000 * 60 * 15
  checkToClearInterval: 1000 * 60 * 60 * 24 * 7, // default = 1000 * 60 * 60 * 24 * 7
  saveDataLogLevels: [ level.info, level.warn, level.error, level.debug, level.fatal ], // default = level.all
  saveRequestLogs: true, // default = true
  serveURL: 'json',
  auth, // default = () => ({ denied: false, message: '' })
});

const customTransport = new Transport.custom({
  onDataLog: async (log) => (await fetch.post('/notify-about-fatal', log)), // default = () => {}
  onRequestLog: (log) => {}, // default = () => {}
  saveDataLogLevels: [ level.info, level.warn, level.error, level.debug, level.fatal ], // default = level.all
  saveRequestLogs: true, // default = true
})

const logger = new Logger({
  transport: [
    mongoTransport,
    jsonTransport,
    customTransport,
  ],
  app,
  extras: {
    user: 'req.user',
  }
})

app.use(logger.watch)
app.post('/users', (req, res) => {
  req.debug({ step: 'start_request', name: 'REQ_START', description: 'just started', data: { customData: 'custom data' } })
  res.status(201).json({ message: 'user was created' })
})
```
---

## Part 2 - SERVE LOGS
will be soon