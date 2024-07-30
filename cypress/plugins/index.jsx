module.exports = (on, config) => {
    on("task", {
        logExecutionTime(message) {
            console.log(message);
            return null;
        },
    });
};
