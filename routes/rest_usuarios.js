const cargaController = require("../controllers/c_get_usuario");
module.exports = (app) => {
  app.route("/rest_usuarios").get(cargaController.getUsuarios);  
};
  