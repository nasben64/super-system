const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.postStripe = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Please enter a name" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(10 * 100),
      currency: "gbp",
      payment_method_types: ["card"],
      metadata: { name },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
