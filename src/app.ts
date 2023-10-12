import express, { Request, Response } from 'express';
import passport from 'passport';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import "./config/passportConfig";
import dotenv from 'dotenv';
import profileRoutes from "./routes/profileRoutes";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

// Your routes go here
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to InterSoul!');
});

app.use('/auth', authRoutes);
app.use("/profile", profileRoutes)

// Error handler
app.use((err:any, req:any, res:any, next:any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});