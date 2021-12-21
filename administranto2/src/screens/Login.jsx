import companyLogo from '../styles/logo.png';

const Login = ({ loginWithGoogle, signInAnon }) => {
    return (<>
    
        <div className = 'bg-purple-600 w-full h-10' > </div> 
        <div className = 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-300 w-full h-2/3 rounded-b-3xl' >
        <div className="sm:flex my-8 float-right">
						<div className=''>
				            <label htmlFor="priority" className=' text-gray-500 block sm:inline'></label>
				            <select name="priority" defaultValue='low' className='select'>
							<option className='option' value="pink">English</option>
									<option className='option' value="orange">Esperanto</option>
				            </select>
				           
						</div>
					</div>
            <img className = 'p-20 pl-24'src = { companyLogo } alt = 'logo' />
            
            <h1 className = 'p-6 pl-32 text-3xl md:text-5xl text-gray-50 font-black' > Organise your projects with scrum and kanban </h1> 
            <button className = 'm-16 ml-32 font-black text-3xl bg-purple-600 p-6 mr-4 text-gray-100 rounded-full transform hover:-translate-y-1 transition-transform duration-300' onClick = { loginWithGoogle } > Continue with Google </button>
        </div>	

        <div className='bg-gradient-to-b from-white via-blue-50 to-red-50 flex  px-5  h-4/6'>
            <div className='mt-32 ml-32'>
                <h1 className='text-3xl md:text-5xl text-gray-800 text-primary'>Stop choosing between Scrum and Kanban, Use both !</h1>
                <p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal'>Administranto is a in-development tool which allow you to supervise your project using scrum and kanban.</p>
                <div class="slider-wrapper relative" id="slider-1452702843">

                    <div className='bg-white grid justify-items-center p-8 rounded-3xl shadow-xl my-32 w-4/5'>
                        <div class="grid grid-cols-4 gap-0">
                            <div className=' w-44 mt-4'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/512px-React.svg.png"/>
                            </div>  
                            <div className='w-44 pt-8 ml-4'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1920px-Node.js_logo.svg.png"/>
                            </div>
                            <div className=' w-44'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Touchicon-180.png"/>
                            </div>
                            <div className=' w-44'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/600px-Tailwind_CSS_Logo.svg.png"/>
                            </div>
                        </div>
                        <p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal font-bold'>Technologies & Frameworks</p>
                    </div>

                    
                </div>
            </div>
        <img src="https://programisto.fr/wp-content/uploads/2021/03/Programisto-expériences-numériques-complètes.webp" className="bg-red-500 w-4 p-4 m-4 h-4 hidden hover:visible" alt="a"/>
        </div>
        <div className = 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-300 w-full h-2/3 '>
            <p className='p-6 text-2xl md:text-2xl text-gray-50 font-black text-center'>Web site created by Antoine Le Flohic and Sebastian Pages</p>
            <p className='p-6 text-2xl md:text-2xl text-gray-50 font-black text-center'>Copyright 2021 © Administranto</p>
        </div>
            {/* <div className='bg-gradient-to-r from-indigo-50 via-blue-50 to-red-50 flex flex-col-reverse md:flex-row md:justify-between px-5 md:px-20 py-12 md:py-24 h-screen'>
            				<div className='w-full md:w-7/12 md:pr-12 pt-4'>
            					<h1 className='text-3xl md:text-5xl text-gray-800 text-primary'>Stay on top of the game called life with Agilix.</h1>
            					<p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal'>Agilix is an opinionated, simplified Kanban planner for personal use that helps you organise your life and accomplish more.</p>
            					<div className="flex mt-6 md:mt-16 text-sm md:text-base">
            		            	<button className='bg-blue-800  px-2 py-1 mr-4 text-gray-100 rounded-sm transform hover:-translate-y-1 transition-transform duration-300' onClick={loginWithGoogle}>Continue with Google</button>
            		            	<button className='border border-black  px-2 py-1 text-gray-800 rounded-sm transform hover:-translate-y-1 transition-transform duration-300' onClick={signInAnon}>Continue as Guest <sup>*</sup></button>
            					</div>
            					<p className='text-xs text-gray-600 mt-6'><sup>*</sup> Your data will be deleted once you log out.</p>
            				</div>
            				<div className='w-full md:w-5/12'>
            	            	<img src={require('../styles/plan.png').default}  alt="plan" />
            				</div>
            	        </div>  */}
    </>)}

export default Login