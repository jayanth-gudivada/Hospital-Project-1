const Info = require('../models/Info');
const Login = require('../models/Login');

                                            /* public view */
// const getTask1 = async (req, res) => {
//     try {
//         const { id: hospitallocation } = req.params

//         const info = await Info.find({ location: hospitallocation }).select('-_id name address location ');
//         if (info.length === 0) {
//             return res.status(404).send('<script>alert("No hospital details present in db"); window.location = "/index.html";</script>');;
//         }
//         if (info) {
//             return res.status(200).json({ info })
//         }

//     } catch (error) {
//         return res.status(500).json({ msg: error })
//     }
// }
const getTask1 = async (req, res) => {
    try {
        const { id: hospitallocation } = req.params;

        const info = await Info.find({ location: hospitallocation }).select('-_id name address location ');

        if (info.length === 0) {
            const errorMessage = 'No hospital details present in database';
            return res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Error</title>
                    <style>
                        body {
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <script>alert("${errorMessage}"); window.location = "/index.html";</script>
                </body>
                </html>
            `);
        }

        if (info) {
            const tableRows = info.map(hospital => `
                <tr>
                    <td>${hospital.name}</td>
                    <td>${hospital.address}</td>
                    <td>${hospital.location}</td>
                </tr>
            `).join('');

            return res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Hospitals Information</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            text-align: center;
                            padding: 20px;
                        }
                        h1 {
                            color: #333;
                        }
                        table {
                            width: 80%;
                            margin: 20px auto;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        th, td {
                            padding: 10px;
                            text-align: center;
                        }
                        th {
                            background-color: #333;
                            color: #fff;
                        }
                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h1>Hospitals Information</h1>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Location</th>
                        </tr>
                        ${tableRows}
                    </table>
                </body>
                </html>
            `);
        }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};




                                                /* Admin view */
                                        

// Login..............................................................
const getTask = async (req, res) => {
    try {
        const { id: name } = req.params
        const { id1: pass } = req.params

        const info = await Login.findOne({ email: name, password: pass })

        if (!info) {
            // return res.status(404).json({ msg: 'User not found' })
            return res.status(404).send('<script>alert("User not found"); window.location = "/login.html";</script>');
        } else {
            // return res.status(200).json({ msg: 'User found!!!!!!!!!!!!!!!!!!!!!!!!' });
            res.status(200).redirect('/index2.html');
        }
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



// create admin......................................................................
const createTask = async (req, res) => {
    try {
        const { u1: ename } = req.params
        const { u2: epassword } = req.params

        const info1 = await Login.findOne({ email: ename })

        if (!info1) {
            const info = await Login.insertMany({ email: ename, password: epassword });
            // res.status(201).json({ msg: "successfully added" });
            return res.status(201).send('<script>alert("Successfully added"); window.location = "/index2.html";</script>');
        } else {
            // res.status(501).json({ msg: "There exist a admin with the user name provided" });
            return res.status(501).send('<script>alert("Already there exist a admin with the user name provided"); window.location = "/index2.html";</script>');
        }


    } catch (error) {
        res.status(500).json({ msg: error })
    }
}






/* All hospitas  */
const getAllTasks = async (req, res) => {
    try {
        const information = await Info.find({})
        res.status(201).json({ information });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



// create task
const createTask1 = async (req, res) => {
    try {
        const { h1: hname } = req.params
        const { h2: hlocation } = req.params
        const { h3: haddress } = req.params

        const info = await Info.insertMany({ name: hname, location: hlocation, address: haddress })

        // res.status(201).json({ info })
        res.status(201).send('<script>alert("Successfully added"); window.location = "/index2.html";</script>');

    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



// update
const updateTask = async (req, res) => {
    try {
        const { o1: oname } = req.params
        const { o2: oaddress } = req.params
        const { o3: olocation } = req.params

        const { n1: nname } = req.params
        const { n2: naddress } = req.params
        const { n3: nlocation } = req.params

        const info1 = await Info.findOne({ name: oname, address: oaddress, location: olocation })

        if (info1) {
            const info = await Info.findOneAndUpdate({ name: oname, address: oaddress, location: olocation }, { name: nname, address: naddress, location: nlocation })
            // res.status(201).json({ msg: "successfully updated" });
            return res.status(201).send('<script>alert("Successfully updated"); window.location = "/index2.html";</script>');
        } else {
            res.status(501).json({ msg: "No Hospital found with the given details" });
            return res.status(501).send('<script>alert("No Hospital found with the given details"); window.location = "/index2.html";</script>');
        }

    } catch (error) {
        res.status(500).json({ msg: error })
    }
}




// delete
const deleteTask = async (req, res) => {
    try {
        const { o1: oname } = req.params
        const { o2: oaddress } = req.params
        const { o3: olocation } = req.params

        const info1 = await Info.findOne({ name: oname, address: oaddress, location: olocation })

        if (info1) {
            const info = await Info.findOneAndDelete({ name: oname, address: oaddress, location: olocation })
            return res.status(201).send('<script>alert("Successfully deleted"); window.location = "/index2.html";</script>');

        } else {
            // res.status(500).json({ msg: "No Hospital found with the given details" });
            return res.status(501).send('<script>alert("No Hospital found with the given details"); window.location = "/index2.html";</script>');
        }



    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


module.exports = {
    getAllTasks,
    createTask,
    createTask1,
    getTask,
    getTask1,
    updateTask,
    deleteTask
}