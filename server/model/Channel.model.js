import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    userId:  String ,
    text: String ,
    time: {
      type: Date,
      default: new Date()
    },
    meta: {
      type: Object,
      default: {}
    }
  },
  {
    _id: false,
    timestamp: true
  }
)

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      unique: true
    },
    usersId: [String],
    messages: [MessageSchema]
  },
  {
    timestamp: true
  }
)

export default mongoose.model('channel', channelSchema)
