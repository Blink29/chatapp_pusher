// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

//app config
const app = express();

const PORT = process.env.PORT || 9000;

//db config
const uri = "mongodb+srv://admin:aYzGxOxt90udjt92@cluster0.sbdwuto.mongodb.net/?retryWrites=true&w=majority";

const connectDb = async () => {
    try {
        await mongoose.connect(uri, {
             useNewUrlParser : true ,
             useUnifiedTopology : true
        });
    } catch (err) {
        console.log(err);
    }
} 

connectDb();

//middleware
app.use(express.json());
app.use(cors());

//pusher config
const pusher = new Pusher({
    appId: "1663382",
    key: "a57a1e023d0a2976ddb6",
    secret: "4429a7c6d699abe7a2c5",
    cluster: "ap2",
    useTLS: true
  });
  
//routes
app.get('/', (req, res) => res.send("hello"))

app.get('/messages/sync', async (req, res) => {
    const dbMessages = await Messages.find();
    res.json(dbMessages);
})

app.post('/messages/new', async (req, res) => {
    const dbMessage = req.body;

    const result = await Messages.create(dbMessage);

    res.status(201).send(result);
})

const db = mongoose.connection;

db.once('open', () => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`connected to port ${PORT}`));

    const dbCollection = db.collection('messagecontents');
    const changeStream = dbCollection.watch();

    changeStream.on('change', (change) => {
        // console.log(change)
        if (change.operationType === 'insert') {
            const msgDetails = change.fullDocument
            pusher.trigger('message', 'inserted', {
                name: msgDetails.name,
                message: msgDetails.message,
                recieved: msgDetails.recieved
            }) 
        }
    })
})