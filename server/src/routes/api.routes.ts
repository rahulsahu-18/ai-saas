import express from "express"
import { addApi, deleteApi, updateApi } from "../controllers/api.controller.js"

const apiRouter = express.Router();

apiRouter.post('/add-api',addApi);
apiRouter.patch('update-api',updateApi);
apiRouter.delete('/delete-api',deleteApi);

export default apiRouter;