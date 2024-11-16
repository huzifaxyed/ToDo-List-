import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [list, setList] = useState(null);
  const [text, setText] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [disable, setDisable] = useState(false);

  // Fetch tasks from the backend
  const getData = async () => {
    const response = await fetch("http://localhost:4000/api/tasks");
    const data = await response.json();
    setList(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // Create new task
  const addTask = async () => {
    if (!text) {
      alert("Empty Field");
    } else {
      await fetch("http://localhost:4000/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: text }),
      });
    }
    setText("");
    getData();
  };

  // Edit task
  const handleOnEdit = (id) => {
    const task = list.find((item) => item.id === id);
    setText(task.task);
    setTaskId(id);
    setToggle(true);
    setDisable(true);
  };

  // Update task
  const updateTask = async () => {
    if (text && toggle) {
      await fetch(`http://localhost:4000/api/tasks/update/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: text }), 
      });

      setTaskId(null);
      setToggle(false);
      setDisable(false);
      setText("");
      getData();
    } else {
      alert("For Update, this task input field should not be empty");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/api/tasks/delete/${id}`, {
      method: "DELETE",
    });
    getData();
  };

  return (
    <main style={{ textAlign: "center" }}>
      <h1>Task</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={toggle === true ? "Update Task" : "Add New Task"}
      />

      {toggle === true ? (
        <button onClick={updateTask}>Update Task</button>
      ) : (
        <button onClick={addTask}>Add New Task</button>
      )}

      <ol>
        {list?.map((item) => (
          <div
            key={item.id}
            style={{
              margin: "0 auto",
              width: "20%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <li>{item.task}</li>

            <div>
              <button disabled={disable} onClick={() => handleOnEdit(item.id)}>
                Edit
              </button>
              <button disabled={disable} onClick={() => deleteTask(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </ol>
    </main>
  );
}

export default App;
