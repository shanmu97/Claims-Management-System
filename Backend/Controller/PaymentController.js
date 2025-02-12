let payments = [];

const getPayment = (req, res) => {
    res.json({ payments });
};

const postPayment = (req, res) => {
    const { amount, policyId, payer } = req.body;



    const newPayment = {
        id: payments.length,
        amount,
        policyId,
        payer
    };

    payments.push(newPayment);
    res.status(201).json(newPayment);
};

const putPayment = (req, res) => {
    const { id } = req.params;
    const { amount, policyId, payer } = req.body;
    const paymentIndex = payments.findIndex(payment => payment.id === parseInt(id));

    if (paymentIndex === -1) {
        return res.status(404).json({ message: "Payment not found" });
    }

    if (amount && (isNaN(amount) || amount <= 0)) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (policyId && (isNaN(policyId) || policyId < 0)) {
        return res.status(400).json({ message: "Valid Policy ID is required" });
    }

    if (payer && payer.trim().length < 3) {
        return res.status(400).json({ message: "Payer name must be at least 3 characters long" });
    }

    payments[paymentIndex] = {
        ...payments[paymentIndex],
        amount,
        policyId,
        payer
    };

    res.json(payments[paymentIndex]);
};

const deletePayment = (req, res) => {
    const { id } = req.params;
    const paymentExists = payments.some(payment => payment.id === parseInt(id));

    if (!paymentExists) {
        return res.status(404).json({ message: "Payment not found" });
    }

    payments = payments.filter(payment => payment.id !== parseInt(id));
    res.json({ message: "Payment deleted successfully" });
};

module.exports = { getPayment, postPayment, putPayment, deletePayment };
