export const checkPermission = (access = "") => {
  if (access !== "") {
    const userPermissionsStr = localStorage.getItem('userPermissions', null);
    const userPermissions = JSON.parse(userPermissionsStr);
    if (Array.isArray(userPermissions))
      return userPermissions.includes(access);
  }
  return false;
};
export const alphaKeyPress = (e) => {
  const regex = /^[a-zA-Z ]{1}$/i;
  if (!regex.test(e.key)) {
    e.preventDefault();
  }
};
export const numberKeyPress = (e) => {
  if ((isNaN(e.key) || e.key === " ")) e?.preventDefault();
};
export const BloodGroupOptions = [
  {
    value: "O+",
    label: "O+",
  },
  {
    value: "O-",
    label: "O-",
  },
  {
    value: "A-",
    label: "A-",
  },
  {
    value: "A+",
    label: "A+",
  },
  {
    value: "B-",
    label: "B-",
  },
  {
    value: "B+",
    label: "B+",
  },
  {
    value: "AB-",
    label: "AB-",
  },
  {
    value: "AB+",
    label: "AB+",
  },
];
export const getUniqueArray = (arr) => {
  const newArr = [];
  if (Array.isArray(arr) && arr.length > 0) {
    arr.forEach(element => {
      if (!newArr?.includes(element))
        newArr.push(element);
    });
  }
  return newArr;
};
export const getOnlyDate = (date = new Date()) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
export const getLikesText = (likes = []) => {
  if (likes.length > 0) {
    if (likes.length === 1) return likes[0].name;
    if (likes.length === 2) return `${likes[0].name} and ${likes[1].name}`;
    return `${likes[0].name} and ${likes.length - 1} others`
  }
  return "0"
}