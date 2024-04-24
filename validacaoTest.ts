import { z } from 'zod'

const userSchema = z.object({
    name: z.string().min(2, { message: 'nome precisa ser maior que 3 caracteres' }).transform(name => name.toLocaleUpperCase()),
    age: z.number().min(18, { message: 'usuário precisa ser maior de idade' }),
    email: z.string().email({ message: 'email valido' }),
    password: z.string().min(5, { message: 'senha precisa ter mais de 5 caracteres' })
});


type User = z.infer<typeof userSchema>

function saveUser(user: User) {
    const { name, age } = userSchema.parse(user)

    console.log(name, age)
};


saveUser({
    name: 'mateus',
    age: 20,
    email: 'mateus@gmail.com',
    password: 'oooooo'
})