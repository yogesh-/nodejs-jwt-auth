const db = require('../config/db.config');

const checkIfUserExists = (req,res,next) => {
    const user_Name = req.query.user_name;
    const user_Email = req.query.user_email;
    try {
        db.query(`SELECT COUNT(*) as count FROM users WHERE userName = '${user_Name}' OR userEmail = '${user_Email}'`,(err,result)=>{
            if(err){
                res.status(404).send({message:"something went wrong"})
            }
                let count = result[0].count;
                if (count > 0) {
                    return res.status(409).json({ message: 'User already exists' });
                  }
                  
                  next();
        } )
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = checkIfUserExists