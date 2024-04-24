import express, { Request, Response, request } from 'express';
const app = express();
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod'


// setando a validação 
const userSchema = z.object({    //transform faz o nome ficar em letra maiuscula
    username: z.string().min(3).transform(username => username.toLocaleUpperCase()),
    age: z.number().min(18, { message: 'voce precisa ser maior de idade' }),
    email: z.string().email(),
    password: z.string().min(5, { message: 'senha precisa ter mais de 5 caracteres' })
})

interface User extends z.infer<typeof userSchema> {
    id: string
}

// guardando dados em memoria
const users: User[] = []

app.use(express.json());


// routes
app.get('/', (req: Request, res: Response) => {
    res.send('homepage')
});

// criando usuario
app.post('/users', (req: Request, res: Response) => {
    try {
        const { username, age, email, password } = userSchema.parse(req.body);

        const id = uuidv4();

        const newUser: User = { id, username, age, email, password };

        users.push(newUser);

        res.status(201).json(newUser);

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'erro de validação', details: error.errors })
        }
    }
});

// PATCH
app.patch('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id;

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        // Verifica se algum campo foi fornecido no corpo da requisição e atualiza apenas esses campos
        const updatedFields = userSchema.partial().parse(req.body);
        const updatedUser = { ...users[userIndex], ...updatedFields };

        users[userIndex] = updatedUser;

        // Retorna o usuário atualizado como resposta
        res.json(updatedUser);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', details: error.errors });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// DELETE
app.delete('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Remove o usuário do array e retorna-o na resposta
    const deletedUser = users.splice(userIndex, 1)[0];
    res.json({ message: 'User deleted', deletedUser });
});



// listando todos os usuarios
app.get('/users', (req: Request, res: Response) => {
    res.json(users)
});





app.listen(3333, () => {
    console.log('server is running')
});
