import React, { useState } from 'react';
import {AiOutlineClose} from 'react-icons/ai';

export const TaskMenu = () => {

  const [showTaskMenu, setShowTaskMenu] = React.useState(true)
  
  const [taskColor, setColor] = React.useState('green')
  function handleColor(newColor) {
    setColor(newColor);
    console.log(newColor)
  }
  
  const toggleTaskMenu = () => showTaskMenu ? setShowTaskMenu(false) : setShowTaskMenu(true)

  const overlayed = {
      position: 'fixed',
      zIndex: '1'
  };

  return ( 
      showTaskMenu ?
          <div className='overlay' style={overlayed}>
              <div className='task-menu' >
                  <div className='task-menu-header' >
                      <h2 style={{backgroundColor:'red'}}>Task {taskColor}</h2>
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
                              <Form />
                              <Form />
                              <Form />
                              <ColorPicker taskColor={taskColor} onChange={handleColor}/>
                          </div>
                        </div>
                        {/* <div className='testme'>
                            je comprend pas pq ya pas de style là
                        </div> */}
                        <div style={{textAlign: 'center'}}>
                            <button className='button-primary' onClick='CreateTask'>Create Task</button>
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
  
  const colorStyle = {backgroundColor: color};

  function handleColor(event) {
    // Here, we invoke the callback with the new value
    props.onChange(event.target.value);
    console.log("ok: ",event.target.value)
  }

  return (
    <div style={colorStyle} className='palette'  >
      {/* <p>Selected color: {color}</p> */}
      {colorNames.map((colorName)=>(
        <div
            className='palette-cell'
            onClick={() => setColor(colorName)} 
            key={colorName}
            style={{backgroundColor:colorName}}
            taskColor={props.taskColor}
            onChange={handleColor} 
            >
            
              {/* {colorName} */}
        </div>
      ))}
    </div>
  );
}


