import React, { useState } from 'react';
import { ReactDOM } from 'react';
import axios from 'axios';

const complete = "complete";
const pending = "pending";

function AddTask(props)
{
  return(
    <div>
      <input  style={{margin:'10px'}} value={props.value} onChange={(e)=>props.setValue(e.target.value)}></input>
      <button onClick={()=>props.addToList(props.value)}>Add Task</button>

    </div>
  );
}

function AddSubtask(props)
{
  const [value, setValue] = React.useState("");
  return(
    <div>
      <input  value={value} onChange={(e)=>setValue(e.target.value)}></input>
      <button onClick={()=>{props.addToList(value,props.index); setValue(""); } }>Add Subtask</button>
    </div>
  );
}


function ShowList(props)
{
  return(
    <div>
      <hr></hr>
      <hr></hr>
      <h3>Tasks:</h3>
      <ul>
        {props.list.map((item, index) => <li key={index}>Title: {item.title}. Id: <br></br>
          <button onClick={()=>props.toggle(index)}>{item.status}</button>
          <button onClick={()=>props.delete(index)}>Delete</button>
          <AddSubtask addToList={props.addToList} index={index} />
          <ul>
            {item.subtasks.map((subtask,indx)=><li key={indx}>{subtask.title}
              <button onClick={()=>props.toggleSubtaskStatus(index,indx)}>{subtask.status}</button>
            </li>)}
          </ul>
          <hr></hr>
        </li>)} 
      </ul>
    </div>
  );
}


//head
function Tasks() {
  const [taskList, setTasklist] = React.useState([]);

  const [addTaskValue, setAddTaskValue] = React.useState("");

  const addTaskToList = (input) => {
    if(input == ""){
      return;
    }
    let tmpTask = {
      title: input,
      status: pending,
    };
    console.log(tmpTask);
    axios
      .post('localhost:8000/api/tasks',tmpTask)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })

    //setTasklist([tmpTask, ...taskList]);
    //setAddTaskValue("");
  };











  const addSubtask = (value, index) => {
    let tmpTask = taskList[index];
    if(value == ""){
      return;
    }

    let tmpSubtask = {
      title: value,
      status: pending,
    }
    tmpTask.subtasks.push(tmpSubtask);

    let tmplist = taskList.filter((item,indx)=>index!=indx);
    tmplist.splice(index,0,tmpTask);
    setTasklist(tmplist);
  }

  const toggleTaskStatus = (index) => {
    let tmpTask = taskList[index];
    if(tmpTask.status == complete) 
    {
      tmpTask.status = pending;
    }
    else
    {
      tmpTask.status = complete;
      tmpTask.subtasks.map((item,tmpindex)=>{
        item.status = complete;
      });
    }
    let tmplist = taskList.filter((item,indx)=> index!=indx );
    tmplist.splice(index,0,tmpTask);
    setTasklist(tmplist);
  }

  const toggleSubtaskStatus = (index,indx) =>{
    console.log("ok");
    let tmpTask = taskList[index];
    if(tmpTask.subtasks[indx].status == complete) 
    {
      tmpTask.subtasks[indx].status = pending;
      tmpTask.status = pending;
    }
    else
    {
      tmpTask.subtasks[indx].status = complete;
    }

    let tmplist = taskList.filter((item,tmpIndex)=>tmpIndex!=index);
    tmplist.splice(index,0,tmpTask);
    setTasklist(tmplist);

  }

  const deleteTask = (index)=>{
    let tmplist = taskList.filter((item,indx)=>index!=indx);
    setTasklist(tmplist);
  }

  return (
    <div>
      <h1>Task Manager</h1>
      <AddTask value={addTaskValue} setValue={setAddTaskValue} addToList={addTaskToList} />
      <ShowList list={taskList} toggle={toggleTaskStatus} addToList={addSubtask} delete={deleteTask} toggleSubtaskStatus={toggleSubtaskStatus}/>
    </div>
  );
}

export default Tasks;
