const {Todo} = require('./../model/todo.js');
const {ObjectID} = require('mongodb');

setDeleteRoute = (app)=>{
    app.delete('/todos/:id',(req,res)=>{
        const {id} = req.params;

        if(!ObjectID.isValid(id)){
            return res.status(404).send({errorMessage:"id is not valid"})
        }

        Todo.findByIdAndRemove(id).then(doc=>{
            if(!doc){
                return res.status(404).send({errorMessage:"id is not found"});
            }

            res.send({doc});
        });
    })
};

module.exports = {setDeleteRoute}
