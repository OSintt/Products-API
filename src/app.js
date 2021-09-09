import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();

//settings
const corsConfig = {
    origin: "*",
    optionsSuccessStatus: 200
}
app.set("port", process.env.PORT || 3001);



//middleware
app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/v1/products", require('./routes/products'));
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/users', require('./routes/users'));

app.use((req, res, next) => {
    return res.status(404).json({status: 404, message: "Page not found"})
    next();
});

//app
export default app;



