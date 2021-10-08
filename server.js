'use strict'
const undici = require('undici')
const url = require('url')
const http = require('http')
const start = async() => {
  const fastify = require('fastify')({ logger: true })
  const { PORT = 3000, HOST = 'localhost' } = process.env

  fastify.post('/dt', async (request, reply) => {
    const urls = request.body
    const outboundRequests = urls.map(({ url: uri, arguments: body }) => {
      const parsedUrl = url.parse(uri)
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        path: parsedUrl.path,
        body: Buffer.from(JSON.stringify(body))
      }

      return undici.request(`${parsedUrl.protocol}//${parsedUrl.host}`, options)
    })
    const results = await Promise.all(outboundRequests)
    reply.send('ok')
  })

  fastify.post('/http', async(request, reply) => {
    const urls = request.body
    const outboundRequests = urls.map(({ url: uri, arguments: body }) => {
      const postData = JSON.stringify(body)
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        },
        method: 'POST'
      }

      return new Promise((resolve) => {
        const req = http.request(uri, options, (res) => {
          res.setEncoding('utf8');
          // i found if handler for on data
          // was not here it took longer to process
          res.on('data', (chunk) => {
          })
          res.on('end', () => {
            resolve()
          })
        })

        req.write(postData)
        req.end()
      })
    })

    await Promise.all(outboundRequests)
    reply.send('ok')

  })

  try {
    await fastify.listen(PORT, HOST)
  } catch(err) {
    console.error(err)
  }
}

start()
