const bcrypt = require('bcrypt');
module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/login',function(req,res){
        res.render("login.ejs", shopData);
    });
    app.post('/loggedin', function(req, res){
        // Here we are the variable that will store the user inputs. 
        const plainPassword = req.body.password;
        const username = req.body.username;
        //Here is the sql code for the db.query to be used for. 
        let sqlquery = "SELECT * FROM user WHERE username ='"+ username +"'";
        db.query(sqlquery,(err,result)=>{
            //let hashedPassword = req.body.hashedPassword
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
                    //Checking for the length of the user's input. 
                    bcrypt.compare(plainPassword,result[0].password,function(err,result){
                        //NOw we are comparing the 'password' from the user input with the ones in the database. 
                        if(err){
                            console.log("not working "+ plainPassword);
                            res.redirect('./');
                        }
                        else if(result == true){
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
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);
        let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
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
    app.post('/registered', function (req,res) {
        //Here we are the variable that will store the user inputs. 
        const saltRounds = 10;
        const plainPassword = req.body.password;
        const appuser = req.body.appuser;
        const email = req.body.email;

        // saving data in database
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
            //Store hashed password in your database. 
            console.log(hashedPassword);
            let sqlquery = "INSERT INTO user (username, email, password) VALUES ('" + appuser + "', '" + email + "', '" + hashedPassword + "');";
            ////Here is the sql code for the db.query to be used for. 
            let newUserrecord = [req.body.appuser, hashedPassword];
            console.log(sqlquery);
           db.query(sqlquery, newUserrecord, (err, result) => {
            //Checking for error and calling them out. 
             if (err) {
               return console.error(err.message);
             }
             else{
                res.send(' This user is added to database, name: '+ req.body.appuser + ' password '+ req.body.hashedPassword);
        }});
        })                                
    }); 
    app.get('/list', function(req, res) {
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

    app.get('/listusers',function(req,res){
        let sqlquery = "SELECT username, email FROM user;"; // query database to get all the users
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
               res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
          });
    });

    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
     });
 
     app.post('/bookadded', function (req,res) {
           // saving data in database
           let sqlquery = "INSERT INTO books (name, price) VALUES (?,?);";
           // execute sql query
           let newrecord = [req.body.name, req.body.price];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
             });
       });    

       app.get('/bargainbooks', function(req, res) {
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
}
