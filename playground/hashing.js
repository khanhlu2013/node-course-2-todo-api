const bcrypt = require('bcryptjs');

(async ()=>{
    const password = 'mypass123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    console.log(hash);

    const result = await bcrypt.compare(password,hash);
    console.log(result);
})();