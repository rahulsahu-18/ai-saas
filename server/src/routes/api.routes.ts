import express from "express"
import { addApi, deleteApi, updateApi } from "../controllers/api.js"

const apiRouter = express.Router();

apiRouter.post('/add-api',addApi);
apiRouter.patch('update-api',updateApi);
apiRouter.delete('/delete-api',deleteApi);

export default apiRouter;