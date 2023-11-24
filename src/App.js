import { useEffect, useState, useRef,useOptimistic } from 'react';

function App() {
  const [todos,setTodos] = useState(null);
  useEffect(()=>{
    fetch('http://localhost/todos/')
    .then(res=>res.json())
    .then(data=>setTodos(data));
  },[]);

  if(!todos){
    return <p>loading ...</p>
  }
  return <Todos todos={todos} setTodos={setTodos} />;
}

const addTodoToServer = async (formData)=>{
  const response = await fetch(
    'http://localhost/todos/add.php',
    {
      method:'POST',
      body:formData,
    }
  );
  const result = await response.json();
  return result;
}

function Todos({todos,setTodos}){
  const todoInput = useRef(null);

  const [optimisticTodos,addOptimisticTodos] = useOptimistic(
    todos,
    (currentTodos,optimisticTodo)=>[...currentTodos,optimisticTodo]
  );

  const formAction = async (formData)=>{
    const optimisticTodo = {
      title:formData.get('title'),
      id:Math.random()*100000000,
      sending:true, // add sending property
    }

    const todo = {
      ...optimisticTodo,
      sending:false,
    }

    todoInput.current.value = '';
    addOptimisticTodos(optimisticTodo); // dispatch to optimisticTodos
    await addTodoToServer(formData);
    setTodos(todos=>[...todos,todo]); // dispatch to original todos
  }

  return (<>
    <form action={formAction}>
      <input ref={todoInput} type='text' name='title' />
      <button type='submit'>Add</button>
    </form>
    <ul>
      {optimisticTodos.map((todo)=>(<li 
      key={todo.id}
      // set custom style if sending is true
      style={{opacity:todo.sending?'.5':'1'}} 
      >
        {todo.title}
      </li>))}
    </ul>
  </>);
}

export default App;
