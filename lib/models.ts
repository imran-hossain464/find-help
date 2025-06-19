import mongoose from "mongoose"

// User Schema - Updated with profile fields
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
})

// Help Request Schema
const helpRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  urgency: { type: String, required: true },
  location: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ["open", "in_progress", "completed"], default: "open" },
  createdAt: { type: Date, default: Date.now },
})

// Help Offer Schema
const helpOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  availability: { type: String, required: true },
  location: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ["active", "fulfilled", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
})

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  maxAttendees: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
})

// Message Schema
const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  createdAt: { type: Date, default: Date.now },
})

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  updatedAt: { type: Date, default: Date.now },
})

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  relatedId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const HelpRequest = mongoose.models.HelpRequest || mongoose.model("HelpRequest", helpRequestSchema)
export const HelpOffer = mongoose.models.HelpOffer || mongoose.model("HelpOffer", helpOfferSchema)
export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)
export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema)
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)
