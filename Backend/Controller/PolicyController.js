let policies = [];

const getPolicy = (req, res) => {
    res.json({ policies });
};

const postPolicy = (req, res) => {
    const { policyName, policyNumber, policyHolder, startDate, endDate, premiumAmount } = req.body;
    const newPolicy = { id: policies.length, policyName, policyNumber, policyHolder, startDate, endDate, premiumAmount };
    policies.push(newPolicy);
    res.status(201).json(newPolicy);
};

const putPolicy = (req, res) => {
    const { id } = req.params;
    const { policyName, policyNumber, policyHolder, startDate, endDate, premiumAmount } = req.body;
    const policyIndex = policies.findIndex(policy => policy.id === parseInt(id));

    if (policyIndex === -1) {
        return res.status(404).json({ message: "Policy not found" });
    }

    policies[policyIndex] = { ...policies[policyIndex], policyName, policyNumber, policyHolder, startDate, endDate, premiumAmount };
    res.json(policies[policyIndex]);
};

const deletePolicy = (req, res) => {
    const { id } = req.params;
    policies = policies.filter(policy => policy.id !== parseInt(id));
    res.json({ message: "Policy deleted successfully" });
};

module.exports = { getPolicy, postPolicy, putPolicy, deletePolicy };
