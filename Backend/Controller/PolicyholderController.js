let policyholders = [];

const getPolicyholder = (req, res) => {
    res.json({ policyholders });
};

const postPolicyholder = (req, res) => {
    const { name, email, phone, dob, address, policyNumber } = req.body;

    if (!name || name.length < 3) {
        return res.status(400).json({ message: "Name is required and must be at least 3 characters long" });
    }


    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }




    const newPolicyholder = {
        id: policyholders.length,
        name,
        email,
        phone,
        dob,
        address,
        policyNumber
    };

    policyholders.push(newPolicyholder);
    res.status(201).json(newPolicyholder);
};

const putPolicyholder = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, dob, address, policyNumber } = req.body;
    const policyholderIndex = policyholders.findIndex(ph => ph.id === parseInt(id));

    if (policyholderIndex === -1) {
        return res.status(404).json({ message: "Policyholder not found" });
    }

    if (name && name.length < 3) {
        return res.status(400).json({ message: "Name must be at least 3 characters long" });
    }

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }
    }

    if (phone) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
        }
    }

    if (dob && isNaN(Date.parse(dob))) {
        return res.status(400).json({ message: "Valid date of birth is required" });
    }

    if (address && address.trim().length === 0) {
        return res.status(400).json({ message: "Address is required" });
    }

    if (policyNumber && policyNumber.trim().length === 0) {
        return res.status(400).json({ message: "Policy Number is required" });
    }

    policyholders[policyholderIndex] = {
        ...policyholders[policyholderIndex],
        name,
        email,
        phone,
        dob,
        address,
        policyNumber
    };

    res.json(policyholders[policyholderIndex]);
};

const deletePolicyholder = (req, res) => {
    const { id } = req.params;
    const policyholderExists = policyholders.some(ph => ph.id === parseInt(id));

    if (!policyholderExists) {
        return res.status(404).json({ message: "Policyholder not found" });
    }

    policyholders = policyholders.filter(ph => ph.id !== parseInt(id));
    res.json({ message: "Policyholder deleted successfully" });
};

module.exports = { getPolicyholder, postPolicyholder, putPolicyholder, deletePolicyholder };
