import { Sequelize } from "sequelize";

class SequelizeDBPoolManager {
  private pools: Map<string, Sequelize>;

  constructor() {
    this.pools = new Map();
  }

  getSequelize(dbName: string): Sequelize {
    if (!this.pools.has(dbName)) {
      const tenantConfig = this.getDatabaseConnectionUrl(dbName);
      
      const sequelize = new Sequelize(tenantConfig, {
        dialect: "mysql",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
      this.pools.set(dbName, sequelize);
    } else {
    }
    return this.pools.get(dbName)!;
  }

  private getDatabaseConnectionUrl(dbName: string) {
    return `${process.env.DB_CONNECTION_URL}/${dbName}`;
  }
}

export const sequelizeDBPoolManager = new SequelizeDBPoolManager()