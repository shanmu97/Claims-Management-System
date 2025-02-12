let claims = [];

const getClaim = (req, res) => {
    res.json({ claims });
};

const postClaim = (req, res) => {
    const { claimNumber, policyId, claimantName, amount, status } = req.body;



    const newClaim = {
        id: claims.length,
        claimNumber,
        policyId,
        claimantName,
        amount,
        status: status.toLowerCase()
    };

    claims.push(newClaim);
    res.status(201).json(newClaim);
};

const putClaim = (req, res) => {
    const { id } = req.params;
    const { claimNumber, policyId, claimantName, amount, status } = req.body;
    const claimIndex = claims.findIndex(claim => claim.id === parseInt(id));

    if (claimIndex === -1) {
        return res.status(404).json({ message: "Claim not found" });
    }

    if (claimNumber && claimNumber.trim().length < 5) {
        return res.status(400).json({ message: "Claim Number must be at least 5 characters long" });
    }

    if (policyId && (isNaN(policyId) || policyId < 0)) {
        return res.status(400).json({ message: "Valid Policy ID is required" });
    }

    if (claimantName && claimantName.trim().length < 3) {
        return res.status(400).json({ message: "Claimant Name must be at least 3 characters long" });
    }

    if (amount && (isNaN(amount) || amount <= 0)) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (status && !validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: `Status must be one of the following: ${validStatuses.join(", ")}` });
    }

    claims[claimIndex] = {
        ...claims[claimIndex],
        claimNumber,
        policyId,
        claimantName,
        amount,
        status: status ? status.toLowerCase() : claims[claimIndex].status
    };

    res.json(claims[claimIndex]);
};

const deleteClaim = (req, res) => {
    const { id } = req.params;
    const claimExists = claims.some(claim => claim.id === parseInt(id));

    if (!claimExists) {
        return res.status(404).json({ message: "Claim not found" });
    }

    claims = claims.filter(claim => claim.id !== parseInt(id));
    res.json({ message: "Claim deleted successfully" });
};

module.exports = { getClaim, postClaim, putClaim, deleteClaim };
