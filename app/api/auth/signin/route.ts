import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt for:", email); // Debug log

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found with this email" }), 
        { status: 401 }
      );
    }

    // Debug logs
    console.log("Stored hashed password:", user.password);
    console.log("Provided password:", password);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isPasswordCorrect); // Debug log

    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ message: "Invalid password" }), 
        { status: 401 }
      );
    }

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
        message: "Login successful", 
        token,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          id: user._id
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in sign-in:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500 }
    );
  }
}
