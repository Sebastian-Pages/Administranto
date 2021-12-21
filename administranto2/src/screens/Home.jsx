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
            .set({name: "New Name" , endingDate: "", startingDate: "", state:0})

        const columnOrder = {id: 'columnOrder', order: ['productBacklog','afaire','enCours','termine']}

        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('columnOrder')
            .set(columnOrder)

        const productBacklog = { taskIds: [], title: 'ProductBacklog' ,max:null,id:"productBacklog"}
        const afaire= {title: 'À Faire', taskIds: [],max:null,id:"afaire"}
        const enCours= {title: 'En Cours', taskIds: [],max:null,id:"enCours"}
        const termine= {title: 'Terminé', taskIds: [],max:null,id:"termine"}
        
        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('productBacklog')
            .set(productBacklog)
        
        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('afaire')
            .set(afaire)

        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('enCours')
            .set(enCours)

        db.collection(`users/${userId}/boards/${uid}/sprints/${uid2}/columns`)
            .doc('termine')
            .set(termine)

    }

    const addSprint = (bid,productBacklog,tasks) => {
        console.log("adding sprint to ",bid)

        // e.preventDefault()
        const uid = uuidv4()

        db.collection(`users/${userId}/boards/${bid}/sprints`)
            .doc(uid)
            .set({name: "New Sprint" , endingDate: "", startingDate: "", state:0})
        
 
        const columnOrder = {id: 'columnOrder', order: ['productBacklog','afaire','enCours','termine']}
        const afaire= {title: 'À Faire', taskIds: [],max:null,id:"afaire"}
        const enCours= {title: 'En Cours', taskIds: [],max:null,id:"enCours"}
        const termine= {title: 'Terminé', taskIds: [],max:null,id:"termine"}

        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('columnOrder')
            .set(columnOrder)

            db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('afaire')
            .set(afaire)

        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('enCours')
            .set(enCours)

        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('termine')
            .set(termine)

        // const productBacklog = { taskIds: [], title: 'ProductBacklog' }
        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/columns`)
            .doc('productBacklog')
            .set(productBacklog)


        // Atention on garde tous les items mais comme ils sont affiché quand la bonne col
        // ca va marcher mais c'est pas du tout
        // il fait filtrer mais balec

        db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/tasks`)
            .doc(uid)
            .set({title:"a", description:"a" ,priority:"a" , todos: [], dateAdded: 0 })
        
        
        // console.log("foreach: ",element)
        
        //ça na pas marcher
        // Object.entries(tasks).map(task => {
        // db.collection(`users/${userId}/boards/${bid}/sprints/${uid}/tasks`)
        //     .doc(task[0])
        //     .update(task[1]) // ici update n'ajoute pas
        // });

        Object.entries(tasks).map(task => {
            addTask2 (bid, uid,task[0],task[1].title, task[1].priority , task[1].description,task[1].dateAdded) 
        });
    }

    const addTask2 = (bId, sId,taskId,title, priority , description,dateAdded) => {
        db.collection(`users/${userId}/boards/${bId}/sprints/${sId}/tasks`)
        	.doc(taskId)
        	.set({title,  priority , description, todos: [], dateAdded })
    }


    const deleteBoard = (id) => {
        db.collection(`users/${userId}/boards`)
            .doc(id)
            .delete()
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
                    <Kanban logOut={logOut} userId={userId} addSprint={addSprint} />
                </Route>

            </BrowserRouter>

    ) : <div className="spinner h-screen w-screen" />
}

export default Home