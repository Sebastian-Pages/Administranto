import { useState, useEffect } from 'react'
import { db } from '../firebase/fbConfig'

const useKanban = (userId, boardId, sprintId) => {
    const [tasks, setTasks] = useState(null)
    const [columns, setColumns] = useState(null)
    const [final, setFinal] = useState(null)
    const [sprints, setSprints] = useState(null)
    const [boardName, setBoardName] = useState('')
    const [sprintName, setSprintName] = useState('')
    const [boardEndingProjectDate, setBoardEndingProjectDate] = useState('')
    const [sprintState, setSprintState] = useState(null)


    useEffect(() => {
        return db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/tasks`)
            .onSnapshot(snap => {
                const documents = []
                snap.forEach(d => {
                    documents.push({ id: d.id, ...d.data() })
                })
                setTasks(documents)
            })
    }, [userId, boardId])


    useEffect(() => {
        return db.collection(`users/${userId}/boards`)
            .doc(boardId)
            .get()
            .then(d => setBoardName(d.data().name))
    }, [userId, boardId])

    // useEffect(() => {
    //     return db.collection(`users/${userId}/boards/${boardId}/sprints`)
    //         .doc(sprintId)
    //         .get()
    //         .then(d => setSprintName(d.data().name))
    // }, [userId, boardId])

    useEffect(() => {
        return db.collection(`users/${userId}/boards`)
            .doc(boardId)
            .get()
            .then(d => setBoardEndingProjectDate(d.data().endingDate))
    }, [userId, boardId])

    //bug quand je le met :()
    // useEffect(() => {
    //     return db.collection(`users/${userId}/boards/${boardId}/sprints`)
    //         .doc(sprintId)
    //         .get()
    //         .then(d => setSprintState(d.data().state))
    // }, [userId, boardId])

    // useEffect(() => {
    //     return db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}`)
    //         .doc(boardId)
    //         .get()
    //         .then(d => setBoardEndingProjectDate(d.data().endingDate))
    // }, [userId, boardId])

    useEffect(() => {
        return db.collection(`users/${userId}/boards/${boardId}/sprints`)
            .onSnapshot(snap => {
                const documents = []
                snap.forEach(d => {
                    documents.push({ id: d.id, ...d.data() })
                })
                setSprints(documents)
            })
    }, [userId, boardId])

    useEffect(() => {
        return db.collection(`users/${userId}/boards/${boardId}/sprints/${sprintId}/columns`)
            .onSnapshot(snap => {
                const documents = []
                snap.forEach(d => {
                    documents.push({ id: d.id, max: d.max, ...d.data()})
                })
                setColumns(documents)
            })
    }, [userId, boardId])


    useEffect(() => {
        if (tasks && columns) {
            const finalObject = {}

            const co = columns.find(c => c.id === 'columnOrder')
            const cols = columns.filter(c => c.id !== 'columnOrder')
            
            finalObject.columnOrder = co?.order
            finalObject.columns = {}
            finalObject.tasks = {}

            tasks.forEach(t => finalObject.tasks[t.id] = t)
            cols.forEach(c => finalObject.columns[c.id] = c)

            setFinal(finalObject)
        }
    }, [tasks, columns])


    return { initialData: final, setInitialData: setFinal, boardName, boardEndingProjectDate ,sprints ,sprintState}

}

export default useKanban