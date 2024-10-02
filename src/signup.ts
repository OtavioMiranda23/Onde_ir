import express, { NextFunction, Request, Response } from 'express';

import { Account, AccountDAODatabase } from './signupRepository';
import Signup from './useCase/signup';

const app = express();
app.use(express.json());
// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
const PORT =  3000;

const accountDAO = new AccountDAODatabase();
const signup = new Signup(accountDAO);
app.get("/user/:id", (req: Request, res: Response) => {
    const userId = req.params.id;
    const account = accountDAO.getAccountById(userId);
    res.status(200).json(account)
})

app.post("/signup", (req: Request, res: Response) => {
    const { name, email, passwordHash }: Account = req.body;
    const account = { name, email, passwordHash };
    try {
        const userId = signup.execute(account);
        res.status(201).json(userId);
    } catch (error) {
        res.status(400).json(error);
    }
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})