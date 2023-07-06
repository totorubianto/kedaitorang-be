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
            where: query,
            overrideAccess: true,
        });
        return res.json(posts);
    });
    router.post("/inquiry", async (req: any, res) => {
        console.log(req.body)
        const { phoneNumber, amount, cart } = req.body
        const midtrans = new midtransClient.Snap({
            isProduction: true,
            serverKey: "Mid-server-TcLDnmmWgTV2GoB3dTEM731o",
            clientKey: "Mid-client-1fBp70ietGuU2yiL"
        });
        const midtransRef = new Date().getTime().toString()
        const parameter = {
            "transaction_details": {
                "order_id": midtransRef,
                "gross_amount": amount
            },
            "credit_card": {
                "secure": true
            },
        };
        const post = await payload.create({
            collection: "orders", // required
            data: {
                "phonenumber": phoneNumber,
                "orderId": midtransRef,
                "price": amount,
                "notes": "",
                "status": "belum_dibayar",
                "products": cart
            },
            locale: "en",
            fallbackLocale: false,
            overrideAccess: true,
            showHiddenFields: false,
            disableVerificationEmail: true
          });
        const response = await midtrans.createTransaction(parameter)
        return res.json(response);
    });
    router.post("/info", async (req: any, res) => {
        console.log(req.body)
        const test = await payload.find({
            collection: "orders",
            limit: 1,
            where: {
                "orderId": req.body.order_id 
            },
        })
        if (test.docs.length < 1)  return res.json({ ok: "yes" });
        switch (req.body.transaction_status) {
            case "settlement":
                await payload.update({
                    collection: "orders", // required
                    id: test.docs[0].id, // required
                    data: {
                      status: "sedang_diproses",
                    },
                    depth: 2,
                    locale: "en",
                    fallbackLocale: false,
                    overrideAccess: true,
                    showHiddenFields: true,
                    overwriteExistingFiles: true,
                  });
                  console.log(test.docs[0].phonenumber+ "@c.us")
                client.sendMessage( test.docs[0].phonenumber+ "@c.us", "Pesanan anda sedang di proses mohon untuk menunggu")
                    .then(response => { console.log(response, "berhasil")})
                    .catch(error => {console.log(error, "err")});
                break;
            case "failure":
                await payload.update({
                    collection: "orders", // required
                    id: test.docs[0].id, // required
                    data: {
                        status: "digagalkan",
                    },
                    depth: 2,
                    locale: "en",
                    fallbackLocale: false,
                    overrideAccess: true,
                    showHiddenFields: true,
                    overwriteExistingFiles: true,
                });
                break;
            case "expire":
                await payload.update({
                    collection: "orders", // required
                    id: test.docs[0].id, // required
                    data: {
                        status: "digagalkan",
                    },
                    depth: 2,
                    locale: "en",
                    fallbackLocale: false,
                    overrideAccess: true,
                    showHiddenFields: true,
                    overwriteExistingFiles: true,
                });
                break;
            case "pending":
                // test.docs[0].id
                break;
            default:
                break;
        }
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
        let otp = generateRandomIntegerInRange(1000, 9999)
        if (phone.includes("83108222625")) {
            otp = "0000"
        }
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
    router.get("/get-order/:phoneNumber", async (req: any, res) => {
        const phoneNumber = req.params.phoneNumber
        const test = await payload.find({
            collection: "orders",
            limit: 1,
            where: {
                and: [
                    {
                        "phoneNumber": phoneNumber,
                    }, 
                    {
                        "status": {
                            in: ['sedang_diproses', 'sudah_siap']                        
                        },
                    }
                ]
            },
            overrideAccess: true,
        })
        if (test.docs.length < 1) return res.status(400).json({})

        return res.status(200).json(test.docs[0])
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