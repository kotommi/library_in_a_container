db.createUser({
    user: 'dev_user',
    pwd: 'dev_password',
    roles: [
        {
            role: 'dbOwner',
            db: 'the_database',
        },
    ],
});

db.createCollection('authors')
db.createCollection('users')
db.createCollection('books')


