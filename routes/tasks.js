import { Router } from "express";
import pool from "../database/db.js";

const router = Router();

// get all tasks
router.get("/", async(req, res) => {
    try {
        const result = await pool.query("select * from tasks order by created_at desc");
        res.status(200).json({
            success: true,
            message: "all tasks fetched successfully",
            data: result.rows,
            count: result.rowCount,
        })
    } catch (error) {
        console.error("fetching error", error);
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
});


// get single tasks by ID
router.get("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from tasks where id = $1", [id])
        if(result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message:`invalid task id ${id}`
            })
        }

        res.status(200).json({
            success: true,
            message: "single task successfully fetched",
            data: result.rows[0],
        })
    } catch (error) {
        console.error("single task fetching error", error);
        res.status(500).json({
            success: false,
            message: "server error",
        })
    }
});


// add new tasks
router.post("/", async(req, res) => {
    try {
        const {title, description} = req.body;
        if(!title || !description) {
            return res.status(400).json({
                success: false,
                message: "title and description are required",
            });
        };

        const newTask = await pool.query("insert into tasks(title, description) values($1, $2) returning *", [title.trim(), description.trim()])

        res.status(201).json({
            success: true,
            message: "task added successfully",
            data: newTask.rows[0],
        })
    } catch (error) {
        console.error("add tasks error", error);
        res.status(500).json({
            success: false,
            message: "server error",
        })
    }
});


// update the tasks by ID
router.put("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {title, description} = req.body;
        
        if(!title || !description) {
            return res.status(400).json({
                success: false,
                message: "title and description required",
            })
        }

        const result = await pool.query(`
            update tasks 
            set title = $1,
            description = $2,
            updated_at = current_timestamp
            where id = $3
            returning *
            `, [title, description, id]);

            if(result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "task not exists",
                })
            }

            res.status(200).json({
                success: true,
                message: "updated successfully",
                data: result.rows[0]
            })



    } catch (error) {
        console.error("update tasks by ID failed", error);
        res.status(500).json({
            success: false,
            message:" server error "
        })
        
    }
})


// delete tasks
router.delete("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const chekcExists = await pool.query("select * from tasks where id = $1", [id]);

        if(chekcExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `tasks id ${id} not found`,
            });
        };

        const result = await pool.query("delete from tasks where id = $1 returning *", [id])

        res.status(200).json({
            success: true,
            message: "tasks deleted successfully",
            data: result.rows[0]
        })
    } catch (error) {
        console.error("tasks deletion error", error);
        res.status(500).json({
            success: false,
            message: "server error",
        })
    }
})

export default router;