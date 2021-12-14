import companyLogo from '../styles/logo.png';

const Login = ({ loginWithGoogle, signInAnon }) => {
    return (<>
        <div className = 'bg-purple-600 w-full h-10' > </div> 
        <div className = 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-300 w-full h-2/3 rounded-b-lg' >
            <img className = 'p-20 pl-24'src = { companyLogo } alt = 'logo' />
            <h1 className = 'p-6 pl-32 text-3xl md:text-5xl text-gray-50 font-black' > Organise your projects with scrum and kanban </h1> 
            <button className = 'm-16 ml-32 font-black text-3xl bg-purple-600 p-6 mr-4 text-gray-100 rounded-full transform hover:-translate-y-1 transition-transform duration-300' onClick = { loginWithGoogle } > Continue with Google </button>
        </div>	
        {/* <div className = 'flex justify-center relative' >
            <div className = ' w-2/3 h-52 place-content-center rounded-lg shadow-xl absolute bottom--1' >insert images of tech stack here </div> 
        </div> */}

        <div className='bg-gradient-to-r from-indigo-50 via-blue-50 to-red-50 flex flex-col-reverse md:flex-row md:justify-between px-5 md:px-20 py-12 md:py-24 h-screen'>
            <div className='w-full md:w-7/12 md:pr-12 pt-4'>
                <h1 className='text-3xl md:text-5xl text-gray-800 text-primary'>Stop choosing between Scrum and Kanban, Use both !</h1>
                <p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal'>Administranto is a in-development tool which allow you to supervise your project using scrum and kanban.</p>
                <div class="slider-wrapper relative" id="slider-1452702843">
                    <p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal font-bold'>Technologies & Frameworks</p>
                    {/* <div className="img has-hover x md-x lg-x y md-y lg-y" id="image_4756120">
						<div className="img-inner image-zoom dark">
			                <img width="100" height="100" src="https://programisto.fr/wp-content/uploads/2021/03/Programisto-technologie-expertise-dot-net-core-csharp-c-c.webp" className="attachment-large size-large" alt="Programisto technologie expertise dot net core csharp c++ c#" title="Accueil Programisto 8"></img>
					    </div>
                    </div> */}
                    <p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal font-bold'>react , tailwind , firebase , craco , </p>
                </div>
            </div>
            <div className='w-full md:w-5/12'>
                <img src={require('../styles/plan.png').default}  alt="plan" />
            </div>
        </div>
        <div className = 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-300 w-full h-2/3 rounded-b-lg'>
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