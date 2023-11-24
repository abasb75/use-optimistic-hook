import { useEffect, useState, useRef } from 'react';
import { useOptimistic } from "react";

function App() {
  const [todos,setTodos] = useState(null);
  useEffect(()=>{
    fetch('http://localhost/todos/')
    .then(res=>res.json())
    .then(data=>setTodos(data));
  },[]);
  return (
    <>
      {todos?<Todos todos={todos} setTodos={setTodos} />:<p>loading ...</p>}
    </>
  );
}

function Todos({todos,setTodos}){
  const todoInput = useRef(null);

  const [todosOptimistic,addTodosOptimistic] = useOptimistic(
    todos,
    (currentTodos,optimisticTodo)=>[...currentTodos,optimisticTodo]
  );

  const formAction = async (formData)=>{
    const title = formData.get('title');
    todoInput.current.value = '';
    addTodosOptimistic(title);
    await addTodoOnServer(title);
  }

  return (<>
    <form action={formAction}>
      <input ref={todoInput} type='text' name='title' />
      <button type='submit'>Add</button>
    </form>
    {todosOptimistic.map((todo)=>(<h3 
    key={todo.id}
    style={{opacity:todo.sending?'.5':'1'}}
    >
      {todo.title}
    </h3>))}
  </>);
}

/*
function Todos({todos,setTodos}){
  console.log(todos);
  const todoInput = useRef(null);
  
  const addTodo = async (title)=>{
    const formData = new FormData();
    formData.append('title',title);
    const response = await fetch(
      'http://localhost/todos/add.php',
      {
        method:'POST',
        body:formData,
      }
    );
    const result = await response.json();
    setTodos(todos=>[...todos,{id:todos.length+1,title}]);
    todoInput.current.value = '';
  }

  return (<>
    <div>
      <input ref={todoInput} />
      <button onClick={()=>addTodo(todoInput.current.value)}>Add</button>
    </div>
    {todos.map((todo)=>(<h3 key={todo.id}>{todo.title}</h3>))}
  </>);
}
*/

export default App;
