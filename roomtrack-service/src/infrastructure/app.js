import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../../swaggerOptions.js";
import { errorHandler } from "../application/middlewares/errorHandler.js";
import routes from "./server/routes/index.js";
import morgan from "morgan";

const app = express();

app.use(morgan("combined"));

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
