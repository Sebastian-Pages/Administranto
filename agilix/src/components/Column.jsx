import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'

import {Bin, Exclaim} from './Icons'

import {db, firebase} from '../firebase/fbConfig'
import {debounce} from '../utils'
import {useState, useRef} from 'react'
import Modal from './Modal'


const Column = ({ column, tasks, allData, boardId, userId, filterBy, index, max, sprintId }) => {

    const [modal, setModal] = useState(false)
    const [editingCol, setEditing] = useState(false)
    const colInput = useRef(null)

    const deleteCol = (colId, tasks) => {
        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)        
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayRemove(colId)})   

        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
            .doc(colId)
            .delete()

        //Extract and delete its tasks
        tasks.forEach(t => {
            db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/tasks`)
            .doc(t)
            .delete()
        })
    }

    const changeColName = debounce((e, colId) => {
        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
            .doc(colId)
            .update({title: e.target.value})
    }, 7000)

    const changeColMax = debounce((e, colId) => {
        db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
            .doc(colId)
            .update({max: e.target.value})
    }, 7000)

    const moveToInp = () => {
        setEditing(true)
        setTimeout(()=>{
            colInput.current.focus()
        }, 50)
    }


    return (
        <>
            <Draggable draggableId={column.id} index={index} key={column.id}>
                {provided => 
                    (column.title==="ProductBacklog")?
                    <div {...provided.draggableProps} ref={provided.innerRef} className='mr-5'>
                        <div style={{background: '#edf2ff',borderRadius:' 0 0 10px 10px'}}>
                            <div {...provided.dragHandleProps} className='bg-gradient-to-r from-purple-700 via-purple-700 to-pink-400 flex items-center justify-between px-4 py-1 rounded-t-lg'>
                               <h2 className={`p-2 text-blue-100 truncate font-black text-3xl`}>{column.title} </h2>
                            </div>
                            <Droppable droppableId={column.id} type='task'>                          
                                {(provided, snapshot) => 
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-sm h-full py-4 px-2 rounded-b-lg ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-green-400 via-green-200 to-green-100' : ''}`}>
                                        {tasks.map((t, i) =>  <Task allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy} sprintId={sprintId}/> )}
                                        {provided.placeholder}
                                    </div>
                                }
                            </Droppable>
                        </div>
                        <Modal modal={modal} setModal={setModal} ariaText='Column Delete confirmation'>
                            <div className='md:px-12'>
                                <div className='text-yellow-600 mb-2'>
                                    <Exclaim />
                                </div>
                                <h2 className='text-base md:text-2xl text-gray-900 mb-2'>Are you sure you want to delete this column?</h2>
                                <h3 className="text-red-600 text-sm md:text-lg">This column and its tasks will be permanently deleted and it cannot be undone.</h3>
                                <div className="my-8 flex">
                                    <button className='border border-red-700 text-red-600 px-2 py-1 rounded-sm mr-4 text-sm md:text-base' onClick={()=>deleteCol(column.id, tasks)}>Yes, delete</button>
                                    <button className='bg-blue-800 text-gray-100 px-2 py-1 rounded-sm text-sm md:text-base' onClick={()=>setModal(false)}>No, go back</button>
                                </div>
                            </div>
                        </Modal>
                    </div>:
                    <div {...provided.draggableProps} ref={provided.innerRef} className='mr-5'>
                        <div style={{background: '#edf2ff',borderRadius:' 0 0 10px 10px'}}>
                            <div {...provided.dragHandleProps} className='bg-gradient-to-r from-purple-700 via-purple-700 to-pink-400 flex items-center justify-between px-4 py-1 rounded-t-lg'>
                               <input ref={colInput} className={`sm:text-xl text-blue-700 text-lg px-2 w-10/12 ${editingCol ? '' : 'hidden'}`} onBlur={()=>setEditing(false)} type="text" defaultValue={column.title} onChange={(e)=>changeColName(e, column.id)} />
                               <h2 className={`p-2 text-blue-100 truncate font-black text-3xl ${editingCol ? 'hidden' : ''}`} onClick={moveToInp}>{column.title} </h2>
                               <input ref={colInput} className={`text-purple-700 bg-purple text-lg px-2 w-7 rounded-lg ${editingCol ? 'hidden' : ''} `} onBlur={()=>setEditing(false)} type="int" defaultValue={column.max} onChange={(e)=>changeColMax(e, column.id)} />
                                <div className={`text-blue-700 hover:text-blue-50 cursor-pointer ${editingCol ? 'hidden' : ''}`} onClick={()=>setModal(true)}>
                                    <Bin />
                                </div>
                            </div>
                            <Droppable droppableId={column.id} type='task'>                          
                                {(provided, snapshot) => 
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-sm h-full py-4 px-2 rounded-b-lg ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-green-400 via-green-200 to-green-100' : ''}`}>
                                        {tasks.map((t, i) =>  <Task allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy} sprintId={sprintId}/> )}
                                        {provided.placeholder}
                                    </div>
                                }
                            </Droppable>
                        </div>
                        <Modal modal={modal} setModal={setModal} ariaText='Column Delete confirmation'>
                            <div className='md:px-12'>
                                <div className='text-yellow-600 mb-2'>
                                    <Exclaim />
                                </div>
                                <h2 className='text-base md:text-2xl text-gray-900 mb-2'>Are you sure you want to delete this column?</h2>
                                <h3 className="text-red-600 text-sm md:text-lg">This column and its tasks will be permanently deleted and it cannot be undone.</h3>
                                <div className="my-8 flex">
                                    <button className='border border-red-700 text-red-600 px-2 py-1 rounded-sm mr-4 text-sm md:text-base' onClick={()=>deleteCol(column.id, tasks)}>Yes, delete</button>
                                    <button className='bg-blue-800 text-gray-100 px-2 py-1 rounded-sm text-sm md:text-base' onClick={()=>setModal(false)}>No, go back</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                }
            </Draggable>
        </>
    )
}

export default Column





