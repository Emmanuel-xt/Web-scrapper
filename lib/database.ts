import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery' , true)

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URI is not defined')

    if(isConnected) return console.log('==> mongo DB is already connected')

    try {
        await mongoose.connect(process.env.MONGODB_URL)

        isConnected = true

        console.log('MongoDB connected')
    } catch (error) {
        console.log('error connecting to DB' , error)
    }
}