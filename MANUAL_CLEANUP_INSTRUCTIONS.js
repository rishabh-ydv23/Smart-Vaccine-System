// Manual MongoDB Cleanup Instructions
//
// 1. Open MongoDB Compass or Atlas Shell
// 2. Connect to your database cluster
// 3. Select your database (SmartVaccine)
// 4. Run these commands one by one:

// First, check what users exist:
// db.users.find({}, {email: 1, name: 1}).pretty()

// Then, search for your specific email (case insensitive):
// db.users.find({email: {$regex: "CHANGE_ME_ADMIN_EMAIL", $options: "i"}})

// Finally, delete the account:
// db.users.deleteMany({email: {$regex: "CHANGE_ME_ADMIN_EMAIL", $options: "i"}})

// Alternative approach - delete by exact email:
// db.users.deleteOne({email: "CHANGE_ME_ADMIN_EMAIL"})

// If you know the ObjectId, you can delete directly:
// db.users.deleteOne({_id: ObjectId("your-object-id-here")})

console.log(`
📝 Manual MongoDB Cleanup Instructions:

1. Open MongoDB Compass or Atlas Web Interface
2. Connect to: mongodb+srv://smartvaccineuser:CHANGE_ME_MONGODB_PASSWORD@smartvaccine.uvb3wyh.mongodb.net/
3. Select your database
4. Go to the "users" collection
5. Run these commands in the shell:

// Check all users first:
db.users.find({}, {email: 1, name: 1}).pretty()

// Search for your email:
db.users.find({email: {$regex: "CHANGE_ME_ADMIN_EMAIL", $options: "i"}})

// Delete the account:
db.users.deleteMany({email: {$regex: "CHANGE_ME_ADMIN_EMAIL", $options: "i"}})

This will remove any accounts registered with CHANGE_ME_ADMIN_EMAIL
and allow you to register again.
`);