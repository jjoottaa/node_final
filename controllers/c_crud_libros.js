const con = require('../bd');
const controller = {};


var fecha = Date.now();

/*VALIDA LOGIN*/
controller.valida = (req , res)=>{
        const data = req.query;
        const estado='A';       
        con.query("select id as existe from tb_usuarios_final where usuario='"+data.usuario +"' and clave = '"+data.clave+"' and estado='"+estado+"'", (err, respuesta)=>{
            if (err) throw err;
            console.log(respuesta.length);             
            if(respuesta.length>0){               
                req.session.UltimoUsuario= data.usuario;   
                req.session.IdUsuario= respuesta[0].existe;  
                log('Accede al sistema',`${req.session.IdUsuario}`);
                console.log(`UltimoUsuario : ${req.session.UltimoUsuario}`);
                con.query('select * from tb_libro_final order by id desc', (err, libros)=>{
                    if (err) throw err; 
                    res.render('libros.ejs',{
                        data:libros,
                        activo :`${req.session.UltimoUsuario}`,
                        id :`${req.session.IdUsuario}`
                    }); 
                }); 
            }else{
                res.redirect('/'); 
                /*
                res.render('error.ejs',{
                    data:'Error'
                }); 
                */
            }
        });    
};
/* */

/*LOAD NUEVO LIBRO*/
controller.carga_ingresa_libro = (req , res)=>{  
    if(`${req.session.IdUsuario}`!='undefined'){
        res.render('nuevo_libro.ejs',{
            activo :`${req.session.UltimoUsuario}`,
        });  
    }else{
        res.redirect('/');   
    }   
};
/* */

/*ACTUALIZA*/
controller.reload = (req , res)=>{ 
    if(`${req.session.IdUsuario}`!='undefined'){ 
        con.query('select * from tb_libro_final order by id desc', (err, libros)=>{
            if (err) throw err; 
            res.render('libros.ejs',{
                data:libros,
                activo :`${req.session.UltimoUsuario}`
            }); 
        });  
    }else{
        res.redirect('/');   
    }
};
/* */

/*ELIMINA LIBRO*/
controller.delete=(req, res)=>{
    if(`${req.session.IdUsuario}`!='undefined'){
        const id = req.params.id;  
        const titulo = req.params.titulo; 
        con.query("delete from tb_libro_final where id="+id, (err, customers)=>{
            if (err) throw err; 
            log('Elimina libro [titulo : '+titulo+']' ,`${req.session.IdUsuario}`);
                res.redirect('/reload');     
            });        
    }else{
        res.redirect('/');   
    }    
};
/* */

/*LOAD DATOS LIBROS*/
controller.update=(req, res)=>{
    const id = req.params.id;  
    if(`${req.session.IdUsuario}`!='undefined'){
        con.query("select * from tb_libro_final where id="+id, (err, libro)=>{
            if (err) throw err; 
            res.render('editar_libro.ejs',{
                data:libro,
                activo :`${req.session.UltimoUsuario}`
            });     
        });   
    }else{
        res.redirect('/');   
    }      
};
/* */

/*UPDATE LIBRO*/
controller.modifica=(req, res)=>{
    const _id = req.query.id;  
    const _titulo = req.query.titulo; 
    const _autor = req.query.autor;
    const _descripcion = req.query.descripcion;  
    if(`${req.session.IdUsuario}`!='undefined'){
        con.query("update tb_libro_final set titulo='"+_titulo+"' , autor='"+_autor+"' , desceipcion='"+_descripcion +"'  where id="+_id, (err, libro)=>{
            if (err) throw err; 
            log('Modifica libro [titulo: '+_titulo+']',`${req.session.IdUsuario}`);
            con.query('select * from tb_libro_final order by id desc', (err, libros)=>{
                if (err) throw err; 
                res.render('libros.ejs',{
                    data:libros,
                    activo :`${req.session.UltimoUsuario}`
                }); 
            });      
        });  
    }else{
        res.redirect('/');   
    }     
};
/* */

/*LOAD DATA LOGIN*/
controller.login=(req, res)=>{
    const id = req.params.id;  
    console.log(id);
    con.query("select DATE_FORMAT(fecha_hora, '%d-%m-%Y %H:%i')  as fecha_hora, descripcion from tb_log_final where usuario="+id+" order by id desc", (err, historia)=>{
        if (err) throw err; 
        console.log(historia);
        res.render('log_usuario.ejs',{
            data:historia,
            activo :`${req.session.UltimoUsuario}`
        });     
    });            
};
/* */

/*EXIT*/
controller.salir=(req, res)=>{
    log('Exit sistema',`${req.session.IdUsuario}`);
    req.session.destroy();    
    res.redirect('/');   
};
/* */


/*INSERT LOG*/
function log(msg,id){  
    const estado='A';
    con.query("insert into tb_log_final (id,fecha_hora,usuario,descripcion,estado) VALUES (0,now(), '"+ id +" ', '"+ msg +"','"+ estado +" ')", (err, respuesta)=>{
        if (err) throw err;
        console.log('Log guardado');         
    });     
}
/* */






module.exports = controller;