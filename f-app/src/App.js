import './App.css';

import Amplify, {API, graphqlOperation} from 'aws-amplify';

import awsconfig from './aws-exports';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

import {withAuthenticator} from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
import { useState, useEffect } from 'react';

Amplify.configure(awsconfig);

const initialState = {title: '', description: '', content: '', price: '', rating: ''}

const App = () => {
  const [fromState, setFromState] = useState(initialState)
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos()
  }, [])


  function setInput(key, value) {
    setFromState({ ...fromState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(queries.listTodos, {limit: 100}));
      const todos = todoData.data.listTodos.items
      setTodos(todos)
      console.log(todos.length)
    } catch (err) { console.log('error fetching todos') }
  }



  async function addTodo() {
    try {
      if (!fromState.title || !fromState.description) return
      const todo = { ...fromState }
      console.log(todos);
      setTodos([...todos, todo])
      setFromState(todo)
      await API.graphql(graphqlOperation(mutations.createTodo, {input: todo}))
    } catch(err) {
      console.log('error creating todo: ', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={event => setInput('title', event.target.value)}
        style={styles.input}
        value={fromState.title}
        placeholder="Title"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={fromState.description}
        placeholder="Description"
      />
      <input
        onChange={event => setInput('content', event.target.value)}
        style={styles.input}
        value={fromState.content}
        placeholder="Content"
      />
      <input
        onChange={event => setInput('price', event.target.value)}
        style={styles.input}
        value={fromState.price}
        placeholder="Price"
      />
      <input
        onChange={event => setInput('rating', event.target.value)}
        style={styles.input}
        value={fromState.rating}
        placeholder="Rating"
      />
      <button style={styles.button} onClick={addTodo}>Create Todo</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.title}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
            <p style={styles.todoName}>{todo.content}</p>
            <p style={styles.todoName}>{todo.price}</p>
            <p style={styles.todoName}>{todo.rating}</p>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);
