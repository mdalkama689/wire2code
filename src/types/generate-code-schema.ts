import z from "zod";

const generateCodeSchema = z.object({
  modelName: z.string(),
  CODE_PROMPT: z.string(),
  imageUrl: z.string(),
  roomId: z.string(),
});

export default generateCodeSchema;
