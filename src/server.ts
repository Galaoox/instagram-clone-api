import app from '.';

const port = 3000 // TODO: cambiar el puerto de ejecucion
app.listen(port, () => {
    console.log("Server run on port: ", port);
});