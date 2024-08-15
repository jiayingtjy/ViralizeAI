import mongoose, { Schema, Document } from 'mongoose';

export interface IPages extends Document {
    name: string[];
    id: mongoose.Types.ObjectId;
}

const PagesSchema: Schema = new Schema({
    name: { type: String, required: true },
    id: { type: mongoose.Types.ObjectId, required: true },
});


export const Pages = mongoose.models.Pages || mongoose.model<IPages>('Pages', PagesSchema);
