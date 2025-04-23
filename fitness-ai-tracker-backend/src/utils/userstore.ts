import fs from 'fs'
import path from 'path';
import {user} from '../types/user';


const filePath = path.join(__dirname, '../../data/users.json');

export const readUsers = (): user[] => {
    try{
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }catch{
        return [];
    }
};


export const writeUsers = (users : user[]) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};


