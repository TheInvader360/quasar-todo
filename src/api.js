import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8080',
  json: true
})

export default {
  async execute (method, resource, data) {
    return client({
      method,
      url: resource,
      data
    }).then(req => {
      return req.data
    })
  },
  createTask (data) {
    return this.execute('post', '/task', data)
  },
  readTasks () {
    return this.execute('get', '/tasks')
  },
  readTask (id) {
    return this.execute('get', `/tasks/${id}`)
  },
  updateTask (id, data) {
    return this.execute('put', `/tasks/${id}`, data)
  },
  deleteTask (id) {
    return this.execute('delete', `/tasks/${id}`)
  }
}
