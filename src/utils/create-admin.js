const rl = require("readline-sync");
const genPassword = require("password-generator");

const models = require("../lib/models");

module.exports = (args, callback) => {
    const email = rl.questionEMail("Email: ");
    const password = rl.question("Password [auto-gen]: ", {
        defaultInput: genPassword(),
        hideEchoBack: true,
    });

    const User = models("User");
    const user = new User({
        email,
        password,
        siteAdmin: true,
    });

    user.save(err => {
        if (err) {
            return callback(err);
        }

        console.log("Admin User Created:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        callback();
    });
};
