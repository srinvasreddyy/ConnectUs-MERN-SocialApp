import React from 'react'
import useAuthUser from '../hooks/useAuthUser.js'
import { useLocation } from 'react-router'
import { Link } from 'react-router'
import { MessageCircleHeartIcon, HomeIcon, UsersIcon, BellIcon } from 'lucide-react'
import { useNotificationCount } from "../store/useThemeSelector.js"
const Sidebar = () => {
    const { authUser } = useAuthUser()
    const location = useLocation()
    const currentPath = location.pathname
    return (
        <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0'>
            <div className="p-5 border-b border-base-300">
                <Link to="/" className="flex items-center gap-2.5">
                    <MessageCircleHeartIcon className="size-9 text-primary" />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                        ConnectUs
                    </span>
                </Link>
            </div>

            <nav className='flex-1 p-4 space-y-1'>
                <Link
                    to="/"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""
                        }`}
                >
                    <HomeIcon className="size-5 text-base-content opacity-70" />
                    <span>Home</span>
                </Link>

                

                <Link
                    to="/notifications"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" ? "btn-active" : ""
                        }`}
                >
                    <BellIcon className="size-5 text-base-content opacity-70" />
                    <span>Notifications</span>
                    
                </Link>

            </nav>

            
            
        </aside>
    )
}

export { Sidebar }