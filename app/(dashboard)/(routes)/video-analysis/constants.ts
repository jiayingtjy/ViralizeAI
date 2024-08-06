import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().nonempty("Prompt is required"),
  video: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("video/"), {
      message: "Must be a video file",
    })
    .optional(),
});
