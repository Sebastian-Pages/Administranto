import React, {useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'
import companyLogo from './logo.png';
import {RiDeleteBin5Line } from 'react-icons/ri';
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
  };

const onDragEnd = (result, columns, setColumns)=>{

  if(!result.destination) return;
  const {source, destination} = result;
  if (result.destination.droppableId ==="42"){ 
    console.log("delete: ",result.destination );
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [];

    const [removed] = sourceItems.splice(source.index,1);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },

    })
    return;
  }
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
  const [sprint, setSprint] = useState(false)
  const [newColName, setNewColName] = useState("");

  const addNewItem = ()=>{
    console.log("Going to push: ",newItem);
    Object.entries(columns).slice(0,1).map( ([key, value]) => value.items.push(newItem) )
    console.log("items: ",Object.entries(columns).slice(0,1).map( ([key, value]) => value.items ));
    console.log(columns)
    toggleUi()
  }

  const addNewCol = ()=>{
    console.log("We add col: ",newColName)
    let newCol = { id: uuid(), 
      name: newColName,
      items: []
    }
    console.log("We add col: ",newCol)
    Object.entries(columns).push(newCol);
    console.log(columns)
  }

  const startSprint= ()=>{
    setSprint(!sprint);
    console.log("Start Sprint");
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

  function Sprint_menu(props) {
    return (props.visibility ?
      <div className='sprint-ui'>
      <h2>Sprint Menu</h2>
      <label for='sprint-start-input'>Start</label>
      <input id='sprint-start-input' placeholder="Day/Month" />
      <label for='sprint-end-input'>End</label>
      <input id='sprint-end-input' placeholder="Day/Month"/>
      <button className='ui-button button-primary ' onClick={startSprint} >Start Sprint</button>
    </div>:null
    )
  }

  function NewCol(props) {
    return (props.visibility ?
      <div className='new-col'>
        {/* <input id='sprint-start-input' placeholder="Name" style={{padding:'15px'}}  type="text" value={newColName} onChange={(e) => {setNewColName(e.target.value)}}/> */}
        <input type="text" value={newColName} onChange={(e) => {setNewColName(e.target.value)}}/>

        <div style={{display:'flex',justifyContent: 'center',marginTop:'100px'}}>
          <button className='button-add-col' onClick={addNewCol} ><AiOutlinePlus /></button>
        </div>
      </div>:null
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
                      minHeight: (column.name!=='Backlog') ? 370 : 500
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
                                <div style={{
                                  padding: 10,
                                  borderRadius:10,
                                  width:40,
                                  backgroundColor:item.color,
                                }}></div>

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
        {/* Poubelle */}
        <Droppable droppableId={"42"} key={"42"}>
          {(provided, snapshot) => {
            return (
              <div className='Column-delete'
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                  padding: 4,
                  width: 250,
                  minHeight: 100, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  
                }}
              >
                <RiDeleteBin5Line style={{color:'rgb(223, 223, 223)',fontSize:'4rem',margin:10}}/>
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
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
                                  <div style={{
                                  padding: 10,
                                  borderRadius:10,
                                  width:40,
                                  backgroundColor:item.color,
                                }}></div>
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
          <Sprint_menu visibility={!sprint} />
          <NewCol visibility={sprint} />
          </div> 
        </div>
      </DragDropContext>
      </div>
    </div>
    
  );
}


export default App;
