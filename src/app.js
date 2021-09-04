import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();

//settings
const corsConfig = {
    origin: "https://discord.com",
    optionsSuccessStatus: 200
}
app.set("port", process.env.PORT || 3001);



//middleware
app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/doxes", require('./routes/doxes'));
app.use("/api/raids", require('./routes/raids'));
app.use('/api/auth', require('./routes/auth'));
app.use("/api/tks", require('./routes/tokens'));

app.use((req, res, next) => {
    const error = new Error('Page not found');
    error.status = 404;
    next();
});

//app
export default app;



