let mongoose=require('mongoose');

let tasksSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DevelopersCollection'
    },
    dueDate: {
        type: Date
    },
    taskStatus: {
        type: String,
        validate:{
            validator:function(status){
                if(status === "InProgress" || status === "Complete"){
                    return true;
                }
                else{
                    return false;
                }
            },
            message:'Should be either InProgress or Complete. Sorry :('
        }
    },
    taskDescription: {
        type: String
    }
});

let tasksModel=mongoose.model("TasksCollection",tasksSchema);
module.exports=tasksModel;