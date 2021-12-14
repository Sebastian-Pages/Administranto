

import {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {db, firebase} from '../firebase/fbConfig'
import {Link} from 'react-router-dom'
import Column from '../components/Column'
import Modal from '../components/Modal'
import AddTask from '../screens/AddTask'
import {Add, Github} from '../components/Icons'
import companyLogo from '../styles/logo-sm.png';

import useKanbanData from '../hooks/useKanbanData'
import {debounce} from '../utils'


const Sprint = ({logOut, boards,userId ,addSprint}) => {
    
    const {boardId} = useParams()
    const [modal, setModal] = useState(false)
    const {initialData, setInitialData, boardName , boardEndingProjectDate, sprints,sprintState, sprintName} = useKanbanData(userId, boardId,null)
    const [filter, setFilter] = useState(null)
    const filters = ['high', 'medium', 'low']

    // sert plus à rien mais le code peu etre utile
    // function NewSprint(props) {
    //     if (sprints!==null)
    //         console.log("aaa: ",sprints.filter(state=>state===0))
    //     const isLoggedIn = props.isLoggedIn;
    //     if (isLoggedIn) {
    //       return (
    //   <form onSubmit={(e) => addSprint(e,boardId)} autoComplete='off' className='my-4 sm:my-8 justify-items-center bg-white p-16 rounded-lg shadow-md'>
    //       <label htmlFor="boardName" className='block text-xl text-purple-600 font-black text-3xl underline'>Start a New Sprint</label>
    //       <div className="flex items-center mt-2">
    //           <input required type="text" name='boardName' className='bg-transparent border border-gray-500 px-2 py-1.5 rounded-l-sm placeholder-gray-700' placeholder='Enter a sprint name' />
    //           <input required type="date" name='endingProjectDate' className='bg-transparent border border-gray-500 px-2 py-1.5 rounded-l-sm placeholder-gray-700' />
    //           <button type='submit' className='bg-purple-600 hover:bg-purple-900 text-purple-50 border border-purple-500 rounded-r-sm px-2 py-1.5' >Add</button>
    //       </div>
    //   </form>);
    //     }
    //     return (<div></div>);
    //   }

	if(navigator.onLine !== true)
    {
        return (
                <div className='p-12'>
                    <div className="my-12">
                        <h1 className='text-xl text-red-800'>The network is disconnected. Connect and try again</h1>
                    </div>
                </div>
            )
    }



    else return (<>
        <div className='bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 h-20 '>
            <div className='content-end'>
                <img className='p-5 inline float-left ' src={companyLogo} alt='logo'/>
                <button className='m-6 inline float-right border border-purple-800 hover:bg-purple-700 hover:text-white text-purple-800 px-2 py-1 rounded-sm text-sm sm:text-base' onClick={logOut}>Log out</button>
            </div>
        </div>
        <div className='bg-gradient-to-br from-pink-200 via-orange-100 to-yellow-100 h-screen px-6 py-4 sm:py-20 sm:px-24 '>
            <div className='flex flex-col my-2 '>
                <div className='flex justify-between'>
                <Link to='/' className='inline p-2 text-xl bg-purple-600 font-black border-4 rounded-lg border-purple-600 text-white hover:bg-purple-400 py-3 ring-1 rounded-l-lg ring-purple-600 ring-offset-0'>Project Menu</Link>

                    {/* <h1 className='text-xl sm:text-3xl bg-gradient-to-r from-indigo-500 to-primary bg-clip-text text-transparent'>Project: {boards.map(b => b.id==boardId ? b.name : b}</h1> */}
                </div>
                <div className="my-12 grid justify-items-center bg-white p-16 rounded-lg shadow-md">
                    <h1 className='text-xl text-purple-600 font-black text-3xl underline p-10' >Your Sprints</h1>
                    <div className="flex flex-wrap mt-2">
                        {/* ICI ON MET LES SPTINS */}
                        {/* {console.log("s: ",sprints)} */}
                     
                        {sprints && sprints.map(s => 
    
                            <div className='m-4'>
                                <div className={`${s.state===0 ? 'bg-blue-100' : ''} ${s.state===1 ? 'bg-green-200' : ''} ${s.state===2 ? 'bg-red-200' : ''} bg-pink text-gray-700 mb-3 m-4 py-4 px-6 rounded-lg shadow-md w-full `} key={s.id}>
                                    <div className="flex items-center justify-between">                  
                                        <Link to={`/kanban/${boardId}/${s.id}`}><h2 className='text-lg sm:text-2xl text-gray-700 hover:text-gray-900'>{s.name}</h2></Link>
                                        <div  className='text-red-500 ml-6 cursor-pointer hover:text-red-700'>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        )}
                        {/* {boards.length === 0 ? <h1 className='text-gray-700'>No Boards created yet. Why don't you go ahead and create one?</h1>  : null} */}
                    </div>
                </div>
            </div>
            
            {/* <form onSubmit={(e) => addSprint(e,boardId)} autoComplete='off' className='my-4 sm:my-8 justify-items-center bg-white p-16 rounded-lg shadow-md'>
                <label htmlFor="boardName" className='block text-xl text-purple-600 font-black text-3xl underline'>Start a New Sprint</label>
                <div className="flex items-center mt-2">
                    <input required type="text" name='boardName' className='bg-transparent border border-gray-500 px-2 py-1.5 rounded-l-sm placeholder-gray-700' placeholder='Enter a sprint name' />
                    <input required type="date" name='endingProjectDate' className='bg-transparent border border-gray-500 px-2 py-1.5 rounded-l-sm placeholder-gray-700' />
                    <button type='submit' className='bg-purple-600 hover:bg-purple-900 text-purple-50 border border-purple-500 rounded-r-sm px-2 py-1.5' >Add</button>
                </div>
            </form> */}
        </div>
        </>)
}

export default Sprint


