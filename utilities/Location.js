export function getCurrentLocation(){
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    });
  };