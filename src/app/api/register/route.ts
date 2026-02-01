import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcrypt"
import { z } from "zod"

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "VENDOR"]).default("USER")
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role } = userSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    })

    // If user is vendor/user, create a wallet for them
    await prisma.wallet.create({
      data: {
        userId: newUser.id,
        balanceBtc: 0,
        balanceUsdt: 0
      }
    })

    const { password: newUserPassword, ...rest } = newUser

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { user: null, message: "Something went wrong" },
      { status: 500 }
    )
  }
}
