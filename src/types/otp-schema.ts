import {z} from 'zod'

const otpSchema = z.object({
    email: z.string().email({message: "Invalid email format"}), 
    otp: z.string().regex(/^\d{6}$/, ({message: "OTP must be 6 digits and only contain numbers"}))
})


export default otpSchema 