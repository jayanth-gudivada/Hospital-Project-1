const express = require('express');
const { getAllTasks,createTask,getTask,updateTask,deleteTask, getTask1,createTask1, getAllUsers,updateUser,deleteUser } = require('../controllers/info');


const router = express.Router();


                                                // public view 
router.route('/:id').get(getTask1);


                                                // admin view
router.route('/all/allinfo').get(getAllTasks);
router.route('/adduser/:u1/:u2').get(createTask);
router.route('/addhos/:h1/:h2/:h3').get(createTask1);
router.route('/update/:o1/:o2/:o3/:n1/:n2/:n3').get(updateTask);
router.route('/delete/:o1/:o2/:o3').get(deleteTask);

// admin/user management (mirrors the hospital CRUD above)
router.route('/all/allusers').get(getAllUsers);
router.route('/updateuser/:o1/:o2/:n1/:n2').get(updateUser);
router.route('/deleteuser/:o1/:o2').get(deleteUser);

router.route('/login/:id/:id1').get(getTask);


module.exports = router;