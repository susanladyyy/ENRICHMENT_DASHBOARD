import { statuses } from './status';
import { users } from './user'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    for(let user of users) {
        await prisma.user.create({
            data: user
        })
    }
}

main().catch(e => {
    console.log(e)
}).finally(() => {
    prisma.$disconnect()
})