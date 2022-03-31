import axios from "axios";

const AXIOS_INSTANCE = axios.create({
  timeout: 60 * 60 * 60 * 1000,
});
export class Service {
  constructor() {
    this.get = (endpoint, isConverter = false) => {
      let token = process.env.REACT_APP_TRANSCRIPTION_TOKEN;
      let url = process.env.REACT_APP_TRANSCRIPTION_BASE_URL;
      // let url =
      // "http://ec2-18-133-197-246.eu-west-2.compute.amazonaws.com:8000/";
      if (isConverter) {
        token = process.env.REACT_APP_CONVERTER_TOKEN;
        url = process.env.REACT_APP_CONVERTER_BASE_URL;
      }
      return AXIOS_INSTANCE.get(url + endpoint, {
        headers: { Authorization: token },
      });
    };
    this.post = (endpoint, postData, isConverter = false, onlyUrl = false) => {
      let token = process.env.REACT_APP_TRANSCRIPTION_TOKEN;
      let url = process.env.REACT_APP_TRANSCRIPTION_BASE_URL;
      // let url =
      // "http://ec2-18-133-197-246.eu-west-2.compute.amazonaws.com:8000/";
      // let url = "http://localhost:8000/";
      if (isConverter) {
        token = process.env.REACT_APP_CONVERTER_TOKEN;
        url = process.env.REACT_APP_CONVERTER_BASE_URL;
      }
      return AXIOS_INSTANCE.post(
        onlyUrl ? endpoint : url + endpoint,
        postData,
        {
          headers: { Authorization: token },
        }
      );
    };
    this.delete = (endpoint, isConverter = false) => {
      let token = process.env.REACT_APP_TRANSCRIPTION_TOKEN;
      let url = process.env.REACT_APP_TRANSCRIPTION_BASE_URL;
      if (isConverter) {
        token = process.env.REACT_APP_CONVERTER_TOKEN;
        url = process.env.REACT_APP_CONVERTER_BASE_URL;
      }
      return AXIOS_INSTANCE.delete(url + endpoint, {
        headers: { Authorization: token },
      });
    };
  }
}
