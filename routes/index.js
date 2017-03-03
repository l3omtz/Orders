const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

var config = {
  user: 'sf179', //env var: PGUSER
  database: 'sf179', //env var: PGDATABASE
  password: 'So61IfRmm703', //env var: PGPASSWORD
  host: '75.126.173.142', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}

var pool = new pg.Pool(config);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page.*/
router.get('/orders', function(req, res, next) {
  // res.render('index', { title: 'List of Locations' });


  // pool.connect ((err, client, done) => {
  //   if(err){
  //     done();
  //     return res.status(500).json({success: false, data: err});
  //   }else{
  //     console.log('YAY I F***IN DID IT');
  //   }
  //
  //   client.query('SELECT name FROM w_business', (err, result) => {
  //
  //     if(err){
  //       return console.err('error running query', err);
  //     }
  //
  //     res.render('index', {title: result.rows});
  //
  //     console.log(result);
  //
  //     done();
  //   });




const results = [];

  pool.connect ((err, client, done) => {
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }else{
      console.log('YAY I F***IN DID IT');
    }

    const query = client.query('SELECT name FROM w_business');

      if(err){
        return console.err('error running query', err);
      }

      query.on('row', (row) => {
      results.push(row);
    });

      // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
      // res.render('index', {title: result.rows});

      console.log(results);



  }); // END CONNECTION

});


module.exports = router;
