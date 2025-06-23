import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { Category } from "../../../../domain/category.entity"

describe("CategoryModel Integration Tests", () =>{

    test("Category Model Integration Tests", async () => {  
        let sequelize;

        beforeEach(async () => {
            sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: ':memory:',
                models: [CategoryModel],
             });
             await sequelize.sync({ force: true });
        })
    })
    
})