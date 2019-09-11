let mongoose=require('mongoose');

let developersSchema=mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
    },
    level: {
        type: String,
        required: true,
        validate:{
            validator:function(status){
                if(status === "Beginner" || status === "Expert"){
                    return status.toUpperCase();
                }
                else{
                    return false;
                }
            },
            message:'Should be either Beginner or Expert. Sorry :('
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String,
    }
});

let developersModel=mongoose.model("DevelopersCollection",developersSchema);
module.exports=developersModel;