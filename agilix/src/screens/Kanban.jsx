
import {useState,useCallback} from 'react'
import {useParams} from 'react-router-dom'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {db, firebase} from '../firebase/fbConfig'
import {Link} from 'react-router-dom'
import Column from '../components/Column'
import Modal from '../components/Modal'
import AddTask from './AddTask'
import {Add, Github} from '../components/Icons'
import companyLogo from '../styles/logo-sm.png';

import useKanbanData from '../hooks/useKanbanData'
import {debounce} from '../utils'


const Kanban = ({logOut,userId,addSprint}) => {
    
    const {boardId} = useParams()
    const {sprintId} = useParams()
    const [modal, setModal] = useState(false)
    const {initialData, setInitialData, boardName , boardEndingProjectDate, sprints,sprintState,sprintName,startingDate,endingDate } = useKanbanData(userId, boardId,sprintId)
    const [filter, setFilter] = useState(null)
    const filters = ['high', 'medium', 'low']



    const onDragEnd = (result) => {
        const {destination, source, draggableId} = result
        if(!destination) return
        if(sprintState===2)return
        if(result.type === 'task') {
            //sprintState===0
            const startColumn = initialData.columns[source.droppableId]    
            const endColumn = initialData.columns[destination.droppableId]    

            if(sprintState===0){
                if(startColumn === endColumn){
                    const newTaskIds = Array.from(endColumn.taskIds)

                    newTaskIds.splice(source.index, 1)
                    newTaskIds.splice(destination.index, 0, draggableId)


                    const newColumn = {
                        ...endColumn, taskIds: newTaskIds
                    }

                    const newState = {
                        ...initialData, 
                        columns: {...initialData.columns, [endColumn.id]: newColumn}
                    }

                    setInitialData(newState)
                    db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(startColumn.id)
                        .update({taskIds: newTaskIds})
                    return
                }

                //console.log(endColumn.taskIds.length+1);
                if(endColumn.max){
                    if ( endColumn.taskIds.length < endColumn.max ){
                        console.log("test")
                        const startTaskIDs = Array.from(startColumn.taskIds)
                        startTaskIDs.splice(source.index, 1)
                        const newStart = {
                            ...startColumn, taskIds: startTaskIDs
                        }


                        const finishTaskIDs = Array.from(endColumn.taskIds)
                        finishTaskIDs.splice(destination.index, 0, draggableId)
                        const newFinish = {
                            ...endColumn, taskIds: finishTaskIDs
                        }


                        const newState = {
                            ...initialData, 
                            columns: {
                                ...initialData.columns,
                                [startColumn.id]: newStart,
                                [endColumn.id]: newFinish
                            }
                        }

                        setInitialData(newState)

                        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newStart.id)
                            .update({taskIds: startTaskIDs})

                        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newFinish.id)
                            .update({taskIds: finishTaskIDs})
                    }
                }else{
                    const startTaskIDs = Array.from(startColumn.taskIds)
                    startTaskIDs.splice(source.index, 1)
                    const newStart = {
                        ...startColumn, taskIds: startTaskIDs
                    }


                    const finishTaskIDs = Array.from(endColumn.taskIds)
                    finishTaskIDs.splice(destination.index, 0, draggableId)
                    const newFinish = {
                        ...endColumn, taskIds: finishTaskIDs
                    }


                    const newState = {
                        ...initialData, 
                        columns: {
                            ...initialData.columns,
                            [startColumn.id]: newStart,
                            [endColumn.id]: newFinish
                        }
                    }

                    setInitialData(newState)

                    db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newStart.id)
                        .update({taskIds: startTaskIDs})

                    db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newFinish.id)
                        .update({taskIds: finishTaskIDs})
                }
            //sprintState===1 
            }else{
                //console.log("STATE NI 2 NI 1")
                if(startColumn === endColumn){
                    const newTaskIds = Array.from(endColumn.taskIds)

                    newTaskIds.splice(source.index, 1)
                    newTaskIds.splice(destination.index, 0, draggableId)


                    const newColumn = {
                        ...endColumn, taskIds: newTaskIds
                    }

                    const newState = {
                        ...initialData, 
                        columns: {...initialData.columns, [endColumn.id]: newColumn}
                    }

                    setInitialData(newState)
                    db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(startColumn.id)
                        .update({taskIds: newTaskIds})
                    return
                }

                //console.log(endColumn.taskIds.length+1);
                if(endColumn.max){
                    if ( endColumn.taskIds.length < endColumn.max ){
                        const startTaskIDs = Array.from(startColumn.taskIds)
                        startTaskIDs.splice(source.index, 1)
                        const newStart = {
                            ...startColumn, taskIds: startTaskIDs
                        }


                        const finishTaskIDs = Array.from(endColumn.taskIds)
                        finishTaskIDs.splice(destination.index, 0, draggableId)
                        const newFinish = {
                            ...endColumn, taskIds: finishTaskIDs
                        }


                        const newState = {
                            ...initialData, 
                            columns: {
                                ...initialData.columns,
                                [startColumn.id]: newStart,
                                [endColumn.id]: newFinish
                            }
                        }

                        setInitialData(newState)

                        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newStart.id)
                            .update({taskIds: startTaskIDs})

                        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newFinish.id)
                            .update({taskIds: finishTaskIDs})
                    }   
                }else{
                    if ( destination.droppableId ==="productBacklog" || source.droppableId ==="productBacklog" ){}else{
                        const startTaskIDs = Array.from(startColumn.taskIds)
                        startTaskIDs.splice(source.index, 1)
                        const newStart = {
                            ...startColumn, taskIds: startTaskIDs
                        }


                        const finishTaskIDs = Array.from(endColumn.taskIds)
                        finishTaskIDs.splice(destination.index, 0, draggableId)
                        const newFinish = {
                            ...endColumn, taskIds: finishTaskIDs
                        }


                        const newState = {
                            ...initialData, 
                            columns: {
                                ...initialData.columns,
                                [startColumn.id]: newStart,
                                [endColumn.id]: newFinish
                            }
                        }

                        setInitialData(newState)

                        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newStart.id)
                            .update({taskIds: startTaskIDs})

                        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`).doc(newFinish.id)
                            .update({taskIds: finishTaskIDs})
                    }
                }
            }
        }else {
        if (source.index===0 || destination.index===0)
        {
            return
        }
        else{
            const newColumnOrder = Array.from(initialData.columnOrder)
            newColumnOrder.splice(source.index, 1)
            newColumnOrder.splice(destination.index, 0, draggableId)
            setInitialData({...initialData, columnOrder: newColumnOrder})
            db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
                .doc('columnOrder')
                .update({order: newColumnOrder})
        }

    }
}



    const addCol = (e) => {
        e.preventDefault()
        const newColumnName = e.target.elements.newCol.value   
        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
            .doc(newColumnName)
            .set({title: newColumnName, taskIds: []})

        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayUnion(newColumnName)})

        e.target.elements.newCol.value = ''    
    }

    //TO DO
    /*const addSprint = (e) => {
        e.preventDefault()
        const newColumnName = e.target.elements.newCol.value   
        db.collection(`users/${userId}/boards/${boardId}/sprints`)
            .doc(newColumnName)
            .set({title: newColumnName, taskIds: []})

        db.collection(`users/${userId}/boards/${boardId}/sprints`)
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayUnion(newColumnName)})

        e.target.elements.newCol.value = ''    
    }*/

    const startSprint= () => {
        if(sprintState===1){
            // console.log('test fct: ',initialData.tasks)
            Object.entries(initialData.tasks).map(task => {
                console.log("start sprint: ",task[0],task[1])
            });
            // console.log('test fct: ',{ taskIds: [], title: 'ProductBacklog' ,max:null,id:"productBacklog"})
            addSprint(boardId,initialData.columns.productBacklog,initialData.tasks)
        }
        if (sprintState<2){
        db.collection(`users/${userId}/boards/${boardId}/sprints/`)
            .doc(sprintId)
            .update({state: sprintState+1})}
        console.log('State:', sprintState)
        // window.location.reload();

        
    }

    const changeBoardName = debounce((ev) => {
        db.collection(`users/${userId}/boards`)
            .doc(boardId)
            .update({name: ev})
    }, 7000);

    const changeSprintName = debounce((ev) => {
        db.collection(`users/${userId}/boards/${boardId}/sprints/`)
            .doc(sprintId)
            .update({name: ev})
    }, 7000);

    const changeSprintStartingDate = debounce((ev) => {
         db.collection(`users/${userId}/boards/${boardId}/sprints/`)
             .doc(sprintId)
             .update({startingDate: ev})
    }, 7000);

    const changeSprintEndingDate = debounce((ev) => {
        db.collection(`users/${userId}/boards/${boardId}/sprints/`)
            .doc(sprintId)
            .update({endingDate: ev})
   }, 7000);


	return (
		<>
            {initialData ? 
                (
                <>
                    <Modal modal={modal} setModal={setModal} ariaText='Add a new task'>
                        <AddTask boardId={boardId} userId={userId} allCols={initialData.columnOrder} sprintId={sprintId} close={()=>setModal(false)} />
                    </Modal>
                    
                    <main className="pb-2 h-screen w-screen">
                    <div className='bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-300 h-20'>
                    <span>
                        <img className='p-5 inline' src={companyLogo} alt='logo'/>
                        
                        <p className="inline">ENDING DATE : </p>
                        <input className="inline" type="text" defaultValue={boardEndingProjectDate} />
                        <button className='px-3 border border-purple-800 hover:bg-purple-700 hover:text-white text-purple-800 px-2 py-1 rounded-sm text-sm sm:text-base' onClick={logOut}>Log out</button>
                    </span>
                    </div>
                        <div className='flex flex-col h-full'>
                            <header className='bg-white z-10 text-sm sm:text-base py-5 mx-3 md:mx-6'>
                                <div className='flex flex-wrap justify-between items-center'>
                                    <span className='text-xl'>
                                    <Link to='/' className='inline p-2 text-xl bg-purple-600 font-black border-4 rounded-l-lg border-purple-600 text-white hover:bg-purple-400 py-3 ring-1 rounded-l-lg ring-purple-600 ring-offset-0'>Project Menu</Link>
                                    <input type="text" defaultValue={boardName} className='inline p-2 text-xl text-purple-600 font-black ring-4 rounded-r-lg ring-purple-600 ring-offset-1 py-2 w-48 h-12 truncate' onChange={(e)=>changeBoardName(e.target.value)} />
                                        {/* <div className='flex items-center'>
                                            <p>ENDING DATE :  </p>
                                            <input type="text" defaultValue={boardEndingProjectDate} />
                                        </div> */}
                                        <button className={`${sprintState===0 ? 'bg-blue-400' : sprintState===1 ? 'bg-green-400' : 'bg-red-400'} ml-4 p-2 text-xl font-black border-4 rounded-l-lg border-purple-600 text-white hover:bg-purple-400 py-3`} onClick={()=>startSprint()}>{sprintState===0 ? "Start Sprint": sprintState===1 ?"End Sprint":"Sprint had Ended"}</button>
                                        <input type="text" defaultValue={sprintName} className={`inline p-2 text-xl text-purple-600 font-black ring-4 rounded-r-lg ring-purple-600 ring-offset-1 py-2 w-32 h-12 truncate `} onChange={(e)=>changeSprintName(e.target.value)} disabled={sprintState>1}/>
                                        <input required type="date" defaultValue={startingDate} name='endingDate' className='inline p-2 text-xl text-purple-600 bg-white font-black ring-4 rounded-r-lg ring-purple-600 ring-offset-1 py-2 w-32 h-12' onChange={(e)=>changeSprintStartingDate(e.target.value)} disabled={sprintState>1}/>
                                        <input required type="date" defaultValue={endingDate} name='startingDate' className='inline p-2 text-xl text-purple-600 bg-white font-black ring-4 rounded-r-lg ring-purple-600 ring-offset-1 py-2 w-32 h-12' onChange={(e)=>changeSprintEndingDate(e.target.value)} disabled={sprintState>1}/>

                                        {/* <input type="text" defaultValue={"sprintName"} className='p-2 text-xl text-grey-600 font-black ring-4 rounded-r-lg ring-purple-600 ring-offset-0 py-3 w-48 truncate' onChange={(e)=>changeBoardName(e.target.value)} />
                                        <input type="text" defaultValue={""} className='p-2 text-xl text-grey-600 font-black ring-4 rounded-r-lg ring-purple-600 ring-offset-0 py-3 w-48 truncate' onChange={(e)=>changeBoardName(e.target.value)} /> */}
                                        <Link to={`/board/${boardId}`}className=' ml-4 p-2 text-xl bg-purple-600 font-black border-4 rounded-lg border-purple-600 text-white hover:bg-purple-400 py-3'>View Sprints</Link>
                                        
                                        {/* <Link to='/' className=' p-2 text-3xl text-purple-600 font-black border-4 rounded-l-lg border-purple-500 hover:text-purple-300 py-3'>Boards </Link>
                                        <input type="text" defaultValue={boardName} className='p-2 text-3xl text-purple-600 font-black ring-4 rounded-r-lg ring-purple-500 ring-offset-1 py-3 w-1/2 truncate' onChange={(e)=>changeBoardName(e.target.value)} />
                                        <div className='flex items-center'>
                                            <p>ENDING DATE :  </p>
                                            <input type="text" defaultValue={boardEndingProjectDate} />
                                        </div> */}
                                    </span> 
                                    <div className='flex flex-wrap items-center sm:space-x-9'>
                                        {/* <div className="flex items-center mt-2 sm:mt-0 ">
                                            <h3 className='text-gray-500 mr-2'>Show Priority: </h3>
                                            <div className='space-x-1 text-blue-900 flex bg-indigo-50 rounded-sm'>
                                                {filters.map(f => <div key={f} className={`px-3  border-black py-1 hover:bg-blue-600 hover:text-blue-50 cursor-pointer capitalize ${filter === f ? 'bg-blue-600 text-blue-50' : ''}`} onClick={() => setFilter(f==='all' ? null : f)}>{f}</div>)}
                                                {filter ? <div className='px-2 py-1 cursor-pointer hover:text-blue-700 rounded-sm' onClick={() => setFilter(null)}>All</div> : null}
                                            </div>
                                        </div>
                                        <div className='flex items-center text-blue-900 hover:bg-blue-600 hover:text-blue-50 bg-indigo-50 rounded-sm px-2 py-1 mr-3 hidden sm:flex'>
                                            <Github />
                                            <a href='https://github.com/drkPrince/agilix' target='blank'>Github</a>
                                        </div> */}
                                        <div className='text-white bg-gradient-to-br from-primary via-purple-600 to-indigo-600 transform hover:scale-110 transition-all duration-300 rounded-full p-2 sm:p-5 fixed bottom-6 right-6 sm:static' onClick={()=>setModal(true)}>
                                            <p>Add a new Task</p>
                                            {/* <Add /> */}
                                        </div>
                                    </div>
                                </div>
                            </header>
                            
                            
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId='allCols' type='column' direction='horizontal'>
                                    {provided => 
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid overflow-x-auto h-full items-start pt-3 md:pt-2 mx-1 md:mx-6 auto-cols-220 md:auto-cols-270 grid-flow-col" style={{height: '90%'}}>
                                            {
                                                initialData?.columnOrder.map((col, i) => {
                                                    const column = initialData?.columns[col]
                                                    const tasks = column.taskIds?.map(t => t)
                                                    return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} index={i} max={column.max} sprintId={sprintId} sprintState={sprintState}/>
                                                }) 
                                            }
                                            {provided.placeholder}
                                            <form onSubmit={addCol} autoComplete='off' className='ml-2'>
                                                <input maxLength='20' className='truncate bg-transparent placeholder-purple-500 text-indigo-800 bg-indigo-50 px-2 outline-none py-1 rounded-lg ring-2 focus:ring-indigo-500' type="text" name='newCol' placeholder='Add a new column' />
                                            </form>
                                        </div>
                                    }
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </main>

                    </>
                )
                :
                <div className="spinner h-screen w-screen" />
            }
        </>
    )
}

export default Kanban


