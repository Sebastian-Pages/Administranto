import { useState, useEffect } from 'react'
import { db } from '../firebase/fbConfig'

const useSprints = (userId, board) => {
    const [sprints, setSprints] = useState(null)
    console.log("hook boards: ", board)

    useEffect(() => {
        return db.collection(`users`).doc(userId).get()
            .then(doc => {
                try {
                    if (doc) {
                        return db.collection(`users/${doc.id}/boards/boardId`).onSnapshot(snap => {
                            const documents = []
                            snap.forEach(doc => documents.push({ id: doc.id, ...doc.data() }))
                            setSprints(documents)
                        })
                    } else return
                } catch (e) {
                    console.log(e)
                }
            })
    }, [userId])


    return sprints
}

export default useSprints