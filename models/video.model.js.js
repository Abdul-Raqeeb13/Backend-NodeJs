import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new Schema({

    videoFile : {
        type : String,
        require : true
    },

    thumbnail : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    duration : {
        type : Number,
        required : true
    },

    views : {
        type : Number,
        default : 0
    },

    isPublished : {
        type : Boolean,
        default : true
    },
 
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
    
}, {timestamps : true})


// .plugin(mongooseAggregatePaginate): Adds pagination functionality to aggregation queries on this schema.
// mongooseAggregatePaginate: A plugin that allows you to paginate large datasets efficiently.
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)