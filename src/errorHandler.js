export function BadRequest(res, message) {
  return res.writeHead(400, { 'Content-Type': 'application/json' }).end(
    JSON.stringify({ error: message })
  )
}

export function notFound(res, message) {
  return res.writeHead(404, { 'Content-Type': 'application/json' }).end(
    JSON.stringify({ error: message })
  )
}

export function internalError(res, message) {
  return res.writeHead(500, { 'Content-Type': 'application/json' }).end(
    JSON.stringify({ error: message })
  )
}
