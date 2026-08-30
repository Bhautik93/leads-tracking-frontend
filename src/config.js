import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
const config = {
  appName: import.meta.env.VITE_APP_TITLE,
  baseURL,

  getAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      let url = new URL(`${baseURL}${data.url}`);
      url.search = new URLSearchParams({
        ...data.params,
      }).toString();
      fetch(url, {
        headers: { Authorization: retrievedObject ? retrievedObject : "" },
      })
        .then((response) => {
          if (response?.status === 401) {
            localStorage.removeItem("user_id");
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            if (window.location.pathname !== "/") window.location.href = "/";
            return;
          } else {
            return response.json();
          }
        })
        .then((data) => {
          resolve(data);
          return;
        })
        .catch((error) => {
          // console.log(error)
          reject(error);
          return;
        });
    });
  },
  postAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      fetch(`${baseURL}${data.url}`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: retrievedObject ? retrievedObject : "",
        },
        body: JSON.stringify({ ...data.params }),
      })
        .then((response) =>
          response.json().then((body) => ({ status: response.status, body })),
        )
        .then(({ status, body }) => {
          if (status === 401 && retrievedObject) {
            localStorage.removeItem("user_id");
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            if (window.location.pathname !== "/") window.location.href = "/";
            return resolve(body);
          }
          resolve(body);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  allAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      fetch(`${baseURL}${data.url}`, {
        method: data.method ? data.method : "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: retrievedObject ? retrievedObject : "",
        },
        body: JSON.stringify({ ...data.params }),
      })
        .then((response) => {
          if (response?.status === 401) {
            localStorage.removeItem("user_id");
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            if (window.location.pathname !== "/") window.location.href = "/";
            return;
          } else {
            return response.json();
          }
        })
        .then((data) => {
          resolve(data);
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    });
  },
  postFormDataAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      fetch(`${baseURL}${data.url}`, {
        method: "post",
        headers: {
          contentType: "application/json",
          Authorization: retrievedObject ? retrievedObject : "",
        },
        body: data.params,
      })
        .then((response) => {
          if (response?.status === 401) {
            localStorage.removeItem("user_id");
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            if (window.location.pathname !== "/") window.location.href = "/";
            return;
          } else {
            return response.json();
          }
        })
        .then((data) => {
          resolve(data);
          return;
        })
        .catch((error) => {
          // console.log(error)
          reject(error);
          return;
        });
    });
  },
  getAPIaxios(data) {
    return new Promise(async (resolve, reject) => {
      try {
        var retrievedObject = localStorage.getItem("token");
        let result = await axios.get(`${baseURL}${data.url}`, {
          params: { ...data.params },
          headers: { Authorization: retrievedObject ? retrievedObject : "" },
        });
        resolve(result?.data?.payload);
        return;
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("user_id");
          localStorage.removeItem("email");
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
        }
        reject(error);
        return;
        // throw error;
      }
    });
  },
};

export default config;
