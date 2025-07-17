const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the database connection
const multer = require('multer'); // For file uploads

// Test endpoint connection
router.get("/", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.post("/checkuser", (req, res) => {
    const sql = "SELECT * FROM user WHERE U_EMAIL=? AND U_PASSWORD=?";
    db.query(sql, [req.body.regemail, req.body.regpass], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json({ exists: 'true' })
        } else {
            return res.json({ exists: 'false' });
        }
    })
});

router.put("/reguser", (req, res) => {
    const sql = "INSERT INTO user (U_FIRSTNAME, U_SURNAME, U_EMAIL, U_CONTACT, U_TITLE, U_PASSWORD, U_USERTYPE, U_REGDATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const regdatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query(sql, [req.body.regfname, req.body.regsurname, req.body.regemail, req.body.regcontact, req.body.regititle, req.body.regpass, req.body.regusertype, regdatetime], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json({ message: 'Success' });
    })
});

router.get("/getnotification", (req, res) => {
    const sql = "SELECT * FROM NOTIFICATION WHERE U_ID=?";
    db.query(sql, [req.query.userid], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getuser", (req, res) => {
    const sql = "SELECT * FROM user WHERE U_ID=?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getallusers", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getallrides", (req, res) => {
    const sql = "SELECT * FROM RIDE";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getallDrivers", (req, res) => {
    const sql = "SELECT * FROM DRIVER";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getpayments", (req, res) => {
    const sql = "SELECT * FROM PAYMENT";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.post("/loguser", (req, res) => {
    const sql = "SELECT * FROM user WHERE U_EMAIL = ? AND U_PASSWORD = ?";
    db.query(sql, [req.body.Logemail, req.body.Logpass], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.post("/addfaq", (req, res) => {
    const sql = `
    INSERT INTO FA_CONTENT (FAQ_QUESTION, FAQ_ANSWER, FAQC_ID)
    VALUES (?, ?, (SELECT FAQC_ID FROM FAQ_CATEGORY WHERE FAQC_CONTENT = ?))
    `;
    db.query(sql, [req.body.questionGroup, req.body.answerGroup, req.body.catGroup], (err, data) => {
        console.log(data);
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Added' });
        } else {
            return res.json({ status: 'failed' });
        }
    })
});

router.post("/getcat", (req, res) => {
    const sql = "SELECT * FROM FAQ_CATEGORY WHERE FAQC_CONTENT=?";
    db.query(sql, [req.body.faqcat], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getfaq", (req, res) => {
    const sql = "SELECT * FROM FA_CONTENT";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.delete("/deletefaq", (req, res) => {
    const sql = "DELETE FROM FA_CONTENT WHERE FAQ_ID = ?";
    db.query(sql, [req.body.delstatus], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Deleted' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.put("/updateboth", (req, res) => {
    const sql = "UPDATE FA_CONTENT SET FAQ_QUESTION=?,FAQ_ANSWER=? WHERE FAQ_ID=?";
    db.query(sql, [req.body.questionGroup, req.body.answerGroup, req.body.deleteid], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.put("/updateques", (req, res) => {
    const sql = "UPDATE FA_CONTENT SET FAQ_QUESTION=? WHERE FAQ_ID=?";
    db.query(sql, [req.body.questionGroup, req.body.deleteid], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.put("/updateans", (req, res) => {
    const sql = "UPDATE FA_CONTENT SET FAQ_ANSWER=? WHERE FAQ_ID=?";
    db.query(sql, [req.body.answerGroup, req.body.deleteid], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.post("/newbookingslot", (req, res) => {
    const sql = `INSERT INTO BOOKINGSLOT (BS_DATETIME,
    BS_PICKUPRADIUS,BS_DESTRADIUS,BS_AVAILSEATS,
    BS_ARRIVALTIME,BS_PICKUPTIME,BS_PARCELPRICE,
    BS_PASSPRICE,BS_STATUS)
     VALUES (?,?,?,?,?,?,?,?,?)`;
    db.query(sql, [req.body.newdate, req.body.newpickradius, req.body.newdestradius, req.body.newseats, req.body.newarrivaltime, req.body.newpicktime, req.body.parcelprice, req.body.passprice, req.body.status], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.put("/updatebookingslot", (req, res) => {
    const sql = `UPDATE BOOKINGSLOT SET BS_DATETIME=?,
    BS_PICKUPRADIUS=?,BS_DESTRADIUS=?,BS_AVAILSEATS=?,
    BS_ARRIVALTIME=?,BS_PICKUPTIME=?,BS_PARCELPRICE=?,
    BS_PASSPRICE=?,BS_STATUS=? WHERE BS_ID=?`;
    const regdatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query(sql,[regdatetime,req.body.edditpickradius,req.body.edditdestradius,req.body.edditseats,req.body.edditarrivaltime,req.body.edditpicktime,req.body.edditparcelprice,req.body.edditpassprice,req.body.status,req.body.id],(err,data)=>{
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getbookingslot", (req, res) => {
    const sql = "SELECT * FROM BOOKINGSLOT";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.delete("/deletebookingslot", (req, res) => {
    const sql = `DELETE FROM BOOKINGSLOT WHERE BS_ID = ? `;
    db.query(sql, [req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Deleted' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getbookingbyid", (req, res) => {
    const sql = "SELECT * FROM BOOKINGSLOT WHERE BS_ID = ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getvehiclebyid", (req, res) => {
    const sql = "SELECT * FROM VEHICLE WHERE V_ID = ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.delete("/deletevehicle", (req, res) => {
    const sql = `DELETE FROM VEHICLE WHERE V_ID = ? `;
    db.query(sql, [req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Deleted' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getvehicle", (req, res) => {
    const sql = "SELECT * FROM VEHICLE";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.post("/newvehicle", (req, res) => {
    const sql = `INSERT INTO VEHICLE (V_CAPACITY,
    V_TYPE,V_LICNUMBER,V_MODEL,
    V_COLOR,V_STATUS,V_IMGURL)
     VALUES (?,?,?,?,?,?,?)`;
    db.query(sql, [req.body.newnumseats, req.body.newtype, req.body.newlicnum, req.body.newmodel, req.body.newcolor, req.body.status, req.body.newimgurl], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.put("/editvehicle", (req, res) => {
    const sql = `UPDATE VEHICLE SET V_CAPACITY=?,
    V_TYPE=?,V_LICNUMBER=?,V_MODEL=?,
    V_COLOR=?,V_IMGURL=? WHERE V_ID=?`;
    db.query(sql, [req.body.editnumseats, req.body.edittype, req.body.editlicnum, req.body.editmodel, req.body.editcolor, req.body.editimgurl, req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.delete("/deleteuser", (req, res) => {
    const sql = `DELETE FROM USER WHERE U_ID = ? `;
    db.query(sql, [req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Deleted' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.post("/newroute", (req, res) => {
    const sql = `INSERT INTO ROUTE (RO_NAME, RO_DISTANCE, RO_NUMSTOPS, RO_STARTLOC, RO_ENDLOC, RO_ADDITIONALINFO)
     VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [req.body.newname, req.body.newdistance, req.body.newnumstops, req.body.newstartloc, req.body.newendloc, req.body.newadditionalinfo], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getroutes", (req, res) => {
    const sql = "SELECT * FROM ROUTE";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.get("/getcompleterides", (req, res) => {
    const sql = "SELECT * FROM RIDE WHERE R_STATUS='Complete'";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.delete("/deleteroute", (req, res) => {
    const sql = `DELETE FROM ROUTE WHERE RO_ID = ? `;
    db.query(sql, [req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Deleted' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getroutebyid", (req, res) => {
    const sql = "SELECT * FROM ROUTE WHERE RO_ID = ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.post("/savecheckpoint", (req, res) => {
    const sql = `INSERT INTO ROUTE_CHECKPOINT (RC_LOCATION, RC_STATUS, RO_ID)
     VALUES (?, ?, ?)`;
    db.query(sql, [req.body.checkloc, req.body.status, req.body.rid], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getcheckpoint", (req, res) => {
    const sql = "SELECT * FROM ROUTE_CHECKPOINT WHERE RO_ID = ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.put("/editroute", (req, res) => {
    const sql = `UPDATE ROUTE SET RO_NAME=?, RO_DISTANCE=?, RO_NUMSTOPS=?, RO_STARTLOC=?, RO_ENDLOC=?, RO_ADDITIONALINFO=? WHERE RO_ID=?`;
    db.query(sql, [req.body.editname, req.body.editdistance, req.body.editnumstops, req.body.editstartloc, req.body.editendloc, req.body.editadditionalinfo, req.body.rid], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getdriverbytype", (req, res) => {
    const sql = "SELECT * FROM USER WHERE U_USERTYPE= ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.get("/getactivedriver", (req, res) => {
    const sql = `SELECT * FROM USER INNER JOIN DRIVER ON USER.U_ID=DRIVER.U_ID INNER JOIN D_PROFILE
         ON DRIVER.D_ID= D_PROFILE.D_ID WHERE D_STATUS='Active'`;
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.get("/getdriverprofileinfo", (req, res) => {
    const sql = `SELECT * FROM USER INNER JOIN DRIVER ON USER.U_ID=DRIVER.U_ID INNER JOIN D_PROFILE
         ON DRIVER.D_ID= D_PROFILE.D_ID`;
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getdriverbyid", (req, res) => {
    const sql = "SELECT * FROM DRIVER WHERE U_ID= ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.get("/getpaydata", (req, res) => {
    const sql = "SELECT * FROM PAYMENT";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.put("/editvid", (req, res) => {
    const sql = `UPDATE DRIVER SET V_ID=? WHERE D_ID=?`;
    db.query(sql, [req.body.assignid, req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.put("/editverify", (req, res) => {
    const sql = `UPDATE DRIVER SET D_STATUS=? WHERE D_ID=?`;
    db.query(sql, [req.body.status, req.body.did], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

router.get("/getdriverprofile", (req, res) => {
    const sql = "SELECT * FROM D_PROFILE";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/drating", (req, res) => {
    const sql = "SELECT * FROM DRIVER_RATING";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});

router.get("/getfeed", (req, res) => {
    const sql = "SELECT * FROM RIDE_FEEDBACK";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.post("/newmessage", (req, res) => {
    const sql = `INSERT INTO NOTIFICATION (NOT_CONTENT,NOT_TYPE, NOT_STATUS,NOT_TIMESTAMP, U_ID)
     VALUES (?, ?, ?,?,?)`;

     const regdatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
     const type='Admin Message';
     const status='Not Seen';
    db.query(sql, [req.body.mesg, type,status,regdatetime, req.body.user], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});
router.get("/getparcelbookings", (req, res) => {
    const sql = "SELECT * FROM PARCEL_BOOKING";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.get("/getparcelimages", (req, res) => {
    const sql = "SELECT * FROM PARCEL_IMG WHERE P_ID= ?";
    db.query(sql, [req.query.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    })
});
router.put("/acceptparcel", (req, res) => {
    const sql = `UPDATE PARCEL_BOOKING SET P_STATUS=? WHERE P_ID`;
    db.query(sql, [req.body.status, req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});
router.put("/rejectparcel", (req, res) => {
    const sql = `UPDATE PARCEL_BOOKING SET P_STATUS=? WHERE P_ID`;
    db.query(sql, [req.body.status, req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});
router.put("/edituser", (req, res) => {
    const sql = `UPDATE USER SET U_FIRSTNAME=?, U_SURNAME=?, U_EMAIL=?,U_TITLE=?, U_CONTACT=?, U_USERTYPE=? WHERE U_ID=?`;
    db.query(sql, [req.body.fname,req.body.surname,req.body.email,req.body.title,req.body.constact,req.body.usertype,req.body.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        if (data.affectedRows > 0) {
            return res.json({ status: 'Updated' });
        } else {
            return res.json({ status: 'Failed' });
        }
    })
});

//Mphaga Personal information
// Personal information
// Fetch user details
router.get("/getUserDetails/:userId", (req, res) => {
    const sql = "SELECT * FROM USER WHERE U_ID = ?";
    db.query(sql, [req.params.userId], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json("Error");
        }
        return res.json(data[0]);
    });
});

  
  

// Update user details
router.put("/updateUserDetails/:userId", (req, res) => {
    const sql = "UPDATE USER SET U_FIRSTNAME = ?, U_SURNAME = ?, U_EMAIL = ?, U_CONTACT = ? WHERE U_ID = ?";
    db.query(sql, [req.body.firstName, req.body.surname, req.body.email, req.body.contact, req.params.userId], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json("Error");
        }
        return res.json({ message: 'User details updated successfully' });
    });
});

// Profile picture update setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.put("/updateProfilePicture/:userId", upload.single('profilePicture'), (req, res) => {
    const profilePictureUrl = `/uploads/${req.file.filename}`;
    const sql = "UPDATE USER SET U_PROFILEPIC = ? WHERE U_ID = ?";
    db.query(sql, [profilePictureUrl, req.params.userId], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json("Error");
        }
        return res.json({ message: 'Profile picture updated successfully', profilePictureUrl });
    });
});

// Notifications
router.get("/notifications/1", (req, res) => {
    const sql = "SELECT * FROM NOTIFICATION WHERE U_ID = 1 AND NOT_STATUS = 'unread'";
    db.query(sql, [], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        console.log('Notifications fetched:', data);
        return res.json(data);
    });
});


router.put("/messages/read/:messageId", (req, res) => {
    const sql = "UPDATE MESSAGE SET M_STATUS = 'read' WHERE M_ID = ?";
    db.query(sql, [req.params.messageId], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json({ message: 'Success' });
    });
});

// Messages
// Messages
router.get('/messages/:receiver', (req, res) => {
    const receiver = req.params.receiver;
    const sql = "SELECT * FROM MESSAGE ";
    db.query(sql, [receiver], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        console.log('Messages fetched:', data); // Add this for debugging
        return res.json(data);
    });
});


router.post('/messages', (req, res) => {
    const { M_CONTENT, M_SENDER, M_RECEIVER, REPLY_TO } = req.body;
    const M_TIME = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const M_STATUS = 'unread';
    const sql = "INSERT INTO MESSAGE (M_TIME, M_CONTENT, M_STATUS, M_SENDER, M_RECEIVER, REPLY_TO) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [M_TIME, M_CONTENT, M_STATUS, M_SENDER, M_RECEIVER, REPLY_TO], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error"); 
        }
        return res.json({ message: 'Success' });
    });
});

// Fetch messages

router.get('/messages/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM MESSAGE WHERE M_RECEIVER = ?";
    db.query(sql, [userId], (err, data) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json(data);
    });
  });

  // Send a reply to a message
  router.post('/messages', (req, res) => {
    const { M_CONTENT, M_SENDER, M_RECEIVER, REPLY_TO } = req.body;
    const M_TIME = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const M_STATUS = 'unread';
    const sql = "INSERT INTO MESSAGE (M_TIME, M_CONTENT, M_STATUS, M_SENDER, M_RECEIVER, REPLY_TO) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [M_TIME, M_CONTENT, M_STATUS, M_SENDER, M_RECEIVER, REPLY_TO], (err, data) => {
      if (err) {
        console.error('Error sending reply:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Reply sent successfully' });
    });
  });
  
router.get('/messages/:receiver', (req, res) => {
    const receiver = req.params.receiver;
    const sql = "SELECT * FROM MESSAGE WHERE M_RECEIVER = ?";
    db.query(sql, [receiver], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        console.log('Messages fetched:', data);
        return res.json(data);
    });
});


router.put('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { M_CONTENT } = req.body;
    const sql = "UPDATE MESSAGE SET M_CONTENT = ? WHERE M_ID = ?";
    db.query(sql, [M_CONTENT, id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json({ message: 'Success' });
    });
});

router.delete('/messages/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM MESSAGE WHERE M_ID = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json({ message: 'Success' });
    });
});

router.get('/messages/search/:query', (req, res) => {
    const { query } = req.params;
    const sql = "SELECT * FROM MESSAGE WHERE M_CONTENT LIKE ?";
    db.query(sql, [`%${query}%`], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    });
}); 

// Bookings
// Fetch bookings
router.get("/bookings", (req, res) => {
    const sql = `
        SELECT BOOKING.B_ID, BOOKING.B_DATETIME, BOOKING.B_DESTLOCATION, BOOKING.B_PICKUPLOCATION, 
               BOOKING.B_NUMBOOKING, BOOKING.B_STATUS, BOOKING.B_TYPE, ROUTE.RO_ID
        FROM BOOKING 
        LEFT JOIN BOOKINGSLOT ON BOOKING.BS_ID = BOOKINGSLOT.BS_ID
        LEFT JOIN ROUTE ON BOOKINGSLOT.BS_ID = ROUTE.RO_ID
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        console.log('Bookings fetched:', data);
        return res.json(data);
    });
});


  


router.get("/bookingDetails/:id", (req, res) => {
    const sql = "SELECT * FROM BOOKING WHERE B_ID = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json("Error");
        }
        return res.json(data);
    });
});


// Report incident
// Report incident
// Report incident
router.post('/reportIncident', (req, res) => {
    const sql = 'INSERT INTO U_INCIDENT (CINC_DESCRIP, CINC_DATE, CINC_INTENSITY) VALUES (?, NOW(), ?)';
    const { description, intensity } = req.body;
    db.query(sql, [description, intensity], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ message: 'Incident reported successfully' });
    });
});



// Fetch incidents
router.get('/incidents', (req, res) => {
    const sql = 'SELECT * FROM U_INCIDENT';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    });
});

// Update incident
router.put('/updateIncident/:id', (req, res) => {
    const sql = 'UPDATE U_INCIDENT SET CINC_DESCRIP = ?, CINC_DATE = NOW(), CINC_INTENSITY = ? WHERE CINC_ID = ?';
    const { description, intensity } = req.body;
    const { id } = req.params;
    db.query(sql, [description, intensity, id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ message: 'Incident updated successfully' });
    });
});
// Delete incident
router.delete('/deleteIncident/:id', (req, res) => {
    const sql = 'DELETE FROM U_INCIDENT WHERE CINC_ID = ?';
    const { id } = req.params;
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ message: 'Incident deleted successfully' });
    });
});

router.get('/incidentsForReporting/:tripId', (req, res) => {
    const sql = 'SELECT * FROM U_INCIDENT WHERE TRIP_ID = ? AND TIMESTAMPDIFF(HOUR, CINC_DATE, NOW()) <= 42';
    const { tripId } = req.params;
    db.query(sql, [tripId], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    });
});



// Dashboard
//fetch rides
router.get('/rides', (req, res) => {
    const query = `
        SELECT * FROM RIDE;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching rides:', error);
            return res.status(500).send('Error fetching rides');
        }
        res.json(results);
    });
});



module.exports = router;
