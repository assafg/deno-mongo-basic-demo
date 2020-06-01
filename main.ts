import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { MongoClient, ObjectId } from 'https://deno.land/x/mongo@v0.7.0/mod.ts';

const client = new MongoClient();
client.connectWithUri('mongodb://mongodb:27017');

const db = client.database('test');
const users = db.collection('users');

// populate initial values
const insertId = await users.insertOne({
    username: 'admin',
    password: '123456',
});

console.log(`admin Id: ${insertId.$oid}`);

const app = new Application();

const router = new Router();
router
    .get('/', ({ response }: { response: any }) => {
        response.body = 'hello Oak';
    })
    .get('/users/:id', async ({ params, response }: { params: { id: string }; response: any }) => {
        const { id } = params;
        const user = await users.findOne({ _id: ObjectId(id) });
        response.body = user;

    }).post('/users', async ({ request, response }: {request: any, response: any}) => {
        const { value } = await request.body();
        console.log( value );
        const insertId = await users.insertOne(value);
        
        response.status = 201;
        response.body = insertId;
    });

app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(Deno.env.get('PORT') || `8009`);
console.log(`Listening on port ${port} ...`);
await app.listen(`localhost:${port}`);
