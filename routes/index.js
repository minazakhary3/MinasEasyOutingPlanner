server.get("/", function (req, res) {
    res.redirect("/home");
});

server.use("/api", apiRoute);
server.use("/home", homeRoute);
server.use("/error", errorRoute);
