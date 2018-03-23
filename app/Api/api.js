import Utils from 'app/common/Utils';
// var url = `http://solutiontrackers.com/dev-a/zerototwo/index.php/Webservice/dealsAndOffer`;
var api = {
    dealsAndOffer(){
        let formData = new FormData();
        formData.append('is_user_app', String(1));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.gurl('dealsAndOffer'), config).then((res) => res.json())
    }
};
module.exports = api;
