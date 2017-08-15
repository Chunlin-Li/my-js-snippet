function setFloor(req) {
    var urlObj = url.parse(req.url);
    var selected = ['02ad19a62dc08f30f664', '5910c4de21afc0463e3e', '59dfa07b381216d7e315', '8145e76b68e01899c320', '8c5f9fa8f73970f89719', 'adedcb85470fddd50815', 'b96b9242a5d05d2c0b6e', 'd3e1528ecb40edd9ff8a', 'dad4651c3526536b70a6', 'dd78b63b5dbb0303fc08', 'e3d1a3ddbde1204d3d98', '01b1f6566fbc77663f16', '9868c781aa0db7a48097'];
    var sites = ['020bc5603ea9e4d0f539', '02c0ccfbee77b3215a7f', '02df3d436c1209f0e50c', '056c599925973efd14a1', '0f578d7798c80a13b15c', '13b4b15244c614863b3b', '1bf36fddf513f2d564e3', '1d76f8b6d41ba1b2096f', '1e034f834303a6d20713', '1e583385b1e95024e797', '23fb2497fd4ed493b3dc', '248bcdd223d2782a47b9', '2edcace202c3a2a98881', '30479198868a6cbb87dd', '3378171d02d30888c59f', '34892d0f19c6fc89503b', '35c5cbcc7eada100aa17', '396717d2a8e3e764b0b3', '39d761f8d727ed085cb5', '3c0c3b8fc01d1eee9ddc', '3fa38e2f30f132533419', '451257f7f09342659b3a', '4a90212dd9ad454303eb', '4f6e09bf2f8bbb0bf51f', '51f454015d312d05d376', '5b4511a49dd74c9c78be', '5b9c41be362c753cb15d', '5baf755c5e1e9b62a285', '5d93212d6e44c9f74925', '5faf08d8006ba499c236', '6092b5510fe52c4293ad', '630bb953da02802e051b', '6903d2233e3c7e870560', '6d09e70c65ef722ca272', '6ed7da6e17c3f515e1ae', '709950b8aabc683eda09', '764d17ee0d186d15644f', '788514c6d7e13eb9be20', '7945ca4c7f9ae8bdd27c', '7c6485518ed5b1121f18', '7cb6573d8d2e3e151df7', '7f2ec94696056ffbcf6a', '80fa2a92d34d6c4adb11', '8b5bdc6fca1da063cd75', '8e23dcd3d8fd2039a9f4', '957b7bb8035b00c168d4', '95a5dcd163a49a764814', '9756a911fa7564b58a02', '9a851efe024db52fbb77', '9c910178524d0a99b5fb', '9e4abd64c8920ad160a9', '9ff798c7229774c5c72b', 'a318421943f6cf731745', 'a49bfb87935e4d4d42f3', 'a90099b5d092856324ca', 'aeaa17947254b6b3e3a8', 'aecf675fbaedd74f3762', 'aee63f814039f0e4fe91', 'b6e3cd94d74abe1aaa6f', 'b77f7454dd8028593c29', 'b79bb0dcb0bd384723f7', 'b8e9964bdb6397d19e6b', 'c50b977b4592eab502e5', 'c54d8e840f166bbc9cda', 'c6d895819ca0ee7ca9aa', 'ca39c781c787e0b44f21', 'cefee7e2224c5406072c', 'd9c93a99008600ba3009', 'dd609c2b75e000b57bad', 'e4898f1929a88480070d', 'e59d2b1373f9562bc42f', 'e5a3155ca0159d11c56a', 'e6e79e5f4433ba9c231a', 'e78193b3a2356774cb89', 'ea15bb42e63a3daeacb6', 'ee37ced0e8a33bf370f9', 'f39889b76b683132f0e5', 'fd340457606c89477a33'];
    if (_.has(req.requester, 'mediaproID')) {
        req.exchange_bidfloor = 1
    } else if (selected.indexOf(req.publisher.id) != -1) {
        req.exchange_bidfloor = 300
    } else if (sites.indexOf(req.publisher.id) != -1) {
        req.exchange_bidfloor = 150
    } else if (req.bidRequest.scenario.type == 'SITES') {
        req.exchange_bidfloor = 150
    } else if (req.bidRequest.scenario.type == 'NETBAR') {
        req.exchange_bidfloor = 100
    } else {
        if (req.requester.platform_bid) {
            if (req.bidRequest.device && /android/i.test(req.bidRequest.device.os) && _.has(req.requester.platform_bid, 'android')) {
                req.exchange_bidfloor = req.requester.platform_bid.android || 90
            } else if (req.bidRequest.device && /ios/i.test(req.bidRequest.device.os) && _.has(req.requester.platform_bid, 'ios')) {
                req.exchange_bidfloor = req.requester.platform_bid.ios || 150
            } else {
                req.exchange_bidfloor = 150
            }
        } else {
            req.exchange_bidfloor = 100
        }
    }
    for (var i = 0, len = req.bidRequest.imp.length; i < len; i++) {
        req.bidRequest.imp[i].bidfloor = req.exchange_bidfloor
    }
}
