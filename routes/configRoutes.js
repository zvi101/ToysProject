const indxR = require("./indx");
const usersR = require("./users");
const toysR = require("./toys");


exports.routesInit = (app) => {
    app.use("/", indxR);
    app.use("/users", usersR);
    app.use("/toys", toysR);
}