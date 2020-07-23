const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
const courses = [
    {id:1, name:'course1'},{id:2, name:'course2'},{id:3, name:'course3'}
];

app.get('/', (req,res) => {
    res.send("hi there!!!");
});

app.get('/api/courses', (req,res)=>{
    res.send(courses);
});

app.post('/api/courses', (req,res)=>{

    // const schema = {
    //     name: Joi.string().min(3).required()
    // };
    // const result = Joi.validate(req.body, schema);
    

    // if (result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    const {error} = validateCourse(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {id:courses.length+1, name: req.body.name};
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('not found!!');
    res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{
    //Look up the course
    //if not existing return 404
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('not found!!');
        return;
    }


    //validate
    //if invalid return 400 bad request
    const {error} = validateCourse(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    //return the updated course 
    course.name = req.body.name;
    res.send(course);

});


//validate functoin
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req,res)=>{
    //look up the course
    //if not exist 404
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('not found!!');

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    //return
    res.send(course);

});


// app.get('/api/posts/:years/:months', (req,res)=>{
//     res.send(req.query);
// });

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`server is running at port = ${port}...`));


 