
module.exports = function(Router, AuthController) {

    const router = Router();

    router.get('/login', (req, res) => {
        console.log(`called /login`);
        res.send('The result')
    })

    router.post('/login', AuthController.login);

    router.post('/refresh', AuthController.getNewAccessTokenUsingRefreshToken);

    return router;
};
