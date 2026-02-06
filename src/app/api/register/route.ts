import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcrypt"
import { z } from "zod"

// BTC address validation regex
const btcRegex = /^(1|3|bc1|m|n|2|tb1)[a-zA-HJ-NP-Z0-9]{25,62}$/;

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "VENDOR"]).default("USER"),
  payoutAddress: z.string().optional()
}).superRefine((data, ctx) => {
  // For VENDOR role, payoutAddress is required
  if (data.role === "VENDOR") {
    if (!data.payoutAddress || data.payoutAddress.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "BTC Wallet is required for sellers",
        path: ["payoutAddress"]
      });
      return;
    }
    
    // Validate BTC address format
    if (!btcRegex.test(data.payoutAddress)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid BTC Wallet address format",
        path: ["payoutAddress"]
      });
    }
  }
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role, payoutAddress } = userSchema.parse(body)

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
        role,
        payoutAddress: role === "VENDOR" ? payoutAddress : undefined
      }
    })

    // Create a wallet for the user
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
    console.error('[Registration Error]:', error)

    // Check if it's a Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { user: null, message: `Validation error: ${error.issues[0]?.message || 'Invalid data'}` },
        { status: 400 }
      )
    }

    // Check for Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } }

      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.[0] || 'field'
        return NextResponse.json(
          { user: null, message: `A user with this ${target} already exists` },
          { status: 409 }
        )
      }

      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { user: null, message: 'Database operation failed - record not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { user: null, message: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    )
  }
}
