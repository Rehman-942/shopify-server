const router = require("express").Router();
const paymentController = require("../controllers/payment");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/payment", auth, authAdmin, paymentController.getPayments);
router.post("/payment", auth, paymentController.createPayment);

module.exports = router;
