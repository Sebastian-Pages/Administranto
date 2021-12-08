import React, {useState,useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'
import companyLogo from './logo.png';
import {RiDeleteBin5Line } from 'react-icons/ri';
import {AiOutlinePlus,AiOutlineClose } from 'react-icons/ai';
import { TaskMenu } from './components.js';
import useForm from "./useForm";

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
    ["100"]: {
      name: 'BackLog',
      items: itemsFromBackend
    },
    [uuid()]: {
      name: 'Sprint Backlog',
      items: []
    },
  };

const onDragEnd = (result, columns, setColumns,sprint)=>{

  if(!result.destination) return;
  const {source, destination} = result;

  if (sprint && result.destination.droppableId ==="100"){
    console.log("Tried to put task in backlog during Sprint",result.destination.droppableId)
    return;
  }
  if (sprint && result.source.droppableId ==="100" && result.destination.droppableId !=="42"){
    console.log("Tried to take task out of backlog during Sprint",result.destination.droppableId)
    return;
  }
  if (sprint && result.source.droppableId !=="100" && result.destination.droppableId =="42"){
    console.log("Tried to delete task during Sprint",result.destination.droppableId)
    alert("You must complete task or archive it!");
    return;
  }
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

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const visible = {visibility:'visible'};
const invisible = {visibility:'invisible'};

function App() {
  const [columns, setColumns] = useState(columnsFromBackEnd)
  const [tasktoggle, setTasktoggle] = useState(false)
  const [sprint, setSprint] = useState(false)
  const [newColName, setNewColName] = useState("");
  const [colToDelete,setColToDelete] = useState("");
  const [formValue, Form] = useForm("", "Start");
  const [formValue2, Form2] = useForm("", "End   ");


  const forceUpdate = useForceUpdate();

  useEffect(() => {
    console.log("UseEffects",columns)
  }, [columns]);

  const addNewItem = ()=>{
    console.log("Going to push: ",newItem);
    Object.entries(columns).slice(0,1).map( ([key, value]) => value.items.push(newItem) )
    console.log("items: ",Object.entries(columns).slice(0,1).map( ([key, value]) => value.items ));
    console.log(columns)
    toggleUi()
  }

  const addNewCol = ()=>{
    console.log("We add col: ",newColName)
    let newCol = {
      [uuid()]: {
        name: newColName,
        items: []
      },
    };
    console.log("We add col2: ",newCol)
    setColumns({
      ...columns,
      [uuid()]:{
        name: newColName,
        items: []
      }
    })
    console.log("Columns: ",columns)
  }

  const deleteCol = (key)=>{
  
    console.log("key",key)
    const copyColumns = columns
    let res = Object.entries(copyColumns[key]).map( ([key, value]) =>{{return value}});
    console.log("res: ",res[1])
    
    if (res[1].length===0){
      delete copyColumns[key]
      console.log("col before",columns)
      setColumns(copyColumns);
      forceUpdate();
      console.log("col after",columns)
    }
    else{
      alert("You still have items in that column")
    }

  }

  const resetCols =()=>{
    console.log("DELETING");

    // Object.entries(columns).slice(2).forEach(element => {
    //   deleteCol(element.id);
    //   console.log("a");
    // });
    Object.entries(columns).slice(2).map( ([key, value]) => deleteCol(key));
    console.log("DELETING: ",columns.length);
    
  }

  const startSprint= ()=>{
    if (formValue==="" || formValue2===""){
      alert("You must give a start and end to your sprint");
    }
    else{
      setSprint(!sprint);
      console.log("Start Sprint");
    }
  }

  const endSprint= ()=>{
    setSprint(!sprint);
    resetCols();
    console.log("End Sprint");
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
      {/* <label for='sprint-start-input'>Start</label> */}
      {Form}
      {Form2}
      {/* <input id='sprint-start-input' placeholder="Start Date" value={debutSprint} onChange={(e) => {setDebutSprint(e.target.value)}} /> */}
      {/* <label for='sprint-end-input'>End</label>
      <input id='sprint-end-input' placeholder="End Date"/> */}
      <button className='ui-button button-primary ' onClick={startSprint} >Start Sprint</button>
    </div>:null
    )
  }

  function Sprint_info(props) {
    return (props.visibility ?
    <div>
      <h2 className="date-display">from {formValue} to {formValue2}</h2>
      <button className="button-primary" onClick={endSprint} style={{marginRight:'10px'}}>End Sprint</button>

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
      {/* <div className='button-menu' style={{display:'inline-block'}}>             
            <input 
              type="text" 
              value={colToDelete}
              onChange={(e) => setColToDelete(e.target.value)}
              style={{display:'inline-block', width:'50px',paddingRight:0,marginRight:0}}
            />  
            <button type="submit" style={{height:'3rem',padding: '10px',border: 'solid 2px lightgray'}}
            onClick={() => { console.log("delete col:",colToDelete) }}
            ><RiDeleteBin5Line style={{color:'grey',fontSize:'1.2rem'}}/></button>
          </div> */}
      <div className="App-body">
      <DragDropContext onDragEnd={ result => onDragEnd(result, columns,setColumns,sprint)}>
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
        <div className='sprint-header' style={{display:'flex'}}>       
          <h2 style={{display:'inline-block'}}>Sprint</h2>
          <Sprint_info visibility={sprint}/>
        </div>

          <div className='column-container'> 
          {Object.entries(columns).slice(1,2).map(([id, column])=>{
            return(
              <div className='Column-Header'>
              <h2 style={{width:'240px'}}>{column.name}</h2>
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
          {Object.entries(columns).slice(2).map(([id, column])=>{
            return(
              <div className='Column-Header'>
              <h2>{column.name}</h2>
              <button className='exit' onClick={(e) => { deleteCol(id) }}> <AiOutlineClose /></button>
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
