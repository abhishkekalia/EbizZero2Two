import { AsyncStorage } from 'react-native';

let Utils = {
    gurl: (usersPath)=> {
        return `http://solutiontrackers.com/dev-a/zerototwo/index.php/Webservice/${usersPath}`;
        // return `http://192.168.0.123/zerototwo/index.php/Webservice/${usersPath}`;
    },


    country: () => {
        return AsyncStorage.getItem('data')
        .then((result) => {
            var response = JSON.parse(result); 
            return response.userdetail.country;
        });
    },

    userid: () => {

        return AsyncStorage.getItem('data')
        .then((result) => {
            var response = JSON.parse(result); 
            var data =response.userdetail.u_id
            return data;
        });
    },

    logout(){
        AsyncStorage.removeItem('data', (err, result) => {
            return result; 
        }); 
    }
};

module.exports = Utils;