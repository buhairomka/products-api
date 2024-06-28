import {registerAs} from "@nestjs/config";
import {config as dotenvConfig} from "dotenv";
import {DataSource, DataSourceOptions} from "typeorm";
import {join} from "path";
//path to env
const path = process.cwd();
dotenvConfig({path: join(path, '.env')})
// dotenvConfig({ path: path.endsWith("migrations") ? join(path, "../../environment/.env") : join(path, "/environment/.env") });
// dotenvConfig({ path: path.endsWith("migrations") ? join(path, "../../environment/.env.local") : join(path, "/environment/.env.local") });

const config = {
    type: "postgres",
    host: `${process.env.POSTGRES_HOST}`,
    port: +`${process.env.POSTGRES_PORT}`,
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    entities: ['**/entities/**.entity.js'],
    // entities: [join(path, `${path.endsWith("migrations") ? ".." : "dist"}/entities/*entity.js`)],
    // migrations: [join(process.cwd(), `${!path.endsWith("migrations") ?'dist/migrations/':''}*.js`)],
    logging: 'all',
    autoLoadEntities: true,
    synchronize: true,
    // migrationsRun: true
} as DataSourceOptions;

export default registerAs("typeorm", () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);