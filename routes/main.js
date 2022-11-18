module.exports = function(app, shopData) {

    const bcrypt = require('bcrypt');
    const{check, validationResult} = require('express-validator');
    // Creating a function that redirects the user to login page if they are not authorised    
    const redirectLogin = (req, res, next)=>{
        //Checking if the user is logged in
        if(!req.session.userId){
          res.redirect('./login')
        }else{next();}
    }

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
//This is the about page of the webpage, talking about what the website is about
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    // This is the EJS file of the login.       
    app.get('/login',function(req,res){
        res.render("login.ejs", shopData);
    });
    // This is the login function to validate and sanitise the user inputs into the login page, to make sure there are no SQL injections and more.
    app.post('/loggedin', function(req, res){
        // Here we are the variable that will store the user inputs. 
        const plainPassword = req.sanitize(req.body.password);
        const username = req.sanitize(req.body.username);
        //Here is the sql code for the db.query to be used for. 
        let sqlquery = "SELECT * FROM user WHERE appuser ='"+ username +"'";
        db.query(sqlquery,(err,result)=>{
            console.log(result);
            console.log(sqlquery);
            console.log(username);
            if(err){
                //Checking out for errors.
                console.log("error");
                res.redirect('./');
            }
            else{
                if (result.length >= 1){
                    //Checking for the length of the user's input and getting the hashed password.
                    const hashPassword = result[0].hashedPassword;
                    console.log(hashPassword);
                    bcrypt.compare(plainPassword,hashPassword,function(err,result){
                        //Now we are comparing the 'password' from the user input with the ones in the database. 
                        if(err){
                            console.log("not working "+ plainPassword);
                            res.redirect('./');
                        }
                        else if(result == true){
                            req.session.userId = req.body.username;
                            console.log("This is for the login:"+req.session.userId);
                            console.log(username+" is logged in successfully");
                            //res.send('Hi '+username+" is logged in");
                            res.redirect('./');
                        }
                        else{
                            console.log("credentials not correct "+plainPassword);
                            //res.send("Username or password incorrect");
                            res.redirect('./');
                       }})
                    }
                }
            })
        })

 	app.get('/search', redirectLogin,function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);
        const keyword = req.sanitize(req.query.keyword);
        let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);
    });
    app.post('/registered', [check('email').isEmail()], function (req,res) {
        //Here we are the variable that will store the user inputs.
        const firstName = req.sanitize(req.body.first_name);
        const lastName = req.sanitize(req.body.last_name);
        const saltRounds = 10;
        const plainPassword = req.sanitize(req.body.password);
        const appuser = req.sanitize(req.body.appuser);
        const email = req.sanitize(req.body.email);
        const errors = validationResult(req);

  //Checking for errors from the user's inputs and that the meet the requirments for the registration form. 
        if(!errors.isEmpty()){
           res.redirect('./register');
        } else{
                // saving data in database
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
            //Store hashed password in your database. 
            console.log(hashedPassword);
            let sqlquery = "INSERT INTO user (firstname, lastname,appuser,email, hashedPassword) VALUES ('"+firstName+"','"+lastName+"','" + appuser + "', '" + email + "', '" + hashedPassword + "');";
            ////Here is the sql code for the db.query to be used for. 
            let newUserrecord = [appuser, hashedPassword];
            console.log(sqlquery);
           db.query(sqlquery, newUserrecord, (err, result) => {
            //Checking for error and calling them out. 
             if (err) {
               return console.error(err.message);
             }
             else{
               // res.send(' This user is added to database, name: '+ req.body.appuser + ' password '+ req.body.hashedPassword)
                res.redirect('./');
        }});
        })

}});

    app.get('/list', redirectLogin , redirectLogin, function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
                 let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });

    app.get('/listusers', redirectLogin,function(req,res){
        let sqlquery = "SELECT appuser, email FROM user;";
        // query database to get all the users
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
               res.redirect('./');
}
            let newData = Object.assign({}, shopData, {listusers:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
          });
    });

    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
     });

     app.post('/bookadded', function (req,res) {
           // saving data in database
           const name = req.sanitize(req.body.name);
           const price = req.sanitize(req.body.price);
           let sqlquery = "INSERT INTO books (name, price) VALUES (?,?);";
           // execute sql query
           let newrecord = [name, price];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This book is added to database, name: '+ name + ' price '+ price);
             });
       });

       app.get('/bargainbooks', redirectLogin, function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20;";
        db.query(sqlquery, (err, result) => {
          if (err) {
             res.redirect('./');
          }
          let newData = Object.assign({}, shopData, {availableBooks:result});
          console.log(newData)
          res.render("bargains.ejs", newData)
        });
    });

        app.get('/logout',redirectLogin, (req,res)=>{
            console.log("This is for the logout"+req.session.userId);
            //Checking for errors and sending a message that the user has logout and they can go back to the Home page if they want to.
            req.session.destroy(err=>{
            if(err){
                return res.redirect('./')
            }
                //console.log(req.session.userId);
                res.send('you are now logged out. <a href='+'./'+'>Home</a>');
                //res.redirect('./')
            })
        });

}

