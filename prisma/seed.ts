import {PrismaClient} from "@prisma/client";
import {Products} from "./products";
import {Users} from "./users";


const prisma = new PrismaClient()

async function main(){
    for(let product of Products){
        await prisma.product.create({
            data: product
        })
    }
    for(let user of Users){
        await prisma.user.create({
            data: user
        })
    }
}
main().catch(e=> {
    console.log(e)
    process.exit(1)
}).finally(()=>{
    prisma.$disconnect()
})
