import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, CreditCard, Download, FileText, Calendar } from "lucide-react"

export default function BillingSettings() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")

  const [currentPlan] = useState("Pro")
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 analyses per month",
        "Basic fact-checking",
        "Email support",
        "7-day history"
      ]
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "$29" : "$290",
      period: billingCycle === "monthly" ? "per month" : "per year",
      features: [
        "Unlimited analyses",
        "Advanced AI fact-checking",
        "Priority support",
        "Unlimited history",
        "Export reports",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom training",
        "White-label options"
      ]
    }
  ]

  const invoiceHistory = [
    { id: "INV-2024-001", date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-2024-002", date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-2024-003", date: "Oct 1, 2024", amount: "$29.00", status: "Paid" },
  ]

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleUpdatePayment = () => {
    showToastMessage("Payment method updated successfully!", "success")
  }

  const handleChangePlan = (planName) => {
    if (planName === currentPlan) return
    showToastMessage(`Upgraded to ${planName} plan!`, "success")
  }

  const handleCancelSubscription = () => {
    showToastMessage("Subscription cancelled. Access until end of billing period.", "success")
  }

  const handleDownloadInvoice = (invoiceId) => {
    showToastMessage(`Downloading invoice ${invoiceId}...`, "success")
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toastType === "success" ? "bg-[#10e956] text-black" : "bg-red-500 text-white"
          }`}
        >
          {toastType === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toastMessage}</span>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Current Plan</h2>
          <p className="text-sm text-gray-400 mb-4">You are currently on the {currentPlan} plan</p>
          
          <div className="bg-gray-700 rounded-lg p-4 border-2 border-[#10e956]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{currentPlan} Plan</h3>
              <span className="text-xs bg-[#10e956] text-black px-2 py-1 rounded font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold mb-1">$29<span className="text-sm text-gray-400">/month</span></p>
            <p className="text-sm text-gray-400 mb-4">Next billing date: January 1, 2025</p>
            <button
              onClick={handleCancelSubscription}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Available Plans</h2>
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-[#10e956] text-black font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  billingCycle === "yearly"
                    ? "bg-[#10e956] text-black font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-gray-700 rounded-lg p-5 border-2 ${
                  plan.popular ? "border-[#10e956]" : "border-gray-600"
                } relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10e956] text-black text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-1">
                  {plan.price}
                  {plan.price !== "Custom" && <span className="text-sm text-gray-400">/{plan.period.split(" ")[1]}</span>}
                </p>
                <p className="text-sm text-gray-400 mb-4">{plan.period}</p>
                
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#10e956] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleChangePlan(plan.name)}
                  disabled={plan.name === currentPlan}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    plan.name === currentPlan
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-[#10e956] text-black hover:bg-[#0ef052]"
                  }`}
                >
                  {plan.name === currentPlan ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h2>
          
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-400">Expires 12/2025</p>
                </div>
              </div>
              <button
                onClick={handleUpdatePayment}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          <button className="px-4 py-2 bg-[#10e956] text-black rounded-lg font-medium hover:bg-[#0ef052] transition-all duration-200">
            Add Payment Method
          </button>
        </div>

        {/* Invoice History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Invoice History
          </h2>
          
          <div className="space-y-3">
            {invoiceHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-gray-400">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <span className="text-xs text-[#10e956] px-2 py-1 bg-[#10e956]/20 rounded">
                      {invoice.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Billing Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                placeholder="Your Company Name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">VAT/Tax ID</label>
              <input
                type="text"
                placeholder="VAT123456"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Billing Address</label>
              <input
                type="text"
                placeholder="123 Main St, Lagos, Nigeria"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20"
              />
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-[#10e956] text-black rounded-lg font-medium hover:bg-[#0ef052] transition-all duration-200">
            Save Billing Info
          </button>
        </div>
      </div>
    </>
  )
}