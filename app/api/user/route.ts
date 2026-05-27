import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

function getTokenFromHeader(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return null;

  return parts[1];
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = getTokenFromHeader(req);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as any;

    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const token = getTokenFromHeader(req);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as any;

    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const { monthlyBudget } = await req.json();

    if (!monthlyBudget || monthlyBudget <= 0) {
      return NextResponse.json(
        { message: "Invalid budget amount" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        monthlyBudget,
      },
      {
        new: true,
      }
    ).select("-password");

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}