const { Eureka } = require('eureka-js-client');

function registerWithEureka(port) {
    const client = new Eureka({
        instance: {
            app: 'meeting',                      // apparaîtra en MAJUSCULES : MEETING
            instanceId: `meeting:${port}`,       // unique par instance (plusieurs ports)
            hostName: 'localhost',
            ipAddr: '127.0.0.1',
            port: { '$': Number(port), '@enabled': true },
            vipAddress: 'meeting',
            homePageUrl: `http://localhost:${port}/`,
            statusPageUrl: `http://localhost:${port}/info`,
            healthCheckUrl: `http://localhost:${port}/health`,
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: 'localhost',
            port: 8761,
            servicePath: '/eureka/apps/',
        },
    });

    client.logger.level('debug');
    client.start((error) => {
        console.log(error || `Meeting enregistré dans Eureka (port ${port})`);
    });

    // Désenregistrement propre à l'arrêt
    process.on('SIGINT', () => client.stop(() => process.exit()));
    process.on('SIGTERM', () => client.stop(() => process.exit()));
}

module.exports = registerWithEureka;