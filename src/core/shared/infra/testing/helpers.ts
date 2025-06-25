import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Config } from "../config";

export function SetupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;    
    Config
    beforeAll(async () => {
         _sequelize = new Sequelize({
            ...Config.db(),
            ...options
         })
    })

    beforeEach(async () => await _sequelize.sync({ force: true }))

    afterAll(async () => await _sequelize.close())

  return {
    get sequelize() {
      return _sequelize;
    },
  };
} 