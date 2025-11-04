exports.geterror = (req, res, next) => {
  res.status(404).render('error', {
    pageTitle: 'Page Not Found',
    isLoggedIn: req.isLoggedIn,
    user: req.session?.user || null
  });
};
