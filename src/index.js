import http from 'node:http'
import { routes } from './middlewares/routes.js'
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';

function isEqual(value1, value2) {
  return value1 === value2;
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return isEqual(route.method, method) && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }


  return res.writeHead(404).end()
})

server.listen(3333)
