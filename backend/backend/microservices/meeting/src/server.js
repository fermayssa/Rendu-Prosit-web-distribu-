const app = require('./app');
const registerWithEureka = require('./config/eureka');

const PORT = process.env.PORT || 8083;   // port lu depuis la variable d'environnement PORT

app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  registerWithEureka(PORT);
});
