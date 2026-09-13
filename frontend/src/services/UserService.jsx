const serviceURL = process.env.REACT_APP_API_URL ;

export async function userSignUpService(userData) {
try {
const response = await fetch(`${serviceURL}/auth/register`, {
method: "POST",


  headers: {
    "Content-Type": "application/json",
  },

  credentials: "include",

  body: JSON.stringify(userData),
});

const data = await response.json();

if (!response.ok) {
  return {
    success: false,
    message: data.message || "Signup failed",
  };
}

return {
  success: true,
  message: data.message,
  user: data.data.user,
};


} catch (error) {
return {
success: false,
message:
error.message ||
"Something went wrong. Please try again later.",
};
}
}

export async function userSignInService(userData) {
try {
const response = await fetch(`${serviceURL}/auth/login`, {
method: "POST",


  headers: {
    "Content-Type": "application/json",
  },

  credentials: "include",

  body: JSON.stringify(userData),
});

const data = await response.json();

if (!response.ok) {
  return {
    success: false,
    message: data.message || "Signup failed",
  };
}

return {
  success: true,
  message: data.message,
  user: data.data.user,
};


} catch (error) {
return {
success: false,
message:
error.message ||
"Something went wrong. Please try again later.",
};
}
}
