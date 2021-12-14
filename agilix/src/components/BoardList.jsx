import { Link } from 'react-router-dom'
import {useState} from 'react'

import Modal from './Modal'
import {Exclaim, Bin} from './Icons'

import companyLogo from '../styles/logo-sm.png';

const BoardList = ({ logOut, boards, addNewBoard, deleteBoard, name }) => 
{
    const [modal, setModal] = useState(false)
    const [idToBeDeleted, setId] = useState(null)

    const removeBoard = (id) => {
        setModal(false)
        deleteBoard(id)
    }

    const openDeleteModal = (id) => {
        setId(id)
        setModal(true)
    }

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
    // flex items-stretch 


    else return (<>
            <div className='bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 h-20 '>
                <div className='content-end'>
                    <img className='p-5 inline float-left ' src={companyLogo} alt='logo'/>
                    <button className='m-6 inline float-right border border-purple-800 hover:bg-purple-700 hover:text-white text-purple-800 px-2 py-1 rounded-sm text-sm sm:text-base' onClick={logOut}>Log out</button>
                </div>
            </div>
        <div className='bg-gradient-to-br from-pink-200 via-orange-100 to-yellow-100 h-screen px-6 py-4 sm:py-20 sm:px-24 '>
            <Modal modal={modal} setModal={setModal} ariaText='Board Delete confirmation'>
                <div className='md:px-12'>
                    <div className='text-yellow-600 mb-2'>
                        <Exclaim />
                    </div>
                    <h2 className='text-base md:text-3xl text-gray-900 mb-2'>Are you sure you want to delete this Board?</h2>
                    <h3 className="text-red-600 text-sm md:text-lg">All of it's data will be permanently deleted and it cannot be undone.</h3>
                    <div className="my-8 flex">
                        <button className='border border-red-700 text-red-600 px-2 py-1 rounded-sm mr-4 text-sm md:text-base' onClick={()=>removeBoard(idToBeDeleted)}>Yes, delete</button>
                        <button className='bg-blue-800 text-gray-100 px-2 py-1 rounded-sm text-sm md:text-base' onClick={()=>setModal(false)}>No, go back</button>
                    </div>
                </div>
            </Modal>
            <div className='flex flex-col my-2 '>
                <div className='flex justify-between'>
                    <h1 className='text-xl sm:text-3xl bg-gradient-to-r from-indigo-500 to-primary bg-clip-text text-transparent'>Welcome, {name ? name.split(' ')[0] : 'Stranger'}</h1>
                </div>
                <div className="my-12 grid justify-items-center bg-white p-16 rounded-lg shadow-md">
                    <h1 className='text-xl text-purple-600 font-black text-3xl underline p-10' >Your Projects</h1>
                    <div className="flex flex-wrap mt-2">
                        {boards.map(b => 
                            <div className='bg-white text-gray-700 mb-3 mr-4 py-4 px-6 rounded-lg shadow-md w-full sm:w-auto' key={b.id}>
                                <div className="flex items-center justify-between">
                                    <Link to={`/board/${b.id}`}><h2 className='text-lg sm:text-2xl text-gray-700 hover:text-gray-900'>{b.name}</h2></Link>
                                    <div onClick={() => openDeleteModal(b.id)} className='text-red-500 ml-6 cursor-pointer hover:text-red-700'>
                                        <Bin />
                                    </div>
                                </div>
                            </div>
                        )}
                        {boards.length === 0 ? <h1 className='text-gray-700'>No Boards created yet. Why don't you go ahead and create one?</h1>  : null}
                    </div>
                </div>
            </div>
            <form onSubmit={addNewBoard} autoComplete='off' className='my-4 sm:my-8 justify-items-center bg-white p-16 rounded-lg shadow-md'>
                <label htmlFor="boardName" className='block text-xl text-purple-600 font-black text-3xl underline p-10'>Make a new project</label>
                <div className="flex items-center mt-2">
                    <input required type="text" name='boardName' className='bg-transparent border border-gray-500 px-2 py-1.5 rounded-l-sm placeholder-gray-700' placeholder='Enter a project name' />
                    <input required type="date" name='endingProjectDate' className='bg-transparent border border-gray-500 px-2 py-1.5 rounded-l-sm placeholder-gray-700' />
                    <button type='submit' className='bg-purple-600 hover:bg-purple-900 text-purple-50 border border-purple-500 rounded-r-sm px-2 py-1.5' >Add</button>
                </div>
            </form>
        </div>
        </>)
}

export default BoardList