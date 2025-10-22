import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface UserContextType {
    currentUser: User;
    setCurrentUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Admin

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
