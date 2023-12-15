import express from "express";
import { createJobController, getAllJobsController, jobStatsController,  updateJobController } from "../controllers/jobsController.js";

import userAuth from "../middelwares/authMiddleware.js";

const router = express.Router();


//Routes
//create job || post
router.post('/create-job', userAuth, createJobController);

//get jobs
router.get("/get-job", userAuth, getAllJobsController);

//update jobs
router.patch("/update-job/:id", userAuth, updateJobController);

//jobs stats filter
router.get('/job-stats', userAuth, jobStatsController);


export default router;