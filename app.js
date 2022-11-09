const saveRoutes = require('./routes/rest_usuarios');
const librosRoutes = require('./routes/route_libros');
const express = require('express');
const request = require("request");
const res = require('express/lib/response');
const con = require('./bd');
const path= require('path');
const fs = require('fs');
const multer = require("multer");
const app = express();
const session = require('express-session');
const http= require("http"); 
const server = http.createServer(app) 

/*UPLOAD FILE*/
const checkFileType = function (file, cb) { 
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: Solo imagenes!!");
    }
};

const storage = multer.diskStorage({
    destination:'upload/',
    filename: function(req,file,cb){
        cb("",file.originalname); //agregar fechahoraminutosegundo para no reemplazar la existente
    }
});
const upload = multer({
    storage:storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
/**/

/*SESSION*/
app.use(session({
    secret:'ESTO ES SECRETO',
    resave: true,
    saveUninitialized:true
}));

app.use(function(req, res, next) {
    res.locals.user = req.session.UltimoUsuario;
    next();
});
/**/


app.use('/upload', express.static('upload'));
app.set('views' , path.join(__dirname,'views'));
app.set('views engine' , 'ejs'); 

saveRoutes(app);

//REST USUARIOS  
app.get('/', (req , res)=>{
    request('http://localhost:3008/rest_usuarios',(err,response,body)=>{
        if (!err){
             const users = JSON.parse(body); 
             res.render('login.ejs', {
                users:users
              });
        }
    }) 
});

/*ADD NEW LIBRO*/
app.post("/add", upload.single('imagen'), (req, res)=>{
    //console.log(req);
    var _titulo = req.body.titulo;
    var _autor = req.body.autor;
    var _descripcion = req.body.descripcion;
    var archivo = req.file.originalname;
    const estado='A';

    var re = /^[a-zA-Z ]*$/;
    if(`${req.session.IdUsuario}`!='undefined'){
        if((_titulo.length<=20) && (_autor.length<=20)&& (_descripcion.length<=50)){
            if(`${req.session.IdUsuario}`){
                con.query("insert into tb_libro_final (id,titulo,autor,desceipcion,path_img,estado) VALUES (0,'"+ _titulo +"', '"+ _autor +" ', '"+ _descripcion +"','"+ archivo +" ','"+ estado +" ')", (err, respuesta)=>{
                    if (err) throw err;
                    msg ='Crea libro [titulo: '+_titulo+']';
                    id= `${req.session.IdUsuario}`;
                    con.query("insert into tb_log_final (id,fecha_hora,usuario,descripcion,estado) VALUES (0,now(), '"+ id +" ', '"+ msg +"','"+ estado +" ')", (err, respuesta)=>{
                        if (err) throw err;
                        console.log('Log guardado');         
                    }); 
                    res.redirect('/reload'); 
                    console.log('Guardado');        
                    
                });     
            }else{
                console.log('No existe session');
            }        

        }else{
            res.writeHead(400, {'Content-Type': 'text/plain' });
            res.end('400 Bad Request. - Tamaño');
            return;
        }
}else{
    res.redirect('/');   
}    
});
/*FIN NUEVO LIBRO*/

/*RUTAS*/
app.use('/',librosRoutes);

app.use('/static', express.static(path.join(__dirname, 'static')));


/*INICIO SERVER*/
server.listen(3008, ()=>{
    console.log('Server OK en Localhost:3008')
});  
/* */

