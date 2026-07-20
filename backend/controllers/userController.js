const db = require('../config/connectDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/emailConfig');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        if (!user.is_active) {
            return res.status(403).json({ status: "failed", message: "Account is deactivated" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "failed", message: "Email or Password is not valid" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            status: "success",
            message: "Login Success",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Login failed" });
    }
};

const createUser = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;
        if (!full_name || !email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ status: "failed", message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = db.prepare(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)'
        ).run(full_name, email, hashedPassword, role || 'user');
        const newUser = db.prepare('SELECT id, full_name, email, role, is_active, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ status: "success", message: "User created successfully", user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "User creation failed" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = db.prepare('SELECT id, full_name, email, role, is_active, created_at, updated_at FROM users').all();
        res.status(200).json({ status: "success", users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Failed to fetch users" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = db.prepare('SELECT id, full_name, email, role, is_active, created_at, updated_at FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        res.status(200).json({ status: "success", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Failed to fetch user" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, role } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        db.prepare(
            'UPDATE users SET full_name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).run(full_name || user.full_name, email || user.email, role || user.role, id);
        const updatedUser = db.prepare('SELECT id, full_name, email, role, is_active, updated_at FROM users WHERE id = ?').get(id);
        res.status(200).json({ status: "success", message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "User update failed" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        res.status(200).json({ status: "success", message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "User deletion failed" });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        if (is_active === undefined) {
            return res.status(400).json({ status: "failed", message: "is_active field is required" });
        }
        const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        db.prepare('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(is_active ? 1 : 0, id);
        res.status(200).json({ status: "success", message: "User status updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Status update failed" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = db.prepare('SELECT id, full_name, email, role, is_active, created_at, updated_at FROM users WHERE id = ?').get(req.user.id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        res.status(200).json({ status: "success", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Failed to fetch profile" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { full_name, email } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        if (email && email !== user.email) {
            const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
            if (existing) {
                return res.status(400).json({ status: "failed", message: "Email already in use" });
            }
        }
        db.prepare(
            'UPDATE users SET full_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).run(full_name || user.full_name, email || user.email, req.user.id);
        const updatedUser = db.prepare('SELECT id, full_name, email, role, is_active, updated_at FROM users WHERE id = ?').get(req.user.id);
        res.status(200).json({ status: "success", message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Profile update failed" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        if (!old_password || !new_password || !confirm_password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }
        if (new_password !== confirm_password) {
            return res.status(400).json({ status: "failed", message: "New Password and Confirm Password doesn't match" });
        }
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "failed", message: "Old password is incorrect" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, req.user.id);
        res.status(200).json({ status: "success", message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Password change failed" });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({ status: "success", message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Logout failed" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "failed", message: "Email field is required" });
        }
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
        }
        const secret = user.id + process.env.JWT_SECRET;
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '15m' });
        const link = `http://127.0.0.1:3000/api/users/reset-password/${user.id}/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "ATR Automotive - Password Reset Link",
            html: `<a href="${link}">Click Here</a> to Reset Your Password`
        });
        res.status(200).json({ status: "success", message: "Password Reset Email Sent... Please Check Your Email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Failed to send reset email" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password, confirm_password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        const secret = user.id + process.env.JWT_SECRET;
        jwt.verify(token, secret);
        if (!password || !confirm_password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }
        if (password !== confirm_password) {
            return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password doesn't match" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, id);
        res.status(200).json({ status: "success", message: "Password Reset Successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: "failed", message: "Invalid or Expired Token" });
    }
};


module.exports = {
    login,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserStatus,
    getProfile,
    updateProfile,
    changePassword,
    logout,
    forgotPassword,
    resetPassword
};