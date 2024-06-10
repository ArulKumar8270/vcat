// Password validation

export const CheckPassword = (password) => {
  const regex1 =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  let errorCode = null;
  if (password === "") {
    errorCode = 1;
  } else if (!regex1.test(password)) {
    errorCode = 2;
  }
  return errorCode;
};

// User name validation
export const CheckUserName = (name) => {
  const regex = /^[a-zA-Z]+[a-zA-Z]{1,64}$/;
  let errorCode = null;
  if (name === "" || typeof name === "undefined") {
    errorCode = 1;
  } else if (!regex.test(name)) {
    errorCode = 2;
  }
  return errorCode;
};

// User name validation
export const CheckFullName = (name) => {
  const regex = /^[a-zA-Z]+[a-zA-Z ]{1,64}$/;
  let errorCode = null;
  if (name === "" || typeof name === "undefined") {
    errorCode = 1;
  } else if (!regex.test(name)) {
    errorCode = 2;
  }
  return errorCode;
};

// Email validation
export const CheckEmail = (email) => {
  const regex =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  let errorCode = null;
  if (email === "" || typeof email === "undefined") {
    errorCode = 1;
  } else if (!regex.test(email)) {
    errorCode = 2;
  }
  return errorCode;
};

// Phone validation
export const CheckPhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  let errorCode = null;
  if (phone === "" || typeof phone === "undefined") {
    errorCode = 1;
  } else if (!regex.test(phone)) {
    errorCode = 2;
  }
  return errorCode;
};

// Message validation
export const CheckMessage = (name = "") => {
  const regex = /[a-zA-Z0-9] {1,160}/g;
  let errorCode = null;
  if (name === "" || typeof name === "undefined") {
    errorCode = 1;
  } else if (!regex.test(name)) {
    errorCode = 2;
  } else if (CheckSymbol(name)) {
    errorCode = 3;
  } else if (name && name.length < 2) {
    errorCode = 4;
  }
  console.log("Local => ", errorCode);
  return errorCode;
};

// Symbol validation
export const CheckSymbol = (name) => {
  const regex = /[-!$%^&*()_+|~=#`{}[\]:";'<>?/]/;
  let errorCode = null;
  if (regex.test(name)) {
    errorCode = 1;
  }
  return errorCode;
};

// Dropdown validation

// create Validation for dropdown
export const DropDownCheck = (value) => {
  let errorCode = null;
  if (value === "" || typeof value === "undefined") {
    errorCode = 1;
  }
  return errorCode;
};

// create validation for Address
export const CheckAddress = (address) => {
  const regex = /^[a-zA-Z0-9 ]{2,30}$/;
  let errorCode = null;
  if (address === "" || typeof address === "undefined") {
    errorCode = 1;
  } else if (!regex.test(address)) {
    errorCode = 2;
  }
  return errorCode;
};

// create validation for Amount
export const CheckAmount = (amount) => {
  let errorCode = null;
  if (amount === 0) {
    errorCode = 3;
  } else if (!amount) {
    errorCode = 1;
  } else if (isNaN(amount)) {
    errorCode = 2;
  }
  return errorCode;
};

// create validation for date
export const CheckDob = (value) => {
  let errorCode = null;
  if (!value) {
    errorCode = 1;
  }
  return errorCode;
};

// Create validation for pincode
export const CheckPincode = (pincode) => {
  const regex = /^[0-9]{6}$/;
  let errorCode = null;
  if (pincode === "" || typeof pincode === "undefined") {
    errorCode = 1;
  } else if (!regex.test(pincode)) {
    errorCode = 2;
  }
  return errorCode;
};
