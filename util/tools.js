function clean(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null)
    );
}

function getTransaction(transaction) {
    return clean({transaction});
}

module.exports = {
    clean,
    getTransaction
};
