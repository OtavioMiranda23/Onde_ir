import AccountDAO, { Account } from "../signupRepository";

export default class Signup {
    constructor (readonly accountDAO: AccountDAO) {}

    execute (account: Account) {
        if (!account.name || account.name.length > 40) { 
            throw new Error("Invalid name");
        }
        if (!account.email || !this.isValidEmail(account.email)) {
            throw new Error("Invalid email");
        } 
        if (!account.passwordHash || !this.isValidPassword(account.passwordHash)) {
            throw new Error("Invalid password");   
        }
        return this.accountDAO.saveAccount(account);
    }
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    private isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
    
}