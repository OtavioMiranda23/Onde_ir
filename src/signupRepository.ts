import Database from 'better-sqlite3';
import path from 'path'

export default interface AccountDAO {
    saveAccount(account: Account): { userId: number | bigint };
    getAccountById (userId: string): OutputAccount;
}
export type Account = {
    name: string,
    email: string,
    passwordHash: string
}

export type OutputAccount = {
    id: number | bigint;
    name: string,
    email: string,
    passwordHash: string
}
export class AccountDAODatabase implements AccountDAO {
    saveAccount(account: Account): { userId: number | bigint } {
        const dbPath = path.resolve("./onde_ir.db");
        const db = new Database(dbPath, {
            verbose: console.log,
            
        })
        const stml = db.prepare("insert into users (name, email, password_hash) values (?, ?, ?)");
        const info = stml.run(account.name, account.email, account.passwordHash) 
        return { userId: info.lastInsertRowid };
    }   

    getAccountById(userId: string): OutputAccount {
        const dbPath = path.resolve("./onde_ir.db");
        const db = new Database(dbPath, {
            verbose: console.log,
            
        })
        const stml = db.prepare("select * from users where id = ?");
        const info = stml.get(userId) as { id: number; name: string; email: string; password_hash: string };;
        if (!info) {
            throw new Error("User not found");
        }               
        return {
            id: info.id,
            name: info.name,
            email: info.email,
            passwordHash: info.password_hash
        }
    }
}