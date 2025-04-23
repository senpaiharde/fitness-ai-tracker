import fs from 'fs'
import path from 'path';
import {User} from '../types/user';


const filePath = path.join(__dirname, '../../data/users.json');

export const readUsers = (): User[] => {
    try{
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }catch{
        return [];
    }
};


export const writeUsers = (users : User[]) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};


