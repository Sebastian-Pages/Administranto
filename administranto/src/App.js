import React, {useState} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'
import companyLogo from './logo.png';
import {RiDeleteBin5Line } from 'react-icons/ri';
import {AiOutlineMinus,AiOutlinePlus,AiOutlineClose } from 'react-icons/ai';
import { TaskMenu } from './components.js';
import useForm from "./useForm";

import firebase from 'firebase/compat/app';
import { getFirestore} from 'firebase/firestore/lite';
import 'firebase/compat/auth' ;
import 'firebase/compat/firestore' ;
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

/* IMPORTANT FUNCTIONS */
import {useForceUpdate,initializeProject} from "./Functions"



/* VARIALBLES DECLARATION */
import {projectsFromBackEnd,visible,invisible,firebaseConfig} from "./Variables"

const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const auth = firebase.auth();


const updateProjectBacklogAndSprint= (columns,isSprintActive,project)=> {
  console.log("DEBUG 3: ",columns["backlog"])
  console.log("DEBUG 3: ",project.backlog)
  // firestore.collection("projects").doc(project.id).update({
  //     "backlog": columns["backlog"],
  //   });
};

const onDragEnd = (result, columns, setColumns, isSprintActive , project) => {

if (!result.destination) return;
const { source, destination } = result;

if (isSprintActive&& result.destination.droppableId === "100") {
    console.log("Tried to put task in backlog during Sprint", result.destination.droppableId)
    return;
}
if (isSprintActive && result.source.droppableId === "100" && result.destination.droppableId !== "42") {
    console.log("Tried to take task out of backlog during Sprint", result.destination.droppableId)
    return;
}
if (isSprintActive && result.source.droppableId !== "100" && result.destination.droppableId == "42") {
    console.log("Tried to delete task during Sprint", result.destination.droppableId)
    alert("You must complete task or archive it!");
    return;
}
if (result.destination.droppableId === "42") {
    console.log("delete: ", result.destination);
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [];

    const [removed] = sourceItems.splice(source.index, 1);
    setColumns({
        ...columns,
        [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems
        },

    })
    updateProjectBacklogAndSprint(columns,isSprintActive, project)
    return;
}
if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
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
    updateProjectBacklogAndSprint(columns,isSprintActive, project)

} else {
    const column = columns[source.droppableId];
    console.log("DEBUG: ",columns)
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
        ...columns,
        [source.droppableId]: {
            ...column,
            items: copiedItems
        }
    })
    updateProjectBacklogAndSprint(columns,isSprintActive, project)
}
};



let newItem;
const getNewItem = (data) => {
    (data.item === 'Tomato') ? void(0): console.log("update item", data.item);
    newItem = {
        id: uuid(),
        content: data.item.content,
        description: data.item.description,
        estimation: data.item.estimation,
        color: data.item.color
    }
}

let newProject;
const getNewProject = (data) => {
    console.log("update item", data);
    newProject = {
        id: uuid(),
        name: data.name
    }
}

//Fonction SIGNOUT
function SignOut() {
  return auth.currentUser && (
    <div>
      <button className="sign" onClick={() => auth.signOut()}>Log Out</button>
    </div>
  )
}

//Fonction SIGNIN google
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
      <div className="App">
      <header className="App-header">
        <img src={companyLogo} alt='logo'/>
        <button className="sign" onClick={signInWithGoogle}>Log In</button>
      </header>
      <div className='body-home'>
        <div>
          <h1 className='body-home-title'> Welcome aboard !</h1>
          <p>
            Programisto dispose d’une expertise complète en matière de planification, de conception et de développement, combinée à des technologies populaires, robustes et fiables qui correspondent à vos besoins.
          </p>
        </div>
        <div>
          <h1 className='body-home-title'> How does Administranto works</h1>
          <p>
          Programisto dispose d’une expertise complète en matière de planification, de conception et de développement, combinée à des technologies populaires, robustes et fiables qui correspondent à vos besoins.
          </p>
        </div>
      </div>
      <footer className='App-footer'>
        <div>
          <p>
            Programisto dispose d’une expertise complète en matière de planification, de conception et de développement, combinée à des technologies populaires, robustes et fiables qui correspondent à vos besoins.
          </p>
        </div>
      </footer>
      </div>
  )
}


/* APPLICATION */
function App() {

  /*Auth*/
  const [user] = useAuthState(auth);

  /*FireBase*/
  const projectsRef = firestore.collection('projects');
  const query = projectsRef.orderBy('createdAt').limit(25);
  const [projects] = useCollectionData(query, { idField: 'id' });
  
  /*Project Menu*/
  const [projectMenu, setProjectMenu] = useState(false)
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStart, setNewProjectStart] = useState("");
  const [newProjectEnd, setNewProjectEnd] = useState("");

  //ancien; il faut voir lequel on garde
  const [project, setProject] = useState()

  const [projectName, setProjectName] = useState()
  const [columns, setColumns] = useState([])
  const [backlog, setBacklog] = useState([])

  const [isItemCreationMenuVisible, setisItemCreationMenuVisible] = useState(false)
  const [isSprintActive, setIsSprintActive] = useState(false)
  const [newColName, setNewColName] = useState("");
  const [colToDelete,setColToDelete] = useState("");
  const [formValue, Form] = useForm("", "Start");
  const [formValue2, Form2] = useForm("", "End   ");

  /*fonctions qui marche bien*/ 
  const forceUpdate = useForceUpdate();
  const createNewProject = async (e,namearg, startarg, endarg)=>{
    // const { uid, photoURL } = auth.currentUser;
    const uid =  2;
    await projectsRef.add({
      id: uuid(),
      name: namearg,
      start: startarg,
      end: endarg,
      lastSprintIsActive: false,
      backlog: {
        ["backlog"]: {
            name: 'BackLog',
            items: []
        },
      },
      sprints: [{
        [uuid()]:{
        name: "Sprint Backlog",
        items: []
      },
      },],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    })
    setNewProjectName("")
    setNewProjectStart("")
    setNewProjectEnd("")
  };
  const deleteProject = async (id)=>{
    console.log('id: ',id);
    firestore.collection("projects").doc(id).delete();
  }
  const GoToProject = (id)=>{
    /*Open kanban menu from project selection manu*/
    let p = projects.filter(p=> p.id==id)[0]
    setProjectMenu(true);
    setProject(p)
    console.log("opening: ",projects.filter(p=> p.id==id)[0]["name"])
  }
  /*les fonctions ci dessous ne sont pas garantis de marcher*/ 

  const goToProjects = ()=>{
    /* Go back to project selection menu */        
    //console.log(projects[project]["active"]);
    setProjectMenu(false);
  }
  const addNewItem = ()=>{
    let copyBacklogItems = projects.filter(p=> p.id==project.id)[0]["backlog"]["backlog"]["items"];
    let copyBacklog = projects.filter(p=> p.id==project.id)[0]["backlog"];
    // console.log("items: " ,copyBacklog["backlog"]["items"])
    // console.log("items: " ,Object.entries(copyBacklogItems))
    copyBacklog["backlog"]["items"]=[...copyBacklogItems,newItem]
    // console.log("new thing: " ,[...copyBacklogItems,newItem])
    firestore.collection("projects").doc(project.id).update({
      "backlog": copyBacklog,
    });
    setColumns(project['backlog'])
    console.log("DEBUG2: ",project['backlog'])
    // console.log("columns: ",project['backlog'])
    // console.log("columns: ",Object.entries(project['backlog']))
    // console.log("columns: ",project['backlog']['backlog'])
    // console.log("columns: ",Object.entries(project['backlog']['backlog']))
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
      setIsSprintActive(!isSprintActive);
      ///remove columsfrom sprints
      console.log("Start Sprint");
    }
  }

  const endSprint= ()=>{
    setIsSprintActive(!isSprintActive);
    resetCols();
    console.log("End Sprint");
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
  
  //HTLM VARIABLES
  let task_menu= <div><TaskMenu func={getNewItem} visibility={isItemCreationMenuVisible}/><div style={{textAlign: 'center',position: 'fixed',zIndex: '1',margin:'45% 0 0 45%'}}><Button  visibility={isItemCreationMenuVisible}/></div></div>;
  const toggleUi = ()=>{
    if (isItemCreationMenuVisible) {
      task_menu = 
      <div>
        <TaskMenu func={getNewItem} visibility={isItemCreationMenuVisible}/>
        <div style={{textAlign: 'center',position: 'fixed',zIndex: '1',margin:'45% 0 0 45%'}}>
              <button className='button-primary' 
                  onClick={addNewItem}>
                  Create Task 
              </button>
          </div>
      </div>
    }
    else {
      task_menu = <h1></h1>
    }
      setisItemCreationMenuVisible(!isItemCreationMenuVisible);
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
    user ? 
      <div className="connected">
    {projectMenu ?
    <div className="App">
      <header className="App-header">
        <img src={companyLogo} alt='logo'/>
        <SignOut />
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
        <h2 style={{width:"350px"}}>{project["name"]}</h2>
        <button className="button-primary" onClick={goToProjects}>Projects Menu</button>
        <button className="button-primary">View Old Sprints</button>
      </div>
      <div className="App-body">

      <DragDropContext onDragEnd={ result => onDragEnd(result, columns,setColumns,isSprintActive,project)}>
        <div className='backlog'> <h2>Backlog</h2>
        {Object.entries(project["backlog"]).map(([id, column])=>{
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
          <Sprint_info visibility={isSprintActive}/>
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
          <Sprint_menu visibility={!isSprintActive} />
          <NewCol visibility={isSprintActive} />
          </div> 
        </div>
      </DragDropContext>
      </div>
    </div>
    :

    <div className="App">
      <header className="App-header">
        <img src={companyLogo} alt='logo'/>
        <SignOut />
      </header>
      <div className="App-header-project"> 
        <h1>Project Menu</h1>
      </div>
      <div className="App-body-project"> 
        <div className="App-creating-project"> 
          <h1 className='new-project-titles'>New Project</h1>
          <div className='inputs'>
            <input id='new-project-name-input' placeholder="New project name" value={newProjectName} onChange={(e) => {setNewProjectName(e.target.value)}}/>
            <input id='new-project-start-input' placeholder="starting date : DD/MM/YYYY" value={newProjectStart} onChange={(e) => {setNewProjectStart(e.target.value)}}/>
            <input id='new-project-end-input' placeholder="ending date : DD/MM/YYYY" value={newProjectEnd} onChange={(e) => {setNewProjectEnd(e.target.value)}}/>
                <button className='button-plus' onClick={(e)=>{createNewProject(e,newProjectName,newProjectStart,newProjectEnd)}}>
                <AiOutlinePlus/> 
                </button>
          </div>
          
        </div>
        <div className="App-listing-project">
          <h1 className='new-project-titles'>Your Projects</h1>
          <div >
          {projects && projects.map(item => <div  className="App-listing-project-list">
                <h2 className='App-listing-project-title'>{item.name}</h2>
                <div className='button-listed' onClick={(e) => { GoToProject(item.id) }}>GO </div>
                <div className='button-listed-right' onClick={(e) => { deleteProject(item.id) }}><AiOutlineMinus/></div>
              </div>)}  
          </div>
        </div>
      </div>
    </div>}
    </div>
      :  <SignIn />
    
  );
}


export default App;
