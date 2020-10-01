import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

const db = admin.firestore();
const userCollection = 'users';

export const userProfileApi = functions.https.onRequest(main);

export interface IUser {
    id: string;
    data: IUserData;
}

export interface IUserData {
    firstName: string;
    lastName: string;
    profileImage: string;
    position: string;
    workedFor: string;
    workLocation: string;
    aboutYou: string;
}

app.post('/users', async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            profileImage,
            position,
            workedFor,
            workLocation,
            aboutYou
        }: IUserData = req.body;

        const userData: IUserData = {
            firstName,
            lastName,
            profileImage,
            position,
            workedFor,
            workLocation,
            aboutYou
        }

        const userRef = await db.collection(userCollection).add(userData);
        const user = await userRef.get();

        res.json({
            id: userRef.id,
            data: user.data()
        });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get('/users/:id', async(req, res) => {
    try {
        const userId = req.params.id;

        if(!userId) {
            throw new Error('User ID is required!')
        }

        const user = await db.collection(userCollection).doc(userId).get();

        if(!user.exists) {
            throw new Error('Person does not exist in db!');
        }

        res.json({
            id: user.id,
            data: user.data()
        });

    } catch(err) {
        res.status(500).send(err);
    }
});

app.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection(userCollection).get();
        const users: any[] = [];
        usersSnapshot.forEach(
            (user) => {
                users.push({
                    id: user.id,
                    data: user.data()
                });
            }
        );
  
        res.json(users);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
  
        if (!userId) throw new Error('id not defined!');
  
        await db.collection(userCollection).doc(userId).delete();
  
        res.json({
            id: userId,
        })
    } catch(error){
        res.status(500).send(error);
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
  
        if (!userId) throw new Error('id not defined!');

        const data = { 
            newProp: 'new prop value',
            firstName: 'changed first name'
        };

        await db.collection(userCollection).doc(userId).set(data, { merge: true });
  
        res.json({
            id: userId,
            data
        });  
    } catch(err){
        res.status(500).send(err);
    }
});





