const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const task = require('./models/task')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('API Projeto TOTI');
})

// List tasks
app.get('/tasks', async (req, res) => {
  const taskAll = await tasks.findAll()
  res.status(200).json({ taskAll })
})

// Create task
app.post('/tasks', async (req, res) => {
  const { description, done } = req.body
  if (description == null || done == null) {
    res.status(400).send('Valores invalidos')
  }
  else {
    if (done == true || done == false) {
      const newTask = await tasks.create({
        description,
        done
      })
      res.status(200).send('Cadastro feito com sucesso!')
    }
    else {
      res.status(400).send('Faltal erro 400: valor de Done não é correto')
    }
  }


})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const tarefa = await tasks.findByPk(taskId)

  if (tarefa) {
    res.status(200).json({ tarefa })
    return;
  }

  if (isNaN(taskId)) {
    res.status(400).send('Erro 400: ID não valida, insira ID válida')
    return;
  }

  else {
    res.status(500).send('Erro 500: Tarefa inexistente')
    return;
  }
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await tasks.findOne({ where: { id: taskId}});
  const { description, done} = req.body;

if(isNaN(taskId)){
    res.status(400).send('Valor invalido, Insira um valor valido!')
    return;
   }

  if(!task){
    res.status(500).send('Não encontrado!')
    return;
  }
  
  if(done == null){
    task.set(req.body);
  await task.save();
  res.status(200).send('Tarefa atualizada com sucesso!');
  }

else{

  if(done == true || done == false){
    task.set(req.body);
  await task.save();
  res.status(200).send('Tarefa atualizada com sucesso!');
  }

  else{
    res.status(400).send('Valor para o Done não é valido!')
  }
}
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const tarefa = await tasks.findByPk(taskId);

  if (tarefa) {
    await tasks.destroy({ where: { id: taskId } });
    res.status(200).send('A tarefa foi apagada com sucesso!')
    return;
  }
  if (isNaN(taskId)) {
    res.status(400).send('Status 400: pedido de delete não valido!')
    return;
  }
  else {
    res.status(500).send('Não existe!')
    return;
  }
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
