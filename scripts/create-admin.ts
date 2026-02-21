import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = "robson_muniz@tutamail.com"
  const password = "^i8sc57#%@4q&$7khS7w69$8Q*!7r^"
  const hashedPassword = await hash(password, 10)

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (user) {
    // Update existing user to ADMIN and set new password
    await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        password: hashedPassword
      }
    })
    console.log(`Updated existing user ${email} to ADMIN with new password.`)
  } else {
    // Create new ADMIN user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        username: "admin"
      }
    })
    console.log(`Created new ADMIN user: ${email}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
