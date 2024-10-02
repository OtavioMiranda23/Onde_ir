import express, { NextFunction, Request, Response } from 'express';

import { Account, AccountDAODatabase } from './signupRepository';

const app = express();
app.use(express.json());
// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
const PORT =  3000;

const accountDAO = new AccountDAODatabase();

app.get("/user/:id", (req: Request, res: Response) => {
    const userId = req.params.id;
    const account = accountDAO.getAccountById(userId);
    res.status(200).json(account)
})

app.post("/signup", (req: Request, res: Response) => {
    const { name, email, passwordHash }: Account = req.body;
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
    const account = { name, email, passwordHash };
    const userId = accountDAO.saveAccount(account);
    res.status(201).json(userId);
})

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