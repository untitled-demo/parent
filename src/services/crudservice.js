import {parentEndpointURL, driverEndpointURL} from '../config/endpointconfig';
import axios from 'react-native-axios';
import {getToken} from './tokenstorage';

export const parentGETRequest = async userName => {
  try {
    const token = await getToken('userToken');

    axios.defaults.headers.common['x-auth-token'] = token;
    const response = {
      data: {},
      error: null,
    };
    const configGET = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.get(
      `${parentEndpointURL}me/${userName}`,
      configGET,
    );
    response.error = responseValidator(res.status);
    response.data = res.data;

    const driverResponse = await axios.get(
      `${driverEndpointURL}${response.data.DriverID}`,
      configGET,
    );

    response.error = responseValidator(driverResponse.status);
    response.data['driverDetail'] = driverResponse.data;
    console.log(response);
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

function responseValidator(status) {
  if (status !== 200) {
    if (status === 404) {
      return 'Not Found';
    }
    if (status === 401) {
      return 'Forbidden Access';
    }
    if (status === 400) {
      return 'Invalid Token';
    }
    if (status >= 500) {
      return 'Something Failed';
    }
  }
}
