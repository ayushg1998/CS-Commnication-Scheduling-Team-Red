function generateRandomOtp() {
    return (Math.random() + "").substring(2, 8);
}

module.exports = { generateRandomOtp };