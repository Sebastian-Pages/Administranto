import React, { useState } from 'react';
import {AiOutlineClose} from 'react-icons/ai';

export const TaskMenu = () => {

    const [showTaskMenu, setShowTaskMenu] = React.useState(true)
    
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
                        <h2>Task {showTaskMenu}</h2>
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
                                <ColorPicker />
                            </div>
                            <div className='testme'>
                                je comprend pas pq ya pas de style là
                            </div>
                            <div>
                                <button className='button-primary'>Create Task</button>
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
  const [submit, setSubmit] = React.useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('The name you entered was: ');
  }

  const spacing = {
    padding: 10,
    margin: 10
    };

  return (
    submit ?
    <form onSubmit={handleSubmit}>
      <label style={spacing} >{props.label}
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={spacing}
        />
      </label>
      <input type="submit" />
    </form>
    :
    <form>
      <label style={spacing} >{props.label}
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

const colorNames = ['Aquamarine', 'BlueViolet', 'Chartreuse', 'CornflowerBlue', 'Thistle', 'SpringGreen', 'SaddleBrown', 'PapayaWhip', 'MistyRose','White'];

export default function ColorPicker() {
  const [color, setColor] = useState('White');

 const colorStyle = {backgroundColor: color};

  return (
    <div style={colorStyle} className='palette'>
      {/* <p>Selected color: {color}</p> */}
      {colorNames.map((colorName)=>(
        <div
            className='palette-cell'
            onClick={() => setColor(colorName)} 
            key={colorName}
            style={{backgroundColor:colorName}}>
            
       	    {/* {colorName} */}
      	</div>
      ))}
    </div>
  );
}

