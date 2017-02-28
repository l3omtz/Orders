const pg = require('pg');

// Create a config to configure both pooling behavior
// and client options
var config = {
  user: 'sf179', //env var: PGUSER
  database: 'sf179', //env var: PGDATABASE
  password: 'So61IfRmm703', //env var: PGPASSWORD
  host: '75.126.137.85', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}
// This initializes a connection pool
// it will keep idle connections open for a 30 seconds
// and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);


// To run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect (function(err, client, done) {
  if(err){
    return console.error('Error fettching client from pool', err);
  }

  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    // Call 'done()' to release the client back to the pool
    done();

    if (err) {
      return console.error('error running query', err);
    }
    console.log(result.row[o].number);
  });

}); // END

pool.on('error', function(err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out 
  console.error('idel client error', err.message, err.stack);
});
