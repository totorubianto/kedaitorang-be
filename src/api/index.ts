import * as midtransClient from 'midtrans-client';
export function routers(router, payload, client) {
    router.get("/get-post", async (req: any, res) => {
        const query = {}
        console.log(req.query)
        if (req.query.category) {
            query["category.category"] = { in: req.query.category }
            if (req.query.category == "Semua") query["category.category"] = {}
        }

        const posts = await payload.find({
            collection: "products",
            where: query
        });
        return res.json(posts);
    });
    router.post("/inquiry", async (req: any, res) => {
        console.log(req.body)
        const midtrans = new midtransClient.Snap({
            isProduction: false,
            serverKey: "SB-Mid-server-MQrx8IX8TUh0Mqcv8io2OSax",
            clientKey: "SB-Mid-client-G5_97AQHe2xUG3FE"
        });
        const midtransRef = new Date().getTime().toString()
        const parameter = {
            "transaction_details": {
                "order_id": midtransRef,
                "gross_amount": req.body.amount
            },
            "credit_card": {
                "secure": true
            },
        };
        const response = await midtrans.createTransaction(parameter)
        return res.json(response);
    });
    router.post("/info", async (req: any, res) => {
        console.log(req.body)
        return res.json({ ok: "yes" });
    });
    router.post("/message", async (req: any, res) => {
        console.log(req.body)
        return res.json({ ok: "yes" });
    });

    // utp
    router.post("/request-otp", async (req: any, res) => {
        function generateRandomIntegerInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const phone = req.body.phone;
        const otp = generateRandomIntegerInRange(1000, 9999)
        const message = `kode otp anda ada lah _*${otp}*_`;

        const post = await payload.create({
            collection: "otps", // required
            data: {
                // required
                phoneNumber: phone,
                otp,
            },
            locale: "en",
            overrideAccess: true,
            showHiddenFields: false,
        });


        client.sendMessage(phone, message.toString())
            .then(response => {
                res.status(200).json({
                    error: false,
                    data: {
                        message: 'Pesan terkirim',
                        meta: response,
                    },
                });
            })
            .catch(error => {
                console.log(error)
                res.status(200).json({
                    error: true,
                    data: {
                        message: 'Error send message',
                        meta: error,
                    },
                });
            });
    })
    router.post("/validate-otp", async (req: any, res) => {
        const test = await payload.find({
            collection: "otps",
            limit: 1,
            where: {
                and: [
                    { "phoneNumber": { equals: req.body.phone } },
                    { "otp": { equals: req.body.otp } }
                ]
            },
        })
        if (test.docs.length < 1) return res.status(400).json({})

        await payload.login({
            collection: "users",
            data: {
                email: "toto@mareco.id",
                password: "Toto123!",
            },
            req: req,
            res: res,
            depth: 2,
            locale: "en",
            overrideAccess: true,
            showHiddenFields: true,
        });
        return res.status(200).json({})
    })
    router.get('/check-table/:id', async (req, res) => {
        const id = req.params.id
        const test = await payload.find({
            collection: "reservation",
            limit: 1,
            deep: 3,
        })
        const exist = test.docs.find(e => e.table.name == id)
        if (exist) return res.status(400).json({})
        // if (test.docs.length < 1) return res.status(400).json({})
        return res.json(test)
    })
    return router
}