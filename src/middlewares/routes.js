import { randomUUID } from 'node:crypto';
import { buildRoutePath } from '../utils/build-route-path.js';
import { Database } from '../database.js';
import { BadRequest, internalError, notFound } from '../errorHandler.js';

const database = new Database()
const getactualDate = () => new Date()
const formattedDate = getactualDate().toLocaleString('pt-BR')

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body || {}
      const created_at = formattedDate
      const updated_at = formattedDate
      const completed_at = null

      if (!title && !description) {
        return BadRequest(res, 'Para Criar uma Tarefa é Necessário o Envio de um Título e Descrição')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at,
        created_at,
        updated_at,
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body || {}
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        updated_at: formattedDate
      }

      if (!title && !description) {
        return BadRequest(res, 'Para Atualizar uma Tarefa é Necessário o Envio de um Título ou Descrição')
      }

      try {
        database.update('tasks', id, updateData)
        return res.writeHead(204).end()
      } catch(error) {
        return notFound(res, error.message)
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params


      try {
        database.delete('tasks', id)
        return res.writeHead(204).end()
      } catch (error) {
        return notFound(res, error.message)
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const updateData = {
        completed_at: formattedDate
      }

      try {
        database.update('tasks', id, updateData)
        return res.writeHead(204).end()
      } catch (error) {
        return notFound(res, error.message)
      }
    }
  }
]
