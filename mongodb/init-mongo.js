// Create VizGen database and collections
db = db.getSiblingDB('vizgen');

// Create users collection with indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "created_at": 1 });

// Create connections collection
db.connections.createIndex({ "user_id": 1 });
db.connections.createIndex({ "connection_name": 1 });

// Create sessions collection with TTL
db.sessions.createIndex({ "created_at": 1 }, { expireAfterSeconds: 86400 });

// Create sample user (development only)
db.users.insertOne({
    email: "admin@vizgen.com",
    hashed_password: "$2b$12$example_hash",
    created_at: new Date(),
    is_active: true
});

print("VizGen database initialized successfully!");
