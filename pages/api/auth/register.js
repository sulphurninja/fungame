import connectDB from "../../../utils/connectDB";
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await register(req, res)
            break;
    }
}



const register = async (req, res) => {
    try {
        const { userName, password, role, balance } = req.body

        const passwordHash = await bcrypt.hash(password, 12)

        const user = await Users.findOne({ userName })
        if (user) return res.status(400).json({ err: 'You are already registerd!' })

        const newUser = new Users(
            { userName, password: passwordHash, role, balance })

        console.log(newUser)
        await newUser.save()
        res.json({ msg: "Successful Registration!" })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}