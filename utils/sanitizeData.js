exports.sanitizeUser = function (User) {
  return {
    id: User.id,
    name: User.name,
    email: User.email,
  };
};
