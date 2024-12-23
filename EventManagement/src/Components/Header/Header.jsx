import React from 'react'
import {Link, NavLink} from 'react-router-dom'

export default function Header() {
    return (
        <header className="shadow sticky z-50 top-0">
  <nav className="bg-[url('https://img.freepik.com/free-vector/v915-red-blue_53876-174923.jpg')] bg-cover bg-center border-gray-200 px-4 lg:px-6 py-2.5">                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/home" className="flex items-center">
                        <img
                            src="https://www.zarla.com/images/zarla-top-events-1x1-2400x2400-20211123-4fgq7httf3p79gk64jb6.png?crop=1:1,smart&width=250&dpr=2"
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                    </Link>
                    <div className="flex items-center lg:order-2">
                      
                      
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                to="/home"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/attendees"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Attendees
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/task"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                   Task Management
                                </NavLink>
                            </li>
                       
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}