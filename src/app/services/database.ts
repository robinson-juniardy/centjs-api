import { CentJs } from "../../lib"

export const MyDB = new CentJs.Database({
    provider: "sqlserver",
    config: {
        server: "",
        user: "",
        password: "",
        database: "",
        options: {
            encrypt: false,
            trustServerCertificate: true,
        },
        pool: {
            idleTimeoutMillis: 30000,
            max: 10,
            min: 1,
        },
    }
})