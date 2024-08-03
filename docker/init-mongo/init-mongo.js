// docker/init-mongo/init-mongo.js

db.createUser({
    user: 'admin',
    pwd: 'password',
    roles: [
        {
            role: 'dbOwner',
            db: 'viralizeai',
        },
    ],
});

db = db.getSiblingDB('viralizeai'); // Switch to your database
db.createCollection('prompts'); // Create a collection if needed
db.createCollection('users'); // Create a collection if needed
db.createCollection('persona'); // Create a collection if needed