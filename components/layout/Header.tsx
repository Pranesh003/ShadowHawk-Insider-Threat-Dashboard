import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { MOCK_USERS } from '../../constants';

interface HeaderProps {
    onToggleSidebar: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, searchTerm, onSearchChange }) => {
    const { currentUser, setCurrentUser } = useUser();

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = MOCK_USERS.find(u => u.id === event.target.value);
        if (selectedUser) {
            setCurrentUser(selectedUser);
        }
    };
    
    return (
        <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between z-10">
            <div className="flex items-center">
                <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-700 transition-colors mr-4" aria-label="Toggle sidebar">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
                <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <h1 className="text-xl font-bold tracking-wider">ShadowHawk</h1>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative w-full min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Search events, endpoints, users..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={currentUser.id}
                        onChange={handleRoleChange}
                        className="bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        aria-label="Select user role"
                    >
                        {MOCK_USERS.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                     <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                    </div>
                </div>
            </div>
        </header>
    );
};
