import UserD from '../models/userSchema.js';

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const normalizeString = (value = "") => String(value).trim();

export const registerUser = async (req, res)=>{
    const name = normalizeString(req.body?.name);
    const email = normalizeString(req.body?.email).toLowerCase();
    const password = normalizeString(req.body?.password);

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (name.length < 3) {
        return res.status(400).json({ message: "Name must be at least 3 characters" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const existingUser = await UserD.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const newUser = new UserD({name, email, password});
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}

export const loginUser = async (req, res) => {
    const rawName = normalizeString(req.body?.name);
    const rawEmail = normalizeString(req.body?.email).toLowerCase();
    const password = normalizeString(req.body?.password);

    try {
        const query = rawEmail
            ? { email: rawEmail }
            : rawName
                ? { name: rawName }
                : null;

        if (!query || !password) {
            return res.status(400).json({ message: "Name/email and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await UserD.findOne(query);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
