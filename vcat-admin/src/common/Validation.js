// Password validation
// **
//  *
//  * @param(OTP)
//  * @return Error code or null
//  */
export const OtpCheck = (otp) => {
  const numberCheck = /[0-9]/;
  let errorCode = null;
  if (!otp) {
    errorCode = 1;
  } else if (!numberCheck.test(otp) || otp.length < 5) {
    errorCode = 2;
  }
  return errorCode;
};

// compare Password in password and confirm password
export const ComparePassword = (password, confirmPassword) => {
  let errorCode = null;
  if (password !== confirmPassword) {
    errorCode = 1;
  }
  return errorCode;
};

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
  const regex = /^[a-zA-Z]+[a-zA-Z ]{1,64}$/;
  let errorCode = null;
  if (name && typeof name === "string") {
    errorCode = 2;
    if (regex.test(name)) errorCode = null;
  } else {
    errorCode = 1;
  }
  return errorCode;
};

export const CheckUserNameLogin = (username) => {
  const stringCheck = /[a-zA-Z]/;

  let errorCode = null;

  if (!username) {
    errorCode = 1;
  } else if (stringCheck.test(username)) {
    const emailError = CheckEmail(username);

    emailError ? (errorCode = 2) : (errorCode = null);
  } else {
    const phoneError = CheckPhone(username);

    phoneError ? (errorCode = 3) : (errorCode = null);
  }

  return errorCode;
};
// Email validation
export const CheckEmail = (email) => {
  const regex =
    // /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  let errorCode = null;
  if (email && typeof email === "string") {
    errorCode = 2;
    if (regex.test(email)) errorCode = null;
  } else {
    errorCode = 1;
  }
  return errorCode;
};

// Phone validation
export const CheckPhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  let errorCode = null;
  if (phone === undefined || phone === null || phone === "" || phone?.length < 10) {
    errorCode = 1;
  } else if (!regex.test(phone)) {
    errorCode = 2;
  }
  return errorCode;
};

// Phone validation
export const CheckMeetingNumber = (meeting) => {
  const regex = /^[0-9]{6}$/;
  let errorCode = null;
  if (meeting === "" || typeof meeting === "undefined") {
    errorCode = 1;
  } else if (!regex.test(meeting)) {
    errorCode = 2;
  }
  return errorCode;
};

export const CheckContinuousCode = (meeting) => {
  const regex = /^[0-9]{3,3}$/;
  let errorCode = null;
  if (meeting === undefined || meeting === null || meeting === "") {
    errorCode = 1;
  } else if (!regex.test(meeting)) {
    errorCode = 2;
  }
  return errorCode;
};

export const CheckYear = (year) => {
  const regex = /^[0-9]{4}-{4}$/;
  let errorCode = null;
  if (year === "" || typeof year === "undefined") {
    errorCode = 1;
  } else if (!regex.test(year)) {
    errorCode = 2;
  }
  return errorCode;
};

export const CheckMeetingCode = (meetingCode) => {
  const regex = /^[0-9]{3,6}$/;
  let errorCode = null;
  if (meetingCode === "" || typeof meetingCode === "undefined") {
    errorCode = 1;
  } else if (!regex.test(meetingCode)) {
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
  if (value !== undefined && value !== null) {
    if (value)
      if (Array.isArray(value) && value.length === 0) {
        errorCode = 1;
      }
    // if (typeof value === "string" && value.length === 0) {
    //     errorCode = 1;
    // }
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
