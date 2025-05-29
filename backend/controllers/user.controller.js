

export const Savedata = async (req, res) => {
    try {
        const { wallet, tier, validUntil, txHash } = req.body;

        // Validate the input data
        if (!wallet || !tier || !validUntil || !txHash) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new user object
        const newUser = {
            wallet,
            tier,
            validUntil,
            txHash
        };

        // Here you would typically save the user to the database
        // For example: await User.create(newUser);

        // Respond with success
        res.status(201).json({ message: "User data saved successfully", user: newUser });
    } catch (error) {
        console.error("Error saving user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}