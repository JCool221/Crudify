const db = require('./config/connection');
const { User } = require('./models')


// db.once('open', () => {
//   });

run()
async function run() {
    try {
        const user = new User({ 
            username: "Josh", 
            email: "Josh@cool.com",
        });
        await user.save()
        console.log(user)           
    } catch (e) {
        console.log(e.message)
    }
}
