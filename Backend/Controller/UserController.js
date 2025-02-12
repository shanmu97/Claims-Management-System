let users = [];

const getUser = (req, res) => {
    res.json({ users });
};

const postUser = (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || name.length < 3) {
        return res.status(400).json({ message: "Name is required and should be at least 3 characters long" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Valid email is required" });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const validRoles = ["admin", "agent", "customer"];
    if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ message: "Role must be one of: admin, agent, customer" });
    }

    const newUser = { id: users.length, name, email, password, role };
    users = [...users, newUser];
    res.status(201).json(newUser);
};

const putUser = (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    if (name && name.length < 3) {
        return res.status(400).json({ message: "Name should be at least 3 characters long" });
    }

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }
    }

    if (password && password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (role) {
        const validRoles = ["admin", "agent", "customer"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Role must be one of: admin, agent, customer" });
        }
    }

    users[userIndex] = { ...users[userIndex], name, email, password, role };
    res.json(users[userIndex]);
};

const deleteUser = (req, res) => {
    const { id } = req.params;
    const userExists = users.some(user => user.id === parseInt(id));

    if (!userExists) {
        return res.status(404).json({ message: "User not found" });
    }

    users = users.filter(user => user.id !== parseInt(id));
    res.json({ message: "User deleted successfully" });
};

module.exports = { getUser, postUser, putUser, deleteUser };
