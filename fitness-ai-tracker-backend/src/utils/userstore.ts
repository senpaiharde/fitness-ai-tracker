import fs from 'fs'
import path from 'path';
import {User} from '../types/user';


const dbPath = path.join(__dirname, '..', 'data', 'users.json');

export const readUsers = (): User[] => {
    if(!fs.existsSync(dbPath)) return []
    const data = fs.readFileSync(dbPath, 'utf-8')
    return JSON.parse(data);
};


export const writeUsers = (users : User[]) : void=> {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
};


