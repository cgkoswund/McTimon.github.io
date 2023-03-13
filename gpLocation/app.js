const gpTextInput = document.querySelector("input#gpText");

const latTextOutput = document.querySelector("#latTextOutput");
const lngTextOutput = document.querySelector("#lngTextOutput");

const submitButton = document.querySelector("#submitButton");
console.log(lngTextOutput);

const onSubmit = () => {
  /**
   * listen to api
   */
  //get gp text
  const gpText = gpTextInput.value;
  //   console.log(gpText.value);

  //API call
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  //   var formdata = new FormData();
  //   formdata.append("address", "AK4849321");

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: formdata,
  //   };

  //   fetch("https://ghanapostgps.sperixlabs.org/get-location", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => console.log("gps results", result))
  //     .catch((error) => console.log("error", error));

  var urlencoded = new URLSearchParams();
  urlencoded.append("address", gpText);
  //   urlencoded.append("address", "AK-484-9321");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch("https://ghanapostgps.sperixlabs.org/get-location", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const lattitude = result.data.Table[0].CenterLatitude;
      const longitude = result.data.Table[0].CenterLongitude;
      latTextOutput.innerHTML = "Lat: " + lattitude;
      lngTextOutput.innerHTML = "Lng: " + longitude;
      console.log("results", lattitude, longitude);
    })
    .catch((error) => console.log("error", error));
  /*********************** */
};

submitButton.addEventListener("click", onSubmit);
