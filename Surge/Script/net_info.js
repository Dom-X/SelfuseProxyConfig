//感谢fishingworld的源码
//使用了来自ip-api的api
//https://gist.githubusercontent.com/linusxiong/32f8f1f30fbad2c1f3932a4f94725240/raw/0957a8044f6dcb438fc349e32e8cdd618f754c7c/NET_info.js
//https://raw.githubusercontent.com/fishingworld/something/main/PanelScripts/net_info.js

;(async () => {
let params = getParams($argument)
//获取根节点名
let proxy = await httpAPI("/v1/policy_groups");
let allGroup = [];
for (var key in proxy){
   allGroup.push(key)
    }
let group = params.group
let rootName = (await httpAPI("/v1/policy_groups/select?group_name="+encodeURIComponent(group)+"")).policy;
while(allGroup.includes(rootName)==true){
	rootName = (await httpAPI("/v1/policy_groups/select?group_name="+encodeURIComponent(rootName)+"")).policy;
}

$httpClient.get('http://ip-api.com/json/?lang=en', function (error, response, data) {
    const jsonData = JSON.parse(data);
    let asn = jsonData.as.split(' ');
    $done({
      title:rootName,
      content:
        `IP: ${jsonData.query}\n`+
        `ISP: ${jsonData.isp}\n`+
        `ASN : ${asn[0]}\n`+
	`地理位置: ${jsonData.country}`,
      icon: params.icon,
		  "icon-color":params.color
    });
  });

})();


function httpAPI(path = "", method = "GET", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
};

function getParams(param) {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}
