import {db} from '../firebase/fbConfig'
import {BrowserRouter, Route} from 'react-router-dom'
import useBoards from '../hooks/useBoards'
import useSprints from '../hooks/useSprints'

import BoardList from '../components/BoardList'

import Sprint from './Sprint'
import Kanban from './Kanban'

import {v4 as uuidv4} from 'uuid';


const Home = ({logOut, userId, loginWithGoogle, name, isAnon}) => 
{

    const boards = useBoards(userId)    
    // const sprints = useSprints(boards)    

    const addNewBoard = (e) => {
        e.preventDefault()
        const uid = uuidv4()

        db.collection(`users/${userId}/boards`)
            .doc(uid)
            .set({name: e.target.elements.boardName.value , endingDate: e.target.elements.endingProjectDate.value})

        e.target.elements.boardName.value = ''
        e.target.elements.endingProjectDate.value = ''

        const uid2 = uuidv4()
        db.collection(`users/${userId}/boards/${uid}/sprints`)
            .doc(uid2)
            .set({name: "New Name" , endingDate: "1", state:0})
        const columnOrder = {id: 'columnOrder', order: ['productBacklog']}
        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('columnOrder')
            .set(columnOrder)
        const productBacklog = { taskIds: [], title: 'ProductBacklog' }
        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('productBacklog')
            .set(productBacklog)

    }

    const addSprint = (e,bid) => {
        console.log("add sprint: ",bid)

        e.preventDefault()
        const uid = uuidv4()

        db.collection(`users/${userId}/boards/${bid}/sprints`)
            .doc(uid)
            .set({name: e.target.elements.boardName.value , endingDate: e.target.elements.endingProjectDate.value, state:0})
        
 
        const columnOrder = {id: 'columnOrder', order: ['productBacklog']}

        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('columnOrder')
            .set(columnOrder)

   
        const productBacklog = { taskIds: [], title: 'ProductBacklog' }

        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('productBacklog')
            .set(productBacklog)


    }

    const deleteBoard = (id) => {
        db.collection(`users/${userId}/boards`)
            .doc(id)
            .delete()
    }

    const addNewSprint = (e) => { 
    }

    const gotoSprint= (e) => {

    }

    const viewSprint= (e) => {

    }

    return boards !== null ? (
         <BrowserRouter>
                <Route exact path='/'>
                    <BoardList deleteBoard={deleteBoard} logOut={logOut} boards={boards} addNewBoard={addNewBoard} name={name}/>
                </Route>

                <Route path='/board/:boardId'>
                    <Sprint logOut={logOut} boards={boards} userId={userId} addSprint={addSprint}/>
                </Route>

                <Route path='/kanban/:boardId/:sprintId'>
                    <Kanban userId={userId} />
                </Route>

            </BrowserRouter>

    ) : <div className="spinner h-screen w-screen" />
}

export default Home