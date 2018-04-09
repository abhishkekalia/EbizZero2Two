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
        console.warn("service_id",service_id);
        console.warn("is_active",is_active);

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
    },
    serviceList( u_id, country){
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
        return fetch(Utils.gurl('serviceList'), config).then((res) => res.json())
    },
    productList(u_id, country){
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
        return fetch(Utils.gurl('productList'), config).then((res) => res.json())
    },
    getCityList(){
        return fetch(Utils.murl('getCityList'),{
            method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
    },
    orderHistory(email_id){
        let formData = new FormData();
        formData.append('email_id', String(email_id));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('orderHistory'), config).then((res) => res.json())
    },
    saveOrderDetails( email_id, product_name, product_size, tempreture, extra_handling_request,
        charges, pickUp_area, pickUp_latitude, pickUp_longitude, delivery_date, delivery_time,
        dropOff_latitude, dropOff_longitude, dropOff_area, dropOff_street, dropOff_city, pickUp_city )
    {
        let formData = new FormData();
        formData.append('email_id', String(email_id));
        formData.append('product_name', String(product_name));
        formData.append('product_size', String(product_size));
        formData.append('tempreture', String(tempreture));
        formData.append('extra_handling_request', String(extra_handling_request));
        formData.append('charges', String(charges));
        formData.append('pickUp_area', String(pickUp_area));
        formData.append('pickUp_latitude', String(pickUp_latitude));
        formData.append('pickUp_longitude', String(pickUp_longitude));
        formData.append('delivery_date', String(delivery_date));
        formData.append('delivery_time', String(delivery_time));
        formData.append('dropOff_latitude', String(dropOff_latitude));
        formData.append('dropOff_longitude', String(dropOff_longitude));
        formData.append('dropOff_area', String(dropOff_area));
        formData.append('dropOff_street', String(dropOff_street));
        formData.append('dropOff_city', String(dropOff_city));
        formData.append('pickUp_city', String(pickUp_city));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('saveOrderDetails'), config).then((res) => res.json())
    },
    fleetCompanyFilter(order_id, pickUp_latitude, pickUp_longitude, min_price, max_price){
        let formData = new FormData();
        formData.append('order_id', String(order_id));
        formData.append('pickUp_latitude', String(pickUp_latitude));
        formData.append('pickUp_longitude', String(pickUp_longitude));
        formData.append('min_price', String(min_price));
        formData.append('max_price', String(max_price));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('fleetCompanyFilter'), config).then((res) => res.json())
    },
    getFleetCompanyDetail(fleetCompanyId){
        let formData = new FormData();
        formData.append('fleetCompanyId', String(fleetCompanyId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('getFleetCompanyDetail'), config).then((res) => res.json())
    },
    conformOrder(order_id, price, u_id, fleetCompanyId){
        let formData = new FormData();
        formData.append('order_id', String(order_id));
        formData.append('price', String(price));
        formData.append('u_id', String(u_id));
        formData.append('fleetCompanyId', String(fleetCompanyId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('conformOrder'), config).then((res) => res.json())
    },
    ordeFilter(email_id, last_week, last_month){
        let formData = new FormData();
        formData.append('email_id', String(email_id));
        formData.append('last_week', String(last_week));
        formData.append('last_month', String(last_month));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('ordeFilter'), config).then((res) => res.json())
    },
    addProductTrackingLatitudeLongitude(order_id, latitude, longitude, driver_speed){
        let formData = new FormData();
        formData.append('order_id', String(email_id));
        formData.append('latitude', String(last_week));
        formData.append('longitude', String(last_month));
        formData.append('driver_speed', String(last_month));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('addProductTrackingLatitudeLongitude'), config).then((res) => res.json())
    },
    getProductTreckingLatitudeLongitude(order_id, is_all){
        let formData = new FormData();
        formData.append('order_id', String(order_id));
        formData.append('is_all', String(is_all));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        return fetch(Utils.murl('getProductTreckingLatitudeLongitude'), config).then((res) => res.json())
    },
};
module.exports = api;
