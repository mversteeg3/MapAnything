import { PLACES_API_KEY } from "../api";
import { NetInfo } from 'react-native'

function getErrorDescription(code) {
    switch (response.status) {
        case 404:
            return "Invalid URL"
        default:
            return "Unknown error"
    }
}


export function sendPlacesQuery(text, mapCenter) {
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text + '&key=' + PLACES_API_KEY
        return fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                reject(new Error(getErrorDescription(response.code)))
            }
        }).then((responseJson) => {
            return responseJson.predictions
        }).catch((error) => {
            console.error(error);
            reject(new Error("No network connectivity"))
        });
}
export function lookupLocation(id) {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + id + '&key=' + PLACES_API_KEY
    // const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=' + PLACES_API_KEY
    return fetch(url, {
        method: 'GET'
    }).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            reject(new Error(getErrorDescription(response.code)))
        }
    }).then((responseJson) => {
        return responseJson.result
    }).catch((error) => {
        console.error(error);
    });
}