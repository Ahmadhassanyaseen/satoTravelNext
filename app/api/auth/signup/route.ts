import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log("Signup attempt for:", email); // Debug log

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }), 
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Generated hash:", hashedPassword); // Debug log

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    // Generate token
    const token = sign(
      { 
        email: user.email, 
        name: user.name, 
        role: user.role,
        id: user._id 
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({ 
        message: "User created successfully",
        token,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          id: user._id
        }
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in sign-up:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500 }
    );
  }
}
