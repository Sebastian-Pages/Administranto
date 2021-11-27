import React, {useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'
import companyLogo from './logo.png';
import {BsThreeDots} from 'react-icons/bs';
import {AiOutlinePlus} from 'react-icons/ai';
import { TaskMenu,Form } from './components.js';

const itemsFromBackend = [
  { id: uuid(), 
    content: 'First task',
    description:'desc...',
    estimation:0,
    color:'tomato'
  },

  { id: uuid(), 
    content: 'Second task',
    description:'desc...',
    estimation:0,
    color:'blue'
  }
];

let columnsFromBackEnd = 
  {
    [uuid()]: {
      name: 'BackLog',
      items: itemsFromBackend
    },
    [uuid()]: {
      name: 'Sprint Backlog',
      items: []
    },
    [uuid()]: {
      name: 'Some Col',
      items: []
    }
  };

const onDragEnd = (result, columns, setColumns)=>{
  if(!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index,1);
    destItems.splice(destination.index,0,removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })

  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index,1);
    copiedItems.splice(destination.index,0,removed);
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...column,
        items: copiedItems
    }
  })
  }
};
let newItem;
const getNewItem = (data)=>{
  (data.item==='Tomato') ? void(0):console.log("update item",data.item);
  newItem = { id: uuid(), 
    content: data.item.content,
    description:data.item.description,
    estimation:data.item.estimation,
    color:data.item.color
  }
}



function App() {
  const [columns, setColumns] = useState(columnsFromBackEnd)
  const [tasktoggle, setTasktoggle] = useState(false)

  const addNewItem = ()=>{
    console.log("Going to push: ",newItem);
    Object.entries(columns).slice(0,1).map( ([key, value]) => value.items.push(newItem) )
    console.log("items: ",Object.entries(columns).slice(0,1).map( ([key, value]) => value.items ));
    console.log(columns)
    toggleUi()
  }

  let task_menu= 
  <div>
    <TaskMenu func={getNewItem} visibility={tasktoggle}/>
    <div style={{textAlign: 'center',position: 'fixed',zIndex: '1',margin:'45% 0 0 45%'}}>
          <Button  visibility={tasktoggle}/>
    </div>
  </div>;
  const toggleUi = ()=>{
    // console.log("hi: ",task_menu)
    if (tasktoggle) {
      task_menu = 
      <div>
        <TaskMenu func={getNewItem} visibility={tasktoggle}/>
        <div style={{textAlign: 'center',position: 'fixed',zIndex: '1',margin:'45% 0 0 45%'}}>
              <button className='button-primary' 
                  onClick={ addNewItem}>
                  Create Task 
              </button>
          </div>
      </div>
    }
    else {
      task_menu = <h1></h1>
    }
      setTasktoggle(!tasktoggle);
      // console.log("hi: ",task_menu)
  }

  function Button(props) {
    return (props.visibility ?
            <button className='button-primary' 
                onClick={ addNewItem}>
                Create Task 
            </button>:null
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={companyLogo} alt='logo'/>
      </header>
      {task_menu}
      <div className="App-body">
      <DragDropContext onDragEnd={ result => onDragEnd(result, columns,setColumns)}>
        <div className='backlog'> <h2>Backlog</h2>
        {Object.entries(columns).slice(0,1).map(([id, column])=>{
          return(
            <div className='Column-Header'>
            <h2>{column.name}</h2>
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => {
                return (
                  <div className='Column-body'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                      padding: 4,
                      width: 250,
                      minHeight: 500
                    }}
                  >
                    {column.items.map((item,index)=> {
                      return(
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot)=> {
                            return(
                              <div className='Task'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                
                                style={{
                                  userSelect: 'none',
                                  padding: 16,
                                  margin: '0 0 8px 0',
                                  minHeight: '50px',
                                  backgroundColor: snapshot.isDragging ? 'rgb(186, 190, 194)' : 'rgb(236, 241, 245)',
                                  ...provided.draggableProps.style
                                }}
                              >      
                                {item.content}
                                <button className='button-task'><BsThreeDots /></button>  
                              </div>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                    <div className='add-item' onClick={toggleUi}><AiOutlinePlus/> Add New Item </div> 
                  </div>
                )
              }}
            </Droppable>
            </div>
          )
        })}
        </div> 
        <div className='sprint'> 
        <h2>Sprint</h2>
          <div className='column-container'> 
          {Object.entries(columns).slice(1).map(([id, column])=>{
            return(
              <div className='Column-Header'>
              <h2>{column.name}</h2>
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <div className='Column-body'
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                        padding: 4,
                        width: 250,
                        minHeight: 500
                      }}
                    >
                      {column.items.map((item,index)=> {
                        return(
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot)=> {
                              return(
                                <div className='Task'
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  
                                  style={{
                                    userSelect: 'none',
                                    padding: 16,
                                    margin: '0 0 8px 0',
                                    minHeight: '50px',
                                    backgroundColor: snapshot.isDragging ? 'rgb(186, 190, 194)' : 'rgb(236, 241, 245)',
                                    ...provided.draggableProps.style
                                  }}
                                >      
                                  {item.content}
                                  <button className='button-task'><BsThreeDots /></button>  
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
              </div>
            )
          })}
          <div className='sprint-ui'>
            <h2>Sprint Menu</h2>
            <label for='sprint-start-input'>Start</label>
            <input id='sprint-start-input' placeholder="Day/Month" />
            <label for='sprint-end-input'>End</label>
            <input id='sprint-end-input' placeholder="Day/Month"/>
            <button className='ui-button button-primary ' disabled={false} >Start Sprint</button>
            <Form />
          </div>
          </div> 
        </div>
      </DragDropContext>
      </div>

    </div>
    
  );
}


export default App;
