import axios from "axios";

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

test("Não deve criar nova conta com nome invalido", async () => {
    const inputUser = {
        name: "",
        email: `otavio${Math.random()}@gmail.com`,
        passwordHash: "Abc12345678"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputUser);
    expect(responseSignup.status).toBe(400); 
    expect(responseSignup.data).toEqual({ error: "Invalid name" });
})
test("Não deve criar nova conta com email invalido", async () => {
    const inputUser = {
        name: "Otavio",
        email: `otavio${Math.random()}gmail.com`,
        passwordHash: "12345678"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputUser);
    expect(responseSignup.status).toBe(400); 
    expect(responseSignup.data).toEqual({ error: "Invalid email" });
})
test("Não deve criar nova conta com password invalido", async () => {
    const inputUser = {
        name: "Otavio",
        email: `otavio${Math.random()}@gmail.com`,
        passwordHash: "abc1234567"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputUser);
    expect(responseSignup.status).toBe(400); 
    expect(responseSignup.data).toEqual({ error: "Invalid password" });
})