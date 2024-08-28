import express from 'express';
import { addParameter, 
         getAllParameters, 
         getParameter,
         updateParameter,
         deleteParameter 
       } from '../controllers/parameterController.js';

const router = express.Router();

router.post('/parameter', addParameter);
router.get('/parameters', getAllParameters);
router.get('/parameter/:id', getParameter);
router.put('/parameter/:id', updateParameter);
router.delete('/parameter/:id', deleteParameter);

export default {
    routes: router
};
