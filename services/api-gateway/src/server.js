const app = require('./app');
const { port } = require('./config');
app.listen(port, () => console.log(`SentinelVault API gateway listening on :${port}`));
