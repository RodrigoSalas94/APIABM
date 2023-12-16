const express = require('express')

const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT ?? 1234
const pool = require('./tabla.js')
app.get('/usuarios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
})

app.post('/usuarios', async (req, res) => {
  const { nombre, email } = req.body

  try {
    await pool.query('INSERT INTO usuarios (nombre, email) VALUES ($1, $2)', [nombre, email])
    res.status(201).json({ message: 'Usuario creado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear usuario' })
  }
})

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, email } = req.body

  try {
    await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3',
      [nombre, email, id]
    )
    res.status(200).json({ message: 'Usuario modificado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al modificar usuario' })
  }
})

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id])
    res.json({ message: 'Usuario eliminado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar usuario' })
  }
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
