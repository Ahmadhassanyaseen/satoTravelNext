import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

// CRUD operations handler
export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    // GET all users
    case "GET":
      if (req.query.id) {
        // If there's an 'id' query parameter, fetch a single user
        const user = await User.findById(req.query.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
      } else {
        // Otherwise, fetch all users
        const users = await User.find();
        return res.json(users);
      }

    // POST - Create a new user
    case "POST":
      const { name, email, password, role } = req.body;
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password before saving
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Save the new user to the database
      await newUser.save();
      return res.status(201).json(newUser);

    // PUT - Update an existing user
    case "PUT":
      const { id } = req.query;
      const updateData = req.body;

      // Hash the password if it is being updated
      if (updateData.password) {
        updateData.password = bcrypt.hashSync(updateData.password, 10);
      }

      // Find the user by ID and update their information
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(updatedUser);

    // DELETE - Delete a user by ID
    case "DELETE":
      const { userId } = req.query;

      // Find the user by ID and delete
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(204).end();

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
