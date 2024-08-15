import mongoose, { Schema, Document } from 'mongoose';

export interface IPersona extends Document {
    user_id: string;
    open_id: string;
    union_id: string;
    avatar_url: string;
    avatar_url_100: string;
    display_name: string;
    bio_description: string;
    profile_deep_link: string;
    username: string;
    follower_count: number;
    following_count: number;
    likes_count: number;
    video_count: number;
    is_verified: boolean;
    tags: string[];
}

const PersonaSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    open_id: { type: String, required: true },
    union_id: { type: String, required: true },
    avatar_url: { type: String, required: false },
    avatar_url_100: { type: String, required: false },
    display_name: { type: String, required: false },
    bio_description: { type: String, required: false },
    profile_deep_link: { type: String, required: false },
    username: { type: String, required: true },
    follower_count: { type: Number, required: false },
    following_count: { type: Number, required: false },
    likes_count: { type: Number, required: false },
    video_count: { type: Number, required: false },
    is_verified: { type: Boolean, required: false },
    tags: { type: [String], required: false },
});

export const Persona = mongoose.models.Persona || mongoose.model<IPersona>('Persona', PersonaSchema);
