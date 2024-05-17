import adminModel from "../models/admin.model.js";
import asyncWrapper from "../middlewares/async.js";
import { validationResult } from "express-validator";
import customError from "../middlewares/customError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "../utils/otp.js";
import { sendEmail } from "../utils/sendemail.js";

// Registration
export const signUp = asyncWrapper(async (req, res, next) => {
    // signUp validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new customError(errors.array()[0].msg, 403));
    }
    // Check if admin exists
    const adminExist = await adminModel.findOne({ Email: req.body.Email });
    if (adminExist) {
        return next(new customError("Admin already exists", 403));
    }
    // Compare password with confirm password
    if (req.body.Password !== req.body.ConfirmPassword) {
        return next(new customError("Passwords do not match", 403));
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    // Generate OTP
    const otp = otpGenerator();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes
    // Send verification code
    await sendEmail(req.body.Email, "Verification Code", `Your OTP is ${otp}`);
    // Create admin
    const admin = new adminModel({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: hashedPassword,
        otp: otp,
        otpExpiration: otpExpiration
    });
    // Save admin to database
    const saveAdmin = await admin.save();
    if (saveAdmin) {
        return res.status(201).json({ message: "Admin created successfully" });
    }
});

// Verify OTP
export const verifyOtp = asyncWrapper(async (req, res, next) => {
    try {
        // Get admin email and OTP we sent
        const otp = req.body.otp;
        // Search admin with that email and OTP
        const foundAdmin = await adminModel.findOne({ otp: otp });
        if (!foundAdmin) {
            return next(new customError("Authorization denied", 403));
        }
        // Check if OTP stored in database is equal to the one in request
        if (!foundAdmin.otp === otp) {
            return next(new customError("Wrong OTP", 403));
        }
        // Check if OTP is expired
        if (!foundAdmin.otpExpiration > new Date().getTime()) {
            return next(new customError("OTP expired", 404));
        }
        // Check if OTP has not been verified
        if (foundAdmin.otpVerified === false) {
            return next(new customError("Already verified", 403));
        }
        // Verify OTP turn to true
        foundAdmin.otpVerified = true;
        // Save change to database
        const saveAdmin = await foundAdmin.save();
        if (saveAdmin) {
            return res.status(201).json({
                message: "Account verified",
                admin: saveAdmin
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
export const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if the admin exists
    const admin = await adminModel.findOne({ Email: email });
    if (!admin) {
        return next(new customError("Invalid credentials", 401));
    }
    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, admin.Password);
    if (!isPasswordValid) {
        return next(new customError("Invalid credentials", 401));
    }
    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
    res.status(200).json({ token });
});

// Update admin
export const updateAdmin = asyncWrapper(async (req, res, next) => {
    const { adminId } = req.params;
    const updatedAdminData = req.body; // Data to update
    // Find the admin by ID and update
    const updatedAdmin = await adminModel.findByIdAndUpdate(
        adminId,
        updatedAdminData,
        { new: true } // Return the updated document
    );
    if (!updatedAdmin) {
        return next(new customError("Admin not found", 404));
    }
    res.status(200).json({ admin: updatedAdmin });
});

// Get all admins
export const getAllAdmins = asyncWrapper(async (req, res, next) => {
    const admins = await adminModel.find();
    res.status(200).json({ admins });
});

// Get admin by ID
export const getAdminById = asyncWrapper(async (req, res, next) => {
    const { adminId } = req.params;
    const admin = await adminModel.findById(adminId);
    if (!admin) {
        return next(new customError("Admin not found", 404));
    }
    res.status(200).json({ admin });
});

// Delete admin
export const deleteAdmin = asyncWrapper(async (req, res, next) => {
    const { adminId } = req.params;
    const deletedAdmin = await adminModel.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
        return next(new customError("Admin not found", 404));
    }
    res.status(200).json({ message: "Admin deleted successfully" });
});
