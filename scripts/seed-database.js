const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/community-help"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("helprequests").deleteMany({})
    await db.collection("events").deleteMany({})
    await db.collection("messages").deleteMany({})
    await db.collection("conversations").deleteMany({})
    await db.collection("notifications").deleteMany({})

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
