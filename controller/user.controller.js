import User from "../model/user.model.js";
import Organisation from "../model/organisation.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { name, email, password, createNewOrg, organisationName, inviteCode } = req.body;
        console.log("Hello");

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        let organisation;
        let role;

        // Organization handling
        if (createNewOrg) {
            if (!organisationName) {
                return res.status(400).json({
                    success: false,
                    message: "Organisation name is required when creating new organisation"
                });
            }

            const generatedInviteCode = crypto.randomBytes(4).toString("hex");
            organisation = await Organisation.create({
                name: organisationName,
                inviteCode: generatedInviteCode // Fixed: using consistent field name
            });
            role = "Admin";
        } else {
            if (!inviteCode) {
                return res.status(400).json({
                    success: false,
                    message: "Invite code is required to join existing organisation"
                });
            }

            organisation = await Organisation.findOne({ inviteCode });
            if (!organisation) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid invite code"
                });
            }
            role = "Member";
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            organisationId: organisation._id
        });

        // Remove sensitive data before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            user: userResponse,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign({
            userId: user._id,
            role: user.role,
            organisationId: user.organisationId  // Make consistent with your schema
        }, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.status(200).json({
            success: true,
            user: user.toObject(),
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};