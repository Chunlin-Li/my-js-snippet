'use strict';

var obj = {},start, x,
    assert = require('assert'),
    N = 1000 * 100;
start = process.hrtime();

/*####################################*/
var obj1 = '{"timestamp":"2016-02-16T16:01:35.595Z","hostname":"dcbef4d12cfc","content":{"reqInfo":"start_r新闻舆论工作是党的一项重要工作,是治国理政、定国安邦的大事,要适应国内外形势发展,从党的工作全局出发把握定位,坚持党的领导,坚持正确政治方向,坚持以人民为中心的工作导向,尊重新闻传播规律,创新方法手段,切实提高党的新闻舆论传播力、引导力、影响力、公信力。　　 做好党的新闻舆论工作,事关旗帜和道路,事关贯彻落实党的理论和路线方针政策,事关顺利推进党和国家各项事业,事关全党全国各族人民凝聚力和向心力,事关党和国家前途命运。必须从党的工作全局出发把握党的新闻舆论工作,做到思想上高度重视、工作上精准有力。　　——2016年2月19日,中共中央总书记、国家主席、中央军委主席eq /bidrequest application/x-protobuf v2_6,start_time 2016-02-16T16:01:35.550Z,_reqId 408e22fffa7c413ebfd7c1830b8e1297,_requester 564c5bafbff38506004082a8,_imp_size 320*50,set_bid_floor 100,_dsp_resp 55811c4bd473f20c000aba60#55811c4bd473f20c000aba60 set_price 158.47999572753906,_dsp_resp 5657f3e7dd49800600085abb#5660193db0fcfa0600120be8 empty_response,_dsp_resp 5666447380963b060049c000#566691b9736dd40600e656db empty_response,_dsp_resp 564410dabff38506004082a4#564410dabff38506004082a4 empty_response,_dsp_resp 564410dabff38506004082a4#565de0cd9ef1f10600c3f582 empty_response,_bid_result 55811c4bd473f20c000aba60 win_at 90.9 103,_ssp_resp success 55811c4bd473f20c000aba60,process_time 45.453454ms","sspRequest":{"id":"408e22fffa7c413ebfd7c1830b8e1297","imp":[{"id":"1","banner":{"id":"5805","w":320,"h":50,"wmax":null,"hmax":null,"wmin":null,"hmin":null,"btype":[],"wtype":["IMAGE"],"battr":[],"pos":null,"mimes":[],"keywords":[],"bwords":[]},"bidfloor":100}],"site":null,"app":{"id":"396905","name":null,"bundle":"com.appbyme.app138786","domain":null,"storeurl":null,"cat":null,"sectioncat":null,"pagecat":null,"ver":null,"paid":0,"publisher":{"id":"564c5bafbff38506004082a8","name":null,"cat":[],"domain":"com.appbyme","type":null,"slot":null},"keywords":[]},"user":null,"device":{"ua":"Mozilla/5.0 (Linux; U; Android 4.3; zh-cn; R7007 Build/JLS36C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Appbyme","geo":null,"ip":"180.119.76.22","devicetype":"MOBILE","make":null,"model":"unknow","hwv":null,"os":"android","osv":"4.3","w":720,"h":1280,"js":0,"language":null,"connectiontype":"WIFI","imei":"864892023093441","mac":"a4:3d:78:ec:c2:15","idfa":null,"carrier":null,"androidid":null},"test":0,"tmax":300,"at":1,"wseat":[],"scenario":{"type":"APP","info":null}},"sspResponse":{"id":"408e22fffa7c413ebfd7c1830b8e1297","seatbid":[{"bid":[{"id":"55811c4bd473f20c000aba60_6461","impid":"1","price":90.9,"adm":"{\\"src\\":\\"http://res.limei.com/creative/544958533662.jpg\\"}\\n","adomain":"112.4.17.117","bundle":null,"iurl":"http://103.249.254.121/i?i=hZFNb9NAEIb_iw9zQMjZb68jjZCjKqWRUoiq0sIl2g87XcWOtxuntEX8dzb0wAXEHmbn8Lwzr975UYwp7MKhmBcP0xTns1kobfBlH4Y2lG4cZh-CR0F0y1jXdaZygvLWdr5yVHNidUtZXcEOlVAUHComawkxYdM0i9tT2ny_G5brG7vf6utPk1jQ29V-ec8PX1-WfLINpINHRgRhUteawbEfJ5SaSHBxh7SqGLghYgXPyBQYi-BRK6FrRhgnNReCgg8-ayAhJb8fDJh9lyZG-zK0559yXWkFI2Z4ymXXImMcXEIhYfCoNKMwOCTQG4R-RHAT5s2nPBNCRKpJSWldVqpkDCaDxfsitY9XPqf2v2gymvP0bcqslJpSJ6wXFe8YcdmssUaRzByP8Qwo4aQ1ne06riVRJCejmdEZ8Me4CP5zCq7N4J9000W9GrrLtZFrvrq4Xn55bMzTetxeqpvN29y_yuI3eqr9U_y47Pb3K5uC3a7vNinS56tdlsWT7cPx4c31v02dz1XMD6e-z314Pa_gjLyTpPj5Cw","w":320,"h":50,"adid":"6461","nurl":"http://103.249.254.121/n?n=hZHLbtswEEX_RYtZFTLfogwMChmB0xhwWiPIo90YfEgOYcliaDkPFP330s0imxblgtycO7w487MYU9iFQzEvHqcpzmezl9IGX_ZhaEPpxmH2OXgURLeMdV1nKicob23nK0c1J1a3lNUV7FAJRcGhYrKWEBM2TbO4PaXNy_2wXN_Y_VZff53Egt6u9ssHfvj-tuSTbSAdPDIiCJO61gyO_Tih1ESCizukVcXADREreEWmwFgEj1oJXTPCOKm5EBR88DkDCSn5c2DA3Ls0Mdq3oT2_lOtKKxgxw1O-di0yxsElFBIGj0ozCoNDAr1B6EcEN2H--ZRnQohINSkprctKlYzBZLD4VKT26cpna_9Tk9Hs07cps1JqSp2wXlS8Y8TlssYaRTJzPMYzoIST1nS267iWRJFsRjOjM-CPcRH8txRcm8EPu-miXg3d5drINV9dXC_vnhrzvB63l-pm8z73r7H4g55q_xy_LLv9w8qmYLfr-02K9PVql2PxZPtwfHxv_e9S53UV88Op73_9Bg","cid":"1772","crid":"62595","cat":null,"attr":null,"curl":"http://103.249.254.121/c?c=hVJdi9UwEP0vlc6T5CaTNE0XBkFE0QfXF_Gx5KO5Vm9uS28FRfzvTnTvPiy7LJQ5hzknTCcnv5uluWm-7vt6czhEEeYkTnOZZhGXcng1JzLSTYg5Z99Ho_QUcuqjcloGNykcejiSNVZBJIvd0MF2ToTSSOzc4BAup2WnzskO4nok1fcIsazUw09CCz4QJHLWuAElajloYxSkOfEZKMT_IPy6hl9lqqi0652FhdiyczlOhKghbmTYncg6VFAiSYg7IcwrKSeFUoPorUCE3RPsP7YTQS1151b7FjN_F7FvPuc5fvNFxDN3Sovx9fR5-KKO67t4m135_uFt_lTbZWl1ki3a84UJY1GMD7aobbyT9dXm7wheyXDFcLXck3iVKhnH2zfvP45jq_O_eDinOXH_uXRGMdbLZ6ghVaghMdYkGKoBLZdHr5rH_x_zYLfmZbPxq3luONsC27rOKRVNSKbXGWWUUvrgrWT5UmVrYhd8Djlr10kr-fE49O7Fk0Lz5y8","type":"IMAGE","extiurl":["http://s.trafficjam.cn/s,BeU9W1gpGcOf8mkJFfPm,mo=0&ns=&m1=864892023093441&m2=&m3=&m1a=&m2a=&m9=&m9b=&m1b=&m1c=&m9c=__ODIN__"],"action":null,"admtype":"JSON"}],"seat":"lm"}],"bidid":"55811c4bd473f20c000aba60","nbr":null,"process_time":5}},"view":{"timestamp":"2016-02-16T16:01:35.754Z","hostname":"93d7815ac207","content":{"origin":"http://i.bid.limei.com/?id=408e22fffa7c413ebfd7c1830b8e1297&g=6461&c=62595&pr=AAABUurQwWmFMSbk_8NOt4B1UJkFX3nYyF3tbA&rnd=2040258982&slot=5805&cpg=1772&cmp=7&x=26&ab=&d=864892023093441&didt=5&r=1000000&m=com.appbyme.app138786&o=1&dt=1&ge=223&cr=45&md=6821&mc=0&la=&lo=&ct=2&cur=1&ip=180.119.76.22&ta=","reqId":"408e22fffa7c413ebfd7c1830b8e1297","bidder":"55811c4bd473f20c000aba60","ssp":"564c5bafbff38506004082a8","dspBidPrice":103,"sspBidPrice":90,"publisher":"564c5bafbff38506004082a8","slot":null,"size":"320*50","ua":"Mozilla/5.0 (Linux; U; Android 4.3; zh-cn; R7007 Build/JLS36C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Appbyme","referrer":"http://adapi.mobcent.com/clientapi/adpro/viewAd.do?t=1455638444657&adState=1&adsmongoPtid=null&advId=5805&ak=6HpBaTt5tWPO66ef18&akKey=APK_6HpBaTt5tWPO66ef18&appId=396905&ch=&esc=&grpId=22&iaid=&im=864892023093441&imochaPtid=&ip=180.119.76.22&jwd=119.83795166015625_32.40187072753906&lo=&mc=a4%3A3d%3A78%3Aec%3Ac2%3A15&net=0&nw=1&orgOs=ANDR&orgOsVer=4.1&os=1&ouid=&pn=com.appbyme.app138786&pt=ANDR_18&referenceVersion=18&sd=&ss=720x1280&ua=R7007&udid=&uid=62674&usa=Mozilla%2F5.0+%28Linux%3B+U%3B+Android+4.3%3B+zh-cn%3B+R7007+Build%2FJLS36C%29+AppleWebKit%2F534.30+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Mobile+Safari%2F534.30+Appbyme&versn=8&wifi=1&wo=&wqmobilePtid=null&zo=zh&dt=14","ip":"::ffff:180.119.76.22","time":1455638495753,"reqTime":1455638495594}}}';
var obj2 = '{"modifyField":"modifyValue"}';
/*####################################*/

for(let i = 0 ; i < N; i++) {  }
start = process.hrtime(); for(let i = 0 ; i < N; i++) {}
console.log('container cost ' + timeUse(start)); for(let i = 0 ; i < N; i++) {obj[i] = 'data' + i;}



start = process.hrtime();
/****   section 1 ******************/
/***********************************/
for(let i = 0 ; i < N; i++ ) {
    assert.deepStrictEqual(obj1.length, 5996);
}
/***********************************/
console.log('section 1 : ' + timeUse(start));start = process.hrtime();for(let i = 0 ; i < N; i++) {} console.log('container cost ' + timeUse(start));



start = process.hrtime();
/****   section 2 ******************/
/***********************************/
for(let i = 0 ; i < N; i++) {
    assert.deepStrictEqual(Buffer.byteLength(obj1), 6518);
}
/***********************************/
console.log('section 2 : ' + timeUse(start));


function timeUse(start) {var t = process.hrtime(start);return '' + (t[0] * 1000000000 + t[1])/1000000 + 'ms';}