import axios from "axios";

export class Service {
  constructor() {
    this.get = (endpoint, isConverter = false) => {
      let token = process.env.REACT_APP_TRANSCRIPTION_TOKEN;
      let url = process.env.REACT_APP_TRANSCRIPTION_BASE_URL;
      if (isConverter) {
        token = process.env.REACT_APP_CONVERTER_TOKEN;
        url = process.env.REACT_APP_CONVERTER_BASE_URL;
      }
      return axios.get(url + endpoint, { headers: { Authorization: token } });
    };
    this.post = (endpoint, postData, isConverter = false, onlyUrl = false) => {
      let token = process.env.REACT_APP_TRANSCRIPTION_TOKEN;
      let url = process.env.REACT_APP_TRANSCRIPTION_BASE_URL;
      if (isConverter) {
        token = process.env.REACT_APP_CONVERTER_TOKEN;
        url = process.env.REACT_APP_CONVERTER_BASE_URL;
      }
      return axios.post(onlyUrl ? endpoint : url + endpoint, postData, {
        headers: { Authorization: token },
      });
    };
    this.delete = (endpoint, isConverter = false) => {
      let token = process.env.REACT_APP_TRANSCRIPTION_TOKEN;
      let url = process.env.REACT_APP_TRANSCRIPTION_BASE_URL;
      if (isConverter) {
        token = process.env.REACT_APP_CONVERTER_TOKEN;
        url = process.env.REACT_APP_CONVERTER_BASE_URL;
      }
      return axios.delete(url + endpoint, {
        headers: { Authorization: token },
      });
    };
  }
}
