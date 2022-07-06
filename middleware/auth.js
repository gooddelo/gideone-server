const auth = (req) => {
  const token = req.cookies.access_token;

  if (!token) {
    req.userData = "A token is undefined"
    return false;
  }

  try {
    req.userData = jwt.verify(token, "KEY");
    return true;
  } catch {
    req.userData = "A token is invalid"
    return false;
  }
};

module.exports = auth;
