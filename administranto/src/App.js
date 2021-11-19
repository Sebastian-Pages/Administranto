import React, {useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'
import companyLogo from './logo.png';

const itemsFromBackend = [
  {id: uuid(), content: 'First task'},
  {id: uuid(), content: 'Second task'}
];

const columnsFromBackEnd = 
  {
    [uuid()]: {
      name: 'Todo',
      items: itemsFromBackend
    },
    [uuid()]: {
      name: 'inProgress',
      items: []
    }
  };

const onDragEnd = (result, columns, setColumns)=>{
  if(!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index,1);
    destItems.splice(destination.index,0,removed);
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
    const [removed] = copiedItems.splice(source.index,1);
    copiedItems.splice(destination.index,0,removed);
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...column,
        items: copiedItems
    }
  })
  }

};
function App() {
  const [columns, setColumns] = useState(columnsFromBackEnd);
  return (
    <div className="App">
      <header className="App-header">
        <img src={companyLogo} alt='logo'/>
      </header>

      <div className="App-body">
      <DragDropContext onDragEnd={ result => onDragEnd(result, columns,setColumns)}>
        {Object.entries(columns).map(([id, column])=>{
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
      </DragDropContext>
      </div>

    </div>
  );
}

export default App;
