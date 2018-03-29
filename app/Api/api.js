import Utils from 'app/common/Utils';
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
    },
    addressList(u_id, country){
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.gurl('addressList'), config).then((res) => res.json())
    },
    addToOrder( u_id, country, value, data, count){
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('order_detail', JSON.stringify(value));
        formData.append('amount', String(data.Price*count));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.gurl('addToOrder'), config).then((res) => res.json())
    },
    UpdateServiceStatus( service_id, is_active){
        let formData = new FormData();
        formData.append('service_id', String(service_id));
        formData.append('is_active', String(is_active));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.gurl('UpdateServiceStatus'), config).then((res) => res.json())
    }
};
module.exports = api;
