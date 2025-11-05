// Root wrapper: wire up modularized app from src and start server only when run directly
const app = require('./src/app');
const port = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
}

module.exports = app;