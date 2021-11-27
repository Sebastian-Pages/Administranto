import React, { useState } from 'react';
import {AiOutlineClose} from 'react-icons/ai';

export const TaskMenu = (props) => {

  const [showTaskMenu, setShowTaskMenu] = React.useState(true)
  const [taskColor, setTaskColor] = React.useState('Tomato')
  const [item, setItem] = React.useState('Tomato')
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState("");
    
  props.func({item});

  const pull_data = (data) => {
    if (data.color !== taskColor)
        setTaskColor(data.color) 
  }

  const toggleTaskMenu = () => showTaskMenu ? setShowTaskMenu(false) : setShowTaskMenu(true)
  
  const CreateTask = () => {
    setItem({content:title, description:description, estimation:estimation, color:taskColor});
}
  
  const overlayed = {
      position: 'fixed',
      zIndex: '1'
  };

  return ( 
      showTaskMenu ?
          <div className='overlay' style={overlayed}>
              <div className='task-menu' >
                  <div className='task-menu-header' style={{backgroundColor:taskColor}}>
                      <h2 >Task</h2>
                      <button className='exit-task-menu' onClick={toggleTaskMenu}><AiOutlineClose /></button>  
                  </div>
                  <div className='task-menu-body'>
                      <div class="row">
                          <div class="column-left">
                              <h3>Title</h3>
                              <h3>Description</h3>
                              <h3>Estimation</h3>
                              <h3>Color</h3>
                          </div>
                          <div class="column-right">
                              <input type="text" value={title} onChange={(e) => {setTitle(e.target.value);CreateTask()}}/>
                              <input type="text" value={description} onChange={(e) => {setDescription(e.target.value);CreateTask()}}/>
                              <input type="text" value={estimation} onChange={(e) => {setEstimation(e.target.value);CreateTask()}}/>
        
                              <ColorPicker func={pull_data} />
                          </div>
                        </div>

                  </div>
              </div>

          </div>
      : null 
  );
};

export function Form(props) {
  const [name, setName] = useState("");

  const spacing = {
    padding: 10,
    margin: 10
    };

  return (
    <form >
      <label style={spacing} >{props.label}{name}
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={spacing}
        />
      </label>
    </form>
  )
}

function ColorPicker(props) {

  const colorNames = ['White','Springgreen', 'Tomato', 'Lightskyblue',
   'Orchid', 'Gold', 'mediumslateblue'];
  
  const [color, setColor] = useState('White');
  
  props.func({color});

  return (
    <div className='palette'  >
      {/* <p>Selected color: {color}</p> */}
      {colorNames.map((colorName)=>(
        <div
            className='palette-cell'
            onClick={() => setColor(colorName)} 
            key={colorName}
            style={{backgroundColor:colorName}}
            taskColor={props.taskColor}
            >
              {/* {colorName} */}
        </div>
      ))}
    </div>
  );
}


