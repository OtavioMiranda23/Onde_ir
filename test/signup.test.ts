import axios from "axios";
import { Account, AccountDAODatabase } from "../src/signupRepository";
import Signup from "../src/useCase/signup";

axios.defaults.validateStatus = function () {
	return true;
}
type OutputSignup = {
    userId: string
}

type OutputUser = {
    id: string,
    name: string,
    email: string,
    passwordHash: string
}
let accountDAO: AccountDAODatabase;
let signup: Signup;
beforeEach(() => {
    signup = new Signup(accountDAO);})
test("Deve criar nova conta", async () => {
    const inputUser = {
        name: "otavio",
        email: `otavio${Math.random()}@gmail.com`,
        passwordHash: "Abc12345678$$"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputUser);
    const outputSignup =  responseSignup.data as OutputSignup;
    const responseUser =  await axios.get(`http://localhost:3000/user/${outputSignup.userId}`);
    const outputUser = responseUser.data as OutputUser;
    expect(outputSignup).toBeDefined();
    expect(outputUser.id).toBe(outputSignup.userId);
    expect(outputUser.name).toBe(inputUser.name);
    expect(outputUser.email).toBe(inputUser.email);
    expect(outputUser.passwordHash).toBe(inputUser.passwordHash);   
})

test("Não deve criar nova conta com nome invalido", () => {
    const inputUser: Account = {
        name: "",
        email: `otavio${Math.random()}@gmail.com`,
        passwordHash: "Abc12345678"
    }
    expect(() => signup.execute(inputUser)).toThrow("Invalid name");
})
test("Não deve criar nova conta com email invalido", async () => {
    const inputUser = {
        name: "Otavio",
        email: `otavio${Math.random()}gmail.com`,
        passwordHash: "12345678"
    }
    expect(() => signup.execute(inputUser)).toThrow("Invalid email");
})
test("Não deve criar nova conta com password invalido", async () => {
    const inputUser = {
        name: "Otavio",
        email: `otavio${Math.random()}@gmail.com`,
        passwordHash: "abc1234567"
    }
    expect(() => signup.execute(inputUser)).toThrow("Invalid password");
})