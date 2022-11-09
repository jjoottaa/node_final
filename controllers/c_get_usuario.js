const con = require('../bd');
const getUsuarios = (req, res)=>{
    var estado='A';
    con.query("select * from tb_usuarios_final where estado='"+ estado +"'", (err, customers)=>{
        if (err) throw err; 
            return res.json(customers);
        });   
   /* return res.json(usuarios);*/
} 

module.exports = { getUsuarios};
