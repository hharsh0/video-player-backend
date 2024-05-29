import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    url: string;
    title: string;
    uploadTime: Date;
    description: string;
}

const VideoSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    uploadTime: { type: Date, default: Date.now, required: true },
    description: { type: String, required: true }
});

const UserVideo = mongoose.model<IVideo>('UserVideo', VideoSchema);
export default UserVideo;
