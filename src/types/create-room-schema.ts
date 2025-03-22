import {z} from 'zod'

const createRoomSchema = z.object({
    roomId: z.string(),
    selectedFile: z.instanceof(File),
    description: z.string(),
    selectedModel: z.string()
})


export default createRoomSchema