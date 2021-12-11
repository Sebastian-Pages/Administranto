import React, { useState } from 'react';
import { v4 as uuid } from 'uuid'

export const onDragEnd = (result, columns, setColumns, sprint) => {

    if (!result.destination) return;
    const { source, destination } = result;

    if (sprint && result.destination.droppableId === "100") {
        console.log("Tried to put task in backlog during Sprint", result.destination.droppableId)
        return;
    }
    if (sprint && result.source.droppableId === "100" && result.destination.droppableId !== "42") {
        console.log("Tried to take task out of backlog during Sprint", result.destination.droppableId)
        return;
    }
    if (sprint && result.source.droppableId !== "100" && result.destination.droppableId == "42") {
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

    } else {
        const column = columns[source.droppableId];
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
    }
};
export function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}