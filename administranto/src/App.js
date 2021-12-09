import React, {useState,useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'
import companyLogo from './logo.png';
import {RiDeleteBin5Line } from 'react-icons/ri';
import {AiOutlineMinus,AiOutlinePlus,AiOutlineClose } from 'react-icons/ai';
import { TaskMenu } from './components.js';
import useForm from "./useForm";

/* VARIALBLES DECLARATION */
const projectsFromBackEnd = [
  { id: uuid(), 
    name: 'Bakery Project',
    active:{
              ["100"]: {
                name: 'BackLog',
                items: [
                          { id: uuid(), 
                            content: 'Make Dought',
                            description:'desc...',
                            estimation:0,
                            color:'gold'
                          },

                          { id: uuid(), 
                            content: 'Cook the Dought',
                            description:'desc...',
                            estimation:0,
                            color:'blue'
                          }
                        ]
              },
              [uuid()]: {
                name: 'Sprint Backlog',
                items: []
              },
              [uuid()]: {
                name: 'Done',
                items: [
                  { id: uuid(), 
                            content: 'Buy Hoven',
                            description:'desc...',
                            estimation:0,
                            color:'Salmon'
                          }
                ]
              },
            },
    sprints:{
      [uuid()]: {
        name: 'Sprint Backlog',
        items: []
      },
      [uuid()]: {
        name: 'Done',
        items: [
          { id: uuid(), 
                    content: 'Old Item',
                    description:'desc...',
                    estimation:10,
                    color:'Lightblue'
                  }
        ]
      },
    }
  },

  { id: uuid(), 
    name: 'Web Project',
    active:{},
    sprints:{
      [uuid()]: {
        name: 'Sprint Backlog',
        items: [
          { id: uuid(), 
                    content: 'publish website',
                    description:'desc...',
                    estimation:10,
                    color:'Tomato'
                  }
        ]
      },
      [uuid()]: {
        name: 'To test',
        items: [
          { id: uuid(), 
                    content: 'make a index.html',
                    description:'desc...',
                    estimation:10,
                    color:'Lightblue'
                  }
        ]
      },
      [uuid()]: {
        name: 'Done',
        items: [
          { id: uuid(), 
                    content: 'brainstorm ideas',
                    description:'desc...',
                    estimation:1,
                    color:'green'
                  }
        ]
      },
    }
  },
];

/* IMPORTANT FUNCTIONS */

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

let newProject;
const getNewProject = (data)=>{
  console.log("update item",data);
  newProject = { id: uuid(), 
    name: data.name}
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const visible = {visibility:'visible'};
const invisible = {visibility:'invisible'};



/* APPLICATION */
function App() {

  const [projects, setProjects] = useState(projectsFromBackEnd)
  const [project, setProject] = useState()
  const [columns, setColumns] = useState([])

  const [tasktoggle, setTasktoggle] = useState(false)
  const [sprint, setSprint] = useState(false)
  const [projectMenu, setProjectMenu] = useState(false)
  const [newColName, setNewColName] = useState("");
  const [colToDelete,setColToDelete] = useState("");
  const [formValue, Form] = useForm("", "Start");
  const [formValue2, Form2] = useForm("", "End   ");
  const [newProjectName, setNewProjectName] = useState("");

  

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

  const deleteCol = (key,bypass)=>{
  
    console.log("key",key)
    const copyColumns = columns
    let res = Object.entries(copyColumns[key]).map( ([key, value]) =>{{return value}});
    console.log("res: ",res[1])
    
    if (res[1].length===0 || bypass){
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
    Object.entries(columns).slice(2).map( ([key, value]) => deleteCol(key,true));
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

   //destroy
   const destroyProject = (index)=>{
    console.log("projs before",projects)
    const copyProjects = projects
    delete copyProjects[index]
    setProject(copyProjects);
    forceUpdate();
    console.log("projs after",projects)
  }

  //add
  const addNewProject = ()=>{
    let newProj = {
      id:uuid(),
      name: "newproject"//newProjectNam
    };
    console.log("We add proj: ",newProj)
    setProject({
      ...projects,
      id:uuid(),
      name: "newproject"//newProjectName
    })
    console.log("Project: ",projects)
  }

  //go
  const GoToProject = (index)=>{
    let p = projects[index]
    // console.log("going to project :",p)
    console.log(Object.entries(p).map( ([key, value]) => `My key is ${key} ` ) )
    console.log("Opening",p["name"])
 
    setProject(p)
    if (Object.entries(p["active"]).length === 0){
      console.log("length 0 !")
      setColumns({["100"]: {
                name: 'BackLog',
                items: []
              },
              [uuid()]: {
                name: 'Sprint Backlog',
                items: []
              }})
      setSprint(false)
    }
    else{
      console.log("length: ",Object.entries(p["active"]).length)
      setColumns(p["active"])
      setSprint(true)
    }
    
    setProjectMenu(true);
    forceUpdate();
  }
  const goToProjects = ()=>{
    setProjectMenu(false);
  }
  

  let task_menu= 
  <div>
    <TaskMenu func={getNewItem} visibility={tasktoggle}/>
    <div style={{textAlign: 'center',position: 'fixed',zIndex: '1',margin:'45% 0 0 45%'}}>
          <Button  visibility={tasktoggle}/>
    </div>
  </div>;
  const toggleUi = ()=>{
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

  /* APPLICATION DISPLAY*/
  return (
    projectMenu ?
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
      <div className="buttons-menu">
        <button className="button-primary" onClick={goToProjects}>Projects Menu</button>
        <button className="button-primary">View Old Sprints</button>
      </div>
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
              <button className='exit' onClick={(e) => { deleteCol(id,false) }}> <AiOutlineClose /></button>
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
    :

    <div className="App">
      <header className="App-header">
        <img src={companyLogo} alt='logo'/>
      </header>
      <div className="App-header-project"> 
        <h1>Project Menu</h1>
      </div>
      <div className="App-body-project"> 
        <div className="App-creating-project"> 
          <h1 className='new-project-titles'>New Project</h1>
          <div className='inputs'>
            <input id='new-project-name-input' placeholder="New project name" value={newProjectName} onChange={(e) => {setNewProjectName(e.target.value)}}/>
            <input id='new-project-start-input' placeholder="starting date : DD/MM/YYYY"/>
            <input id='new-project-end-input' placeholder="ending date : DD/MM/YYYY"/>
                <button className='button-plus' onClick={addNewProject}>
                <AiOutlinePlus/> 
                </button>
          </div>
          
        </div>
        <div className="App-listing-project">
          <h1 className='new-project-titles'>Your Projects</h1>
          <div >
          {projects.map((item,index)=> {
            return(
              <div  className="App-listing-project-list">
                <h2 className='App-listing-project-title'>{item.name}</h2>
                <div className='button-listed' onClick={(e) => { GoToProject(index) }}>GO </div>
                <div className='button-listed-right' onClick={(e) => { destroyProject(index) }}><AiOutlineMinus/></div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </div>
    
  );
}


export default App;
