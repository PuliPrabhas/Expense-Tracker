import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import Expense from "@/models/Expense";

function getTokenFromHeader(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return null;

  return parts[1];
}

function getDecodedUser(req: Request) {
  const token = getTokenFromHeader(req);

  if (!token) return null;

  return verifyToken(token) as any;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const decoded = getDecodedUser(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const expenses = await Expense.find({
      userId: decoded.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const decoded = getDecodedUser(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      amount,
      description,
      category,
      paymentMode,
      date,
    } = await req.json();

    if (
      !amount ||
      !description ||
      !category ||
      !paymentMode ||
      !date
    ) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const expense = await Expense.create({
      userId: decoded.userId,
      amount,
      description,
      category,
      paymentMode,
      date,
    });

    return NextResponse.json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const decoded = getDecodedUser(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { expenseId } = await req.json();

    if (!expenseId) {
      return NextResponse.json(
        { message: "Expense ID required" },
        { status: 400 }
      );
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      userId: decoded.userId,
    });

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    await Expense.deleteOne({
      _id: expenseId,
    });

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}