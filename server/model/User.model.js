import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: [String],
      default: ['user']
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamp: true
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = bcrypt.hashSync(this.password)
  return next()
})

userSchema.method({
  passwordMatches(password) {
    console.log(bcrypt.hashSync(password), this.password)
    return bcrypt.compareSync(password, this.password)
  }
})

userSchema.statics = {
  async findAndValidateUser({ email, password }) {
    if (!email) {
      throw new Error('No Email')
    }
    if (!password) {
      throw new Error('No Password')
    }
    const user = await this.findOne({ email }).exec()
    if (!user) {
      throw new Error('No User')
    }
    const isPasswordOk = await user.passwordMatches(password)
    if (!isPasswordOk) {
      throw new Error('PasswordIncorrect')
    }
    return user
  },

  async createAccount({ email, username, password }) {
    if (!email) {
      throw new Error('Email ')
    }
    const user = await this.findOne({ email }).exec()
    if (user) {
      throw Error('Already exists')
    }
    let newUser = new this({
      username,
      email,
      password
    })
    await newUser.save( (err, savedUser) => {
      if (err) {
        throw Error('Save error')
      }
      newUser = savedUser
    })
    return newUser
  }
}

export default mongoose.model('users', userSchema)
