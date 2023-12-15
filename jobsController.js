
import jobModel from "../models/jobModel.js";
import jobsModel from "../models/jobModel.js";
import mongoose from "mongoose";
//create job
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body
    if (!company || !position) {
        next('please provide all fields');
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({ job });
};
//get job
export const getAllJobsController = async (req, res, next) => {
    const { status, workType, search } = req.query
    //conditiion for searching
    const queryObject = {
        createdBy: req.user.userId
    }
    //logic filters
    if (status && status !== 'all') {
        queryObject.status = status
    }
    if (workType && workType !== 'all') {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }

    const queryResult = jobModel.find(queryObject)
    const jobs = await queryResult;
    //const jobs = await jobsModel.find({ createdBy: req.user.userId })
    res.status(200).json({
        totalJobs: jobs.length,
        jobs
    })
};

//update jobs
export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;

    //validation
    if (!company || !position) {
        next('please provide all information');
    }

    //findjob
    const job = await jobsModel.findOne({ _id: id });
    //validation of id
    if (!job) {
        next(`no jobs found with this is ${id}`);
    }
    if (!req.user.userId === job.createdBy.toString()) {

        next('you cannot update');
        return;
    }
    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    });
    //res
    res.status(200).json({ updateJob });
};




//job filter and stats
export const jobStatsController = async (req, res) => {
    const stats = await jobsModel.aggregate([
        //search by user job
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },

        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        }
    ]);
    //default stat
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0
    };

    //monthly stats
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)

            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: {
                    $sum: 1
                }
            }
        }
    ])
    res.status(200).json({ totalJob: stats.length, defaultStats, monthlyApplication });
};

//search job
/*
export const searchJobController = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await jobsModel.find({
            $or: [
                { company: { $regex: keyword }, $options: 'i' },
                { location: { $regex: keyword }, $options: 'i' },

            ]
        }).select('photo');
        res.json(result)
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error in search product api',
            error
        })
    }
}*/