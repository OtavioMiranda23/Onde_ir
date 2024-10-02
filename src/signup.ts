import express, { NextFunction, Request, Response } from 'express';
import Database from 'better-sqlite3';
import path from 'path'

const app = express();
app.use(express.json());
// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
const PORT =  3000;

const dbPath = path.resolve("./onde_ir.db");
const db = new Database(dbPath, {
    verbose: console.log,
    
})

app.post("/signup", (req: Request, res: Response) => {
    //- O usuario deve criar sua conta e logar;
    const { name, email, passwordHash }: Input = req.body;
    if (!name || name.length > 40) { 
        res.status(400).json({ error: "Invalid name" });
        return 
    }
    if (!email || !isValidEmail(email)) {
        res.status(400).json({ error: "Invalid email" });
        return 
    } 
    if (!passwordHash || !isValidPassword(passwordHash)) {
        res.status(400).json({ error: "Invalid password" });
        return 
     }
    const stml = db.prepare("insert into users (name, email, password_hash) values (?, ?, ?)");
    const info = stml.run(name, email, passwordHash) 
    res.status(201).json({ userId: info.lastInsertRowid });
})

type Input = {
    name: string,
    email: string,
    passwordHash: string
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})