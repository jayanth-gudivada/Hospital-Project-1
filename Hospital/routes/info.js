const express = require('express');
const { getAllTasks,createTask,getTask,updateTask,deleteTask, getTask1,createTask1 } = require('../controllers/info');


const router = express.Router();


                                                // public view 
router.route('/:id').get(getTask1);


                                                // admin view
router.route('/all/allinfo').get(getAllTasks);
router.route('/adduser/:u1/:u2').get(createTask);
router.route('/addhos/:h1/:h2/:h3').get(createTask1);
router.route('/update/:o1/:o2/:o3/:n1/:n2/:n3').get(updateTask);
router.route('/delete/:o1/:o2/:o3').get(deleteTask);

router.route('/login/:id/:id1').get(getTask);


module.exports = router;