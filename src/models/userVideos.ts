import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    url: string;
}

const VideoSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true }
});

const UserVideo = mongoose.model<IVideo>('UserVideo', VideoSchema);
export default UserVideo;
